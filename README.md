# PNG.FUN 📸

A social photo gaming platform built as a World ID Mini App where users compete in daily photo challenges, vote on submissions, and earn WLD rewards.

[![Built with World ID](https://img.shields.io/badge/Built%20with-World%20ID-000000?style=for-the-badge)](https://world.org)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

## 🎮 Features

### Core Gameplay
- **Daily Photo Challenges**: Submit your best photos for themed daily challenges
- **Community Voting**: Vote on submissions from other players using a Tinder-style swipe interface
- **Leaderboards**: Compete for top rankings and track your performance
- **WLD Rewards**: Earn World (WLD) tokens for winning challenges and maintaining streaks

### World ID Integration
- **Human Verification**: Verify personhood before submitting photos using World ID Orb verification
- **Notification Permissions**: Opt-in to receive challenge notifications during onboarding
- **Secure Payments**: Deposit WLD and manage your balance with MiniKit payment commands
- **Sybil Resistance**: Prevent bots and duplicate accounts with World ID's proof of personhood

### User Experience
- **Onboarding Flow**: Smooth introduction to the app with notification setup
- **Photo Capture**: Native camera integration for capturing challenge submissions
- **Photo Preview**: Review and retake photos before submission
- **Profile Management**: Track your wins, streaks, submissions, and predictions
- **Success Animations**: Engaging feedback for completed actions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- A World ID Developer Portal account
- World App installed on your mobile device (for testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/png.fun.git
cd png.fun
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
# Create a .env.local file
APP_ID=your_world_id_app_id
ACTION=verifyhuman
```

4. Run the development server:
```bash
npm run dev
```

5. Access the app:
   - Local: `http://localhost:3000`
   - For World App testing: Use `cloudflared` tunnel or ngrok to expose your local server

### World ID Setup

1. Go to the [World ID Developer Portal](https://developer.worldcoin.org/)
2. Create a new Mini App
3. Create an Incognito Action called `verifyhuman`
4. Copy your `app_id` and update the environment variables
5. Configure the MiniKit provider in `components/minikit-provider.tsx`

## 🏗️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom neobrutalism design system
- **Animations**: Framer Motion
- **World ID**: @worldcoin/minikit-js for verification and payments
- **UI Components**: Custom components with shadcn/ui primitives

## 📁 Project Structure

```
png.fun/
├── app/
│   ├── api/
│   │   └── verify/          # World ID verification endpoint
│   ├── layout.tsx           # Root layout with MiniKit provider
│   └── page.tsx             # Main app with routing logic
├── components/
│   ├── bottom-nav.tsx       # Bottom navigation bar
│   ├── challenge-header.tsx # Daily challenge info
│   ├── human-verification-modal.tsx  # World ID verification UI
│   ├── leaderboard-screen.tsx        # Rankings display
│   ├── minikit-provider.tsx          # MiniKit SDK initialization
│   ├── onboarding-screen.tsx         # First-time user flow
│   ├── photo-preview-screen.tsx      # Photo review before submit
│   ├── profile-screen.tsx            # User profile and stats
│   ├── success-screen.tsx            # Success feedback
│   ├── top-bar.tsx                   # Header with balance
│   └── vote-stack.tsx                # Swipeable voting interface
└── docs/
    └── llms.txt             # World ID documentation
```

## 🔐 Security

- All World ID proofs are verified server-side via the `/api/verify` endpoint
- The `verifyCloudProof` function validates proofs with the World ID Developer Portal API
- Nullifier hashes prevent duplicate verifications
- No sensitive operations are performed client-side

## 🎨 Design System

The app uses a custom neobrutalism design system with:
- Bold, high-contrast colors
- Thick borders and shadows
- Playful, energetic animations
- Mobile-first responsive layouts

## 🧪 Testing in World App

1. Start your dev server: `npm run dev`
2. Expose it with cloudflared: `cloudflared tunnel --url http://localhost:3000`
3. Copy the generated URL
4. Open World App → Mini Apps → Add your tunnel URL
5. Test the full verification and camera flow

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `APP_ID` | Your World ID app ID from Developer Portal | Yes |
| `ACTION` | Action name for verification (default: `verifyhuman`) | Yes |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [World ID Documentation](https://docs.world.org)
- [MiniKit SDK](https://docs.world.org/mini-apps)
- [World App](https://worldcoin.org/download)

---

Built with ❤️ for ETHGlobal
