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
export const modelGroups = [
  {
    title: 'Overseas Models',
    description: 'World-leading AI models',
    models: [
      {
        name: 'ChatGPT',
        icon: 'openai',
        versions: ['GPT-5', 'GPT-4.1', 'GPT-4o'],
      },
      { name: 'Claude', icon: 'claude', versions: ['Claude 4.1', 'Claude 4'] },
      { name: 'Gemini', icon: 'gemini', versions: ['Gemini Pro'] },
    ],
  },
  {
    title: 'Domestic Models',
    description: 'Models with local advantages',
    models: [
      {
        name: 'Qwen',
        icon: 'qwen',
        versions: ['Qwen-Max', 'Qwen-Plus', 'Qwen-Turbo'],
      },
      {
        name: 'Ernie',
        icon: 'wenxin',
        versions: ['Ernie 4.0', 'Ernie 3.5', 'Ernie Speed'],
      },
      {
        name: 'ChatGLM',
        icon: 'chatglm',
        versions: ['ChatGLM-4', 'ChatGLM-3', 'ChatGLM-Turbo'],
      },
    ],
  },
  {
    title: 'Multimodal Models',
    description: 'Image, voice, video and more',
    models: [
      {
        name: 'Midjourney',
        icon: 'midjourney',
        versions: ['Midjourney V6', 'Midjourney V5.2', 'Niji V6'],
      },
      {
        name: 'DALL-E',
        icon: 'dalle',
        versions: ['DALL-E 3', 'DALL-E 2', 'DALL-E HD'],
      },
      {
        name: 'Stable Diff',
        icon: 'stability',
        versions: ['SD 3.0', 'SD XL', 'SD Turbo'],
      },
    ],
  },
]

export const features = [
  {
    title: 'High Performance',
    points: ['Load Balancing', 'Rate Limiting', 'Automatic Retry'],
    description: 'Support for high concurrency with automatic load balancing',
    metric: 'Load Balancing',
    value: 'Enabled',
  },
  {
    title: 'Global Coverage',
    points: [
      'Channel Management',
      'Model Management',
      'Multi-protocol Compatible',
    ],
    description:
      'Connect through OpenAI, Claude, Gemini, and other compatible API routes',
    metric: 'Models',
    value: 'Multi-protocol Compatible',
  },
  {
    title: 'Developer Friendly',
    points: ['API Keys', 'Documentation', 'Quick Start'],
    description: 'Compatible API routes for common AI application workflows',
    metric: 'Connect',
    value: 'API / SDK',
  },
  {
    title: 'Transparent Billing',
    points: ['Usage', 'Logs', 'Wallet'],
    description: 'Pay-as-you-go with real-time usage monitoring',
    metric: 'Usage',
    value: 'Pay As You Go',
  },
  {
    title: 'Team Collaboration',
    points: ['User Management', 'Permission Management', 'Access Tokens'],
    description: 'Multi-user management with flexible permission allocation',
    metric: 'Account Management',
    value: 'Permission Management',
  },
  {
    title: 'Secure & Reliable',
    points: ['Permission Management', 'Rate Limiting', 'Logs'],
    description:
      'Enterprise-grade security with comprehensive permission management',
    metric: 'Access Tokens',
    value: 'Secure & Reliable',
  },
]

export const plans = [
  {
    title: 'Pay As You Go',
    summary: 'View Pricing',
    icon: 'calc.png',
    action: 'Model Square',
    to: '/pricing',
    points: ['Model Management', 'Usage', 'Logs', 'Transparent Billing'],
  },
  {
    title: 'Get Started',
    summary: 'Create Account',
    icon: 'gift.svg',
    action: 'Register',
    to: '/sign-up',
    points: [
      'API Keys',
      'Documentation',
      'Multi-protocol Compatible',
      'Account Management',
    ],
  },
  {
    title: 'Console',
    summary: 'Unified Access',
    icon: 'custom.png',
    action: 'Go to Dashboard',
    to: '/dashboard',
    points: ['Access Tokens', 'Usage', 'Wallet', 'Permission Management'],
  },
] as const
