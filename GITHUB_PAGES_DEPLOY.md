# GitHub Pages Deployment Guide

This guide explains how to deploy the Employee Lunch Booking System (ELBS) frontend to GitHub Pages.

## Important Note

GitHub Pages is a static site hosting service and doesn't support server-side code. This means:

1. Only the frontend React app will be hosted on GitHub Pages
2. You need to host the backend API separately 
3. You must update the frontend code to point to your hosted backend API

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Create a new repository (e.g., "elbs" or "employee-lunch-booking-system")
3. Make note of your GitHub username and repository name

## Step 2: Update Configuration for GitHub Pages

1. Update the homepage in `client/package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
   ```

2. Update the API URL in `client/src/config/api.js`:
   ```javascript
   const API_BASE_URL = isDevelopment 
     ? '' 
     : 'https://your-backend-api-url.com'; // Replace with your hosted backend URL
   ```

## Step 3: Deploy the Backend

Before deploying the frontend, you need to deploy the backend API to a hosting service that supports Node.js. Some options include:

- [Render](https://render.com)
- [Heroku](https://heroku.com)
- [Vercel](https://vercel.com)
- [Railway](https://railway.app)
- [DigitalOcean App Platform](https://digitalocean.com/products/app-platform)

When deploying, make sure to set the following environment variables:
- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secret key for JWT authentication
- `PORT` - The port for your backend (usually set by the hosting provider)

After deployment, note the URL of your backend API (e.g., https://elbs-api.onrender.com) and update the API URL in `client/src/config/api.js`.

## Step 4: Push to GitHub

Initialize the repository and push it to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 5: Deploy to GitHub Pages

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Run the deployment script:
   ```bash
   node deploy.js
   ```

   Alternatively, you can run:
   ```bash
   npm run deploy
   ```

3. The script will build your React app and push it to the `gh-pages` branch of your repository.

4. After a few minutes, your site will be available at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
   ```

## Step 6: Configure GitHub Pages Settings

1. Go to your GitHub repository
2. Navigate to Settings > Pages
3. Ensure the source is set to the `gh-pages` branch
4. Check that your site is published at the correct URL

## Troubleshooting

- **404 errors when navigating**: This is likely due to GitHub Pages not supporting client-side routing. To fix this, you might need to modify the React Router configuration or add a 404.html file with a redirect script.

- **API connection errors**: Make sure you've updated the API URL in `client/src/config/api.js` to point to your hosted backend API.

- **CORS errors**: Your backend needs to allow requests from your GitHub Pages domain. Update the CORS configuration in your backend code.

## Updating the Deployment

After making changes to your code, commit and push to GitHub, then run the deploy script again to update your GitHub Pages site. 