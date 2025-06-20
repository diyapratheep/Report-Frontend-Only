import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import Checkbox from './Checkbox';

// Icon for the dropdown
const ChevronDownIcon = (props) => (
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
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const MultiSelectDropdown = ({ options, selectedValues, onToggle, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getDisplayText = () => {
        if (selectedValues.length === 0) return placeholder;
        if (selectedValues.length === 1) {
            const selectedOption = options.find(option => option.id === selectedValues[0]);
            return selectedOption?.name || placeholder;
        }
        return `${selectedValues.length} ERs selected`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className="flex h-12 md:h-14 w-full items-center justify-between rounded-md border-2 border-borderPurple bg-sidebarBg px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{getDisplayText()}</span>
                <ChevronDownIcon className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className="flex items-center justify-between p-3 h-14 hover:bg-gray-50 cursor-pointer"
                            onClick={() => onToggle(option.id)}
                        >
                            <span className="text-base font-medium">
                                {option.name} <span className="text-gray-500 text-sm">(ID: {option.id})</span>
                            </span>
                            <Checkbox
                                id={`er-${option.id}`}
                                checked={selectedValues.includes(option.id)}
                                readOnly
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

MultiSelectDropdown.displayName = "MultiSelectDropdown";

export default MultiSelectDropdown;