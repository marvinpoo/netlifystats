# Contributing to NetlifyStats

Thank you for your interest in contributing to NetlifyStats! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to uphold our Code of Conduct, which expects all participants to interact respectfully and professionally.

## How Can I Contribute?

### Reporting Bugs

Bugs are tracked as GitHub issues. When you create an issue, please use the bug report template and provide detailed information about:

1. **Description**: Clear and concise description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the behavior
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Screenshots**: If applicable, add screenshots to help explain your problem
6. **Environment**: Include details about your environment (OS, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are also tracked as GitHub issues. When creating an enhancement suggestion, please include:

1. **Description**: Clear and concise description of the enhancement
2. **Use Case**: Explain why this enhancement would be useful
3. **Possible Implementation**: If you have ideas about how to implement the enhancement

### Pull Requests

1. **Fork the Repository**: Create your own fork of the project
2. **Create a Branch**: Create a branch for your feature or bugfix
3. **Make Changes**: Make your changes to the code
4. **Follow Coding Standards**: Ensure your code follows the project's coding standards
5. **Write Tests**: Add tests for your changes if applicable
6. **Update Documentation**: Update the documentation to reflect your changes
7. **Submit Pull Request**: Submit a pull request from your branch to our main branch

## Development Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm, yarn, or pnpm

### Setup Steps

1. Clone your fork of the repository
2. Install dependencies: `npm install` (or `yarn install` or `pnpm install`)
3. Create a `.env.local` file with your Netlify credentials (see README.md)
4. Start the development server: `npm run dev`

## Coding Guidelines

### JavaScript/TypeScript

- Use TypeScript for all new code
- Follow the existing code style in the project
- Use ESLint to check your code quality: `npm run lint`

### React Components

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use the UI components from the components/ui directory

### CSS/Styling

- Use Tailwind CSS for styling
- Follow the existing design system

## Testing

- Write tests for new features and bug fixes
- Ensure all tests pass before submitting a pull request

## Documentation

- Update documentation to reflect your changes
- Use clear and concise language
- Include code examples where appropriate

## Commit Guidelines

- Use clear and descriptive commit messages
- Reference issue numbers in commit messages when applicable
- Keep commits focused on a single change

## Review Process

All submissions require review. We use GitHub pull requests for this purpose.

1. Submit your pull request
2. Wait for review from maintainers
3. Address any requested changes
4. Once approved, your changes will be merged

## Thank You

Thank you for contributing to NetlifyStats! Your time and expertise help make this project better for everyone.