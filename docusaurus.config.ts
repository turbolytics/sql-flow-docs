import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'SQLFlow Documentation',
  tagline: 'Making stream processing easy.',
  favicon: 'img/sqlflow-small.png',

  // Set the production url of your site here
  url: 'https://sql-flow.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'turbolytics', // Usually your GitHub org/user name.
  projectName: 'sql-flow', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        gtag: {
          trackingID: 'G-4R2PLTD2H3',
          anonymizeIP: true,
        },
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'SQLFlow Documentation',
      logo: {
        alt: 'My Site Logo',
        src: 'img/sqlflow-small.png',
      },
      items: [
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'docsSidebar',
          label: 'Docs',
        },
        {to: 'docs/category/tutorials/', label: 'Tutorials', position: 'left'},
        {
          href: 'https://github.com/turbolytics/sql-flow',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorials',
              to: '/docs/tutorials/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
              /*
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/sql-flow',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
               */
          ],
        },
        {
          title: 'More',
          items: [
              /*
            {
              label: 'Blog',
              to: '/blog',
            },
               */
            {
              label: 'GitHub',
              href: 'https://github.com/turbolytics/sql-flow',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Turbolytics, LLC. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
