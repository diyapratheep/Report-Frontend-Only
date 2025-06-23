import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { ReactComponent as ChevronDownIcon } from '../../assets/icons/chevron-down.svg'; 

//const ChevronDownIcon = (props) => (
//    <svg
//        xmlns="http://www.w3.org/2000/svg"
//        width="24"
//        height="24"
//        viewBox="0 0 24 24"
//        fill="none"
//        stroke="currentColor"
//        strokeWidth="2"
//        strokeLinecap="round"
//        strokeLinejoin="round"
//        {...props}
//    >
//        <path d="m6 9 6 6 6-6" />
//    </svg>
//);

const SingleSelectDropdown = ({ options, selectedValue, onValueChange, placeholder, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOptionName = options.find(option => option.id === selectedValue)?.name || '';

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

    const handleOptionClick = (optionId) => {
        onValueChange(optionId);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className={cn(
                    "flex h-12 w-full items-center justify-between rounded-md border-2 border-borderPurple bg-sidebarBg px-3 py-2 text-base text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedOptionName === '' ? placeholder : selectedOptionName}</span>
                <ChevronDownIcon className={cn("h-5 w-5 text-gray-500 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className="flex flex-col items-start p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleOptionClick(option.id)}
                        >
                            <span className="text-base font-medium">{option.name}</span>
                            <span className="text-gray-500 text-sm">(ID: {option.id})</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

SingleSelectDropdown.displayName = "SingleSelectDropdown";

export default SingleSelectDropdown;