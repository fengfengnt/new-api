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
import { ArrowRight, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'
import { parseHeaderNavModulesFromStatus } from '@/lib/nav-modules'

import { features, plans } from '../content'

export function ServiceSections() {
  const { t } = useTranslation()
  const { systemName } = useSystemConfig()
  const { status } = useStatus()
  const modules = parseHeaderNavModulesFromStatus(status)
  const visiblePlans = plans.filter(
    (plan) => plan.to !== '/pricing' || modules.pricing.enabled
  )
  return (
    <>
      <section className='features-section' id='features'>
        <div className='page-container'>
          <AnimateInView className='section-heading' threshold={0.08}>
            <div className='section-label'>
              <span />
              {t('Why {{name}}', { name: systemName })}
            </div>
            <h2>
              <em>{t('Professional, Stable, Efficient')}</em>
              {t(' AI API Services')}
            </h2>
          </AnimateInView>
          <div className='feature-grid'>
            {features.map((feature, index) => (
              <AnimateInView
                className='feature-card'
                key={feature.title}
                threshold={0.08}
              >
                <h3>{t(feature.title)}</h3>
                <div className='feature-divider' />
                <div className='feature-copy'>
                  <ul>
                    {feature.points.map((point) => (
                      <li key={point}>
                        <Check aria-hidden='true' />
                        {t(point)}
                      </li>
                    ))}
                  </ul>
                  <p>{t(feature.description)}</p>
                </div>
                <div className='feature-metric'>
                  <span>{t(feature.metric)}</span>
                  <strong>{t(feature.value)}</strong>
                </div>
                <img
                  className='feature-illustration'
                  src={`/homepage/images/feature-${index}.svg`}
                  width={60}
                  height={60}
                  alt=''
                  loading='lazy'
                />
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>
      <section className='pricing-section' id='pricing'>
        <div className='page-container'>
          <AnimateInView className='section-heading' threshold={0.08}>
            <div className='section-label'>
              <span />
              {t('Pricing Plans')}
            </div>
            <h2>
              {t('Transparent Pricing, Pay As You Go, ')}
              <em>{t('Great Value')}</em>
            </h2>
          </AnimateInView>
          <div className='pricing-grid' data-columns={visiblePlans.length}>
            {visiblePlans.map((plan, index) => (
              <AnimateInView
                className={`pricing-card pricing-card-${index}`}
                key={plan.title}
                threshold={0.08}
              >
                {index === 0 && (
                  <span className='recommended'>{t('Recommended')}</span>
                )}
                <div className='plan-title'>
                  <img
                    src={`/homepage/images/${plan.icon}`}
                    width={54}
                    height={54}
                    alt=''
                    loading='lazy'
                  />
                  <h3>{t(plan.title)}</h3>
                </div>
                <div className='plan-price'>
                  <span className='contact-sales'>{t(plan.summary)}</span>
                </div>
                <ul>
                  {plan.points.map((point) => (
                    <li key={point}>
                      {t(point)}
                      <Check aria-hidden='true' />
                    </li>
                  ))}
                </ul>
                <Button
                  role='link'
                  className='action-link'
                  render={<Link to={plan.to} />}
                >
                  <span>{t(plan.action)}</span>
                  <ArrowRight aria-hidden='true' />
                </Button>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
