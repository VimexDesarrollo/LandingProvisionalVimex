import { env } from '@/config/env'
import { legalPages } from '@/content/legal'
import { adaptLegalPageContent } from '@/services/adapters/legalContent.adapter'
import { endpoints } from '@/services/endpoints'

const LEGAL_CONTENT_REVALIDATE_SECONDS = 300
const LEGAL_CONTENT_TIMEOUT_MS = 4500

function isAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\//.test(value)
}

export async function getLegalPageContent(key: keyof typeof legalPages) {
  const fallback = legalPages[key]

  if (env.useMocks || !isAbsoluteHttpUrl(endpoints.legalDocument(fallback.href))) {
    return fallback
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), LEGAL_CONTENT_TIMEOUT_MS)

  try {
    const response = await fetch(endpoints.legalDocument(fallback.href), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: { revalidate: LEGAL_CONTENT_REVALIDATE_SECONDS },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error('Legal content request failed')
    }

    return adaptLegalPageContent(await response.json(), fallback.href, fallback.relatedLinks)
  } catch {
    return fallback
  } finally {
    clearTimeout(timeoutId)
  }
}
