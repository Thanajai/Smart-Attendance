
import React, { useState } from 'react';
import { CameraIcon, XMarkIcon } from './icons';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (name: string, id: string) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, onRegister }) => {
    const [name, setName] = useState('');
    const [id, setId] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && id.trim()) {
            onRegister(name, id);
            setName('');
            setId('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center text-cyan-300">Register New User</h2>
                <p className="text-center text-gray-400 mb-6">Please position your face clearly in the camera frame before submitting.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="id" className="block text-sm font-medium text-gray-300 mb-1">Student/Employee ID</label>
                        <input
                            type="text"
                            id="id"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                        <CameraIcon className="w-5 h-5" />
                        Capture Photo & Register
                    </button>
                </form>
            </div>
        </div>
    );
};
