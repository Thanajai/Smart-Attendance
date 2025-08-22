import React from 'react';
import type { Status } from '../types';
import { CameraIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from './icons';

interface CameraFeedProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    status: Status;
    countdown: number | null;
    isCameraActive: boolean;
}

const StatusOverlay: React.FC<{ status: Status }> = ({ status }) => {
    const getStatusStyles = () => {
        switch (status.type) {
            case 'success':
                return { icon: <CheckCircleIcon className="w-8 h-8 text-green-400" />, bg: 'bg-green-500/20', text: 'text-green-300' };
            case 'error':
                return { icon: <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />, bg: 'bg-red-500/20', text: 'text-red-300' };
            case 'loading':
                return { 
                    icon: (
                        <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ), 
                    bg: 'bg-cyan-500/20', text: 'text-cyan-300' 
                };
            default: // idle
                return { icon: <InformationCircleIcon className="w-8 h-8 text-gray-400" />, bg: 'bg-gray-700/50', text: 'text-gray-300' };
        }
    };

    const { icon, bg, text } = getStatusStyles();

    if (!status.message) return null;

    return (
        <div className={`absolute bottom-4 left-4 right-4 p-4 rounded-lg flex items-center gap-4 backdrop-blur-sm ${bg} border border-white/10`}>
            {icon}
            <p className={`font-medium ${text}`}>{status.message}</p>
        </div>
    );
};


export const CameraFeed: React.FC<CameraFeedProps> = ({ videoRef, status, countdown, isCameraActive }) => {
    
    return (
        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-900 relative flex items-center justify-center border-2 border-gray-700 shadow-lg">
            {isCameraActive ? (
                 <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100"></video>
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <CameraIcon className="w-24 h-24 opacity-30" />
                    <p className="mt-4 font-semibold">Camera is off</p>
                    <p className="text-sm">Click an action below to begin</p>
                </div>
            )}
            
            {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <span 
                        key={countdown}
                        className="text-9xl font-bold text-white animate-pulse"
                        style={{ textShadow: '0 0 25px rgba(0,0,0,0.8)' }}
                    >
                        {countdown}
                    </span>
                </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3/4 h-3/4 border-4 border-dashed border-white/30 rounded-3xl opacity-50"></div>
            </div>
            
            <StatusOverlay status={status} />
        </div>
    );
};