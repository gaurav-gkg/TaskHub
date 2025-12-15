import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    isLoading = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const variants = {
        primary: "bg-primary hover:bg-primaryHover text-white shadow-lg shadow-primary/20 focus:ring-primary",
        secondary: "bg-surface hover:bg-surfaceHover text-text-primary border border-border focus:ring-secondary",
        ghost: "bg-transparent hover:bg-surfaceHover text-text-secondary hover:text-text-primary",
        danger: "bg-danger hover:bg-red-600 text-white shadow-lg shadow-danger/20 focus:ring-danger",
        success: "bg-success hover:bg-green-600 text-white shadow-lg shadow-success/20 focus:ring-success",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    const size = props.size || 'md';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
