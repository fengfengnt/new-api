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
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'

import { modelGroups } from '../content'

function ModelPanel(props: { group: number }) {
  return (
    <div className={`model-panel model-panel-${props.group}`}>
      <div className='model-glass'>
        <div className='model-columns'>
          {modelGroups[props.group].models.map((model) => (
            <div key={model.name} className='model-column'>
              <div className='model-brand'>
                <img
                  src={`/homepage/images/${model.icon}.svg`}
                  width={48}
                  height={48}
                  alt=''
                  loading='lazy'
                />
                <strong>{model.name}</strong>
              </div>
              <div className='model-versions'>
                {model.versions.map((version) => (
                  <span key={version} title={version}>
                    {version}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ModelSection() {
  const { t } = useTranslation()
  const [group, setGroup] = useState(0)
  return (
    <section className='models-section' id='models'>
      <div className='page-container'>
        <AnimateInView className='section-heading' threshold={0.08}>
          <div className='section-label'>
            <span />
            {t('Models We Support')}
          </div>
          <h2>
            {t('Covering')}
            <em>{t('Global Leading AI Models')}</em>
            {t(', Meeting Various ')}
            {t('Scenario Needs')}
          </h2>
          <p className='model-availability'>
            {t('Model availability and prices follow the model square.')}
          </p>
        </AnimateInView>
        <div className='models-grid'>
          <div
            className='model-tabs'
            role='group'
            aria-label={t('Models We Support')}
          >
            {modelGroups.map((item, index) => (
              <AnimateInView key={item.title} threshold={0.08}>
                <Button
                  id={`model-tab-${index}`}
                  aria-pressed={group === index}
                  variant='ghost'
                  className={`model-tab${group === index ? ' selected' : ''}`}
                  onClick={() => setGroup(index)}
                  onMouseEnter={() => setGroup(index)}
                >
                  <span className='model-tab-copy'>
                    <span className='model-tab-label'>
                      <i />
                      {t(item.title)}
                    </span>
                    <span className='model-description'>
                      {t(item.description)}
                    </span>
                  </span>
                </Button>
                {group === index && (
                  <div
                    className='mobile-model-panel'
                    role='region'
                    aria-labelledby={`model-tab-${index}`}
                  >
                    <ModelPanel group={group} />
                  </div>
                )}
              </AnimateInView>
            ))}
          </div>
          <div
            className='desktop-model-panel'
            role='region'
            aria-labelledby={`model-tab-${group}`}
          >
            <ModelPanel group={group} />
          </div>
        </div>
      </div>
    </section>
  )
}
