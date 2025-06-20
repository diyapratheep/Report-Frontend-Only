import React from 'react';
import { cn } from '../../utils/cn';

const CustomInput = React.forwardRef(({ className, type = "text", placeholder, value, onChange, id, ...props }, ref) => (
    <input
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
            "flex h-12 w-full rounded-md border-2 border-borderPurple bg-sidebarBg px-3 py-2 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    />
));

CustomInput.displayName = "CustomInput";

export default CustomInput;