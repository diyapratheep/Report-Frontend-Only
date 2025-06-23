import React, { useEffect } from 'react';
import { cn } from '../utils/cn';
import { ReactComponent as CheckIcon } from '../assets/icons/check.svg'; // Importing the check icon as a React component }



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