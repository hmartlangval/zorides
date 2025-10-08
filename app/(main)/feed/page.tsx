'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Post } from '@/types';
import { formatDate } from '@/lib/utils';

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feed</h1>
        <p className="text-gray-600">Discover events and connect with people</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link href="/events/create">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="py-8 text-center">
              <div className="text-4xl mb-2">📅</div>
              <h3 className="font-semibold">Create Event</h3>
            </CardContent>
          </Card>
        </Link>

        <Link href="/events">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="py-8 text-center">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="font-semibold">Browse Events</h3>
            </CardContent>
          </Card>
        </Link>

        <Link href="/messages">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="py-8 text-center">
              <div className="text-4xl mb-2">💬</div>
              <h3 className="font-semibold">Messages</h3>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Recent Posts</h2>
        
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading posts...</div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No posts yet. Be the first to create an event!</p>
              <Link href="/events/create">
                <Button>Create Event</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                    {post.user?.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-semibold">{post.user?.name}</p>
                    <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{post.content}</p>
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {post.mediaUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Post media"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                <div className="flex gap-4 pt-2 border-t">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600">
                    🙋 Help Find Friend
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-accent-600">
                    👋 Hit Me Up
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    💬 Comment
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
