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
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { PublicLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'

import { HeroScene } from './hero-scene'
import { LandingFooter } from './landing-footer'
import { ModelSection } from './model-section'
import { ServiceSections } from './service-sections'

import '@/styles/homepage.css'

export function LandingPage() {
  const { t, i18n } = useTranslation()
  const isAuthenticated = useAuthStore((state) => !!state.auth.user)

  return (
    <div className='yunhe-homepage' data-language={i18n.language.split('-')[0]}>
      <PublicLayout showMainContainer={false}>
        <main>
          <section className='hero' id='home'>
            <div className='page-container hero-grid'>
              <div className='hero-copy'>
                <AnimateInView className='hero-badge' threshold={0.08}>
                  <img
                    src='/homepage/images/badge.svg'
                    width={16}
                    height={16}
                    alt=''
                  />
                  {t('AI Application Infrastructure Foundation')}
                </AnimateInView>
                <AnimateInView threshold={0.08}>
                  <h1>
                    <span className='hero-headline'>
                      {t('One-stop AI Model API Service')}
                    </span>
                    <span className='hero-promise'>
                      <span>{t('Unified APIs, Stable & Reliable,')}</span>
                      <span className='ready-text'>{t('Ready to Use')}</span>
                    </span>
                  </h1>
                </AnimateInView>
                <AnimateInView className='hero-stats' threshold={0.08}>
                  {[
                    ['API', 'Unified Access'],
                    ['SDK', 'Developer Friendly'],
                    ['AI', 'Multimodal Models'],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <strong>{value}</strong>
                      <p>{t(label)}</p>
                    </div>
                  ))}
                </AnimateInView>
                <AnimateInView className='hero-action' threshold={0.08}>
                  <Button
                    role='link'
                    className='action-link'
                    render={
                      <Link to={isAuthenticated ? '/dashboard' : '/sign-up'} />
                    }
                  >
                    <span className='action-text'>
                      <span>
                        {isAuthenticated
                          ? t('Go to Dashboard')
                          : t('Get Started')}
                      </span>
                      <span aria-hidden='true'>
                        {isAuthenticated
                          ? t('Go to Dashboard')
                          : t('Get Started')}
                      </span>
                    </span>
                    <ArrowRight aria-hidden='true' />
                  </Button>
                </AnimateInView>
              </div>
              <div className='hero-visual'>
                <HeroScene />
              </div>
            </div>
          </section>
          <ModelSection />
          <ServiceSections />
        </main>
        <LandingFooter />
      </PublicLayout>
    </div>
  )
}
