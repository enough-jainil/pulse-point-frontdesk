# Pulse Point Front Desk

A modern gym management system built with React, TypeScript, and Supabase.

## 🚀 Quick Start

### Prerequisites

Before you begin, you need to have Node.js installed on your system. This project requires **Node.js version 18.0.0 or higher**.

## 📦 Installing Node.js

### Option 1: Using NVM (Recommended)

**For Linux/macOS:**

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal or run:
source ~/.bashrc

# Install and use the latest LTS version of Node.js
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```

**For Windows:**

1. Download and install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)
2. Open PowerShell as Administrator and run:

```powershell
nvm install lts
nvm use lts
```

### Option 2: Direct Installation

**For Ubuntu/Debian:**

```bash
# Update package index
sudo apt update

# Install Node.js from NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

**For CentOS/RHEL/Fedora:**

```bash
# Install Node.js from NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo dnf install -y nodejs

# Verify installation
node --version
npm --version
```

**For macOS:**

```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

**For Windows:**

1. Download the Windows Installer from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Restart your computer

### Option 3: Using Package Managers

**Using Yarn:**

```bash
# Install Yarn first
npm install -g yarn

# Verify installation
yarn --version
```

**Using pnpm:**

```bash
# Install pnpm
npm install -g pnpm

# Verify installation
pnpm --version
```

## 🛠️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/enough-jainil/pulse-point-frontdesk.git
cd pulse-point-frontdesk
```

### 2. Install Dependencies

Choose one of the following package managers:

**Using npm:**

```bash
npm install
```

**Using yarn:**

```bash
yarn install
```

**Using pnpm:**

```bash
pnpm install
```

### 3. Environment Setup

1. Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local  # If example file exists
# OR
touch .env.local
```

2. Add your Supabase configuration to `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get Supabase credentials:**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing one
3. Go to Settings > API
4. Copy the Project URL and anon/public key

### 4. Database Setup (Optional)

If you need to set up the database schema, run one of the provided SQL files:

```bash
# Choose the appropriate setup file based on your needs:
# - supabase_simple_setup.sql (basic setup)
# - supabase_corrected_setup.sql (recommended)
# - supabase_existing_db_setup.sql (for existing databases)
```

## 🏃‍♂️ Running the Project

### Development Mode

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

The application will start on `http://localhost:5173` (default Vite port).

### Build for Production

```bash
# Using npm
npm run build

# Using yarn
yarn build

# Using pnpm
pnpm build
```

### Preview Production Build

```bash
# Using npm
npm run preview

# Using yarn
yarn preview

# Using pnpm
pnpm preview
```

## 🔧 Additional Commands

### Linting

```bash
# Using npm
npm run lint

# Using yarn
yarn lint

# Using pnpm
pnpm lint
```

### Development Build

```bash
# Using npm
npm run build:dev

# Using yarn
yarn build:dev

# Using pnpm
pnpm build:dev
```

## 🏗️ Project Structure

```
pulse-point-frontdesk/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # shadcn/ui components
│   │   └── forms/      # Form components
│   ├── pages/          # Application pages
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── integrations/   # External service integrations
├── supabase/           # Database migrations and config
└── package.json        # Project dependencies and scripts
```

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Database:** Supabase (PostgreSQL)
- **State Management:** Tanstack Query
- **Form Handling:** React Hook Form + Zod
- **Routing:** React Router DOM

## 🚨 Troubleshooting

### Common Issues

**1. Node.js version error:**

```bash
# Check your Node.js version
node --version

# If version is below 18.0.0, update Node.js
nvm install --lts  # If using NVM
```

**2. Port already in use:**

```bash
# Kill process using port 5173
sudo lsof -t -i tcp:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

**3. Dependencies installation issues:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. Supabase connection issues:**

- Verify your `.env.local` file has correct Supabase credentials
- Check if your Supabase project is active
- Ensure RLS policies are properly configured

### Getting Help

If you encounter any issues:

1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure your database schema is properly set up
4. Try clearing browser cache and localStorage

## 📝 Development Notes

- The project uses Vite for fast development and building
- Hot module replacement (HMR) is enabled for React components
- TypeScript strict mode is enabled
- ESLint is configured for code quality
- Tailwind CSS is set up with custom configuration

## 🚀 Deployment

This project can be deployed to various platforms:

- **Vercel:** Connect your GitHub repository
- **Netlify:** Use drag-and-drop or GitHub integration
- **Railway:** Deploy directly from GitHub
- **Heroku:** Use buildpacks for Node.js

Remember to set your environment variables in your deployment platform's settings.

---

**Happy coding! 🎉**
