import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-surface border border-border rounded-xl shadow-xl overflow-hidden ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-border ${className}`}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-lg font-semibold text-text-primary ${className}`}>
        {children}
    </h3>
);

export const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 bg-surfaceHover/50 border-t border-border ${className}`}>
        {children}
    </div>
);

export default Card;
