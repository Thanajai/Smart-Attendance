
import React from 'react';
import { UserCheckIcon } from './icons';

export const Header: React.FC = () => {
    return (
        <header className="w-full max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4">
                <UserCheckIcon className="w-12 h-12 text-cyan-400" />
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    Smart Attendance System
                </h1>
            </div>
            <p className="mt-2 text-lg text-gray-400">Effortless attendance tracking powered by AI.</p>
        </header>
    );
};
