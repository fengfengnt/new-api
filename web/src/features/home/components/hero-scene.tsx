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
import { useEffect, useRef, useState } from 'react'
import { preload, preloadModule } from 'react-dom'
import { useTranslation } from 'react-i18next'

interface SceneApplication {
  load: (
    url: string,
    variables?: Record<string, string | number | boolean>,
    fetchOptions?: RequestInit
  ) => Promise<void>
  play: () => void
  stop: () => void
  dispose: () => void
  setSize: (width: number, height: number) => void
  setBackgroundColor: (color: string) => void
}

export function HeroScene() {
  const { t } = useTranslation()
  const canvas = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)

  preloadModule('/homepage/spline/runtime.js')
  preload('/homepage/scene.splinecode', {
    as: 'fetch',
    crossOrigin: 'anonymous',
  })

  useEffect(() => {
    let application: SceneApplication | undefined
    let cancelled = false
    let inView = false
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePlayback = () => {
      if (!document.hidden && inView && !motion.matches) application?.play()
      else application?.stop()
    }
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      updatePlayback()
    })
    const resizeScene = () => {
      const bounds = canvas.current?.parentElement?.getBoundingClientRect()
      if (bounds) application?.setSize(bounds.width, bounds.height)
    }
    const resize = new ResizeObserver(resizeScene)

    async function loadScene() {
      try {
        // The verified runtime is served locally so the host needs no new dependency.
        const runtimeUrl = '/homepage/spline/runtime.js'
        const { Application } = (await import(
          /* webpackIgnore: true */ runtimeUrl
        )) as {
          Application: new (element: HTMLCanvasElement) => SceneApplication
        }
        if (cancelled || !canvas.current) return
        application = new Application(canvas.current)
        await application.load('/homepage/scene.splinecode', undefined, {
          mode: 'cors',
          credentials: 'same-origin',
        })
        if (cancelled) return
        application.setBackgroundColor('transparent')
        resizeScene()
        if (canvas.current) {
          canvas.current.style.width = '100%'
          canvas.current.style.height = '100%'
          visibility.observe(canvas.current)
          if (canvas.current.parentElement) {
            resize.observe(canvas.current.parentElement)
          }
        }
        updatePlayback()
        setReady(true)
      } catch {
        if (!cancelled) setFailed(true)
      }
    }
    void loadScene()
    document.addEventListener('visibilitychange', updatePlayback)
    motion.addEventListener('change', updatePlayback)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', updatePlayback)
      motion.removeEventListener('change', updatePlayback)
      visibility.disconnect()
      resize.disconnect()
      application?.dispose()
    }
  }, [])

  return (
    <div
      className='scene-frame'
      data-ready={ready}
      aria-label={t('Animated 3D scene')}
      aria-busy={!ready && !failed}
      role='img'
    >
      <div className='scene-glow' />
      <div className='scene-crop'>
        <div className='scene-canvas'>
          {!ready && (
            <img
              className='scene-poster'
              src='/homepage/scene-poster.webp'
              alt=''
              width={1250}
              height={1250}
              fetchPriority='high'
            />
          )}
          <canvas ref={canvas} />
        </div>
      </div>
      {failed && <p className='scene-error'>{t('3D scene unavailable')}</p>}
    </div>
  )
}
