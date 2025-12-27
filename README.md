# learn-apt

**Learn Your Aptitude** - A comprehensive aptitude testing platform that helps users discover their learning preferences, problem-solving styles, and motivation drivers.

## Features

- **Elaborate Test**: In-depth assessment covering multiple modules with comprehensive questions
- **Brief Test**: Quick assessment with three key modules:
  - Learning Preferences
  - Problem-Solving Style
  - Motivation Drivers

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/phildass/Learnapt-next.git
cd Learnapt-next
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/phildass/Learnapt-next)

### Option 2: Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Environment Variables

No environment variables are required for basic deployment.

### Custom Domain Setup

After deployment, configure your custom domain `learnapt.iiskills.in`:

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add `learnapt.iiskills.in`
4. Update your DNS records as instructed by Vercel

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/
│   ├── brief-test/     # Brief test flow
│   ├── elaborate-test/ # Elaborate test flow
│   ├── results/        # Test results display
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Landing page
├── components/         # Reusable components
└── lib/               # Utility functions
```

## License

This project is private and proprietary to Learnapt.
