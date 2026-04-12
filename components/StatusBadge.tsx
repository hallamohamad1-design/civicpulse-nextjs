import { Badge } from "@/components/ui/badge"

type StatusBadgeProps = {
  status: 'submitted' | 'under_review' | 'in_progress' | 'resolved'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'submitted':
      return <Badge className="bg-gray-400 hover:bg-gray-500">Submitted</Badge>
    case 'under_review':
      return <Badge className="bg-amber-500 hover:bg-amber-600">Under Review</Badge>
    case 'in_progress':
      return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
    case 'resolved':
      return <Badge className="bg-green-500 hover:bg-green-600">Resolved</Badge>
    default:
      return <Badge className="bg-slate-400">Unknown</Badge>
  }
}
