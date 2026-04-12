'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function UpvoteWidget({ issueId, initialCount = 0 }: { issueId: string, initialCount?: number }) {
  const supabase = createClient()
  const [upvotes, setUpvotes] = useState(initialCount)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkVote() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      // Check if user voted
      const { data } = await supabase
        .from('votes')
        .select('*')
        .eq('issue_id', issueId)
        .eq('user_id', session.user.id)
        .single()

      if (data) setHasVoted(true)

      // Get accurate vote count
      const { count } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('issue_id', issueId)

      setUpvotes(count || initialCount)
      setLoading(false)
    }
    
    checkVote()
  }, [issueId, supabase, initialCount])

  const toggleVote = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return alert('Please sign in with Google to upvote!')

    setLoading(true)
    if (hasVoted) {
      await supabase.from('votes').delete().eq('issue_id', issueId).eq('user_id', session.user.id)
      setHasVoted(false)
      setUpvotes(prev => prev - 1)
    } else {
      await supabase.from('votes').insert({ issue_id: issueId, user_id: session.user.id })
      setHasVoted(true)
      setUpvotes(prev => prev + 1)
    }
    setLoading(false)
  }

  return (
    <Button 
      variant={hasVoted ? "default" : "outline"}
      onClick={toggleVote}
      disabled={loading}
      className={`flex items-center gap-2 ${hasVoted ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
      </svg>
      {upvotes} Upvotes
    </Button>
  )
}
