# Interactive Neural Network Calculator

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20App-green?style=for-the-badge&logo=vercel)](https://neural-network-calc.vercel.app)

This is a web application built with Next.js, TypeScript, and Tailwind CSS that provides a step-by-step interactive walkthrough of how a simple neural network learns using forward and backward propagation.

## Live Demo

Check out the live demo at: [https://neural-network-calc.vercel.app](https://neural-network-calc.vercel.app)

## Features

- **Interactive Stepper:** Guides you through each calculation in the forward and backward pass.
- **Neural Network Visualization:** A dynamic diagram that highlights the active nodes and weights for each step.
- **Live Calculations:** See the results of each calculation as you step through the process.
- **Mathematical Formulas:** All formulas are rendered using KaTeX for clarity.

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for server-rendered applications.
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
- [KaTeX](https://katex.org/) - Fast math typesetting for the web.
- [Chart.js](https://www.chartjs.org/) - For data visualization.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/neural-network-calc.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

### Running Tests

This project includes Playwright end-to-end tests. To run the tests:

1. First, ensure the development server is running:
   ```bash
   npm run dev
   ```

2. In a new terminal, run the tests:
   ```bash
   # Run tests in headless mode
   npx playwright test
   
   # Run tests with UI (for debugging)
   npx playwright test --headed
   
   # Run a specific test file
   npx playwright test tests/app.spec.ts
   
   # Run with debug information
   DEBUG=pw:api npx playwright test
   ```

### Running the Development Server

Run the following command to start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is ready for deployment on [Vercel](https://vercel.com/), the platform from the creators of Next.js. Pushing your repository to GitHub and connecting it to Vercel will enable automatic deployments.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
