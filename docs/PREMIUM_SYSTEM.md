# Premium Subscription System Documentation

## Overview

The premium subscription system provides users with access to advanced features, unlimited content, and enhanced learning tools. The system includes payment processing, subscription management, and premium content access controls.

## Architecture

### Core Components

1. **Payment Processing** - Razorpay integration for secure payments
2. **Subscription Management** - API endpoints for subscription activation and status
3. **Premium Content Access** - Components and hooks for feature gating
4. **User Profile Integration** - Subscription data stored in user profiles

### File Structure

```
├── pages/api/
│   ├── create-order.ts              # Create payment orders
│   ├── verify-payment.ts            # Verify payment signatures
│   ├── save-payment.ts              # Save payment records
│   └── subscription/
│       ├── activate.ts              # Activate user subscription
│       └── status.ts                # Get subscription status
├── hooks/
│   └── useSubscription.ts           # Subscription management hook
├── components/
│   ├── PremiumGuard.tsx             # Route-level premium protection
│   ├── PremiumFeature.tsx           # Component-level premium protection
│   └── SubscriptionStatus.tsx       # Display subscription info
├── pages/
│   ├── premium/index.tsx            # Premium plans page
│   └── payment-success.tsx          # Payment success page
└── types/
    └── user.ts                      # User profile types
```

## Subscription Plans

### Available Plans

1. **Monthly Plan** - ₹999/month
   - Unlimited practice problems
   - AI-powered feedback
   - Mock interviews
   - Progress tracking
   - Priority support
   - Advanced analytics

2. **Yearly Plan** - ₹7,999/year (55% savings)
   - Everything in Monthly
   - 2 months free
   - Exclusive content
   - Early access to features
   - 1-on-1 consultation
   - Resume review

3. **Lifetime Plan** - ₹19,999 (67% savings)
   - Everything in Yearly
   - Lifetime updates
   - Premium community access
   - Personal mentor
   - Job placement assistance
   - Certificate of completion

## API Endpoints

### Payment Endpoints

#### POST /api/create-order
Creates a payment order with Razorpay.

**Request Body:**
```typescript
{
  amount: number;           // Amount in rupees
  currency: 'INR';
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: PaymentItem[];
}
```

**Response:**
```typescript
{
  success: boolean;
  order: RazorpayOrder;
}
```

#### POST /api/verify-payment
Verifies payment signature from Razorpay.

**Request Body:**
```typescript
{
  orderId: string;
  paymentId: string;
  signature: string;
}
```

#### POST /api/save-payment
Saves payment record to Firebase.

### Subscription Endpoints

#### POST /api/subscription/activate
Activates user subscription after successful payment.

**Request Body:**
```typescript
{
  planId: 'monthly' | 'yearly' | 'lifetime';
  paymentId: string;
  amount: number;
}
```

#### GET /api/subscription/status
Returns current subscription status.

**Response:**
```typescript
{
  success: boolean;
  isPremium: boolean;
  subscriptionStatus: 'free' | 'premium' | 'expired' | 'lifetime';
  subscriptionExpiresAt?: string;
  planId?: string;
  daysRemaining: number;
  subscription?: Subscription;
}
```

## Hooks

### useSubscription

Manages subscription state and provides utility functions.

```typescript
const {
  subscriptionStatus,      // Current subscription data
  loading,                 // Loading state
  error,                   // Error state
  hasPremiumAccess,        // Check if user has premium access
  hasLifetimeAccess,       // Check if user has lifetime access
  isExpired,              // Check if subscription is expired
  getExpiryDate,          // Get subscription expiry date
  formatDaysRemaining,    // Format days remaining
  activateSubscription,   // Activate subscription
  refreshStatus,          // Refresh subscription status
} = useSubscription();
```

## Components

### PremiumGuard

Route-level protection for premium content.

```typescript
<PremiumGuard feature="Mock Interviews">
  <MockInterviewComponent />
</PremiumGuard>
```

