'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ProfileLinkProps {
  userId: string;
  userName: string;
  userAvatar?: string | null;
  className?: string;
}

export function ProfileLink({ userId, userName, userAvatar, className = '' }: ProfileLinkProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="relative inline-block">
      <Link
        href={`/profile/${userId}`}
        className={`font-semibold hover:text-primary-600 transition-colors ${className}`}
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
      >
        {userName}
      </Link>

      {/* Hover Preview */}
      {showPreview && (
        <div 
          className="absolute z-50 mt-2 p-4 bg-white rounded-lg shadow-xl border border-gray-200 w-64 left-0"
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
              ) : (
                userName[0].toUpperCase()
              )}
            </div>
            <div>
              <p className="font-bold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">Click to view profile</p>
            </div>
          </div>
          <Link href={`/profile/${userId}`}>
            <button className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold">
              View Full Profile
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
