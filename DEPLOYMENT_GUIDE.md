# LUXE Deployment Guide (Supabase + Render)

This detailed guide helps you deploy the LUXE E-Commerce platform using **Supabase** for the database and **Render** for both Frontend and Backend.

## 1. Prerequisites (Environment Variables)

Before you begin, ensure you have the following keys ready.

### Backend Secrets (for Render Backend)
| Variable | Description | Where to find it |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL Connection String | **Supabase** (See Step 1) |
| `JWT_SECRET` | Secret key for encryption | Generate any random string (e.g., `mysecret123`) |
| `GOOGLE_CLIENT_ID` | OAuth Client ID | **Google Cloud Console** |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret | **Google Cloud Console** |
| `RAZORPAY_KEY_ID` | Payment Public Key | **Razorpay Dashboard** |
| `RAZORPAY_KEY_SECRET` | Payment Secret Key | **Razorpay Dashboard** |
| `CLOUDINARY_CLOUD_NAME`| Image Host Name | **Cloudinary Dashboard** |
| `CLOUDINARY_API_KEY` | Image Host Key | **Cloudinary Dashboard** |
| `CLOUDINARY_API_SECRET`| Image Host Secret | **Cloudinary Dashboard** |
| `ADMIN_EMAIL` | Admin Email (for seeding) | Set your desired admin email |
| `ADMIN_PASSWORD` | Admin Password (for seeding) | Set your desired admin password |
| `PORT` | Server Port | Set to `10000` (Render Default) |

### Frontend Secrets (for Render Static Site)
| Variable | Description | Values |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend URL | **Your Render Backend URL** (e.g., `https://luxe-backend.onrender.com`) |
| `VITE_GOOGLE_CLIENT_ID`| Same as Backend | Copy `GOOGLE_CLIENT_ID` |
| `VITE_RAZORPAY_KEY_ID` | Same as Backend | Copy `RAZORPAY_KEY_ID` |

---

## Step 1: Set up Database (Supabase)

1.  **Sign Up/Login:** Go to [Supabase.com](https://supabase.com/).
2.  **Create Project:** Click **New Project**.
    - Name: `luxe-db`
    - Password: **Save this password!** You will need it.
    - Region: Choosing a region close to you (e.g., Mumbai, Singapore).
3.  **Get Connection String:**
    - Go to **Project Settings** (Cog icon) > **Database** > **Connection parameters**.
    - Find **Connection String** and switch tab to **URI**.
    - **Important:** Use the standard **"Session"** connection string (Port 5432) first.
    - Value Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`
    - *(Replace `[password]` with your actual password).*
    - **Copy this string.** This is your `DATABASE_URL`.

---

## Step 2: Deploy Backend (Render)

1.  **Login:** Go to [Render.com](https://render.com/).
2.  **New Web Service:** Click **New +** > **Web Service**.
3.  **Connect Repo:** Select your `luxe-ecommerce` repository.
4.  **Configure Settings:**
    - **Name:** `luxe-backend`
    - **Region:** Same as Supabase if possible.
    - **Branch:** `main`
    - **Root Directory:** `.` (Leave empty)
    - **Runtime:** `Node`
    - **Build Command:** `npm install && npx prisma generate && npm run build:server`
    - **Start Command:** `npm run server`
5.  **Environment Variables:**
    - Scroll down to "Environment Variables" and click **Add Environment Variable**.
    - Add **ALL** variables listed in the **Backend Secrets** table above.
    - *Double check `DATABASE_URL` matches your Supabase string.*
6.  **Create:** Click **Create Web Service**.
7.  **Wait:** It will build and verify.
    - If it fails, check logs. Common error: Invalid `DATABASE_URL`.
8.  **Copy URL:** Once deployed, copy the service URL from top left (e.g., `https://luxe-backend.onrender.com`).

---

## Step 3: Deploy Frontend (Render)

1.  **New Static Site:** Click **New +** > **Static Site** on Render.
2.  **Connect Repo:** Select the same `luxe-ecommerce` repository.
3.  **Configure Settings:**
    - **Name:** `luxe-frontend`
    - **Branch:** `main`
    - **Root Directory:** `.` (Leave empty)
    - **Build Command:** `npm run build`
    - **Publish Directory:** `dist`
4.  **Environment Variables:**
    - Add the **Frontend Secrets**:
        - `VITE_API_URL`: Paste your **Backend URL** from Step 2.
        - `VITE_GOOGLE_CLIENT_ID`: Your Google client ID.
        - `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key ID.
5.  **Create:** Click **Create Static Site**.
6.  **Wait:** Wait for build to complete.
7.  **Done!** Visit your new website URL.

---

## Troubleshooting

- **Database Errors?** Ensure you added `?pgbouncer=true` to the end of your Supabase URL if using the Transaction (6543) port. For Session (5432) port, standard URL is fine. Recommended: Use standard 5432 for stability first.
- **Frontend not connecting?** Check `VITE_API_URL`. It must **NOT** have a trailing slash (e.g., correct: `.../onrender.com`, incorrect: `.../onrender.com/`). The code appends `/api`.
- **Images not uploading?** Verify `CLOUDINARY_` keys in Backend Env Vars.
