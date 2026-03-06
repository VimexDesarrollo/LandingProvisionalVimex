import { FaBath, FaBed } from 'react-icons/fa'
import { FiCircle, FiGrid, FiHome, FiMaximize, FiUsers } from 'react-icons/fi'
import type { ResidenceRoomDetail } from '@/types/content'

function normalizeToken(value: string): string {
  return value.trim().toLowerCase().replace(/[_\s]+/g, '-')
}

function resolveRoomDetailToken(item: ResidenceRoomDetail): string {
  const roomIdToken = item.id.split('-room-')[1]

  if (roomIdToken) {
    return normalizeToken(roomIdToken)
  }

  return normalizeToken(item.label)
}

export function getRoomDetailIcon(item: ResidenceRoomDetail, className = 'h-4 w-4') {
  const token = resolveRoomDetailToken(item)

  switch (token) {
    case 'guests':
      return <FiUsers className={className} />
    case 'bedrooms':
    case 'rooms':
      return <FiHome className={className} />
    case 'beds':
      return <FaBed className={className} />
    case 'bathrooms':
      return <FaBath className={className} />
    case 'size':
    case 'area':
      return <FiMaximize className={className} />
    case 'category':
    case 'type':
      return <FiGrid className={className} />
    default:
      return <FiCircle className={className} />
  }
}
