import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createPaymentIntent(
  amountInCents: number,
  orderId: string
): Promise<string> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    metadata: { orderId },
  });

  return paymentIntent.client_secret!;
}

export default stripe;
