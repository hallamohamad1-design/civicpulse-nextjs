import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'

// Leaflet relies on window object, which breaks SSR.
// We rigorously ensure it's loaded strictly dynamically on the client side.
const MapComponent = dynamic(
  () => import('@/components/InteractiveMap'),
  { 
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-slate-100 flex items-center justify-center font-semibold text-slate-400 border rounded-lg animate-pulse">Loading Free OpenStreetMap...</div>
  }
)

export default async function MapPage() {
  const supabase = createClient()
  
  // Fetch fully resolved issues safely
  const { data: issues } = await supabase
    .from('issues')
    .select('*, profiles:user_id(full_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-64px)] flex flex-col">
      <h1 className="text-3xl font-bold mb-4">Interactive Issue Map</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-4 flex-1">
         <MapComponent issues={issues || []} />
      </div>
    </div>
  )
}
