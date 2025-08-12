# Linting and Formatting Setup

This document describes the linting and formatting configuration for the Frontend School Interviews TypeScript project.

## Overview

The project now uses a modern ESLint v9 configuration with Prettier for code formatting. This setup provides:

- **ESLint v9**: Modern linting with flat config format
- **Prettier**: Automatic code formatting
- **TypeScript ESLint**: TypeScript-specific linting rules
- **Next.js ESLint**: Next.js-specific rules and optimizations
- **React Hooks**: React hooks linting rules

## Configuration Files

### ESLint Configuration (`eslint.config.js`)

The project uses ESLint v9 with a flat configuration format that includes:

- **Base Configuration**: Uses `@eslint/js` recommended rules
- **TypeScript Support**: Configured with `@typescript-eslint` parser and plugin
- **Next.js Integration**: Includes Next.js specific rules and optimizations
- **React Hooks**: Enforces React hooks rules
- **Prettier Integration**: Works with Prettier to avoid conflicts
- **Global Variables**: Properly configured for browser and Node.js environments

### Prettier Configuration (`.prettierrc`)

Standard Prettier configuration with:
- Single quotes for strings
- 2-space indentation
- 80 character line width
- Semicolons enabled
- Trailing commas in ES5 mode

### Prettier Ignore (`.prettierignore`)

Comprehensive ignore file that excludes:
- Build outputs (`.next/`, `build/`, `dist/`)
- Dependencies (`node_modules/`)
- Environment files (`.env*`)
- Generated files and documentation
- Configuration files that should maintain their format

## Available Scripts

The following npm scripts are available:

```bash
# Linting
npm run lint              # Check for linting issues
npm run lint:fix          # Auto-fix linting issues where possible

# Formatting
npm run format            # Format all files with Prettier
npm run format:check      # Check if files are properly formatted

# Type Checking
npm run type-check        # Run TypeScript type checking
```

## Key Features

### 1. Modern ESLint v9 Configuration
- Uses the new flat config format
- No deprecated configuration options
- Proper TypeScript integration
- Next.js optimizations

### 2. Prettier Integration
- Automatic code formatting
- Consistent code style across the project
- Integration with ESLint to avoid conflicts

### 3. TypeScript Support
- Full TypeScript linting
- Type-aware rules
- Proper type checking integration

### 4. React Support
- React hooks rules
- JSX linting
- React-specific optimizations

### 5. Next.js Optimizations
- Image optimization warnings
- Performance recommendations
- Next.js best practices

## Current Status

### Build Status
✅ **Build Successful**: The project builds successfully with the new linting configuration

### Linting Status
- **Total Issues**: 508 problems (198 errors, 310 warnings)
- **Formatting**: ✅ All files properly formatted with Prettier
- **Type Checking**: ✅ TypeScript compilation successful

### Remaining Issues
The remaining linting issues are primarily:
- Unused variables and imports (can be auto-fixed)
- TypeScript `any` type warnings (code quality improvements)
- React hooks dependency warnings (code quality improvements)
- Non-null assertion warnings (code quality improvements)

## Usage Guidelines

### For Developers

1. **Before Committing**: Run `npm run lint:fix` to auto-fix issues
2. **Format Code**: Run `npm run format` to format code
3. **Check Types**: Run `npm run type-check` to verify TypeScript types
4. **IDE Integration**: Configure your IDE to use the project's ESLint and Prettier configuration

### IDE Setup

#### VS Code
Install the following extensions:
- ESLint
- Prettier - Code formatter

Add to your VS Code settings:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

#### Other IDEs
Configure your IDE to use the project's ESLint and Prettier configuration files.

## Migration Notes

### From Old Configuration
- Removed `.eslintrc.json` (deprecated format)
- Updated to ESLint v9 flat config format
- Added proper TypeScript and Next.js integration
- Integrated Prettier for consistent formatting

### Benefits
- **Better Performance**: ESLint v9 is faster and more efficient
- **Modern Configuration**: Uses current best practices
- **Better Integration**: Proper TypeScript and Next.js support
- **Consistent Formatting**: Prettier ensures consistent code style
- **Reduced Issues**: From 8000+ issues to 508 manageable issues

## Troubleshooting

### Common Issues

1. **ESLint not found**: Make sure to use `npx eslint` or install ESLint globally
2. **Prettier conflicts**: The configuration includes `eslint-config-prettier` to prevent conflicts
3. **TypeScript errors**: Run `npm run type-check` to identify type issues

### Getting Help

If you encounter issues:
1. Check the ESLint and Prettier documentation
2. Review the configuration files in this project
3. Run `npm run lint` to see specific error messages
4. Use `npm run lint:fix` to auto-fix issues where possible

## Future Improvements

1. **Reduce `any` types**: Replace `any` types with proper TypeScript types
2. **Fix unused variables**: Remove or use declared variables
3. **Improve React hooks**: Fix dependency arrays and hook usage
4. **Add stricter rules**: Gradually increase linting strictness as code quality improves 