'use client'

import { Suspense } from 'react'
import { ResidencesPage } from '@/routes/ResidencesPage'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResidencesPage />
    </Suspense>
  )
}
