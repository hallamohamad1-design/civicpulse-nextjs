import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { StatusBadge } from '@/components/StatusBadge'
import { Timeline } from '@/components/Timeline'
import { UpvoteWidget } from '@/components/UpvoteWidget'
import { CommentThread } from '@/components/CommentThread'
import { FollowButton } from '@/components/FollowButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function IssuePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: issue } = await supabase
    .from('issues')
    .select(`
      *,
      profiles:user_id (full_name)
    `)
    .eq('id', params.id)
    .single()

  if (!issue) return notFound()

  const { data: history } = await supabase
    .from('status_history')
    .select(`
      *,
      profiles:changed_by (full_name)
    `)
    .eq('issue_id', params.id)
    .order('changed_at', { ascending: false })

  const createdDate = new Date(issue.created_at)
  const isOverdue = issue.status !== 'resolved' && (Date.now() - createdDate.getTime()) > (7 * 24 * 60 * 60 * 1000)

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl flex flex-col md:flex-row gap-8">
      {/* Main Issue Content */}
      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">{issue.category}</span>
          <StatusBadge status={issue.status} />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{issue.title}</h1>
        
        <div className="text-sm text-gray-500 mb-8 pb-4">
          Reported by <strong>{issue.profiles?.full_name}</strong> on {createdDate.toLocaleDateString()}
        </div>

        <div className="flex items-center gap-4 mb-8 pb-8 border-b">
          <UpvoteWidget issueId={issue.id} initialCount={issue.vote_count || 0} />
          <FollowButton issueId={issue.id} />
        </div>

        <div className="prose max-w-none text-gray-700">
          <p>{issue.description}</p>
        </div>

        <CommentThread issueId={issue.id} />
      </div>

      {/* Sidebar (Timeline / Status) */}
      <div className="w-full md:w-80">
        <Card className={isOverdue ? "border-amber-400 bg-amber-50" : ""}>
          <CardHeader>
            <CardTitle className="text-lg">Issue Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isOverdue && (
              <div className="mb-6 p-3 bg-amber-100 text-amber-800 rounded-md text-sm border border-amber-200">
                ⚠️ This issue has been open for more than 7 days.
              </div>
            )}
            
            <h3 className="font-semibold text-gray-900 mb-4">Status History</h3>
            <Timeline history={history || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
