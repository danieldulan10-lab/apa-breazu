import type { Metadata } from 'next';

export const pwaMetadata: Partial<Metadata> = {
  manifest: '/manifest.json',
  themeColor: '#1B6B93',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ApaGalbenelelor',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};
