import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { HomePageContent } from '@/types/content'
import { contentService } from '@/services/contentService'

interface ContentContextValue {
  homeContent: HomePageContent | null
  isLoading: boolean
  errorMessage: string | null
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined)

interface ContentProviderProps {
  children: ReactNode
}

export function ContentProvider({ children }: ContentProviderProps) {
  const [homeContent, setHomeContent] = useState<HomePageContent | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadContent = async () => {
      try {
        const response = await contentService.getHome()

        if (!isMounted) {
          return
        }

        setHomeContent(response)
      } catch {
        if (!isMounted) {
          return
        }

        setErrorMessage('We could not load the content right now. Please try again shortly.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadContent()

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo(
    () => ({
      homeContent,
      isLoading,
      errorMessage,
    }),
    [homeContent, isLoading, errorMessage],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export { ContentContext }
