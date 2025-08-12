# API Documentation Setup

This document explains how Swagger API documentation is set up in the Frontend School Interviews platform.

## Overview

The project uses a custom Swagger implementation that provides comprehensive API documentation without external dependencies. This approach ensures better performance and reduces bundle size.

## Structure

### 1. Swagger Configuration (`lib/swagger.ts`)
- Contains the OpenAPI 3.0 specification
- Defines all API schemas, endpoints, and responses
- Self-contained without external dependencies

### 2. API Documentation Endpoint (`pages/api/swagger.ts`)
- Serves the OpenAPI specification as JSON
- Accessible at `/api/swagger`
- Used by the documentation UI

### 3. Documentation UI (`pages/api-docs.tsx`)
- Official Swagger UI React component with custom styling
- Renders API documentation with full interactive features
- Supports both light and dark themes
- Includes "Try it out" functionality for testing APIs
- Accessible at `/api-docs`

## Available APIs

### Payment APIs
1. **POST /api/create-order** - Create a payment order with Razorpay
2. **POST /api/verify-payment** - Verify payment signature for security
3. **POST /api/save-payment** - Save payment details to Firebase

### Interview APIs
1. **POST /api/interview-insights** - Get AI-generated interview insights
2. **OPTIONS /api/interview-insights** - CORS preflight handling

## API Documentation Features

- ✅ Complete endpoint documentation
- ✅ Request/response schemas with examples
- ✅ HTTP status code explanations
- ✅ Parameter descriptions
- ✅ Authentication requirements
- ✅ Error response formats
- ✅ Interactive UI with syntax highlighting
- ✅ Mobile-responsive design
- ✅ Dark mode support

## Accessing Documentation

1. **Web Interface**: Visit `/api-docs` in your browser
2. **JSON Specification**: Access `/api/swagger` for the raw OpenAPI spec
3. **Navigation**: API Docs link available in the main navigation

## Adding New APIs

To document a new API endpoint:

1. Add Swagger comments to your API route file:
```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Brief description
 *     description: Detailed description
 *     tags:
 *       - YourTag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourSchema'
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourResponse'
 */
```

2. Add the endpoint to `lib/swagger.ts` in the `paths` section
3. Define any new schemas in the `components.schemas` section
4. Test the documentation by visiting `/api-docs`

## Schema Definitions

All API schemas are defined in the `components.schemas` section and include:

- **PaymentDetails**: Request structure for creating orders
- **PaymentItem**: Individual payment item structure  
- **PaymentVerification**: Payment signature verification data
- **InterviewInsightsRequest**: Request for interview insights
- **InterviewInsightsResponse**: Response with interview data
- **ErrorResponse**: Standard error response format

## Best Practices

1. **Consistent Error Responses**: All APIs return errors in the same format
2. **Comprehensive Examples**: Include realistic examples for all schemas
3. **Clear Descriptions**: Write helpful descriptions for all fields
4. **Version Control**: Update documentation when API changes
5. **Validation**: Test documentation matches actual API behavior

## Dependencies

The Swagger implementation uses the following packages:
- `swagger-ui-react` - Official Swagger UI React component
- `swagger-jsdoc` - Parses JSDoc comments into OpenAPI specification
- Custom styling with Tailwind CSS for theme integration
- Responsive design with mobile support

## Maintenance

- Update documentation when adding new endpoints
- Keep schemas in sync with TypeScript types
- Review examples for accuracy
- Test documentation with real API calls
- Update version numbers when making breaking changes

## Future Enhancements

Potential improvements to consider:
- Authentication integration for live API testing
- Code generation for client SDKs
- Export functionality for different formats (Postman, etc.)
- Enhanced search and filtering capabilities
- Rate limiting information display
- API versioning support