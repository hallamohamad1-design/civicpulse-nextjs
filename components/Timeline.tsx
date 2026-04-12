import { StatusBadge } from "./StatusBadge"

type HistoryEvent = {
  id: string
  status: 'submitted' | 'under_review' | 'in_progress' | 'resolved'
  changed_at: string
  profiles?: {
    full_name: string
  }
}

export function Timeline({ history }: { history: HistoryEvent[] }) {
  if (!history || history.length === 0) return null

  return (
    <div className="relative border-l-2 border-gray-200 ml-3 md:ml-4 my-8">
      {history.map((event, index) => (
        <div key={event.id} className="mb-8 ml-6 relative">
          <div className="absolute w-4 h-4 bg-gray-200 rounded-full -left-[30px] top-1 border-2 border-white shadow-sm"></div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <StatusBadge status={event.status} />
            <span className="text-sm font-medium text-gray-800">
               {index === history.length - 1 ? 'Report Created' : 'Status Updated'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(event.changed_at).toLocaleString()} 
            {event.profiles && ` • By ${event.profiles.full_name}`}
          </p>
        </div>
      ))}
    </div>
  )
}
