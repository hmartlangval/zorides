'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  description?: string | null;
  interests?: string | null;
  age?: number | null;
  gender?: string | null;
  rideOwnership?: string | null;
  state?: string | null;
  district?: string | null;
  locality?: string | null;
  createdAt: string;
  _count: {
    eventsCreated: number;
    groupsCreated: number;
    groupMemberships: number;
  };
}

export default function ProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchUser(params.id as string);
    }
  }, [params.id]);

  const fetchUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12 text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-8">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-5xl mb-4">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user.name[0].toUpperCase()
              )}
            </div>

            {/* Name & Basic Info */}
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            {user.bio && <p className="text-gray-600 mb-4">{user.bio}</p>}

            {/* Location */}
            {(user.state || user.district || user.locality) && (
              <p className="text-sm text-gray-500 mb-4">
                📍 {[user.locality, user.district, user.state].filter(Boolean).join(', ')}
              </p>
            )}

            {/* Stats */}
            <div className="flex gap-8 mt-4 pt-4 border-t w-full justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{user._count.eventsCreated}</p>
                <p className="text-sm text-gray-500">Events Created</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent-600">{user._count.groupsCreated}</p>
                <p className="text-sm text-gray-500">Groups Created</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600">{user._count.groupMemberships}</p>
                <p className="text-sm text-gray-500">Groups Joined</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* About Section */}
        {user.description && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">About</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{user.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Interests Section */}
        {user.interests && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">Interests</h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.interests.split(',').map((interest, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {interest.trim()}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personal Info */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Personal Info</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.age && (
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-semibold">{user.age} years</span>
              </div>
            )}
            {user.gender && (
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-semibold capitalize">{user.gender}</span>
              </div>
            )}
            {user.rideOwnership && (
              <div className="flex justify-between">
                <span className="text-gray-600">Ride:</span>
                <span className="font-semibold">
                  {user.rideOwnership === 'bike' && '🏍️ Bike'}
                  {user.rideOwnership === 'car' && '🚗 Car'}
                  {user.rideOwnership === 'both' && '🚗🏍️ Both'}
                  {user.rideOwnership === 'looking_for_ride' && '🙋 Looking for Ride'}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t">
              <span className="text-gray-600">Member Since:</span>
              <span className="font-semibold">{formatDate(user.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
