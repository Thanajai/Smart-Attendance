
import React from 'react';
import type { AttendanceRecord } from '../types';
import { DocumentTextIcon } from './icons';

interface AttendanceLogProps {
    records: AttendanceRecord[];
}

export const AttendanceLog: React.FC<AttendanceLogProps> = ({ records }) => {
    const formatDate = (date: Date | null) => {
        if (!date) return 'N/A';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-cyan-300">
                <DocumentTextIcon className="w-7 h-7" />
                Attendance Log
            </h2>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {records.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        <p>No attendance records yet.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {records.map((record, index) => (
                            <li key={index} className="bg-gray-900/50 p-4 rounded-lg flex items-center gap-4 border border-gray-700 hover:bg-gray-700/50 transition-colors">
                                <img src={record.user.photo} alt={record.user.name} className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400" />
                                <div className="flex-1">
                                    <p className="font-bold text-white">{record.user.name}</p>
                                    <p className="text-sm text-gray-400">ID: {record.user.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">In: <span className="font-mono text-green-400">{formatDate(record.checkIn)}</span></p>
                                    <p className="text-sm text-gray-400">Out: <span className="font-mono text-red-400">{formatDate(record.checkOut)}</span></p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${record.status === 'Completed' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                                    {record.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
