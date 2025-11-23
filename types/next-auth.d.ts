import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      walletAddress: string;
      username: string | null;
      profilePictureUrl: string | null;
    };
  }

  interface User {
    id: string;
    walletAddress: string;
    username: string | null;
    profilePictureUrl: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    walletAddress: string;
    username: string | null;
    profilePictureUrl: string | null;
  }
}
