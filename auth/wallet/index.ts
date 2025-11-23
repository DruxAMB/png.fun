import { MiniKit } from '@worldcoin/minikit-js';
import { signIn } from 'next-auth/react';
import { getNewNonces } from './server-helpers';

export const walletAuth = async () => {
  const { nonce, signedNonce } = await getNewNonces();

  const result = await MiniKit.commandsAsync.walletAuth({
    nonce,
    expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
    statement: `Authenticate (${crypto.randomUUID().replace(/-/g, '')}).`
  });

  if (result.finalPayload.status !== 'success') return;

  await signIn('credentials', {
    redirectTo: '/home',
    nonce,
    signedNonce,
    finalPayloadJson: JSON.stringify(result.finalPayload)
  });
};
