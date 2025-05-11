# Walver SDK for JavaScript

The Walver SDK is a JavaScript/TypeScript library for creating and managing wallet verifications with [Walver.io](https://walver.io), a service for verifying wallet ownership on various blockchain networks.

## Installation

```bash
npm install walver-sdk
# or
yarn add walver-sdk
```

## Usage

### Initialization

```typescript
import { Walver } from 'walver-sdk';

// Initialize with API key
const walver = new Walver('your-api-key');

// Or use environment variable WALVER_API_KEY
// Initialize with .env file
const walver = new Walver();
```

### Creating a Verification Link

```typescript
const response = await walver.createVerification({
  id: 'unique-verification-id',
  service_name: 'Your Service',
  chain: 'ETH', // or SOL for Solana
  // Optional fields
  redirect_url: 'https://your-service.com/callback',
  one_time: true,
  custom_fields: [
    { type: 'email', label: 'Your Email', required: true }
  ]
});

console.log(`Verification URL: ${response.url}`);
```

### Managing Folders

```typescript
// Create a folder
const folder = await walver.createFolder(
  'My Verifications',
  'A collection of verification links'
);

// Get all folders
const folders = await walver.getFolders();

// Get verifications in a folder
const verifications = await walver.getFolderVerifications(folder.id);
```

### Managing API Keys

```typescript
// Create a new API key
const apiKey = await walver.createApiKey(
  'Development Key',
  'For development purposes'
);

// Get all API keys
const apiKeys = await walver.getApiKeys();

// Delete an API key
await walver.deleteApiKey(apiKey.id);
```

## Features

- Create wallet verification links
- Organize verifications in folders
- Manage API keys
- Support for both EVM (Ethereum) and Solana chains
- Webhooks for verification events
- Custom fields for collecting additional information
- Token gating support

## Documentation

For more detailed documentation, visit the [Walver documentation](https://docs.walver.io).

## License

MIT 