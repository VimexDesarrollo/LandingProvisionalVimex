import {
  FiCircle,
  FiDroplet,
  FiEye,
  FiGlobe,
  FiHeart,
  FiHome,
  FiMapPin,
  FiMonitor,
  FiRefreshCw,
  FiSlash,
  FiSun,
  FiTool,
  FiWifi,
  FiWind,
} from 'react-icons/fi'

export function getAmenityLabel(value: string): string {
  const labelMap: Record<string, string> = {
    'air-conditioning': 'Air conditioning',
    'hot-tub': 'Hot tub',
    kitchen: 'Fully equipped kitchen',
    laundry: 'Washer and dryer',
    'non-smoking': 'Non-smoking space',
    'outdoor-grill': 'Outdoor grill',
    parking: 'Private parking',
    patio: 'Private patio',
    'pets-allowed': 'Pets allowed',
    pool: 'Private or shared pool',
    'satellite-or-cable-tv': 'Satellite or cable TV',
    'wheelchair-accessible': 'Wheelchair accessible',
    'wireless-internet': 'High-speed Wi-Fi',
    'ocean-view': 'Ocean view',
    'free-internet': 'Complimentary internet',
    'pet-friendly': 'Pet friendly',
  }

  if (labelMap[value]) {
    return labelMap[value]
  }

  return value
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')
}

export function getAmenityIcon(value: string, className = 'h-4 w-4') {
  switch (value) {
    case 'air-conditioning':
      return <FiWind className={className} />
    case 'hot-tub':
      return <FiDroplet className={className} />
    case 'kitchen':
      return <FiHome className={className} />
    case 'laundry':
      return <FiRefreshCw className={className} />
    case 'non-smoking':
      return <FiSlash className={className} />
    case 'outdoor-grill':
      return <FiTool className={className} />
    case 'parking':
      return <FiMapPin className={className} />
    case 'patio':
      return <FiSun className={className} />
    case 'pets-allowed':
    case 'pet-friendly':
      return <FiHeart className={className} />
    case 'pool':
      return <FiDroplet className={className} />
    case 'satellite-or-cable-tv':
      return <FiMonitor className={className} />
    case 'wireless-internet':
      return <FiWifi className={className} />
    case 'ocean-view':
      return <FiEye className={className} />
    case 'free-internet':
      return <FiGlobe className={className} />
    default:
      return <FiCircle className={className} />
  }
}
