import { useContext } from 'react'
import { ContentContext } from '@/context/content-context'

export function useContent() {
  const context = useContext(ContentContext)

  if (!context) {
    throw new Error('useContent must be used within AppProvider')
  }

  return context
}
