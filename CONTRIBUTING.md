# Contributing to Pet Service Marketplace

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, etc.)

### Suggesting Features

Feature suggestions are welcome! Open an issue with:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Mockups or examples

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests
5. Ensure all tests pass
6. Update documentation
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to your branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## 📋 Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run database migrations: `npm run db:migrate`
5. Start development server: `npm run dev:full`

## 🎨 Code Style

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type
- Use interfaces for object shapes
- Use enums for fixed sets of values

### React/Next.js

- Use functional components
- Use hooks for state management
- Keep components small and focused
- Use TypeScript for props

### Naming Conventions

- Components: PascalCase (`UserProfile.tsx`)
- Functions: camelCase (`getUserData`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Types/Interfaces: PascalCase (`UserData`)

### File Structure

```
component-name/
├── index.tsx           # Main component
├── ComponentName.tsx   # Component implementation
├── ComponentName.test.tsx  # Tests
└── types.ts           # Type definitions
```

## 🧪 Testing

- Write tests for new features
- Maintain or improve test coverage
- Run tests before committing: `npm run test`

## 📝 Documentation

- Update README.md for major changes
- Add JSDoc comments for functions
- Update API documentation for endpoint changes
- Keep CHANGELOG.md updated

## 🔍 Code Review Process

1. PR will be reviewed by maintainers
2. Address any feedback
3. Once approved, it will be merged
4. Thank you for contributing!

## 📞 Questions?

Feel free to open an issue or contact the maintainers.

Happy coding! 🚀

