import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "remix-adonisjs",
  description: "Documentation for @matstack/remix-adonisjs",
  sitemap: {
    hostname: 'https://matstack.dev/remix-adonisjs/'
  },
  base: '/remix-adonisjs/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    siteTitle: '@matstack/remix-adonisjs',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/getting-started/quickstart' },
      { text: 'About', link: '/about' }
    ],

    sidebar: [
      {
        text: 'Getting started',
        items: [
          { text: 'Quickstart', link: '/getting-started/quickstart' },
          { text: 'Migrate a Remix application', link: '/getting-started/migrate-from-remix' },
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
          { text: 'Using services in Remix', link: '/recipes/provide-services' },
          { text: 'Validate intent in action functions', link: '/recipes/validate-action-intent' },
        ],
        collapsed: false
      },
      {
        text: 'Technical details',
        items: [
          { text: 'Accessing services from Remix', link: '/technical-details/accessing-services' },
        ],
        collapsed: false
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jarle/remix-adonisjs' },
      { icon: 'twitter', link: 'https://twitter.com/jarlemathiesen' }
    ]
  }
})
