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
import { act, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { HeroScene } from '../components/hero-scene'

const runtime = vi.hoisted(() => ({ load: vi.fn() }))

vi.mock('/homepage/spline/runtime.js', () => ({
  Application: class {
    load = runtime.load
    play() {}
    stop() {}
    dispose() {}
    setSize() {}
    setBackgroundColor() {}
  },
}))

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    }
  )
})

afterEach(() => vi.unstubAllGlobals())

test('while the 3D scene is loading, a high-priority scene poster is visible', () => {
  runtime.load.mockReturnValue(new Promise(() => {}))
  render(<HeroScene />)
  expect(screen.getByRole('presentation')).toHaveAttribute(
    'src',
    '/homepage/scene-poster.webp'
  )
  expect(screen.getByRole('presentation')).toHaveAttribute(
    'fetchpriority',
    'high'
  )
  expect(
    screen.getByRole('img', { name: 'Animated 3D scene' })
  ).toHaveAttribute('aria-busy', 'true')
  expect(
    document.querySelector('link[rel="preload"][as="fetch"]')
  ).toHaveAttribute('href', '/homepage/scene.splinecode')
})

test('when the scene finishes loading, the poster gives way to the live canvas', async () => {
  let finishLoading!: () => void
  runtime.load.mockReturnValue(
    new Promise<void>((resolve) => {
      finishLoading = resolve
    })
  )
  render(<HeroScene />)
  await waitFor(() => expect(runtime.load).toHaveBeenCalled())
  await act(async () => finishLoading())
  expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
  expect(
    screen.getByRole('img', { name: 'Animated 3D scene' })
  ).toHaveAttribute('aria-busy', 'false')
})

test('when scene loading fails, the poster stays visible alongside the fallback message', async () => {
  let failLoading!: (reason: Error) => void
  runtime.load.mockReturnValue(
    new Promise<void>((_, reject) => {
      failLoading = reject
    })
  )
  render(<HeroScene />)
  await waitFor(() => expect(runtime.load).toHaveBeenCalled())
  await act(async () => failLoading(new Error('Scene download failed')))
  expect(screen.getByText('3D scene unavailable')).toBeVisible()
  expect(screen.getByRole('presentation')).toBeVisible()
  expect(
    screen.getByRole('img', { name: 'Animated 3D scene' })
  ).toHaveAttribute('aria-busy', 'false')
})
