import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  fullscreen?: boolean;
}

/**
 * Loading spinner component with various sizes and options
 */
export function LoadingSpinner({ 
  size = 'md', 
  className,
  text,
  fullscreen = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const spinner = (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn('animate-spin text-primary-600', sizeClasses[size])} />
        {text && (
          <p className="text-sm text-gray-600 animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * Inline loading spinner for buttons
 */
export function InlineSpinner({ 
  size = 'sm', 
  className 
}: Pick<LoadingSpinnerProps, 'size' | 'className'>) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
  };

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  );
}

/**
 * Loading skeleton for content placeholders
 */
export function LoadingSkeleton({ 
  className,
  rows = 3,
  avatar = false
}: {
  className?: string;
  rows?: number;
  avatar?: boolean;
}) {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="flex space-x-4">
        {avatar && (
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
        )}
        <div className="flex-1 space-y-2">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-4 bg-gray-200 rounded',
                index === rows - 1 ? 'w-3/4' : 'w-full'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Loading overlay for tables or lists
 */
export function LoadingOverlay({ 
  text = 'Loading...', 
  className 
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      'absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10',
      className
    )}>
      <LoadingSpinner text={text} size="lg" />
    </div>
  );
}

/**
 * Loading dots animation
 */
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Progress bar component
 */
export function ProgressBar({ 
  progress, 
  className,
  showPercentage = false,
  label
}: {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  label?: string;
}) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          {showPercentage && <span>{Math.round(clampedProgress)}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Pulsing placeholder for images or content
 */
export function PulsePlaceholder({ 
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn(
      'bg-gray-200 animate-pulse rounded flex items-center justify-center',
      className
    )}>
      {children}
    </div>
  );
}