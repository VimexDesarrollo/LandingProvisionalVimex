import 'server-only'

import type { ApiHomeResponse, HomePageContent, ResidenceListing } from '@/types/content'
import { env } from '@/config/env'
import { adaptHomeContent } from '@/services/adapters/homeContent.adapter'
import { endpoints } from '@/services/endpoints'
import { homeMock } from '@/services/mocks/home.mock'

const HOME_CONTENT_REVALIDATE_SECONDS = 300
const HOME_CONTENT_TIMEOUT_MS = 4500

function isAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\//.test(value)
}

async function fetchHomeResponse(): Promise<ApiHomeResponse> {
  if (env.useMocks) {
    return homeMock
  }

  const endpoint = endpoints.home

  // Avoid invalid server-side relative fetches when API base URL is not configured.
  if (!isAbsoluteHttpUrl(endpoint)) {
    return homeMock
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), HOME_CONTENT_TIMEOUT_MS)

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      next: {
        revalidate: HOME_CONTENT_REVALIDATE_SECONDS,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error('Home content request failed')
    }

    return (await response.json()) as ApiHomeResponse
  } catch {
    return homeMock
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function getHomeContent(): Promise<HomePageContent> {
  const response = await fetchHomeResponse()
  return adaptHomeContent(response)
}

interface PaginatedResidenceResponse {
  results: ResidenceListing[]
}

export async function getFeaturedResidences(count = 3): Promise<ResidenceListing[]> {
  if (env.useMocks || !isAbsoluteHttpUrl(endpoints.residences)) {
    return []
  }

  const url = `${endpoints.residences}?page_size=${count}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), HOME_CONTENT_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: { revalidate: HOME_CONTENT_REVALIDATE_SECONDS },
      signal: controller.signal,
    })

    if (!response.ok) throw new Error('Residences request failed')

    const data = (await response.json()) as PaginatedResidenceResponse
    return data.results.slice(0, count)
  } catch {
    return []
  } finally {
    clearTimeout(timeoutId)
  }
}
