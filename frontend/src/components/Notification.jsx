import React, { useEffect } from 'react';
import { cn } from '../utils/cn';

// Icon for the notification (reused from general icons)
const CheckIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const textColor = 'text-white';
    const icon = type === 'success' ? <CheckIcon className="w-5 h-5" /> : null;

    return (
        <div className={cn(
            "fixed bottom-8 right-8 p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 transition-all duration-300 ease-out",
            bgColor,
            textColor
        )}>
            {icon}
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
                &times;
            </button>
        </div>
    );
};

Notification.displayName = "Notification";

export default Notification;