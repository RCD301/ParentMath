import { onCall } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import Stripe from "stripe";

setGlobalOptions({ maxInstances: 10 });
admin.initializeApp();

// Define secrets (NO process.env)
const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");
const STRIPE_PRICE_ID = defineSecret("STRIPE_PRICE_ID");

export const createCheckoutSession = onCall(
  {
    secrets: [STRIPE_SECRET_KEY, STRIPE_PRICE_ID],
  },
  async (request) => {
    if (!request.auth) {
      throw new Error("User must be logged in");
    }

    const uid = request.auth.uid;

    const stripe = new Stripe(STRIPE_SECRET_KEY.value());

    const userRef = admin.firestore().doc(`users/${uid}`);
    const userSnap = await userRef.get();

    let customerId = userSnap.data()?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { uid },
      });

      customerId = customer.id;
      await userRef.set(
        { stripeCustomerId: customerId },
        { merge: true }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: STRIPE_PRICE_ID.value(),
          quantity: 1,
        },
      ],
      success_url: "https://parentmath.com/success",
      cancel_url: "https://parentmath.com",
      metadata: { uid },
    });

    return { url: session.url };
  }
);