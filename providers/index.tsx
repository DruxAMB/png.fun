'use client';
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

interface ClientProvidersProps {
  children: ReactNode;
  session: any;
}

export default function ClientProviders({ children, session }: ClientProvidersProps) {
  // Initialize MiniKit on mount
  useEffect(() => {
    console.log('[MiniKit] Initializing MiniKit...');
    MiniKit.install(process.env.APP_ID || 'app_a7a17919b878ba65fbcbcc116bde80be');
  }, []);

  return (
    <MiniKitProvider>
      <SessionProvider session={session}>{children}</SessionProvider>
    </MiniKitProvider>
  );
}
