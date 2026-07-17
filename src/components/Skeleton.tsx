import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse-slow bg-slate-200 rounded-md ${className}`} />
  );
};

export default Skeleton;
