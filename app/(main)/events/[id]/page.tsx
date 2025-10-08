'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Event, AttendantGroup } from '@/types';
import { formatDateTime } from '@/lib/utils';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [groups, setGroups] = useState<AttendantGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    // Get current user
    const userDataStr = localStorage.getItem('user');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      setCurrentUserId(userData.id);
    }
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`/api/events/${params.id}`, {
        cache: 'no-store', // Disable cache
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
        setEditTitle(data.event.title);
        setEditDescription(data.event.description);
        setGroups(data.groups || []);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  // V1.2 - Edit event (creator only)
  const handleEditEvent = async () => {
    if (!editTitle.trim() || !editDescription.trim()) return;

    try {
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event?.id,
          userId: currentUserId,
          title: editTitle,
          description: editDescription,
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        fetchEventDetails();
        alert('Event updated successfully');
      } else {
        alert('Failed to update event');
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      alert('Failed to update event');
    }
  };

  // V1.2 - Delete event (creator only)
  const handleDeleteEvent = async () => {
    if (!confirm('Are you sure you want to delete this event? This will also delete all related groups.')) return;

    try {
      const res = await fetch(`/api/events?eventId=${event?.id}&userId=${currentUserId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Event deleted successfully');
        router.push('/events');
      } else {
        alert('Failed to delete event');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event');
    }
  };

  // V1.2 - Change event status (creator only)
  const handleChangeStatus = async (newStatus: string) => {
    try {
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event?.id,
          userId: currentUserId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        fetchEventDetails();
        alert('Event status updated successfully');
      } else {
        alert('Failed to update event status');
      }
    } catch (error) {
      console.error('Failed to update event status:', error);
      alert('Failed to update event status');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-gray-500">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">Event not found</p>
            <Link href="/events">
              <Button>Back to Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCreator = currentUserId && event.creatorId === currentUserId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Event Header */}
      <Card className="mb-8">
        {event.mediaUrls && event.mediaUrls.length > 0 && (
          <div className="relative h-96">
            <img
              src={event.mediaUrls[0]}
              alt={event.title}
              className="w-full h-full object-cover rounded-t-xl"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Event title"
                    className="text-2xl font-bold"
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{event.title}</h1>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                      {event.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    📅 {formatDateTime(event.date)}
                  </p>
                  <p className="text-gray-600">
                    📍 {event.venue ? `${event.venue}, ` : ''}
                    {event.locality}, {event.district}, {event.state}
                  </p>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {!isEditing && (
                <Link href={`/groups/create?eventId=${event.id}`}>
                  <Button size="lg">+ Create Group</Button>
                </Link>
              )}
              {/* V1.2 - Creator actions */}
              {isCreator && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleEditEvent}>Save</Button>
                      <Button variant="secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="secondary" onClick={() => setIsEditing(true)}>
                        Edit
                      </Button>
                      <select
                        value={event.status}
                        onChange={(e) => handleChangeStatus(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="OPEN">Open</option>
                        <option value="FILLED">Filled</option>
                        <option value="CLOSED">Closed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <Button variant="secondary" onClick={handleDeleteEvent}>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Event description"
              rows={6}
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          )}
          
          {event.creator && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                Created by{' '}
                <span className="font-semibold text-gray-900">{event.creator.name}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendant Groups */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Attendant Groups</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setLoading(true);
                fetchEventDetails();
              }}
            >
              🔄 Refresh
            </Button>
          </div>
          <Link href={`/groups/create?eventId=${event.id}`}>
            <Button>Create Group</Button>
          </Link>
        </div>

        {groups.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">
                No groups yet. Be the first to create one!
              </p>
              <Link href={`/groups/create?eventId=${event.id}`}>
                <Button>Create Group</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">Group by {group.creator?.name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                      {group.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{group.planDescription}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {group.ageMin && group.ageMax && (
                      <p>👥 Age: {group.ageMin} - {group.ageMax} years</p>
                    )}
                    {group.genderPreference && group.genderPreference !== 'any' && (
                      <p>⚧ Gender: {group.genderPreference}</p>
                    )}
                    {group.rideMode && (
                      <p>🚗 Ride: {group.rideMode}</p>
                    )}
                    <p>👤 Max People: {group.maxPeople}</p>
                  </div>

                  <Link href={`/groups/${group.id}`}>
                    <Button fullWidth className="mt-4">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
