const fs = require('fs');
const http = require('http');
const path = require('path');

// Configuration
const HOST = 'localhost';
const PORT = 5000;
const EMAIL = '94jnr200@gmail.com';
const PASSWORD = 'Darkovybz123';

// Helper for requests
function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = body ? JSON.parse(body) : {};
                    resolve({ statusCode: res.statusCode, body: parsed, headers: res.headers });
                } catch (e) {
                    console.log('Raw Body:', body);
                    resolve({ statusCode: res.statusCode, body: body, headers: res.headers });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function runTest() {
    console.log('--- Step 1: Login ---');
    const loginData = JSON.stringify({ email: EMAIL, password: PASSWORD });
    const loginRes = await request({
        hostname: HOST,
        port: PORT,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': loginData.length
        }
    }, loginData);

    if (loginRes.statusCode !== 200) {
        console.error('Login Failed:', loginRes.body);
        process.exit(1);
    }
    console.log('Login Success. Token acquired.');
    const token = loginRes.body.token;

    console.log('--- Step 2: Upload Image ---');
    // Create a dummy image file if not exists
    const testImagePath = path.join(__dirname, 'test_image.txt');
    fs.writeFileSync(testImagePath, 'fake image content for testing multipart');

    // Manually construct multipart body (simpler than limiting external deps)
    // Actually, Cloudinary might reject non-image. Let's try to fetch a real image buffer or assume one exists? 
    // Or better, let's just send the text file but claim it's a .jpg to test the route logic (Multer might reject mimetype).
    // Let's rely on a simple boundary.

    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const filename = 'test.jpg';

    // Create a minimal valid JPG header to fool magic number checks if necessary
    // But Cloudinary checks the content. 
    // Let's create a "text" file but call it jpg. Multer "checkFileType" regex checks extension and mimetype.
    // Our backend route "checkFileType" manual check uses regex on extension and mimetype. 
    // It DOES NOT inspect buffer magic numbers in the provided code!

    const start = `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="${filename}"\r\nContent-Type: image/jpeg\r\n\r\n`;
    const content = Buffer.from('fake image data');
    const end = `\r\n--${boundary}--\r\n`;

    const requestData = Buffer.concat([Buffer.from(start), content, Buffer.from(end)]);

    const uploadRes = await request({
        hostname: HOST,
        port: PORT,
        path: '/api/upload',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': requestData.length
        }
    }, requestData);

    console.log('Upload Status:', uploadRes.statusCode);
    if (uploadRes.statusCode === 200) {
        console.log('Upload Success:', uploadRes.body);
    } else {
        console.error('Upload Failed:', uploadRes.body);
    }

    // Cleanup
    if (fs.existsSync(testImagePath)) fs.unlinkSync(testImagePath);
}

runTest().catch(console.error);
