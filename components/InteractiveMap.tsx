'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useRouter } from 'next/navigation'

// Fix generic Leaflet icon bleeding
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

type Issue = {
  id: string;
  title: string;
  category: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
}

export default function InteractiveMap({ issues }: { issues: Issue[] }) {
  const router = useRouter()
  
  // Cleanly filter out issues without coordinates globally
  const validIssues = issues.filter(i => i.latitude !== null && i.longitude !== null);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'submitted': return 'text-slate-500'
      case 'under_review': return 'text-amber-500'
      case 'in_progress': return 'text-blue-500'
      case 'resolved': return 'text-green-500'
      default: return 'text-slate-500'
    }
  }

  return (
    <MapContainer 
      center={[30.0444, 31.2357]} // Default map center (Cairo) 
      zoom={11} 
      className="w-full h-full rounded-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {validIssues.map((issue) => (
        <Marker 
          key={issue.id} 
          position={[issue.latitude!, issue.longitude!]}
          icon={customIcon}
        >
          <Popup className="rounded-lg shadow-sm">
            <div className="font-sans min-w-[200px]">
              <div className="uppercase tracking-wide text-xs font-semibold text-slate-500 mb-1">
                {issue.category}
              </div>
              <h3 className="font-bold text-lg leading-tight mb-2 text-slate-800">
                {issue.title}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                {issue.description}
              </p>
              
              <div className="flex items-center justify-between mt-4">
                <span className={`text-xs font-bold uppercase ${getStatusColor(issue.status)}`}>
                  ● {issue.status.replace('_', ' ')}
                </span>
                
                <button 
                  onClick={() => router.push(`/issue/${issue.id}`)}
                  className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium hover:bg-blue-700 transition"
                >
                  View full issue
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
