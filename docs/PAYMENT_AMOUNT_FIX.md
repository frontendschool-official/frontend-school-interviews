# Payment Amount Fix Documentation

## Issue Description

The application was experiencing Razorpay payment errors with the message:
```
"Amount exceeds maximum amount allowed."
```

## Root Cause

The issue was caused by **double conversion** of payment amounts:

1. **Frontend**: Amounts were being converted to paise (`plan.price * 100`)
2. **Backend**: Amounts were being converted again to paise (`paymentDetails.amount * 100`)

This resulted in amounts being 100x larger than intended. For example:
- Lifetime plan: ₹19,999 → 19,999 * 100 * 100 = 199,990,000 paise = ₹1,999,900
- This exceeded Razorpay's maximum allowed amount

## Solution Implemented

### 1. Backend Fix (`pages/api/create-order.ts`)

Updated the amount conversion logic to handle both formats:

```typescript
// Check if amount is already in paise (if it's a large number) or in rupees
let amountInPaise: number;
if (paymentDetails.amount >= 100) {
  // If amount is >= 100, assume it's already in paise
  amountInPaise = Math.round(paymentDetails.amount);
} else {
  // If amount is < 100, assume it's in rupees and convert to paise
  amountInPaise = Math.round(paymentDetails.amount * 100);
}
```

Added maximum amount validation:
```typescript
// Validate maximum amount (Razorpay maximum is typically 10,00,000 paise = ₹10,000)
if (amountInPaise > 1000000) {
  console.error('Amount too large:', amountInPaise);
  return res.status(400).json({ error: 'Maximum amount allowed is ₹10,000' });
}
```

### 2. Frontend Fix (`pages/premium/index.tsx`)

Updated to send amounts in rupees instead of paise:

```typescript
// Before
amount: plan.price * 100, // Convert to paise

// After
amount: plan.price, // Send amount in rupees
```

### 3. Type Definitions Updated (`types/cart.ts`)

Added clear documentation about amount formats:

```typescript
export interface PaymentDetails {
  amount: number; // Amount in rupees (will be converted to paise by the API)
  // ...
}

export interface RazorpayOrder {
  amount: number; // Amount in paise (as returned by Razorpay)
  // ...
}
```

### 4. Debug Payment Updated (`container/debug-payment/index.tsx`)

Updated test amounts to use correct format (1 rupee instead of 100 paise).

## Razorpay Amount Limits

- **Minimum**: 100 paise = ₹1
- **Maximum**: 10,00,000 paise = ₹10,000 (for most accounts)
- **Currency**: Only INR supported

## Best Practices for Future Development

1. **Always send amounts in rupees** from frontend to backend
2. **Let the backend handle conversion** to paise for Razorpay
3. **Validate amounts** on both frontend and backend
4. **Use clear type definitions** with comments about amount formats
5. **Test with small amounts** first (₹1-₹10) before testing larger amounts

## Testing

Use the debug payment page (`/debug-payment`) to test payment flows with small amounts.

## Related Files

- `pages/api/create-order.ts` - Main fix implementation
- `pages/premium/index.tsx` - Frontend amount handling
- `types/cart.ts` - Type definitions
- `container/debug-payment/index.tsx` - Test page updates
