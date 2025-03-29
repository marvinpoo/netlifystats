# NetlifyStats Dashboard
[![Netlify Status](https://api.netlify.com/api/v1/badges/61259878-3ddf-4bdd-8c71-4bd2e178fd58/deploy-status)](https://app.netlify.com/sites/netlifystats/deploys)

## Overview

NetlifyStats is a comprehensive dashboard application built with Next.js that provides real-time insights and statistics for your Netlify deployments. Monitor your site's performance, track deployments, and visualize build statistics all in one place.

## Features

- **Real-time Deployment Tracking**: Monitor your Netlify deployments in real-time
- **Build Statistics**: Visualize build times, sizes, and performance metrics
- **Site Information**: View comprehensive details about your Netlify site
- **Embeddable Views**: Embed statistics and deployment information in other applications
- **Customizable Dashboard**: Configure the dashboard to show the metrics that matter to you
- **Dark/Light Mode**: Support for both dark and light themes

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- A Netlify account with API access
- A Netlify site to monitor

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/netlifystats.git
   cd netlifystats
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Configure your Netlify credentials:
   - Create a `.env.local` file in the root directory
   - Add your Netlify API token and site ID:
     ```
     NEXT_PUBLIC_NETLIFY_API_TOKEN=your_netlify_api_token
     NEXT_PUBLIC_NETLIFY_SITE_ID=your_netlify_site_id
     ```
   - Alternatively, you can set these credentials in the application settings page

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard

## Usage

### Dashboard

The main dashboard displays an overview of your Netlify site, including:
- Recent deployments
- Build statistics
- Site information

### Settings

Access the settings page to configure:
- Netlify API credentials
- Display preferences
- Refresh intervals

### Embed Views

You can embed specific views of your dashboard in other applications using the provided embed codes. Available views include:
- Deployment history
- Build statistics
- Site information

## Development

### Project Structure

```
/app - Next.js application routes
/components - React components
/lib - Utility functions and API clients
/public - Static assets
/styles - Global styles
```

### Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Contributing

Contributions are welcome! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for details.

## Security

For information about reporting security vulnerabilities, please see our [SECURITY.md](SECURITY.md) file.

## Privacy

For information about how we handle data and privacy, please see our [PRIVACY.md](PRIVACY.md) file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.