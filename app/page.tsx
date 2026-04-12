export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/StatusBadge'
import Link from 'next/link'

export default async function Home() {
  const supabase = createClient()

  const { data: issues } = await supabase
    .from('issues')
    .select('*, profiles:user_id(full_name)')
    .order('created_at', { ascending: false })
    .limit(20)

  const { count: totalCount } = await supabase
    .from('issues')
    .select('*', { count: 'exact', head: true })

  const { count: resolvedCount } = await supabase
    .from('issues')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'resolved')

  const { count: openCount } = await supabase
    .from('issues')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'resolved')

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 max-w-5xl text-center">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Civic Engagement Platform
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Report. Track. <span className="text-blue-600">Resolve.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
            CivicPulse Global connects citizens with local government to fix real community issues — roads, water, electricity, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Report an Issue
            </Link>
            <Link
              href="/map"
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-lg transition"
            >
              View Map
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-blue-600">
        <div className="container mx-auto px-4 py-6 max-w-5xl grid grid-cols-3 gap-4 text-center text-white">
          <div>
            <p className="text-3xl font-bold">{totalCount ?? 0}</p>
            <p className="text-blue-200 text-sm">Total reports</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{resolvedCount ?? 0}</p>
            <p className="text-blue-200 text-sm">Resolved</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{openCount ?? 0}</p>
            <p className="text-blue-200 text-sm">Open issues</p>
          </div>
        </div>
      </section>

      {/* Issue feed */}
      <section className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Issues</h2>
          <Link href="/map" className="text-blue-600 hover:underline text-sm font-medium">
            View on map →
          </Link>
        </div>

        {(!issues || issues.length === 0) ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-4xl mb-3">📍</p>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No issues reported yet</h3>
            <p className="text-gray-400 mb-6">Be the first to report a community issue in your area.</p>
            <Link
              href="/submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition text-sm"
            >
              Report the first issue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issues.map((issue) => {
              const createdDate = new Date(issue.created_at)
              const daysOpen = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
              const isOverdue = issue.status !== 'resolved' && daysOpen > 7

              return (
                <Link
                  key={issue.id}
                  href={`/issue/${issue.id}`}
                  className="block bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition p-5 group"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {issue.category || 'General'}
                    </span>
                    <StatusBadge status={issue.status} />
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-blue-600 transition line-clamp-2">
                    {issue.title}
                  </h3>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {issue.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>
                      By <span className="font-medium text-gray-600">{issue.profiles?.full_name || 'Anonymous'}</span>
                    </span>
                    <span className={isOverdue ? 'text-amber-500 font-semibold' : ''}>
                      {daysOpen === 0 ? 'Today' : `${daysOpen}d ago`}
                      {isOverdue && ' ⚠️'}
                    </span>
                  </div>

                  {issue.vote_count > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-xs text-gray-400">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                      {issue.vote_count} {issue.vote_count === 1 ? 'upvote' : 'upvotes'}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* CTA Footer */}
      <section className="bg-white border-t mt-8">
        <div className="container mx-auto px-4 py-12 max-w-5xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">See an issue in your community?</h2>
          <p className="text-gray-500 mb-6">Sign in with Google and report it in under 2 minutes.</p>
          <Link
            href="/submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Report an Issue
          </Link>
        </div>
      </section>

    </div>
  )
}
