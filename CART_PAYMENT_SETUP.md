# Cart and Payment Integration Setup

This document explains how to set up the cart and payment functionality with Razorpay integration.

## Features

- **Shopping Cart**: Add, remove, and manage items in cart
- **Razorpay Integration**: Secure payment processing
- **Discount Codes**: Support for promotional codes
- **Order Management**: Track orders and payments
- **Firebase Integration**: Store payment data securely

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### 2. Razorpay Account Setup

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your test API keys from the Razorpay dashboard
3. For production, replace test keys with live keys

### 3. Firebase Collections

The following Firebase collections are used:

- `payments`: Stores payment transaction data
- `users`: User profiles and subscription status
- `orders`: Order details and status

### 4. API Endpoints

The following API endpoints are created:

- `/api/create-order`: Creates Razorpay order
- `/api/verify-payment`: Verifies payment signature
- `/api/save-payment`: Saves payment to Firebase

## Usage

### Adding Items to Cart

```typescript
import { useCart } from '../hooks/useCart';

const { addToCart } = useCart();

const item = {
  id: 'premium-monthly',
  title: 'Monthly Premium',
  description: 'Premium subscription for 1 month',
  price: 999,
  type: 'premium_plan',
  duration: '1 month',
  features: ['Feature 1', 'Feature 2'],
  quantity: 1,
};

addToCart(item);
```

### Cart Management

```typescript
const { 
  cart, 
  removeFromCart, 
  updateQuantity, 
  applyDiscount,
  clearCart 
} = useCart();

// Remove item
removeFromCart('item-id');

// Update quantity
updateQuantity('item-id', 2);

// Apply discount
const result = applyDiscount('WELCOME10');

// Clear cart
clearCart();
```

### Payment Processing

The payment flow is handled automatically when the user clicks "Proceed to Checkout":

1. Creates Razorpay order
2. Opens payment modal
3. Processes payment
4. Verifies payment signature
5. Saves to Firebase
6. Redirects to success page

## Available Discount Codes

- `WELCOME10`: 10% off
- `PREMIUM20`: 20% off
- `INTERVIEW15`: 15% off

## File Structure

```
├── types/cart.ts              # Cart and payment types
├── hooks/useCart.ts           # Cart management hook
├── services/razorpay.ts       # Razorpay integration
├── components/CartIcon.tsx    # Cart icon component
├── pages/cart.tsx            # Cart page
├── pages/store.tsx           # Store page
├── pages/payment-success.tsx # Success page
└── pages/api/
    ├── create-order.ts       # Create order API
    ├── verify-payment.ts     # Verify payment API
    └── save-payment.ts       # Save payment API
```

## Styling

The cart and payment components use the existing theme system with:
- Primary color: `#e5231c`
- Consistent with the app's black and white theme
- Responsive design for mobile and desktop

## Security Considerations

1. **Payment Verification**: Always verify payment signatures on the server
2. **Environment Variables**: Keep secret keys secure
3. **Input Validation**: Validate all user inputs
4. **Error Handling**: Proper error handling for failed payments

## Testing

1. Use Razorpay test mode for development
2. Test with various payment methods
3. Verify error handling scenarios
4. Test discount code functionality

## Production Deployment

1. Replace test API keys with live keys
2. Set up webhook endpoints for payment notifications
3. Configure proper error monitoring
4. Set up order fulfillment processes 