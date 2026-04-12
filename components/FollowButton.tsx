'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function FollowButton({ issueId }: { issueId: string }) {
  const supabase = createClient()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkFollow() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('follows')
        .select('*')
        .eq('issue_id', issueId)
        .eq('user_id', session.user.id)
        .single()

      if (data) setFollowing(true)
      setLoading(false)
    }
    checkFollow()
  }, [issueId, supabase])

  const toggleFollow = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return alert('Please sign in to follow this issue.')

    setLoading(true)
    if (following) {
      await supabase.from('follows').delete().eq('issue_id', issueId).eq('user_id', session.user.id)
      setFollowing(false)
    } else {
      await supabase.from('follows').insert({ issue_id: issueId, user_id: session.user.id })
      setFollowing(true)
    }
    setLoading(false)
  }

  return (
    <Button 
      variant="outline"
      onClick={toggleFollow}
      disabled={loading}
      className={following ? 'border-blue-500 text-blue-600' : ''}
    >
      {following ? '✓ Following Updates' : 'Follow Issue'}
    </Button>
  )
}
