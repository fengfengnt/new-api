/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { ThemeProvider } from '@/context/theme-provider'
import { api } from '@/lib/api'
import { STATUS_QUERY_KEY } from '@/lib/status-query'
import { useAuthStore } from '@/stores/auth-store'
import { useSystemConfigStore } from '@/stores/system-config-store'

import { Home } from '..'

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  localStorage.clear()
  useAuthStore.setState(useAuthStore.getInitialState(), true)
  useSystemConfigStore.setState(
    {
      ...useSystemConfigStore.getInitialState(),
      loading: false,
    },
    true
  )
  vi.spyOn(api, 'get').mockResolvedValue({ data: { success: true, data: '' } })
})

afterEach(() => {
  vi.unstubAllGlobals()
  useAuthStore.setState(useAuthStore.getInitialState(), true)
  useSystemConfigStore.setState(useSystemConfigStore.getInitialState(), true)
  document.documentElement.classList.remove('dark')
  localStorage.clear()
})

async function renderHome(status: Record<string, unknown> = {}) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  client.setQueryData(STATUS_QUERY_KEY, {
    docs_link: 'https://docs.example.com',
    HeaderNavModules: JSON.stringify({ home: true, console: true, docs: true }),
    ...status,
  })
  client.setQueryData(['notice'], { success: true, data: '' })
  const router = createRouter({
    routeTree: createRootRoute({ component: Home }),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  const view = render(
    <QueryClientProvider client={client}>
      <ThemeProvider defaultTheme='light'>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  )
  await screen.findByRole('main')
  return { ...view, client }
}

test('when the default homepage loads, it shows Yunhe branding and local account links', async () => {
  await renderHome()
  expect(
    await screen.findByRole('heading', {
      name: /One-stop AI Model API Service/,
    })
  ).toBeVisible()
  expect(screen.getByRole('link', { name: 'Get Started' })).toHaveAttribute(
    'href',
    '/sign-up'
  )
  expect(screen.getAllByText('云鹤智元').length).toBeGreaterThan(0)
  expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
    'href',
    '/sign-in'
  )
  expect(screen.getAllByRole('link', { name: 'Docs' })[0]).toHaveAttribute(
    'href',
    'https://docs.example.com'
  )
  expect(document.querySelector('a[href*="apipro"]')).toBeNull()
})

test('when model categories are clicked or activated with the keyboard, their panels follow the selection', async () => {
  await renderHome()
  const user = userEvent.setup()
  const domestic = await screen.findByRole('button', {
    name: /Domestic Models/,
  })
  await user.click(domestic)
  expect(domestic).toHaveAttribute('aria-pressed', 'true')
  for (const region of screen.getAllByRole('region', {
    name: /Domestic Models/,
  })) {
    expect(within(region).getByText('Qwen-Max')).toBeVisible()
  }
  const overseas = screen.getByRole('button', { name: /Overseas Models/ })
  overseas.focus()
  await user.keyboard('{Enter}')
  expect(overseas).toHaveAttribute('aria-pressed', 'true')
  expect(domestic).toHaveAttribute('aria-pressed', 'false')
})

test('when the backend supplies a custom homepage, it still overrides the default landing page', async () => {
  vi.mocked(api.get).mockResolvedValue({
    data: { success: true, data: '# Configured homepage' },
  })
  await renderHome()
  expect(
    await screen.findByRole('heading', { name: 'Configured homepage' })
  ).toBeVisible()
  expect(
    screen.queryByRole('heading', { name: /One-stop AI Model API Service/ })
  ).not.toBeInTheDocument()
})

test('when a user is signed in, the main action opens the local dashboard', async () => {
  useAuthStore
    .getState()
    .auth.setUser({ id: 1, username: 'home-test', role: 1 })
  await renderHome()
  const main = await screen.findByRole('main')
  expect(
    (await within(main).findAllByRole('link', { name: 'Go to Dashboard' }))[0]
  ).toHaveAttribute('href', '/dashboard')
  expect(
    within(main).queryByRole('link', { name: 'Get Started' })
  ).not.toBeInTheDocument()
})

test('when branding is configured, the homepage uses the configured name and logo', async () => {
  useSystemConfigStore
    .getState()
    .setConfig({ systemName: 'Configured brand', logo: '/configured-logo.png' })
  await renderHome()
  expect(
    await screen.findByRole('heading', {
      name: /Professional, Stable, Efficient/,
    })
  ).toBeVisible()
  expect(
    screen.getByRole('link', { name: 'Configured brand' }).querySelector('img')
  ).toHaveAttribute('src', '/configured-logo.png')
  expect(screen.getByText('Why Configured brand')).toBeVisible()
})

test('when optional modules are disabled, the landing page offers no links to disabled pages', async () => {
  await renderHome({
    HeaderNavModules: JSON.stringify({
      pricing: false,
      rankings: false,
      docs: false,
      about: false,
    }),
  })
  await screen.findByRole('heading', { name: /One-stop AI Model API Service/ })
  for (const href of [
    '/pricing',
    '/rankings',
    '/about',
    'https://docs.example.com',
  ]) {
    expect(document.querySelector(`a[href="${href}"]`)).toBeNull()
  }
})
