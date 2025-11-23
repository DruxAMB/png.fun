'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { NeoCard } from './neo-card';
import { NeoButton } from './neo-button';
import { Trophy, Zap, Flame, Download, Clock, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface ProfileData {
  username: string;
  avatarUrl: string;
  wld: number;
  wins: number;
  streak: number;
  totalWldEarned: number;
  submissions: Array<{
    id: string;
    imageUrl: string;
    challenge: string;
    votes: number;
    rank: number;
  }>;
  predictions: Array<{
    id: string;
    challenge: string;
    status: 'active' | 'won' | 'lost';
    amount: number;
    imageUrl: string;
    photographer: {
      username: string;
      avatarUrl: string;
    };
  }>;
}

interface ProfileScreenProps {
  data: ProfileData;
}

export function ProfileScreen({ data }: ProfileScreenProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [isClaiming, setIsClaiming] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Use real user data if authenticated, otherwise fall back to mock data
  const displayUsername =
    isAuthenticated && session?.user?.username ? session.user.username : data.username;
  const displayAvatar =
    isAuthenticated && session?.user?.profilePictureUrl
      ? session.user.profilePictureUrl
      : data.avatarUrl;
  const displayWalletAddress = session?.user?.walletAddress || null;

  // Handle claim button click - show modal about waiting for timeline to end
  const handleClaimWLD = () => {
    setShowClaimModal(true);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-24 pt-6">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <Avatar className="h-24 w-24 border-[5px] border-foreground mx-auto mb-4 neo-shadow">
          <AvatarImage src={displayAvatar || '/placeholder.svg'} />
          <AvatarFallback className="text-3xl font-black">
            {displayUsername[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-black uppercase mb-2">{displayUsername}</h1>
        {displayWalletAddress && (
          <p className="text-xs text-muted-foreground mb-2 font-mono">
            {displayWalletAddress.slice(0, 6)}...{displayWalletAddress.slice(-4)}
          </p>
        )}
        {/* Claim WLD Button - Shows when user has WLD > 0 */}
        {isAuthenticated && data.wld > 0 && (
            <Badge
              onClick={handleClaimWLD}
              className="bg-green-600 hover:bg-green-700 text-white font-black border-2 border-foreground"
            >
              <Download className="mr-2 w-fit" />
              Claim {data.wld} WLD
            </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <NeoCard className="text-center p-2 py-3 flex flex-col items-center justify-center">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md inline-flex mb-1.5 shadow-sm">
            <Trophy className="h-5 w-5" strokeWidth={3} />
          </div>
          <div className="text-2xl font-black">{data.wins}</div>
          <div className="text-[10px] font-black uppercase text-muted-foreground">Wins</div>
        </NeoCard>

        <NeoCard className="text-center p-2 py-3 flex flex-col items-center justify-center">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md inline-flex mb-1.5 shadow-sm">
            <Flame className="h-5 w-5" strokeWidth={3} />
          </div>
          <div className="text-2xl font-black">{data.streak}</div>
          <div className="text-[10px] font-black uppercase text-muted-foreground">Streak</div>
        </NeoCard>

        <NeoCard className="text-center p-2 py-3 flex flex-col items-center justify-center relative">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md inline-flex mb-1.5 shadow-sm">
            <Zap className="h-5 w-5" strokeWidth={3} />
          </div>
          <div className="text-2xl font-black">{data.totalWldEarned}</div>
          <div className="text-[10px] font-black uppercase text-muted-foreground">Earned</div>
          {data.wld > 0 && (
            <div className="absolute -top-1 -right-1 bg-green-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-foreground">
              {data.wld} pending
            </div>
          )}
        </NeoCard>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="predictions" className="w-full">
        {/* Increased height to h-14, added p-1 padding, and ensured full width for a chunky neobrutalist look matching the reference image */}
        <TabsList className="grid w-full grid-cols-2 h-14 p-1 neo-border neo-shadow mb-4">
          <TabsTrigger
            value="predictions"
            className="font-black uppercase h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Predictions
          </TabsTrigger>
          <TabsTrigger
            value="submissions"
            className="font-black uppercase h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Submissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-3">
          {data.predictions.map((prediction) => (
            <NeoCard key={prediction.id} className="p-3 overflow-hidden">
              <div className="flex gap-3">
                {/* Predicted Image */}
                <div className="relative w-20 h-20 shrink-0">
                  <img
                    src={prediction.imageUrl || '/placeholder.svg'}
                    alt="Predicted winner"
                    className="w-full h-full object-cover rounded-md border-2 border-black"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-black text-xs uppercase text-muted-foreground truncate mr-2">
                        {prediction.challenge}
                      </div>
                      <Badge
                        className={`font-black uppercase text-[10px] h-5 ${
                          prediction.status === 'active'
                            ? 'bg-primary text-primary-foreground'
                            : prediction.status === 'won'
                            ? 'bg-green-600 text-white'
                            : 'bg-muted text-muted-foreground'
                        } border border-foreground`}
                      >
                        {prediction.status}
                      </Badge>
                    </div>

                    {/* Photographer Info */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <Avatar className="h-4 w-4 border border-foreground">
                        <AvatarImage
                          src={prediction.photographer.avatarUrl || '/placeholder.svg'}
                        />
                        <AvatarFallback className="text-[8px]">
                          {prediction.photographer.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-bold truncate">
                        by {prediction.photographer.username}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-black">
                    <span>Bet:</span>
                    <span className="flex items-center gap-1 bg-black/5 px-1.5 py-0.5 rounded text-foreground">
                      <Zap className="h-3 w-3" fill="currentColor" />
                      {prediction.amount} WLD
                    </span>
                  </div>
                </div>
              </div>
            </NeoCard>
          ))}
        </TabsContent>

        <TabsContent value="submissions" className="grid grid-cols-2 gap-2">
          {data.submissions.map((submission) => (
            <NeoCard key={submission.id} className="overflow-hidden p-0">
              <div className="aspect-square bg-muted relative">
                <img
                  src={submission.imageUrl || '/placeholder.svg'}
                  alt={submission.challenge}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
                  <div className="text-white text-xs font-black">#{submission.rank}</div>
                  <div className="text-white text-xs font-bold opacity-90">
                    {submission.votes} votes
                  </div>
                </div>
              </div>
            </NeoCard>
          ))}
        </TabsContent>
      </Tabs>

      {/* Claim WLD Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-background border-[5px] border-foreground neo-shadow rounded-lg p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-black uppercase">Claim WLD</h3>
              </div>
              <button
                onClick={() => setShowClaimModal(false)}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="bg-primary/10 border-2 border-primary/20 rounded-lg p-4 mb-4">
                  <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-black text-primary">{data.wld} WLD</div>
                  <div className="text-sm text-muted-foreground">Ready to claim</div>
                </div>
              </div>

              <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4">
                <p className="text-sm text-center">
                  <strong className="text-foreground">WLD claims are available after the challenge timeline ends.</strong>
                </p>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Your earned WLD will be available for withdrawal when the current challenge period completes.
                </p>
              </div>

              <div className="flex gap-3">
                <NeoButton
                  onClick={() => setShowClaimModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Got it
                </NeoButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
