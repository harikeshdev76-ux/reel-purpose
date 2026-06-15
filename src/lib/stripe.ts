import Stripe from "stripe";

// Pin the API version per spec. The installed SDK strongly types `apiVersion`
// to its own pinned literal, so cast through the constructor's config type to
// honor the requested version without a type mismatch.
const apiVersion = "2024-06-20" as unknown as NonNullable<
  ConstructorParameters<typeof Stripe>[1]
>["apiVersion"];

// STRIPE_SECRET_KEY is empty in .env until Mike provides it. A non-empty
// placeholder lets the client construct without throwing on import — real API
// calls will fail with an auth error until a valid key is set.
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  { apiVersion },
);
