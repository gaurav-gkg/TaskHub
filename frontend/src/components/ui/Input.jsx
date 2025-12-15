import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={`w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder-text-muted disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-danger focus:ring-danger/50 focus:border-danger' : ''
                    } ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-danger">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
