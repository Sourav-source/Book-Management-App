import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Desktop Skeleton */}
      <div className="hidden md:block">
        <div className="bg-gray-50 px-6 py-3">
          <div className="grid grid-cols-5 gap-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="px-6 py-4">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                <div className="flex justify-end gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="md:hidden">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="border-b border-gray-200 p-4 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
              <div className="flex gap-2 ml-4">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;