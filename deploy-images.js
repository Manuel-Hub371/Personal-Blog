const { execSync } = require('child_process');
const path = require('path');

console.log('Deploying images to Render...');

try {
    // 1. Add uploads folder
    console.log('Adding uploads...');
    execSync('git add backend/uploads', { stdio: 'inherit' });

    // 2. Commit
    console.log('Committing...');
    try {
        execSync('git commit -m "Deploy images to Render"', { stdio: 'inherit' });
    } catch (e) {
        console.log('Nothing to commit (images already up to date).');
    }

    // 3. Push
    console.log('Pushing to main...');
    execSync('git push origin main', { stdio: 'inherit' });

    console.log('✅ Images deployed! Render will rebuild and serve them shortly.');
} catch (error) {
    console.error('❌ Deployment failed:', error.message);
}
