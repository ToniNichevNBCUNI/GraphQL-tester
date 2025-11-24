const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = 3000;
const HTTPS_PORT = 3443;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Serve static files
app.use(express.static('public'));

// API endpoint to fetch GraphQL data
app.get('/api/article', async (req, res) => {
  const query = `
query mvpdProtectedAsset($id: String!, $drmAsset: drmAssetType!, $deviceType: deviceType!, $options: Int) {
    mvpdProtectedAsset(id: $id, drmAsset: $drmAsset, deviceType: $deviceType, options: $options) {
        id
        drmAsset
        videoAsset
    }
}
  `;

  const variables = {
    "id":"CNBC-linear-24x7-DRM",
    "drmAsset":"LiveStream",
    "deviceType":"vizioTv",
    "options":1
  };

  try {
    const response = await fetch('https://stg-03webql.cnbcfm.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'adbtemptoken': 'eyJub3RCZWZvcmUiOjE3NjQwMDQxMjk4OTAsIm5vdEFmdGVyIjoxNzY0MDA0NDI5ODkwLCJzZXJpYWxpemVkVG9rZW4iOiJQSE5wWjI1aGRIVnlaVWx1Wm04K2NFdEhZMWxYTHpoMWNFdE1NMFE1UW1KV0x6VkRibmxuTmt4MVYweHhkeTlhWjJwb2EyRXlaV1ZWWlVwUVNraFhNVzh2ZFZOVE1IVnJSRmRKTWtSWVpHczRiVTFQV1hSak1sWXJSelZqWkcxb05rTjRZVGhvU0hSSVkwWXZkWGRSTURZeWQxQmhSWFptU2s5UVlXaDJhalozTTBSV0szUTNhRWM1YmpWNFpFY3liVkE1V0RodVl6WndhMHBZT1ROd1JVTTJOM1JNWjJjMU16RlRiMjgyTHpOTWFISldhRzFqUlhSalBUeHphV2R1WVhSMWNtVkpibVp2UGp4aGRYUm9WRzlyWlc0K1BITmxjM05wYjI1SFZVbEVQamsxTWpOaFpUVTROemxpT1RReE16Y3haV1F6Wm1VellUWmpaVEUyTVdJMVBDOXpaWE56YVc5dVIxVkpSRDQ4Y21WeGRXVnpkRzl5U1VRK2MzQmhjbXR0WldScFlUd3ZjbVZ4ZFdWemRHOXlTVVErUEhKbGMyOTFjbU5sU1VRK1kyNWlZend2Y21WemIzVnlZMlZKUkQ0OGRIUnNQak13TURBd01Ed3ZkSFJzUGp4cGMzTjFaVlJwYldVK01qQXlOUzB4TVMweU5DQXdPVG93T0RvME9TQXRNRGd3TUR3dmFYTnpkV1ZVYVcxbFBqeHRkbkJrU1dRK1ZHVnRjRkJoYzNNdFEwNUNReTB4TUcxcGJqd3ZiWFp3WkVsa1Bqd3ZZWFYwYUZSdmEyVnVQZz09IiwiYWRiVG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlKOS5leUp6ZFdJaU9pSTBObVUyWW1KaE1DMDNORE14TFRRNFl6VXRZamczTVMwMk0yRmpNMkU0T1dKak1qVWlMQ0p1WW1ZaU9qRTNOalF3TURReE1qTXNJbWx6Y3lJNkltRjFkR2d1WVdSdlltVXVZMjl0SWl3aWMyTnZjR1Z6SWpvaVlYQnBPbU5zYVdWdWREcDJNaUlzSW1WNGNDSTZNVGMyTkRBeU5UY3lNeXdpYVdGMElqb3hOelkwTURBME1USXpmUS51UXZDRUhyLV82Y2U3X2VyT2FWVDUzbHN1UDRUWlV0b2VoSlR4czVod1NYM3ZyUnduaGxPMjlEbFpwMUpnWWtkRXVfNWpadzEybmtlbFJ5WFE0RXdjMUN2YXRrcjV2ZHk1QWtLcnBHbFVlN24xVFotYnhBaXV4Qkswb01uUkR1dFAxNkhiWTV6S3NwemNhQUg2M1lJSktkMlhRb1NIaEdVWXByQWJIZWp5OHRmWTNrSEcwblFNT2c1OG0tYkoycHhHOHhhd19zWWlGRlhXaDN1R1NveGVOWDVtRTFJb1o0TFFaQUFCSFItWVpPcHJLalVjS05hN25SSy1PMS1NV1kyOGdrN0w3RjF0NEt1VTluOFpRZTBJanhaUE50ZFp4ZVJOTlBka09QWXQ2TVZaWGM3WVBOSXUtS1RKQnRaMnJxVUZ1MUdyZzZIRjRKV18tOTZxRmU1Q2ciLCJkZXZpY2VJZGVudGlmaWVyIjoiZmluZ2VycHJpbnQgTWpFeU5USmxaVEF0T0dZd1pDMDBPRGszTFdJeFl6RXRZVFJpWkdNM05qZGhPR1k1IiwiRGV2aWNlSW5mbyI6ImV5SndjbWx0WVhKNVNHRnlaSGRoY21WVWVYQmxJam9pVkZZaUxDSnRiMlJsYkNJNklsWnBlbWx2SUZOdFlYSjBRMkZ6ZENJc0luWmxibVJ2Y2lJNklsWnBlbWx2SWl3aWJXRnVkV1poWTNSMWNtVnlJam9pVm1sNmFXOGlMQ0p2YzA1aGJXVWlPaUpUYldGeWRFTmhjM1FpTENKamIyNXVaV04wYVc5dVZIbHdaU0k2SWpSbklpd2lZMjl1Ym1WamRHbHZibE5sWTNWeVpTSTZkSEoxWlgwPSIsImNoYW5uZWxJZHMiOlsiY25iYyJdLCJtdnBkUHJvdmlkZXIiOiJUZW1wUGFzcy1DTkJDLTEwbWluIn0=',
        'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbm9ueW1vdXNJZCI6IjQ5MzVhYzk1Yzg0NzgwMzA0NWY3N2E1YzU2MzIyZTE4MDk5ZWUyMWNjZGQ3YzYzZjFkNTAzYTM4ZWMyODA3OTIiLCJjb3VudHJ5Q29kZSI6IlVTIiwiZGV2aWNlSWQiOiI5N2VjYjRmMS1lNWM0LTQ5OTMtYmYxMC0yYjdkZGE0MjU3OWUiLCJleHAiOjE3OTU1MzYwMzYsImlhdCI6MTc2NDAwMDAzNiwiaWQiOiI5MzEzMjg2NS0yNWNlLTRkZTctYTRkZi1hZDExZTM2MTNhZTEiLCJpcGFkZHJlc3MiOiIxNjguMTQ5LjI0MC4yMjMiLCJpcGFkZHJlc3NlcyI6IjE2OC4xNDkuMjQwLjIyMywxMC4xNjAuMC4xMDQiLCJwb3N0YWxjb2RlIjoiMjAxNDkiLCJwcm92aWRlciI6InZpZXdsaWZ0Iiwic2l0ZSI6InNwaW5jbyIsInNpdGVJZCI6ImNlYTM5OGI5LTA5YWItNDMzMS05NThmLThjM2Q2YTM1NmI4OCIsInVzZXJJZCI6IjkzMTMyODY1LTI1Y2UtNGRlNy1hNGRmLWFkMTFlMzYxM2FlMSIsInVzZXJuYW1lIjoiYW5vbnltb3VzIn0.sDw2HThnNwy8Y3J79W-QZw_-smzVAptwx0ClskJnKJY'
      },
      body: JSON.stringify({ query, variables })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching from GraphQL:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start HTTP server
app.listen(PORT, () => {
  console.log(`HTTP Server is running on http://localhost:${PORT}`);
});

// Start HTTPS server if certificates exist
const certPath = path.join(__dirname, 'cert.pem');
const keyPath = path.join(__dirname, 'key.pem');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };

  https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS Server is running on https://localhost:${HTTPS_PORT}`);
  });
} else {
  console.log('HTTPS certificates not found. Generate them with:');
  console.log('  brew install mkcert && mkcert -install');
  console.log('  mkcert -key-file key.pem -cert-file cert.pem localhost 127.0.0.1 ::1');
}
