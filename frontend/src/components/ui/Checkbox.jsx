import React from 'react';
import { cn } from '../../utils/cn';

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, id, ...props }, ref) => (
    <input
        type="checkbox"
        ref={ref}
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
        className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-blue-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "checked:bg-blue-500 checked:text-white",
            className
        )}
        {...props}
    />
));

Checkbox.displayName = "Checkbox";

export default Checkbox;