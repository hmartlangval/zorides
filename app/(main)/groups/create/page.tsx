'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function CreateGroupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const [formData, setFormData] = useState({
    planDescription: '',
    ageMin: '',
    ageMax: '',
    genderPreference: 'any',
    rideMode: '',
    maxPeople: '4',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!eventId) {
      router.push('/events');
    }
  }, [eventId, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          creatorId: userId,
          planDescription: formData.planDescription,
          ageMin: formData.ageMin ? parseInt(formData.ageMin) : null,
          ageMax: formData.ageMax ? parseInt(formData.ageMax) : null,
          genderPreference: formData.genderPreference,
          rideMode: formData.rideMode || null,
          maxPeople: parseInt(formData.maxPeople),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create group');
        setLoading(false);
        return;
      }

      const data = await res.json();
      // Redirect back to event page to see the group
      router.push(`/events/${eventId}`);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Create Attendant Group</h1>
          <p className="text-gray-600 mt-2">Set your preferences for finding companions</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Textarea
              label="Plan Description"
              value={formData.planDescription}
              onChange={(e) => setFormData({ ...formData, planDescription: e.target.value })}
              placeholder="Describe your plan, expectations, or what you're looking for in companions..."
              rows={4}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Min Age (Optional)"
                value={formData.ageMin}
                onChange={(e) => setFormData({ ...formData, ageMin: e.target.value })}
                placeholder="18"
                min="1"
                max="100"
              />
              <Input
                type="number"
                label="Max Age (Optional)"
                value={formData.ageMax}
                onChange={(e) => setFormData({ ...formData, ageMax: e.target.value })}
                placeholder="30"
                min="1"
                max="100"
              />
            </div>

            <Select
              label="Gender Preference"
              value={formData.genderPreference}
              onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value })}
              options={[
                { value: 'any', label: 'Any' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />

            <Select
              label="Ride Mode"
              value={formData.rideMode}
              onChange={(e) => setFormData({ ...formData, rideMode: e.target.value })}
              options={[
                { value: '', label: 'Not specified' },
                { value: 'car', label: 'Car' },
                { value: 'bike', label: 'Bike' },
                { value: 'public_transport', label: 'Public Transport' },
                { value: 'walking', label: 'Walking' },
                { value: 'own_arrangement', label: 'Own Arrangement' },
              ]}
            />

            <Input
              type="number"
              label="Maximum Number of People"
              value={formData.maxPeople}
              onChange={(e) => setFormData({ ...formData, maxPeople: e.target.value })}
              placeholder="4"
              min="2"
              max="20"
              required
            />

            <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
              <p className="font-semibold mb-1">💡 Tip</p>
              <p>Be specific about your preferences to find the best matches!</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Creating...' : 'Create Group'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
