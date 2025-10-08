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
  onDelete?: () => void;
  onUpdate?: () => void;
}

export function PostCard({ post, currentUserId, onReaction, onComment, onDelete, onUpdate }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

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

  // V1.2 - Edit post (author only)
  const handleEdit = async () => {
    if (!editContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          userId: currentUserId,
          content: editContent,
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        if (onUpdate) onUpdate();
      } else {
        alert('Failed to update post');
      }
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  // V1.2 - Delete post (author only)
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/posts?postId=${post.id}&userId=${currentUserId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        if (onDelete) onDelete();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  const isAuthor = post.userId === currentUserId;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-lg">
              {post.user?.name?.[0] || '?'}
            </div>
            <div>
              <p className="font-semibold">{post.user?.name}</p>
              <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          {/* V1.2 - Edit/Delete buttons for author */}
          {isAuthor && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button
                onClick={handleDelete}
                className="text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full"
            />
            <Button onClick={handleEdit} disabled={!editContent.trim() || submitting}>
              Save Changes
            </Button>
          </div>
        ) : (
          <p className="whitespace-pre-line">{post.content}</p>
        )}

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
