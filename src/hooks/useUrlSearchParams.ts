'use client'

import { useCallback, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type SetSearchParamsInput = URLSearchParams | ((previous: URLSearchParams) => URLSearchParams)

interface SetSearchParamsOptions {
  replace?: boolean
}

export function useUrlSearchParams(): readonly [URLSearchParams, (next: SetSearchParamsInput, options?: SetSearchParamsOptions) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams])

  const setSearchParams = useCallback(
    (next: SetSearchParamsInput, options?: SetSearchParamsOptions) => {
      const baseParams = new URLSearchParams(searchParams.toString())
      const resolvedParams = typeof next === 'function' ? next(baseParams) : next
      const nextQuery = resolvedParams.toString()
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname

      if (options?.replace) {
        router.replace(nextUrl, { scroll: false })
        return
      }

      router.push(nextUrl, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  return [currentParams, setSearchParams] as const
}
