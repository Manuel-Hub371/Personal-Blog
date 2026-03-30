const fs = require('fs');
const path = require('path');

const frontendDir = path.resolve(__dirname, '../../frontend');
const files = fs.readdirSync(frontendDir);

const sentrySnippet = `    <!-- Sentry SDK -->
    <script src="https://browser.sentry-cdn.com/8.5.0/bundle.tracing.replay.min.js" 
            crossorigin="anonymous"></script>
    <script>
        Sentry.init({
            dsn: "REPLACE_WITH_YOUR_SENTRY_DSN",
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration(),
            ],
            tracesSampleRate: 1.0,
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
        });
    </script>
`;

files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(frontendDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (!content.includes('Sentry.init')) {
            const headMatch = content.match(/<head>(\s*)<meta charset="UTF-8">/i);
            if (headMatch) {
                const replacement = `<head>${headMatch[1]}<meta charset="UTF-8">${headMatch[1]}${sentrySnippet.trim()}`;
                content = content.replace(headMatch[0], replacement);
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated ${file}`);
            } else {
                console.log(`Could not find head/meta tag in ${file}`);
            }
        } else {
            console.log(`Sentry already initialized in ${file}`);
        }
    }
});
