# Leaflet - AI-Powered Documentation Generator

Leaflet is an AI-powered documentation generator that scans your GitHub repositories and automatically generates beautiful, interactive documentation sites. Similar to Minlify, Leaflet makes it easy to create and maintain documentation for your projects.

## Features

- 🔐 **Authentication** - Secure user authentication with Clerk
- 🔗 **GitHub Integration** - Connect your GitHub account and select repositories
- 🤖 **AI-Powered Scanning** - Automatically scans your codebase and generates documentation
- 🎨 **Customizable Templates** - Customize logo, colors, and text to match your brand
- 📦 **Project Management** - Manage multiple documentation projects from your dashboard
- 🚀 **Publish & Share** - Publish your documentation and share it with the world

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS v4
- **GitHub API**: Octokit
- **UI Components**: Custom components with Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Clerk account (for authentication)
- GitHub OAuth App (for repository access)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd leaflett
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/leaflett?schema=public"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # App URL (for OAuth callbacks)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Clerk**
   - Create an account at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy your publishable key and secret key to `.env`

5. **Set up GitHub OAuth App**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL to: `http://localhost:3000/api/github/callback`
   - Copy Client ID and Client Secret to `.env`

6. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init

   # (Optional) Open Prisma Studio to view your data
   npx prisma studio
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Sign Up / Sign In** - Create an account or sign in with Clerk
2. **Connect GitHub** - Click "New Project" and connect your GitHub account
3. **Select Repository** - Choose a repository from your GitHub account
4. **AI Scanning** - Wait while Leaflet scans your codebase
5. **Customize** - Customize your documentation with logo, colors, and text
6. **Publish** - Publish your documentation and share the link

## Project Structure

```
leaflett/
├── app/
│   ├── api/              # API routes
│   │   ├── github/       # GitHub OAuth and repo fetching
│   │   └── projects/     # Project CRUD and scanning
│   ├── create/           # Create new project flow
│   ├── dashboard/        # User dashboard
│   ├── editor/           # Documentation editor
│   └── docs/             # Published documentation pages
├── components/
│   └── ui/               # Reusable UI components
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── github.ts         # GitHub API utilities
│   └── utils.ts          # Utility functions
└── prisma/
    └── schema.prisma     # Database schema
```

## Database Schema

- **User** - Stores user information linked to Clerk
- **GitHubConnection** - Stores GitHub OAuth tokens
- **Project** - Stores documentation projects with customization settings

## API Routes

- `GET /api/github/connect` - Check GitHub connection status or get OAuth URL
- `GET /api/github/callback` - Handle GitHub OAuth callback
- `GET /api/github/repos` - Fetch user's GitHub repositories
- `POST /api/projects/scan` - Scan a repository and generate documentation
- `GET /api/projects` - Get all user's projects
- `GET /api/projects/[id]` - Get a specific project
- `PATCH /api/projects/[id]` - Update project settings
- `POST /api/projects/[id]/publish` - Publish a project

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database commands
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Create and apply migrations
npx prisma generate        # Generate Prisma Client
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
