# LUXE Deployment Guide

This guide covers how to push your code to GitHub and deploy the application.

## 1. Preparing for GitHub

We have updated `.gitignore` to ensure sensitive files like `.env` and heavy folders like `node_modules` are **NOT** uploaded.

### Step 1: Initialize Git
Open your terminal in the project folder and run:

```bash
git init
git add .
git commit -m "Initial commit: LUXE E-Commerce Platform"
```

### Step 2: Create a GitHub Repository
1. Go to [GitHub.com](https://github.com/new).
2. Create a new repository (e.g., `luxe-ecommerce`).
3. **Do not** initialize with README, license, or gitignore (we already have them).
4. Copy the "HTTPS" or "SSH" URL provided (e.g., `https://github.com/your-username/luxe-ecommerce.git`).

### Step 3: Push Code
Run these commands in your terminal (replace URL with yours):

```bash
git branch -M main
git remote add origin https://github.com/your-username/luxe-ecommerce.git
git push -u origin main
```

---

## 2. Deploying the Application

This is a **Monorepo** (Frontend + Backend in one). The easiest way to deploy is using **Railway** or **Render** for the backend (and database), and **Vercel** for the frontend.

### Option A: Railway (Recommended for Full Stack)

Railway is great because it handles both the Node.js backend and the PostgreSQL database easily.

1. **Sign Up:** Go to [Railway.app](https://railway.app/) and login with GitHub.
2. **New Project:** Click "New Project" > "Deploy from GitHub repo" > Select `luxe-ecommerce`.
3. **Database:**
   - Right-click the project view > "New" > "Database" > "PostgreSQL".
   - Railway will provide a `DATABASE_URL`.
   - Go to your App service > "Settings" > "Variables".
   - Add `DATABASE_URL` (copy from the PostgreSQL service).
4. **Environment Variables:**
   - Add all other variables from your local `.env`:
     - `RAZORPAY_KEY_ID`
     - `RAZORPAY_KEY_SECRET`
     - `GOOGLE_CLIENT_ID`
     - `JWT_SECRET`
     - `CLOUDINARY_CLOUD_NAME` (and others)
5. **Build Command:**
   - In Settings > Build Command: `npm install && npx prisma migrate deploy && npm run build`
6. **Start Command:**
   - `npm run start`

### Option B: Vercel (Frontend) + Render (Backend)

**Backend (Render):**
1. Create a "Web Service" on [Render.com](https://render.com/).
2. Connect GitHub repo.
3. Build Command: `npm install && npm run build:server` (You might need to adjust scripts).
4. Start Command: `npm run server`.
5. Add Environment Variables.

**Frontend (Vercel):**
1. Import repo to [Vercel](https://vercel.com/).
2. Framework Preset: Vite.
3. Build Command: `npm run build`.
4. Environment Variables: Add `VITE_API_URL` pointing to your Render Backend URL.

## 3. Essential Checks Before Pushing
- [x] **.gitignore:** Verified to exclude `.env` and `node_modules`.
- [x] **Build:** Run `npm run build` locally to ensure no errors.
- [x] **Environment:** Ensure you have the keys ready for the production dashboard.
