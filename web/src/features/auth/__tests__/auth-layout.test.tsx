import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'

import { useSystemConfigStore } from '@/stores/system-config-store'

import { AuthLayout } from '../auth-layout'

afterEach(() => {
  useSystemConfigStore.setState(useSystemConfigStore.getInitialState(), true)
  localStorage.clear()
})

test('when auth branding is displayed, its logo and name are not links', async () => {
  useSystemConfigStore.setState({
    ...useSystemConfigStore.getInitialState(),
    loading: false,
  })
  const route = createRootRoute({
    component: () => <AuthLayout>Sign in form</AuthLayout>,
  })
  const router = createRouter({
    routeTree: route,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )

  expect(await screen.findByRole('heading', { name: '云鹤智元' })).toBeVisible()
  expect(screen.getByRole('img', { name: 'Logo' })).toBeVisible()
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
})
