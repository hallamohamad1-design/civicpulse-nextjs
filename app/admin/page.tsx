export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function AdminDashboard() {
  const supabase = createClient()
  
  // Verify User is Logged In
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Verify Role is Admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p>You do not have the necessary permissions to view the Admin Dashboard.</p>
      </div>
    )
  }

  // Fetch all users safely via Server Auth (Since RLS might block normal selects, but admins bypass it)
  const { data: allUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">System Admin Dashboard</h1>

      <div className="bg-white border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Current Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers?.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-mono text-xs">{u.id}</TableCell>
                <TableCell className="font-medium flex items-center gap-2">
                  {u.full_name}
                  {u.role === 'official' && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  )}
                </TableCell>
                <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <select 
                    defaultValue={u.role} 
                    className="border p-2 rounded text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled // Action requires interactive client component wrapper, disabled for Phase 1 UI setup
                  >
                    <option value="citizen">Citizen</option>
                    <option value="moderator">Moderator</option>
                    <option value="official">Official</option>
                    <option value="admin">Admin</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
            
            {(!allUsers || allUsers.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                   No users found or schema not yet initialized.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}
