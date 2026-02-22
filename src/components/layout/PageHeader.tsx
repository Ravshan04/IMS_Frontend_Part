import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

const PageHeader = ({ title, description, children, className }: PageHeaderProps) => {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in", className)}>
            <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">{title}</h1>
                {description && <p className="text-muted-foreground text-sm sm:text-base">{description}</p>}
            </div>
            <div className="flex items-center gap-3">
                {children}
            </div>
        </div>
    );
};

export default PageHeader;
