# Manual Deployment Guide for Netlify

## Method 1: Drag & Drop Deployment (Easiest)

### Step 1: Build Your Project Locally

First, build the client-side application:

```bash
npm run build:client
```

Or if you're using pnpm:
```bash
pnpm build:client
```

This will create a `dist/spa` folder with all the production files.

### Step 2: Deploy via Netlify Dashboard

1. **Go to Netlify**: Visit [app.netlify.com](https://app.netlify.com)
2. **Sign in** with your GitHub account (or create a Netlify account)
3. **Drag & Drop**:
   - Open your file explorer
   - Navigate to your project folder
   - Drag the entire `dist/spa` folder onto the Netlify dashboard
   - Netlify will automatically deploy it

### Step 3: Configure Site Settings (After First Deploy)

1. Go to **Site settings** → **Domain settings**
2. Optionally add a custom domain

**Important**: This method only deploys the frontend. For API endpoints to work, you'll need to set up Netlify Functions separately or use Method 2.

---

## Method 2: Netlify CLI (Recommended - Full Setup)

This method deploys both frontend and backend (API functions).

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

Or with pnpm:
```bash
pnpm add -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

This will open your browser to authorize the CLI.

### Step 3: Initialize Netlify Site

```bash
netlify init
```

Follow the prompts:
- **Create & configure a new site** → Yes
- **Team** → Select your team (or create one)
- **Site name** → Choose a name or press Enter for auto-generated name
- **Build command** → `npm run build:client` (or `pnpm build:client`)
- **Directory to deploy** → `dist/spa`

### Step 4: Deploy

```bash
netlify deploy --prod
```

For a draft/preview deployment first:
```bash
netlify deploy
```

### Step 5: Verify Configuration

Make sure your `netlify.toml` file is in the root directory with these settings:

```toml
[build]
  command = "npm run build:client"
  functions = "netlify/functions"
  publish = "dist/spa"

[functions]
  external_node_modules = ["express"]
  node_bundler = "esbuild"
  
[[redirects]]
  force = true
  from = "/api/*"
  status = 200
  to = "/.netlify/functions/api/:splat"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Method 3: Deploy from GitHub via Netlify Dashboard

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect Repository in Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** as your Git provider
4. Authorize Netlify to access your repositories
5. Select your repository (Zolana)
6. Configure build settings:
   - **Build command**: `npm run build:client` (or `pnpm build:client`)
   - **Publish directory**: `dist/spa`
   - **Functions directory**: `netlify/functions` (optional)

### Step 3: Deploy

Click **"Deploy site"**. Netlify will:
- Clone your repository
- Run the build command
- Deploy the `dist/spa` folder
- Set up automatic deployments on every push

---

## Important Notes

### Environment Variables

If you have environment variables:
1. Go to **Site settings** → **Environment variables**
2. Add your variables (e.g., `PING_MESSAGE`)

### API Functions

The API routes are set up as Netlify Functions. They should automatically work when deployed via Method 2 or 3.

### Troubleshooting

- **Blank page**: Make sure the SPA redirect is in `netlify.toml` (already fixed)
- **Build fails**: Check the build logs in Netlify dashboard
- **API not working**: Verify `netlify/functions/api.ts` exists and is properly configured

---

## Quick Deploy Checklist

- [ ] Built the project (`npm run build:client`)
- [ ] `netlify.toml` is in root directory
- [ ] `dist/spa` folder exists with `index.html`
- [ ] All changes committed to Git (if using GitHub method)
- [ ] Environment variables set (if needed)

---

## After Deployment

Your site will be available at:
- `https://your-site-name.netlify.app`
- Or your custom domain if configured

