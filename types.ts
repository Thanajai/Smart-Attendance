
export interface User {
    id: string;
    name: string;
    photo: string; // base64 encoded image
}

export interface AttendanceRecord {
    user: User;
    checkIn: Date;
    checkOut: Date | null;
    status: 'Checked In' | 'Completed';
}

export interface Status {
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
}
