'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Comment = {
  id: string
  body: string
  created_at: string
  user_id: string
  profiles?: {
    full_name: string
    avatar_url: string
    role: string
  }
}

export function CommentThread({ issueId }: { issueId: string }) {
  const supabase = createClient()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchComments() {
      const { data } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url, role)
        `)
        .eq('issue_id', issueId)
        .order('created_at', { ascending: true })
      
      setComments(data || [])
      setLoading(false)
    }

    fetchComments()

    // Supabase Real-Time Engine Activation
    const channel = supabase
      .channel('public:comments')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `issue_id=eq.${issueId}` },
        (payload) => {
          // Manually refetch to get profile joins (since realtime doesn't join inherently)
          fetchComments()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [issueId, supabase])

  const postComment = async () => {
    if (!newComment.trim()) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return alert('Please sign in to comment.')

    setLoading(true)
    await supabase.from('comments').insert({
      issue_id: issueId,
      user_id: session.user.id,
      body: newComment
    })
    
    setNewComment('')
    setLoading(false)
  }

  return (
    <div className="mt-12 pt-8 border-t">
      <h3 className="text-2xl font-bold mb-6">Discussion ({comments.length})</h3>

      <div className="space-y-6 mb-8">
        {comments.map((comment) => (
          <div key={comment.id} className={`flex gap-4 p-4 rounded-lg bg-white border ${comment.profiles?.role === 'official' ? 'border-amber-300 bg-amber-50 shadow-sm' : ''}`}>
            <Avatar>
              <AvatarImage src={comment.profiles?.avatar_url} />
              <AvatarFallback>{comment.profiles?.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{comment.profiles?.full_name}</span>
                {comment.profiles?.role === 'official' && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-200 px-2 py-0.5 rounded uppercase">Official Response</span>
                )}
                <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
              </div>
              <p className="text-gray-700">{comment.body}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && !loading && (
          <p className="text-gray-500 italic">No comments yet. Be the first to start the discussion!</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment or evidence here..."
          className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          rows={3}
        />
        <Button onClick={postComment} disabled={loading} className="self-end">
          Post Comment
        </Button>
      </div>
    </div>
  )
}
