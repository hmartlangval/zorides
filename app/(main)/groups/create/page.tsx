'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

function CreateGroupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const [formData, setFormData] = useState({
    planDescription: '',
    genderPreference: 'any',
    rideOwnership: '',
    rideMode: '',
    maxPeople: '4',
  });
  const [groupImage, setGroupImage] = useState<File | null>(null);
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

      // Upload group image if provided
      let groupImageUrl = null;
      if (groupImage) {
        const imageFormData = new FormData();
        imageFormData.append('files', groupImage);
        imageFormData.append('folder', 'events');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          groupImageUrl = uploadData.urls[0];
        }
      }

      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          creatorId: userId,
          planDescription: formData.planDescription,
          genderPreference: formData.genderPreference,
          rideOwnership: formData.rideOwnership || null,
          rideMode: formData.rideMode || null,
          groupImage: groupImageUrl,
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

            <Select
              label="Your Ride Ownership"
              value={formData.rideOwnership}
              onChange={(e) => setFormData({ ...formData, rideOwnership: e.target.value })}
              options={[
                { value: '', label: 'Not specified' },
                { value: 'bike', label: '🏍️ I have a Bike' },
                { value: 'car', label: '🚗 I have a Car' },
                { value: 'both', label: '🚗🏍️ I have Both' },
                { value: 'looking_for_ride', label: '🙋 Looking for a Ride' },
              ]}
            />

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setGroupImage(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              <p className="text-xs text-gray-500 mt-1">Add a photo to make your group more appealing!</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700">
              <p className="font-semibold mb-1">💡 Tip</p>
              <p>Be specific about your ride preferences to match with the right people!</p>
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

export default function CreateGroupPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            <p className="text-gray-500 mt-4">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <CreateGroupForm />
    </Suspense>
  );
}