export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  // Try to fetch profile from public profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!profile) {
    // Before SQL initialization, gracefully fall back if tables aren't made yet.
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl text-center">
        <h1 className="text-2xl font-bold">Profile Unavailable</h1>
        <p className="text-gray-500 mt-2">The database schema has not been fully initialized yet, or this user does not exist.</p>
      </div>
    )
  }

  // Fetch submitted issues
  const { data: issues } = await supabase
    .from('issues')
    .select('*')
    .eq('user_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="text-2xl">{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {profile.full_name}
            {profile.role === 'official' && (
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            )}
            {profile.role === 'admin' && <Badge variant="destructive">Admin</Badge>}
          </h1>
          <p className="text-slate-500">Joined {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Issues Reported</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">{issues?.length || 0}</p>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Total Upvotes Received</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">
               {/* Compute sum of upvotes on issues */}
               {issues?.reduce((acc: number, curr: { vote_count?: number }) => acc + (curr.vote_count || 0), 0) || 0}
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
