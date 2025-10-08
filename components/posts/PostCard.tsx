'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Post } from '@/types';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onReaction?: () => void;
  onComment?: () => void;
}

export function PostCard({ post, currentUserId, onReaction, onComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const helpFindFriendCount = post.reactions?.filter(r => r.type === 'HELP_FIND_FRIEND').length || 0;
  const hitMeUpCount = post.reactions?.filter(r => r.type === 'HIT_ME_UP').length || 0;
  
  const userReaction = post.reactions?.find(r => r.userId === currentUserId);

  const handleReaction = async (type: 'HELP_FIND_FRIEND' | 'HIT_ME_UP') => {
    try {
      const res = await fetch('/api/posts/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          userId: currentUserId,
          type,
        }),
      });

      if (res.ok && onReaction) {
        onReaction();
      }
    } catch (error) {
      console.error('Failed to react:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/posts/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          userId: currentUserId,
          content: newComment,
        }),
      });

      if (res.ok) {
        setNewComment('');
        if (onComment) onComment();
      }
    } catch (error) {
      console.error('Failed to comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-lg">
            {post.user?.name?.[0] || '?'}
          </div>
          <div>
            <p className="font-semibold">{post.user?.name}</p>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="whitespace-pre-line">{post.content}</p>

        {/* Media */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
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

        {/* Reactions */}
        <div className="flex items-center gap-6 pt-4 border-t">
          <button
            onClick={() => handleReaction('HELP_FIND_FRIEND')}
            className={`flex items-center gap-2 text-sm transition-colors ${
              userReaction?.type === 'HELP_FIND_FRIEND'
                ? 'text-primary-600 font-semibold'
                : 'text-gray-600 hover:text-primary-600'
            }`}
          >
            🙋 Help Find Friend
            {helpFindFriendCount > 0 && <span>({helpFindFriendCount})</span>}
          </button>

          <button
            onClick={() => handleReaction('HIT_ME_UP')}
            className={`flex items-center gap-2 text-sm transition-colors ${
              userReaction?.type === 'HIT_ME_UP'
                ? 'text-accent-600 font-semibold'
                : 'text-gray-600 hover:text-accent-600'
            }`}
          >
            👋 Hit Me Up
            {hitMeUpCount > 0 && <span>({hitMeUpCount})</span>}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            💬 Comment
            {post.comments && post.comments.length > 0 && <span>({post.comments.length})</span>}
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="pt-4 border-t space-y-4">
            {/* Existing Comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0">
                      {comment.user?.name?.[0] || '?'}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <p className="font-semibold text-sm">{comment.user?.name}</p>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <form onSubmit={handleComment} className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
                className="flex-1"
              />
              <Button type="submit" disabled={!newComment.trim() || submitting}>
                Post
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
