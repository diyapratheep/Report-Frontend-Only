// A simple utility to conditionally join Tailwind CSS class names.
export const cn = (...inputs) => {
    return inputs.filter(Boolean).join(' ');
};