# ELBS Client - Employee Lunch Booking System

This is the frontend for the Employee Lunch Booking System. It's built using React with Vite.

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deploying to GitHub Pages

### Prerequisites

1. Create a GitHub repository for your project.
2. Have a hosted backend API running somewhere (like Heroku, Render, etc.) if you want full functionality.

### Step 1: Update Configuration

1. Open `package.json` and update the `homepage` field with your GitHub username and repository name:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
   ```

2. Open `src/config/api.js` and update the API URL:
   ```javascript
   const API_BASE_URL = isDevelopment 
     ? '' 
     : 'https://your-backend-api-url.com'; // Replace with your hosted backend URL
   ```

### Step 2: Initialize Git Repository (if not done already)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 3: Deploy to GitHub Pages

Run the deploy script:

```bash
node deploy.js
```

This will build the app and deploy it to the `gh-pages` branch of your repository.

### Manual Deployment (Alternative)

You can also deploy manually:

```bash
npm run predeploy  # Builds the app
npm run deploy     # Deploys to GitHub Pages
```

After deployment, your site will be available at the URL you specified in the `homepage` field. 