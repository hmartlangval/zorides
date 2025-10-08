'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  _count: {
    posts: number;
    eventsCreated: number;
    groupsCreated: number;
  };
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    reactions: number;
    comments: number;
  };
}

interface Event {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    groups: number;
    posts: number;
  };
}

interface Group {
  id: string;
  planDescription: string;
  status: string;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  event: {
    id: string;
    title: string;
  };
  _count: {
    members: number;
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'events' | 'groups'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    // Check if user is logged in and is admin
    const userDataStr = localStorage.getItem('user');
    if (!userDataStr) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userDataStr);
    if (userData.email !== 'admin@system.internal') {
      alert('Unauthorized - Admin access required');
      router.push('/feed');
      return;
    }

    setAdminEmail(userData.email);
    loadData('users');
  }, [router]);

  const loadData = async (tab: 'users' | 'posts' | 'events' | 'groups') => {
    setLoading(true);
    try {
      const userDataStr = localStorage.getItem('user');
      if (!userDataStr) return;

      const userData = JSON.parse(userDataStr);
      const adminEmail = userData.email;

      const response = await fetch(`/api/admin/${tab}?adminEmail=${encodeURIComponent(adminEmail)}`, {
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      if (tab === 'users') setUsers(data.users);
      else if (tab === 'posts') setPosts(data.posts);
      else if (tab === 'events') setEvents(data.events);
      else if (tab === 'groups') setGroups(data.groups);
    } catch (error) {
      console.error('Error loading admin data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'users' | 'posts' | 'events' | 'groups') => {
    setActiveTab(tab);
    loadData(tab);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their content.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}&adminEmail=${encodeURIComponent(adminEmail)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      alert('User deleted successfully');
      loadData('users');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/posts?postId=${postId}&adminEmail=${encodeURIComponent(adminEmail)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      alert('Post deleted successfully');
      loadData('posts');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This will also delete all related groups.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/events?eventId=${eventId}&adminEmail=${encodeURIComponent(adminEmail)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      alert('Event deleted successfully');
      loadData('events');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const handleChangeEventStatus = async (eventId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          adminEmail,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event status');
      }

      alert('Event status updated successfully');
      loadData('events');
    } catch (error) {
      console.error('Error updating event status:', error);
      alert('Failed to update event status');
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/groups?groupId=${groupId}&adminEmail=${encodeURIComponent(adminEmail)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete group');
      }

      alert('Group deleted successfully');
      loadData('groups');
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Failed to delete group');
    }
  };

  if (loading && users.length === 0 && posts.length === 0 && events.length === 0 && groups.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, posts, events, and groups</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => handleTabChange('users')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'users'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => handleTabChange('posts')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'posts'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Posts ({posts.length})
        </button>
        <button
          onClick={() => handleTabChange('events')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'events'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Events ({events.length})
        </button>
        <button
          onClick={() => handleTabChange('groups')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'groups'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Groups ({groups.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'users' && (
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Posts: {user._count.posts} | Events: {user._count.eventsCreated} | Groups: {user._count.groupsCreated}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDeleteUser(user.id)}
                    variant="secondary"
                    disabled={user.email === 'admin@system.internal'}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{post.user.name}</span>
                      <span className="text-gray-500 text-sm">({post.user.email})</span>
                    </div>
                    <p className="text-gray-700 mb-2">{post.content.substring(0, 150)}...</p>
                    <p className="text-sm text-gray-500">
                      Reactions: {post._count.reactions} | Comments: {post._count.comments}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button onClick={() => handleDeletePost(post.id)} variant="secondary">
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-600 text-sm">{event.creator.name}</span>
                      <span className="text-gray-500 text-xs">({event.creator.email})</span>
                    </div>
                    <div className="mt-2 flex gap-4 text-sm text-gray-500">
                      <span>Status: {event.status}</span>
                      <span>Groups: {event._count.groups}</span>
                      <span>Posts: {event._count.posts}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {new Date(event.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={event.status}
                      onChange={(e) => handleChangeEventStatus(event.id, e.target.value)}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      <option value="OPEN">Open</option>
                      <option value="FILLED">Filled</option>
                      <option value="CLOSED">Closed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <Button onClick={() => handleDeleteEvent(event.id)} variant="secondary">
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="space-y-4">
            {groups.map((group) => (
              <Card key={group.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold">Event: {group.event.title}</h3>
                    <p className="text-gray-700 mt-2">{group.planDescription.substring(0, 150)}...</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-gray-600 text-sm">{group.creator.name}</span>
                      <span className="text-gray-500 text-xs">({group.creator.email})</span>
                    </div>
                    <div className="mt-2 flex gap-4 text-sm text-gray-500">
                      <span>Status: {group.status}</span>
                      <span>Members: {group._count.members}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {new Date(group.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button onClick={() => handleDeleteGroup(group.id)} variant="secondary">
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

