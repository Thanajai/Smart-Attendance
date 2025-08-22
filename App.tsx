import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { User, AttendanceRecord, Status } from './types';
import { CameraFeed } from './components/CameraFeed';
import { ControlPanel } from './components/ControlPanel';
import { AttendanceLog } from './components/AttendanceLog';
import { RegistrationModal } from './components/RegistrationModal';
import { Header } from './components/Header';
import { compareFaces } from './services/geminiService';

const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>(() => {
        try {
            const savedUsers = localStorage.getItem('smart-attendance-users');
            return savedUsers ? JSON.parse(savedUsers) : [];
        } catch (error) {
            console.error("Failed to parse users from localStorage", error);
            return [];
        }
    });

    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
        try {
            const savedRecords = localStorage.getItem('smart-attendance-records');
            if (!savedRecords) return [];
            const parsedRecords = JSON.parse(savedRecords);
            return parsedRecords.map((record: any) => ({
                ...record,
                checkIn: new Date(record.checkIn),
                checkOut: record.checkOut ? new Date(record.checkOut) : null,
            }));
        } catch (error) {
            console.error("Failed to parse attendance records from localStorage", error);
            return [];
        }
    });

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [status, setStatus] = useState<Status>({ type: 'idle', message: 'Ready' });
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        localStorage.setItem('smart-attendance-users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('smart-attendance-records', JSON.stringify(attendanceRecords));
    }, [attendanceRecords]);

    const startCamera = useCallback(async (): Promise<boolean> => {
        setStatus({ type: 'loading', message: 'Initializing camera...' });
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsCameraActive(true);
                return true;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setStatus({ type: 'error', message: 'Could not access camera. Please grant permission.' });
            setIsCameraActive(false);
        }
        return false;
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    }, []);


    const captureFrame = useCallback((): string | null => {
        if (videoRef.current && canvasRef.current && isCameraActive) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                return canvas.toDataURL('image/jpeg');
            }
        }
        return null;
    }, [isCameraActive]);

    const startCaptureSequence = useCallback(async (): Promise<string | null> => {
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        setStatus({ type: 'loading', message: 'Get ready for your photo...' });
        await sleep(1500);

        for (let i = 3; i > 0; i--) {
            setStatus({ type: 'loading', message: `Capturing in ${i}...` });
            setCountdown(i);
            await sleep(1000);
        }

        setCountdown(null);
        setStatus({ type: 'loading', message: 'Capturing... Smile!' });
        await sleep(200);

        const frame = captureFrame();

        if (!frame) {
            setStatus({ type: 'error', message: 'Failed to capture photo. Please try again.' });
            return null;
        }
        
        return frame;
    }, [captureFrame]);

    const handleRegister = useCallback(async (name: string, id: string) => {
        setIsModalOpen(false);
        if (!(await startCamera())) return;

        try {
            const photo = await startCaptureSequence();

            if (photo) {
                const newUser: User = { name, id, photo };
                setUsers(prev => [...prev, newUser]);
                setStatus({ type: 'success', message: `User ${name} registered successfully!` });
            }
        } finally {
            stopCamera();
        }
    }, [startCamera, startCaptureSequence, stopCamera]);
    
    const processAttendance = useCallback(async (action: 'check-in' | 'check-out') => {
        if (!(await startCamera())) return;

        try {
            const capturedPhoto = await startCaptureSequence();

            if (!capturedPhoto) {
                return;
            }

            setStatus({ type: 'loading', message: 'Verifying your identity... This may take a moment.' });
            
            let matchedUser: User | null = null;
            for (const user of users) {
                try {
                    const isMatch = await compareFaces(user.photo, capturedPhoto);
                    if (isMatch) {
                        matchedUser = user;
                        break;
                    }
                } catch (error) {
                    console.error('Error during face comparison:', error);
                    const message = error instanceof Error ? error.message : 'An API error occurred during verification.';
                    setStatus({ type: 'error', message });
                    return;
                }
            }

            if (matchedUser) {
                const now = new Date();
                if (action === 'check-in') {
                    const existingRecord = attendanceRecords.find(r => r.user.id === matchedUser!.id && r.status === 'Checked In');
                    if(existingRecord){
                        setStatus({ type: 'error', message: `${matchedUser.name} is already checked in.` });
                        return;
                    }
                    const newRecord: AttendanceRecord = {
                        user: matchedUser,
                        checkIn: now,
                        checkOut: null,
                        status: 'Checked In'
                    };
                    setAttendanceRecords(prev => [newRecord, ...prev]);
                    setStatus({ type: 'success', message: `Welcome, ${matchedUser.name}! Checked in successfully.` });
                } else { // check-out
                    const recordIndex = attendanceRecords.findIndex(r => r.user.id === matchedUser!.id && r.status === 'Checked In');
                    if (recordIndex !== -1) {
                        const updatedRecords = [...attendanceRecords];
                        updatedRecords[recordIndex] = {
                            ...updatedRecords[recordIndex],
                            checkOut: now,
                            status: 'Completed'
                        };
                        setAttendanceRecords(updatedRecords);
                        setStatus({ type: 'success', message: `Goodbye, ${matchedUser.name}! Checked out successfully.` });
                    } else {
                        setStatus({ type: 'error', message: `${matchedUser.name}, you need to check in first.` });
                    }
                }
            } else {
                setStatus({ type: 'error', message: 'Identity verification failed. User not recognized.' });
            }
        } finally {
            stopCamera();
        }
    }, [startCamera, stopCamera, startCaptureSequence, users, attendanceRecords]);


    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 md:p-8">
            <Header />
            <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="flex flex-col items-center bg-gray-800 p-6 rounded-2xl shadow-2xl">
                    <CameraFeed 
                        videoRef={videoRef} 
                        status={status} 
                        countdown={countdown} 
                        isCameraActive={isCameraActive} 
                    />
                    <ControlPanel
                        onRegister={() => setIsModalOpen(true)}
                        onCheckIn={() => processAttendance('check-in')}
                        onCheckOut={() => processAttendance('check-out')}
                        isLoading={status.type === 'loading'}
                    />
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl min-h-[300px] lg:min-h-0">
                    <AttendanceLog records={attendanceRecords} />
                </div>
            </main>
            <RegistrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRegister={handleRegister}
            />
            <canvas ref={canvasRef} className="hidden"></canvas>
            <footer className="text-center mt-8 text-gray-500 text-sm">
                <p>Powered by Gemini API</p>
            </footer>
        </div>
    );
};

export default App;
