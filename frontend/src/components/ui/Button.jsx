import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                "bg-buttonGreen text-textMuted hover:bg-buttonGreenHover",
                "h-12 px-8 rounded-full text-lg shadow-md hover:shadow-lg",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export default Button;