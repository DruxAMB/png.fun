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
    MiniKit.install(process.env.NEXT_PUBLIC_APP_ID || 'app_a9e1e8a3c65d60bcf0432ec93883b524');
  }, []);

  return (
    <MiniKitProvider>
      <SessionProvider session={session}>{children}</SessionProvider>
    </MiniKitProvider>
  );
}
