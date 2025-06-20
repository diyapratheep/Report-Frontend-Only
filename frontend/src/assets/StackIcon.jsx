import React from 'react';

// SVG component for the stack image on the login page.
const StackIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="m2.5 7 7.5 4.5 7.5-4.5-7.5-4.5L2.5 7Z" />
        <path d="m12.5 17 7.5-4.5 7.5 4.5-7.5 4.5-7.5-4.5Z" />
        <path d="m2.5 12 7.5 4.5 7.5-4.5-7.5-4.5L2.5 12Z" />
    </svg>
);

export default StackIcon;