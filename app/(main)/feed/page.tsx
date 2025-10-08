'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { ProfileLink } from '@/components/ProfileLink';

interface FeedItem {
  id: string;
  type: 'event' | 'group';
  userId: string;
  userName: string;
  userAvatar?: string;
  image?: string;
  title: string;
  description: string;
  location: string;
  date?: string;
  rideOwnership?: string;
  maxPeople?: number;
  memberCount?: number;
  status?: string;
  userMembershipStatus?: string | null;
  isCreator?: boolean;
  createdAt: string;
  eventId?: string;
}

export default function FeedPage() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const url = userId ? `/api/feed?userId=${userId}` : '/api/feed';
      
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        const data = await res.json();
        setFeed(data.feed);
      }
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInterested = async (item: FeedItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (item.type !== 'group') return;
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login first');
      return;
    }

    if (item.isCreator) {
      alert('You are the creator of this group!');
      return;
    }

    if (item.userMembershipStatus) {
      alert(`You have already shown interest (Status: ${item.userMembershipStatus})`);
      return;
    }

    try {
      const res = await fetch(`/api/groups/${item.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        alert('Interest sent! The creator will review your request.');
        fetchFeed(); // Refresh feed
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to show interest');
      }
    } catch (error) {
      console.error('Interest error:', error);
      alert('Failed to show interest');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-optimized container */}
      <div className="max-w-2xl mx-auto px-0 sm:px-4 py-0 sm:py-6">
        
        {/* Quick Action Bar - Sticky on mobile */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 mb-4 sm:rounded-xl sm:shadow-sm sm:mb-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <Link href="/events/create" className="flex-shrink-0">
              <Button size="sm" className="whitespace-nowrap">
                <span className="mr-1">📅</span> Create Event
              </Button>
            </Link>
            <Link href="/events" className="flex-shrink-0">
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <span className="mr-1">🔍</span> Browse
              </Button>
            </Link>
            <Link href="/messages" className="flex-shrink-0">
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <span className="mr-1">💬</span> Messages
              </Button>
            </Link>
          </div>
        </div>

        {/* Feed */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            <p className="text-gray-500 mt-4">Loading your feed...</p>
          </div>
        ) : feed.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center mx-4 sm:mx-0">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2">Welcome to Zorides!</h3>
            <p className="text-gray-600 mb-6">Be the first to create an event or group</p>
            <Link href="/events/create">
              <Button size="lg">Create Your First Event</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-0 sm:space-y-6">
            {feed.map((item) => (
              <Link 
                key={item.id} 
                href={item.type === 'event' ? `/events/${item.id}` : `/groups/${item.id}`}
                className="block"
              >
                <article className="bg-white border-b sm:border sm:rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Header */}
                  <div className="flex items-center justify-between p-3 sm:p-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                        {item.userAvatar ? (
                          <img src={item.userAvatar} alt={item.userName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          item.userName[0].toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <ProfileLink userId={item.userId} userName={item.userName} userAvatar={item.userAvatar} />
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {item.location}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Image - Full width, Instagram style */}
                  {item.image && (
                    <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Type badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                          {item.type === 'event' ? '📅 Event' : '👥 Group'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    {/* Title */}
                    <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Description - Limited */}
                    <p className="text-gray-700 text-sm sm:text-base mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Meta info - Compact */}
                    <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
                      {item.date && (
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          📅 {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      {item.rideOwnership && (
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          {item.rideOwnership === 'bike' && '🏍️ Bike'}
                          {item.rideOwnership === 'car' && '🚗 Car'}
                          {item.rideOwnership === 'both' && '🚗🏍️ Both'}
                          {item.rideOwnership === 'looking_for_ride' && '🙋 Need Ride'}
                        </span>
                      )}
                      {item.maxPeople && (
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          👤 {item.maxPeople} spots
                        </span>
                      )}
                      {item.status && (
                        <span className={`px-2 py-1 rounded-full font-semibold ${
                          item.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100">
                      {item.type === 'group' && (
                        <>
                          {item.isCreator ? (
                            <button 
                              className="flex items-center gap-1 text-sm font-semibold text-gray-400 cursor-not-allowed"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <span className="text-base">👑</span>
                              <span className="hidden sm:inline">Your Group</span>
                              <span className="sm:hidden">Yours</span>
                            </button>
                          ) : item.userMembershipStatus === 'INTERESTED' ? (
                            <button 
                              className="flex items-center gap-1 text-sm font-semibold text-yellow-600"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <span className="text-base">⏳</span>
                              <span className="hidden sm:inline">Awaiting Approval</span>
                              <span className="sm:hidden">Pending</span>
                            </button>
                          ) : item.userMembershipStatus === 'ACCEPTED' ? (
                            <button 
                              className="flex items-center gap-1 text-sm font-semibold text-green-600"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <span className="text-base">✅</span>
                              <span className="hidden sm:inline">You're In!</span>
                              <span className="sm:hidden">Joined</span>
                            </button>
                          ) : item.userMembershipStatus === 'REJECTED' ? (
                            <button 
                              className="flex items-center gap-1 text-sm font-semibold text-red-600"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <span className="text-base">❌</span>
                              <span className="hidden sm:inline">Not Accepted</span>
                              <span className="sm:hidden">Rejected</span>
                            </button>
                          ) : (
                            <button 
                              className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-primary-600 active:scale-95 transition-transform"
                              onClick={(e) => handleInterested(item, e)}
                            >
                              <span className="text-base">🙋</span>
                              <span className="hidden sm:inline">I'm Interested!</span>
                              <span className="sm:hidden">Interested</span>
                            </button>
                          )}
                          <span className="text-xs text-gray-500 flex items-center">
                            {item.memberCount || 0}/{item.maxPeople} spots
                          </span>
                        </>
                      )}
                      {item.type === 'event' && (
                        <button 
                          className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-primary-600"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Navigate to event detail
                          }}
                        >
                          <span className="text-base">👀</span>
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </button>
                      )}
                      <button 
                        className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-accent-600 ml-auto"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert('Comments coming in V2!');
                        }}
                      >
                        <span className="text-base">💬</span>
                        <span className="hidden sm:inline">Comment</span>
                      </button>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Add CSS for hiding scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}