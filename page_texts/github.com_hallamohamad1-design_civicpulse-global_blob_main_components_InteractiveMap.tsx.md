# civicpulse-global/components/InteractiveMap.tsx at main · hallamohamad1-design/civicpulse-global · GitHub

**URL:** https://github.com/hallamohamad1-design/civicpulse-global/blob/main/components/InteractiveMap.tsx

---

Skip to content
Navigation Menu
Platform
Solutions
Resources
Open Source
Enterprise
Pricing
Sign in
Sign up
hallamohamad1-design
/
civicpulse-global
Public
Notifications
Fork 0
 Star 0
Code
Issues
Pull requests
Actions
Projects
Security and quality
Insights
Files
 main
app
components
ui
CommentThread.tsx
FollowButton.tsx
InteractiveMap.tsx
Navbar.tsx
StatusBadge.tsx
Timeline.tsx
UpvoteWidget.tsx
lib
.eslintrc.json
.gitignore
README.md
components.json
middleware.ts
next.config.mjs
package-lock.json
package.json
postcss.config.mjs
supabase_migration.sql
supabase_migration_phase2.sql
tailwind.config.ts
tsconfig.json
types_supabase.ts
Breadcrumbs
civicpulse-global/components
/InteractiveMap.tsx
Latest commit
Halla
Initial CivicPulse Migration
7449d10
 · 
History
History
File metadata and controls
Code
Blame
Raw
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
'use client'


import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
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