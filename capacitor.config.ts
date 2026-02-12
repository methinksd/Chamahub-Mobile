import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chamahub.mobile',
  appName: 'Chamahub Mobile',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*'],
    cleartext: true
  }
};

export default config;
