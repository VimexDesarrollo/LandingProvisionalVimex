import type { HomePageContent, ApiHomeResponse } from '@/types/content'
import { env } from '@/config/env'
import { adaptHomeContent } from '@/services/adapters/homeContent.adapter'
import { endpoints } from '@/services/endpoints'
import { apiClient } from '@/services/apiClient'
import { homeMock } from '@/services/mocks/home.mock'

const useMocks = env.useMocks

export const contentService = {
  async getHome(): Promise<HomePageContent> {
    if (useMocks) {
      return adaptHomeContent(homeMock)
    }

    try {
      const response = await apiClient.get<ApiHomeResponse>(endpoints.home)
      return adaptHomeContent(response)
    } catch {
      return adaptHomeContent(homeMock)
    }
  },
}
