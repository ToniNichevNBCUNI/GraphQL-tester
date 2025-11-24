# GraphQL Article Tester

A simple Node.js Express application that queries a GraphQL server and displays the results on a web page.

## Prerequisites

- Node.js (v12 or higher)
- npm

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Click the "Fetch Article" button to query the GraphQL server and see the results.

## Running with HTTPS

To run the application over HTTPS, you need SSL certificates:

### Development (Using mkcert - Recommended):

1. Install mkcert:
```bash
brew install mkcert
mkcert -install
```

2. Generate certificates:
```bash
mkcert -key-file key.pem -cert-file cert.pem localhost 127.0.0.1 ::1
```

3. Start the server:
```bash
npm start
```

4. Access via HTTPS:
```
https://localhost:3443
```

No browser warnings with mkcert!

### Alternative (Self-signed certificates):

```bash
openssl req -nodes -new -x509 -keyout key.pem -out cert.pem -days 365
```

Note: You'll need to accept the browser warning for self-signed certificates.

### Production:

Use certificates from a Certificate Authority (Let's Encrypt, etc.) and replace `cert.pem` and `key.pem` files.

## Configuration

The application queries the GraphQL server at:
- **URL:** `https://localhost.cnbc.com:4000/graphql`
- **Query:** Fetches article with ID `108155692`

To modify the query or server URL, edit `server.js`.

## Note

The application disables SSL certificate verification for localhost development. This is suitable for development environments but should be removed for production use.
