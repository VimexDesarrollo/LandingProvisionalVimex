import type { ReactNode } from 'react'
import 'leaflet/dist/leaflet.css'

interface ResidencesLayoutProps {
  children: ReactNode
}

export default function ResidencesLayout({ children }: ResidencesLayoutProps) {
  return children
}
