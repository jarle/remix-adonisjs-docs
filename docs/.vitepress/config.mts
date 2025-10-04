import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "remix-adonisjs",
  description: "Documentation for @matstack/remix-adonisjs",
  sitemap: {
    hostname: 'https://matstack.dev/remix-adonisjs/'
  },
  base: '/remix-adonisjs/',
  head: [
    ['link', { rel: 'icon', href: '/remix-adonisjs/favicon.png' }],
    ['link', { rel: 'canonical', href: 'https://matstack.dev/remix-adonisjs/' }],
  ],
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: '@matstack/remix-adonisjs',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/getting-started/quickstart' },
      { text: 'About', link: '/about' },
      { text: 'Rebrand', link: '/about-rebrand' }
    ],

    sidebar: [
      {
        text: 'Getting started',
        items: [
          { text: 'Quickstart', link: '/getting-started/quickstart' },
          { text: 'Migrate to React Router', link: '/getting-started/migrate-to-react-router' },
          { text: 'Migrate an AdonisJS application', link: '/getting-started/add-to-existing-adonisjs-project' },
          { text: 'Examples', link: '/getting-started/examples' }
        ],
        collapsed: false
      },
      {
        text: 'Hands-on guides',
        items: [
          { text: 'Building a login flow', link: '/hands-on/building-a-login-flow' },
          { text: 'Build an AI chat app', link: '/hands-on/build-an-ai-chat-app' },
        ],
        collapsed: false
      },
      {
        text: 'Recipes',
        items: [
          { text: 'Using services in React Router', link: '/recipes/provide-services' },
          { text: 'Validate intent in action functions', link: '/recipes/validate-action-intent' },
          { text: 'Adding CSRF protection', link: '/recipes/csrf-protection' },
          { text: 'Deploying your application', link: '/recipes/deployment' },
        ],
        collapsed: false
      },
      {
        text: 'Technical details',
        items: [
          { text: 'Why this is not a hack', link: '/technical-details/not-a-hack' },
          { text: 'Accessing services from React Router', link: '/technical-details/accessing-services' },
        ],
        collapsed: false
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jarle/remix-adonisjs/discussions' },
      { icon: 'x', link: 'https://x.com/jarlemathiesen' },
    ]
  }
})
