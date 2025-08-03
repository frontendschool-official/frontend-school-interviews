import React, { useState } from "react";
import { NextPage } from "next";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useThemeContext } from "@/hooks/useTheme";
import Layout from "@/components/Layout";
import {
  FiCheck,
  FiStar,
  FiZap,
  FiAward,
  FiArrowRight,
  FiCreditCard,
} from "react-icons/fi";
import {
  createOrder,
  initializePayment,
  verifyPayment,
  savePaymentToFirebase,
} from "@/services/razorpay";
import { PaymentDetails, PaymentItem } from "@/types/cart";

const PremiumContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text}80;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const PlanCard = styled.div<{ featured?: boolean }>`
  background: ${({ theme }) => theme.secondary};
  border: 2px solid
    ${({ theme, featured }) => (featured ? theme.primary : theme.border)};
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  transform: ${({ featured }) => (featured ? "scale(1.02)" : "scale(1)")};

  &:hover {
    transform: ${({ featured }) => (featured ? "scale(1.03)" : "scale(1.01)")};
    box-shadow: 0 8px 25px ${({ theme }) => theme.border}20;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.4rem 1.2rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const PlanIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.primary};
`;

const PlanName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const PlanPrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.5rem;
`;

const PlanDuration = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text}80;
  margin-bottom: 1.5rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
`;

const CheckIcon = styled(FiCheck)`
  color: #10b981;
  font-size: 1.2rem;
`;

const BuyButton = styled.button<{ featured?: boolean }>`
  width: 100%;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.accent};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #fed7d7;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background: #f0fdf4;
  color: #166534;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #bbf7d0;
  text-align: center;
`;

const BenefitsSection = styled.div`
  background: ${({ theme }) => theme.secondary};
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 3rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const BenefitsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin-bottom: 2rem;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const BenefitCard = styled.div`
  text-align: center;
  padding: 1.5rem;
`;

const BenefitIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 1rem;
`;

const BenefitTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
`;

const BenefitDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text}80;
`;

const plans = [
  {
    id: "premium-monthly",
    name: "Monthly Premium",
    price: 799,
    duration: "1 month",
    icon: <FiStar />,
    features: [
      "Unlimited problem access",
      "AI-powered feedback",
      "Mock interviews",
      "Progress tracking",
      "Community support",
    ],
  },
  {
    id: "premium-quarterly",
    name: "Quarterly Premium",
    price: 1999,
    duration: "3 months",
    icon: <FiZap />,
    featured: true,
    features: [
      "Everything in Monthly Premium",
      "Advanced analytics",
      "Custom problem generation",
      "1-on-1 consultation",
      "Resume review service",
      "Priority support",
    ],
  },
  {
    id: "premium-yearly",
    name: "Yearly Premium",
    price: 5999,
    duration: "12 months",
    icon: <FiAward />,
    features: [
      "Everything in Quarterly Premium",
      "Exclusive content",
      "Interview preparation roadmap",
      "Mock interview sessions",
      "Career guidance",
      "Lifetime access to updates",
    ],
  },
];

const PremiumPage: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useThemeContext();

  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePurchase = async (plan: (typeof plans)[0]) => {
    if (!user) {
      setError("Please login to purchase premium");
      return;
    }

    setIsProcessing(plan.id);
    setError("");
    setSuccess("");

    try {
      const userDisplayName =
        user.displayName || user.email?.split("@")[0] || "Customer";
      const userEmail = user.email || "";
      const userPhone = user.phoneNumber || "";

      const paymentDetails: PaymentDetails = {
        amount: plan.price,
        currency: "INR",
        orderId: `order_${Date.now()}`,
        customerName: userDisplayName,
        customerEmail: userEmail,
        customerPhone: userPhone,
        items: [
          {
            id: plan.id,
            title: plan.name,
            description: `Premium plan for ${plan.duration}`,
            price: plan.price,
            type: "premium_plan",
            duration: plan.duration,
            quantity: 1,
          },
        ],
      };

      // Create order
      const order = await createOrder(paymentDetails);

      // Initialize payment
      await initializePayment(
        order,
        paymentDetails,
        async (response: any) => {
          try {
            // Verify payment
            const verification = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verification.success) {
              // Save payment to Firebase
              await savePaymentToFirebase(user.uid, {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: plan.price,
                currency: "INR",
                status: "completed",
                items: [
                  {
                    id: plan.id,
                    title: plan.name,
                    description: `Premium plan for ${plan.duration}`,
                    price: plan.price,
                    type: "premium_plan",
                    duration: plan.duration,
                    quantity: 1,
                  },
                ],
              });

              setSuccess("Payment successful! Redirecting...");

              setTimeout(() => {
                router.push("/payment-success");
              }, 1500);
            } else {
              setError("Payment verification failed");
            }
          } catch (error) {
            setError("Payment verification failed");
          }
        },
        (error: any) => {
          setError("Payment failed. Please try again.");
        }
      );
    } catch (error) {
      setError("Failed to initialize payment. Please try again.");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <Layout>
      <PremiumContainer>
        <Header>
          <Title>Choose Your Premium Plan</Title>
          <Subtitle>
            Unlock unlimited access to our comprehensive interview preparation
            platform
          </Subtitle>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <PlansGrid>
          {plans.map((plan) => (
            <PlanCard key={plan.id} featured={plan.featured}>
              {plan.featured && <FeaturedBadge>Most Popular</FeaturedBadge>}

              <PlanIcon>{plan.icon}</PlanIcon>
              <PlanName>{plan.name}</PlanName>
              <PlanPrice>₹{plan.price.toLocaleString()}</PlanPrice>
              <PlanDuration>{plan.duration}</PlanDuration>

              <FeaturesList>
                {plan.features.map((feature, index) => (
                  <FeatureItem key={index}>
                    <CheckIcon />
                    {feature}
                  </FeatureItem>
                ))}
              </FeaturesList>

              <BuyButton
                featured={plan.featured}
                onClick={() => handlePurchase(plan)}
                disabled={isProcessing === plan.id || !user}
              >
                {isProcessing === plan.id ? (
                  <>
                    <LoadingSpinner />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCreditCard />
                    Get {plan.name}
                    <FiArrowRight />
                  </>
                )}
              </BuyButton>
            </PlanCard>
          ))}
        </PlansGrid>

        <BenefitsSection>
          <BenefitsTitle>Why Choose Premium?</BenefitsTitle>
          <BenefitsGrid>
            <BenefitCard>
              <BenefitIcon>🎯</BenefitIcon>
              <BenefitTitle>Targeted Practice</BenefitTitle>
              <BenefitDescription>
                Practice problems specifically designed for your target
                companies and role level
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard>
              <BenefitIcon>🤖</BenefitIcon>
              <BenefitTitle>AI-Powered Feedback</BenefitTitle>
              <BenefitDescription>
                Get instant, detailed feedback on your solutions with
                suggestions for improvement
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard>
              <BenefitIcon>📊</BenefitIcon>
              <BenefitTitle>Progress Analytics</BenefitTitle>
              <BenefitDescription>
                Track your progress with detailed analytics and identify areas
                for improvement
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard>
              <BenefitIcon>👥</BenefitIcon>
              <BenefitTitle>Expert Support</BenefitTitle>
              <BenefitDescription>
                Get help from industry experts and access to our community of
                professionals
              </BenefitDescription>
            </BenefitCard>
          </BenefitsGrid>
        </BenefitsSection>
      </PremiumContainer>
    </Layout>
  );
};

export default PremiumPage;