**Props:**
- `children` - Content to protect
- `fallback` - Alternative content for non-premium users
- `showUpgradePrompt` - Whether to show upgrade prompt
- `feature` - Feature name for the prompt

### PremiumFeature

Component-level protection with blurred overlay.

```typescript
<PremiumFeature feature="AI Feedback" description="Get detailed AI-powered feedback on your solutions">
  <AIFeedbackComponent />
</PremiumFeature>
```

**Props:**
- `children` - Content to protect
- `feature` - Feature name
- `description` - Feature description
- `showUpgradeButton` - Whether to show upgrade button
- `className` - Additional CSS classes

### SubscriptionStatus

Displays subscription information and status.

```typescript
<SubscriptionStatus showUpgradeButton={true} />
```

## User Profile Integration

### Subscription Data Structure

```typescript
interface UserProfile {
  // ... other fields
  isPremium: boolean;
  subscriptionStatus: 'free' | 'premium' | 'expired' | 'lifetime';
  subscriptionExpiresAt?: Date;
  subscription?: {
    planId: string;
    paymentId: string;
    amount: number;
    activatedAt: Date;
  };
}
```

### Subscription Status Logic

1. **Free** - Default state for new users
2. **Premium** - Active subscription with expiry date
3. **Lifetime** - Permanent premium access
4. **Expired** - Subscription past expiry date

## Payment Flow

### Complete Payment Process

1. **User selects plan** on `/premium` page
2. **Create order** via `/api/create-order`
3. **Initialize payment** with Razorpay
4. **User completes payment** on Razorpay
5. **Payment success callback** triggered
6. **Verify payment** via `/api/verify-payment`
7. **Save payment record** via `/api/save-payment`
8. **Activate subscription** via `/api/subscription/activate`
9. **Redirect to success page** `/payment-success`

### Error Handling

- Payment verification failures
- Subscription activation errors
- Network connectivity issues
- Invalid payment amounts

## Security Considerations

### Payment Security

- All payments verified with Razorpay signatures
- Server-side payment verification
- Secure API endpoints with authentication
- Amount validation and limits

### Data Protection

- User subscription data encrypted in Firebase
- Payment details not stored in plain text
- Secure session management
- API rate limiting

## Testing

### Debug Payment Page

Use `/debug-payment` to test payment flows with small amounts.

### Test Scenarios

1. **New user subscription**
2. **Subscription renewal**
3. **Payment failure handling**
4. **Subscription expiry**
5. **Premium content access**

## Monitoring and Analytics

### Key Metrics

- Subscription conversion rates
- Payment success rates
- Feature usage by subscription type
- Subscription renewal rates
- Revenue tracking

### Logging

- Payment events logged for debugging
- Subscription status changes tracked
- Error events captured for monitoring

## Future Enhancements

### Planned Features

1. **Subscription management dashboard**
2. **Automatic renewal handling**
3. **Promo code system**
4. **Referral rewards**
5. **Team/enterprise plans**
6. **Usage analytics**
7. **Email notifications**

### Technical Improvements

1. **Webhook integration** for payment events
2. **Subscription caching** for performance
3. **Real-time status updates**
4. **Advanced analytics dashboard**
5. **A/B testing for pricing**

## Troubleshooting

### Common Issues

1. **Payment amount errors** - Check amount conversion logic
2. **Subscription not activating** - Verify API endpoints and authentication
3. **Premium features not accessible** - Check subscription status and hooks
4. **Payment verification failures** - Verify Razorpay configuration

### Debug Steps

1. Check browser console for errors
2. Verify API endpoint responses
3. Check Firebase user profile data
4. Test with debug payment page
5. Review server logs for errors

## Support

For technical support or questions about the premium system:

1. Check the debug payment page for testing
2. Review server logs for error details
3. Verify Razorpay configuration
4. Test with small amounts first
5. Contact development team for assistance
