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
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { Footer } from '@/components/layout/components/footer'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'
import { parseHeaderNavModulesFromStatus } from '@/lib/nav-modules'

export function LandingFooter() {
  const { t } = useTranslation()
  const { status } = useStatus()
  const { logo, systemName, footerHtml } = useSystemConfig()
  const docsLink = status?.docs_link as string | undefined
  const modules = parseHeaderNavModulesFromStatus(status)
  return (
    <div className='site-footer'>
      <section className='trust-banner' aria-label={t('Services')}>
        <div className='trust-glass'>
          {[
            [
              'Secure & Reliable',
              'Enterprise-grade security with comprehensive permission management',
            ],
            [
              'Transparent Billing',
              'Pay-as-you-go with real-time usage monitoring',
            ],
            [
              'Developer Friendly',
              'Compatible API routes for common AI application workflows',
            ],
          ].map(([title, text]) => (
            <div key={title}>
              <h3>{t(title)}</h3>
              <p>{t(text)}</p>
            </div>
          ))}
        </div>
      </section>
      {footerHtml ? (
        <Footer />
      ) : (
        <footer>
          <div className='page-container footer-content'>
            <div className='footer-grid'>
              <div className='footer-brand'>
                <Link to='/' className='footer-logo'>
                  <img src={logo} width={36} height={36} alt='' />
                  <strong>{systemName}</strong>
                </Link>
                <p>{t('Next Gen AI Interface Platform')}</p>
                {modules.about && <Link to='/about'>{t('About')}</Link>}
              </div>
              <div>
                <h4>{t('Services')}</h4>
                <ul>
                  <li>
                    <Link to='/sign-up'>{t('Register')}</Link>
                  </li>
                  <li>
                    <Link to='/wallet'>{t('Buy Credits')}</Link>
                  </li>
                  {modules.pricing.enabled && (
                    <li>
                      <Link to='/pricing'>{t('View Pricing')}</Link>
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h4>{t('Documentation')}</h4>
                <ul>
                  {modules.docs && docsLink && (
                    <li>
                      <a
                        href={docsLink}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {t('Docs')}
                      </a>
                    </li>
                  )}
                  {modules.rankings.enabled && (
                    <li>
                      <Link to='/rankings'>{t('Rankings')}</Link>
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h4>{t('About')}</h4>
                <ul>
                  {modules.about && (
                    <li>
                      <Link to='/about'>{t('About Us')}</Link>
                    </li>
                  )}
                  {status?.user_agreement_enabled && (
                    <li>
                      <Link to='/user-agreement'>{t('User Agreement')}</Link>
                    </li>
                  )}
                  {status?.privacy_policy_enabled && (
                    <li>
                      <Link to='/privacy-policy'>{t('Privacy Policy')}</Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className='footer-bottom'>
              <AnimateInView>
                <p>
                  {t('One API For All AI ')}
                  <em>{t('Models')}</em>
                </p>
              </AnimateInView>
              <small>
                © {new Date().getFullYear()} {systemName}.{' '}
                {t('footer.defaultCopyright')}
              </small>
              <small>
                <a
                  href='https://github.com/QuantumNous/new-api'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  New API
                </a>
              </small>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
