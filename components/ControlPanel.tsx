
import React from 'react';
import { UserPlusIcon, ArrowRightEndOnRectangleIcon, ArrowLeftStartOnRectangleIcon } from './icons';

interface ControlPanelProps {
    onRegister: () => void;
    onCheckIn: () => void;
    onCheckOut: () => void;
    isLoading: boolean;
}

const ActionButton: React.FC<{ onClick: () => void, disabled: boolean, children: React.ReactNode, className: string }> = ({ onClick, disabled, children, className }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${className}`}
    >
        {children}
    </button>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({ onRegister, onCheckIn, onCheckOut, isLoading }) => {
    return (
        <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActionButton onClick={onRegister} disabled={isLoading} className="bg-blue-600 hover:bg-blue-500">
                <UserPlusIcon className="w-8 h-8 mb-1" />
                <span>Register</span>
            </ActionButton>
            <ActionButton onClick={onCheckIn} disabled={isLoading} className="bg-green-600 hover:bg-green-500">
                <ArrowRightEndOnRectangleIcon className="w-8 h-8 mb-1" />
                <span>Check In</span>
            </ActionButton>
            <ActionButton onClick={onCheckOut} disabled={isLoading} className="bg-red-600 hover:bg-red-500">
                <ArrowLeftStartOnRectangleIcon className="w-8 h-8 mb-1" />
                <span>Check Out</span>
            </ActionButton>
        </div>
    );
};
