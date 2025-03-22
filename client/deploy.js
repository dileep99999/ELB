/*
 * GitHub Pages Deployment Script
 * 
 * This script helps deploy the frontend app to GitHub Pages.
 * Before running this script:
 * 1. Update the homepage in package.json with your GitHub username and repo name
 * 2. Update the API_BASE_URL in src/config/api.js with your hosted backend URL
 * 
 * Run with: node deploy.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}===== GitHub Pages Deployment Script =====${colors.reset}\n`);

try {
  // Step 1: Check if package.json has been updated with correct homepage
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  if (packageJson.homepage.includes('USERNAME') || packageJson.homepage.includes('REPO_NAME')) {
    console.log(`${colors.bright}${colors.yellow}WARNING: ${colors.reset}You need to update the homepage in package.json with your GitHub username and repo name.`);
    console.log(`Current value: ${packageJson.homepage}`);
    console.log(`It should be: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME\n`);
    process.exit(1);
  }
  
  // Step 2: Check if API config has been updated
  const apiConfigPath = path.join(__dirname, 'src', 'config', 'api.js');
  const apiConfig = fs.readFileSync(apiConfigPath, 'utf8');
  
  if (apiConfig.includes('your-backend-api-url.com')) {
    console.log(`${colors.bright}${colors.yellow}WARNING: ${colors.reset}You need to update the API_BASE_URL in src/config/api.js with your hosted backend URL.`);
    console.log(`It should point to where your backend API is hosted.\n`);
    process.exit(1);
  }
  
  // Step 3: Build and deploy
  console.log(`${colors.bright}Building and deploying to GitHub Pages...${colors.reset}`);
  
  // Run the deploy script from package.json
  execSync('npm run deploy', { stdio: 'inherit' });
  
  console.log(`\n${colors.bright}${colors.green}Deployment successful!${colors.reset}`);
  console.log(`Your app should be available at: ${packageJson.homepage}`);
  
} catch (error) {
  console.error(`\n${colors.bright}${colors.red}Deployment failed:${colors.reset}`, error.message);
  process.exit(1);
} 