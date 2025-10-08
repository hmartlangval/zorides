'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { AttendantGroup, GroupMember } from '@/types';

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [group, setGroup] = useState<AttendantGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editPlanDescription, setEditPlanDescription] = useState('');
  const [editMaxPeople, setEditMaxPeople] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) setCurrentUserId(userId);
    fetchGroupDetails();
  }, []);

  const fetchGroupDetails = async () => {
    try {
      const res = await fetch(`/api/groups/${params.id}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Group data:', data);
        console.log('Members:', data.members);
        setGroup(data.group);
        setEditPlanDescription(data.group.planDescription);
        setEditMaxPeople(data.group.maxPeople);
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error('Failed to fetch group:', error);
    } finally {
      setLoading(false);
    }
  };

  // V1.2 - Edit group (creator only)
  const handleEditGroup = async () => {
    if (!editPlanDescription.trim() || editMaxPeople < 1) return;

    try {
      const res = await fetch('/api/groups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: group?.id,
          userId: currentUserId,
          planDescription: editPlanDescription,
          maxPeople: editMaxPeople,
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        fetchGroupDetails();
        alert('Group updated successfully');
      } else {
        alert('Failed to update group');
      }
    } catch (error) {
      console.error('Failed to update group:', error);
      alert('Failed to update group');
    }
  };

  // V1.2 - Delete group (creator only)
  const handleDeleteGroup = async () => {
    if (!confirm('Are you sure you want to delete this group?')) return;

    try {
      const res = await fetch(`/api/groups?groupId=${group?.id}&userId=${currentUserId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Group deleted successfully');
        router.push(`/events/${group?.eventId}`);
      } else {
        alert('Failed to delete group');
      }
    } catch (error) {
      console.error('Failed to delete group:', error);
      alert('Failed to delete group');
    }
  };

  // V1.2 - Change group status (creator only)
  const handleChangeStatus = async (newStatus: string) => {
    try {
      const res = await fetch('/api/groups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: group?.id,
          userId: currentUserId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        fetchGroupDetails();
        alert('Group status updated successfully');
      } else {
        alert('Failed to update group status');
      }
    } catch (error) {
      console.error('Failed to update group status:', error);
      alert('Failed to update group status');
    }
  };

  const handleJoinGroup = async () => {
    setJoining(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/login');
        return;
      }

      const res = await fetch(`/api/groups/${params.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        const joinData = await res.json();
        console.log('Join response:', joinData);
        // Wait a bit then refresh
        setTimeout(() => {
          fetchGroupDetails(); // Refresh data
        }, 500);
      } else {
        const errorData = await res.json();
        console.error('Join error:', errorData);
        alert(errorData.error || 'Failed to join group');
      }
    } catch (error) {
      console.error('Failed to join group:', error);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-gray-500">Loading group...</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">Group not found</p>
            <Link href="/events">
              <Button>Back to Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCreator = currentUserId === group.creatorId;
  const isMember = members.some(m => m.userId === currentUserId);
  const canJoin = !isCreator && !isMember && group.status === 'OPEN';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Group Details */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Attendant Group</h1>
              {group.event && (
                <Link 
                  href={`/events/${group.eventId}`}
                  className="text-primary-600 hover:underline inline-flex items-center gap-1"
                >
                  📅 {group.event.title}
                  <span className="text-sm">→ View Event</span>
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {group.status}
              </span>
              {/* V1.2 - Creator actions */}
              {isCreator && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={handleEditGroup}>Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
                        Edit
                      </Button>
                      <select
                        value={group.status}
                        onChange={(e) => handleChangeStatus(e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="OPEN">Open</option>
                        <option value="FILLED">Filled</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                      <Button size="sm" variant="secondary" onClick={handleDeleteGroup}>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Plan Description</h3>
            {isEditing ? (
              <Textarea
                value={editPlanDescription}
                onChange={(e) => setEditPlanDescription(e.target.value)}
                placeholder="Plan description"
                rows={4}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-line">{group.planDescription}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Preferences</h4>
              <div className="space-y-2 text-sm">
                {group.ageMin && group.ageMax && (
                  <p>👥 <strong>Age Range:</strong> {group.ageMin} - {group.ageMax} years</p>
                )}
                {group.genderPreference && (
                  <p>⚧ <strong>Gender:</strong> {group.genderPreference}</p>
                )}
                {group.rideMode && (
                  <p>🚗 <strong>Ride Mode:</strong> {group.rideMode.replace('_', ' ')}</p>
                )}
                {isEditing ? (
                  <div>
                    <label className="block text-sm font-medium mb-1">Max People:</label>
                    <Input
                      type="number"
                      value={editMaxPeople}
                      onChange={(e) => setEditMaxPeople(parseInt(e.target.value) || 0)}
                      min={1}
                      className="w-24"
                    />
                  </div>
                ) : (
                  <p>👤 <strong>Max People:</strong> {group.maxPeople}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Group Info</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Created by:</strong> {group.creator?.name}</p>
                <p><strong>Current Members:</strong> {members.length + 1} / {group.maxPeople}</p>
                <p><strong>Status:</strong> {group.status}</p>
              </div>
            </div>
          </div>

          {canJoin && !isEditing && (
            <div className="pt-4">
              <Button 
                onClick={handleJoinGroup} 
                disabled={joining}
                size="lg"
                fullWidth
              >
                {joining ? 'Joining...' : 'Join This Group'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Members ({members.length + 1})</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Creator */}
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center text-primary-700 font-semibold">
                  {group.creator?.name?.[0] || '?'}
                </div>
                <div>
                  <p className="font-semibold">{group.creator?.name}</p>
                  <p className="text-xs text-gray-600">Group Creator</p>
                </div>
              </div>
              <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">
                CREATOR
              </span>
            </div>

            {/* Members */}
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                    {member.user?.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-semibold">{member.user?.name}</p>
                    <p className="text-xs text-gray-500">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  member.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                  member.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>

          {members.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No members yet. Be the first to join!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
