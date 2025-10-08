'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Event } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { getStates, getDistricts } from '@/lib/locations';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [filterState, filterDistrict]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (filterState) params.append('state', filterState);
      if (filterDistrict) params.append('district', filterDistrict);

      const res = await fetch(`/api/events?${params.toString()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const states = getStates();
  const districts = filterState ? getDistricts(filterState) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Events</h1>
          <p className="text-gray-600">Find events near you</p>
        </div>
        <Link href="/events/create">
          <Button size="lg">+ Create Event</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="py-4">
          <div className="flex gap-4 items-end">
            <Select
              label="Filter by State"
              value={filterState}
              onChange={(e) => {
                setFilterState(e.target.value);
                setFilterDistrict('');
              }}
              options={[
                { value: '', label: 'All States' },
                ...states.map((state) => ({ value: state, label: state })),
              ]}
            />

            <Select
              label="Filter by District"
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              disabled={!filterState}
              options={[
                { value: '', label: 'All Districts' },
                ...districts.map((district) => ({ value: district, label: district })),
              ]}
            />

            {(filterState || filterDistrict) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setFilterState('');
                  setFilterDistrict('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading events...</div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No events found. Create one!</p>
            <Link href="/events/create">
              <Button>Create Event</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                {event.mediaUrls && event.mediaUrls.length > 0 && (
                  <div className="relative h-48">
                    <img
                      src={event.mediaUrls[0]}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                    <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                      {event.status}
                    </div>
                  </div>
                )}
                <CardHeader>
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-500">📅 {formatDateTime(event.date)}</p>
                  <p className="text-sm text-gray-600">
                    📍 {event.locality}, {event.district}, {event.state}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
