import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Frontend School Interviews API',
      version: '1.0.0',
      description: 'API documentation for Frontend School Interviews platform',
      contact: {
        name: 'API Support',
        email: 'support@frontendschool.io',
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://frontend-school-interviews.vercel.app'
            : 'http://localhost:3000',
        description:
          process.env.NODE_ENV === 'production'
            ? 'Production server'
            : 'Development server',
      },
    ],
    components: {
      schemas: {
        PaymentItem: {
          type: 'object',
          required: ['id', 'title', 'description', 'price', 'type', 'quantity'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the payment item',
            },
            title: {
              type: 'string',
              description: 'Title of the payment item',
            },
            description: {
              type: 'string',
              description: 'Description of the payment item',
            },
            price: {
              type: 'number',
              description: 'Price of the item in INR',
              minimum: 0,
            },
            type: {
              type: 'string',
              enum: ['premium_plan', 'mock_interview', 'custom_problem'],
              description: 'Type of payment item',
            },
            duration: {
              type: 'string',
              description: 'Duration for premium plans',
            },
            features: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Features included in premium plans',
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              description: 'Quantity of items',
            },
            image: {
              type: 'string',
              description: 'Image URL for the item',
            },
          },
        },
        PaymentDetails: {
          type: 'object',
          required: [
            'amount',
            'currency',
            'customerName',
            'customerEmail',
            'items',
          ],
          properties: {
            amount: {
              type: 'number',
              description: 'Total amount in INR',
              minimum: 1,
            },
            currency: {
              type: 'string',
              enum: ['INR'],
              description: 'Payment currency (only INR supported)',
            },
            customerName: {
              type: 'string',
              description: 'Customer full name',
            },
            customerEmail: {
              type: 'string',
              format: 'email',
              description: 'Customer email address',
            },
            customerPhone: {
              type: 'string',
              description: 'Customer phone number',
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/PaymentItem',
              },
              description: 'List of payment items',
            },
          },
        },
        RazorpayOrder: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Razorpay order ID',
            },
            amount: {
              type: 'number',
              description: 'Order amount in paise',
            },
            currency: {
              type: 'string',
              description: 'Order currency',
            },
            receipt: {
              type: 'string',
              description: 'Order receipt',
            },
            status: {
              type: 'string',
              description: 'Order status',
            },
            created_at: {
              type: 'number',
              description: 'Order creation timestamp',
            },
          },
        },
        PaymentResponse: {
          type: 'object',
          required: ['success'],
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the operation was successful',
            },
            orderId: {
              type: 'string',
              description: 'Order ID from payment gateway',
            },
            paymentId: {
              type: 'string',
              description: 'Payment ID from payment gateway',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            error: {
              type: 'string',
              description: 'Error message if operation failed',
            },
          },
        },
        PaymentVerification: {
          type: 'object',
          required: ['orderId', 'paymentId', 'signature'],
          properties: {
            orderId: {
              type: 'string',
              description: 'Razorpay order ID',
            },
            paymentId: {
              type: 'string',
              description: 'Razorpay payment ID',
            },
            signature: {
              type: 'string',
              description: 'Razorpay payment signature for verification',
            },
          },
        },
        SavePaymentRequest: {
          type: 'object',
          required: ['userId', 'orderId', 'paymentId', 'amount'],
          properties: {
            userId: {
              type: 'string',
              description: 'User ID who made the payment',
            },
            orderId: {
              type: 'string',
              description: 'Razorpay order ID',
            },
            paymentId: {
              type: 'string',
              description: 'Razorpay payment ID',
            },
            amount: {
              type: 'number',
              description: 'Payment amount',
              minimum: 1,
            },
            currency: {
              type: 'string',
              default: 'INR',
              description: 'Payment currency',
            },
            status: {
              type: 'string',
              description: 'Payment status',
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/PaymentItem',
              },
              description: 'Items purchased',
            },
          },
        },
        InterviewInsightsRequest: {
          type: 'object',
          required: ['companyName', 'roleLevel'],
          properties: {
            companyName: {
              type: 'string',
              description: 'Company name for interview insights',
              minLength: 1,
            },
            roleLevel: {
              type: 'string',
              description: 'Role level (e.g., Junior, Mid, Senior)',
              minLength: 1,
            },
          },
        },
        InterviewRound: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the interview round',
            },
            description: {
              type: 'string',
              description: 'Description of the interview round',
            },
            sampleProblems: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Sample problems for this round',
            },
            duration: {
              type: 'string',
              description: 'Duration of the round (e.g., "45-60 minutes")',
            },
            focusAreas: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Focus areas for this round',
            },
            evaluationCriteria: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Evaluation criteria for this round',
            },
            difficulty: {
              type: 'string',
              enum: ['easy', 'medium', 'hard'],
              description: 'Difficulty level of the round',
            },
            tips: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Tips for this round',
            },
          },
        },
        InterviewInsightsData: {
          type: 'object',
          properties: {
            totalRounds: {
              type: 'integer',
              description: 'Total number of interview rounds',
            },
            estimatedDuration: {
              type: 'string',
              description: 'Estimated total duration of interview process',
            },
            rounds: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/InterviewRound',
              },
              description: 'Details of each interview round',
            },
            overallTips: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Overall tips for the interview process',
            },
            companySpecificNotes: {
              type: 'string',
              description: 'Company-specific notes and insights',
            },
          },
        },
        InterviewInsightsResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful',
            },
            data: {
              $ref: '#/components/schemas/InterviewInsightsData',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          required: ['error'],
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            details: {
              type: 'string',
              description: 'Additional error details',
            },
            status: {
              type: 'integer',
              description: 'HTTP status code',
            },
          },
        },
      },
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
        },
      },
    },
    paths: {
      '/api/create-order': {
        post: {
          summary: 'Create a payment order',
          description:
            'Creates a payment order with Razorpay for processing payments',
          tags: ['Payment'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PaymentDetails',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Order created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      order: { $ref: '#/components/schemas/RazorpayOrder' },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '405': {
              description: 'Method not allowed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/verify-payment': {
        post: {
          summary: 'Verify payment signature',
          description:
            'Verifies the payment signature from Razorpay to ensure payment authenticity',
          tags: ['Payment'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PaymentVerification',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Payment verified successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PaymentResponse' },
                },
              },
            },
            '400': {
              description: 'Invalid signature or missing fields',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '405': {
              description: 'Method not allowed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/save-payment': {
        post: {
          summary: 'Save payment to database',
          description:
            'Saves successful payment details to Firebase database for record keeping',
          tags: ['Payment'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SavePaymentRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Payment saved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      paymentId: { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Missing required fields',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '405': {
              description: 'Method not allowed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/api/interview-insights': {
        post: {
          summary: 'Get interview insights',
          description:
            'Generate or retrieve interview insights for a specific company and role level',
          tags: ['Interview'],
          parameters: [
            {
              in: 'query',
              name: 'refresh',
              schema: { type: 'boolean' },
              description: 'Force refresh insights (generate new ones)',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/InterviewInsightsRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Interview insights retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/InterviewInsightsResponse',
                  },
                },
              },
            },
            '400': {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '405': {
              description: 'Method not allowed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
            '503': {
              description: 'Service unavailable',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        options: {
          summary: 'CORS preflight',
          description: 'Handle CORS preflight requests',
          tags: ['Interview'],
          responses: {
            '200': {
              description: 'CORS preflight successful',
            },
          },
        },
      },
    },
  },
  apis: ['./pages/api/**/*.ts'], // Path to the API docs
};

const specs = swaggerJSDoc(options);

export default specs;
