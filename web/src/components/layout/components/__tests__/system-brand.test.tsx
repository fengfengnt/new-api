import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { expect, test, vi } from 'vitest'

import { STATUS_QUERY_KEY } from '@/lib/status-query'
import { useSystemConfigStore } from '@/stores/system-config-store'

import { MobileDrawer } from '../mobile-drawer'
import { PublicHeader } from '../public-header'
import { SystemBrand } from '../system-brand'

vi.mock('@/hooks/use-notifications', () => ({ useNotifications: () => ({}) }))

function createRouterWithRoute(component: () => ReactNode) {
  const route = createRootRoute({ component })
  return createRouter({
    routeTree: route,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
}

function createQueryClient() {
  const queryClient = new QueryClient()
  queryClient.setQueryData(STATUS_QUERY_KEY, {
    system_name: '云鹤智元',
    version: '0.1.0',
  })
  return queryClient
}

test('inline brand shows its current version without linking home', async () => {
  const queryClient = createQueryClient()
  const router = createRouterWithRoute(() => <SystemBrand variant='inline' />)

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )

  expect(await screen.findByText('云鹤智元')).toBeInTheDocument()
  expect(screen.getByText('0.1.0')).toBeInTheDocument()
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
})

test('public header brand is not a home link', async () => {
  useSystemConfigStore.getState().setLoading(false)
  const router = createRouterWithRoute(() => (
    <PublicHeader
      logo={<img alt='Logo' src='/logo.png' />}
      siteName='云鹤智元'
      showAuthButtons={false}
      showNotifications={false}
      showNavigation={false}
      showThemeSwitch={false}
      showLanguageSwitcher={false}
    />
  ))

  render(
    <QueryClientProvider client={createQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )

  expect((await screen.findByText('云鹤智元')).closest('a')).toBeNull()
})

test('mobile drawer brand is not a home link', () => {
  render(
    <MobileDrawer
      isOpen
      onClose={() => {}}
      displayLogo={<img alt='Logo' src='/logo.png' />}
      displaySiteName='云鹤智元'
      loading={false}
      logoLoaded
      mobileLinksList={[]}
      showAuthButtons={false}
      user={null}
    />
  )

  expect(screen.getByText('云鹤智元').closest('a')).toBeNull()
})
