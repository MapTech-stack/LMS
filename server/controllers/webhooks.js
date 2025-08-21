import { Svix, Webhook } from "svix";

import User from "../models/User.js";

import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

// API controller function to manage clerk User with database

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        // Handle user created event
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }
      case "user.updated": {
        // Handle user updated event
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        // Handle user deleted event
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        // Handle unknown event type

        break;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  //   switch (event.type) {
  //     case "checkout.session.completed":
  //       const session = event.data.object;
  //       console.log("Payment was successful!");
  //       break;
  //     // ... handle other event types
  //     default:
  //       console.warn(`Unhandled event type: ${event.type}`);
  //   }

  //   response.json({ received: true });
  // };

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      // console.log("payment was successful")
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);

      const userData = await User.findById(purchaseData.userId);

      const courseData = await Course.findById(
        purchaseData.courseId.toString()
      );

      courseData.enrolledStudents.push(userData);
      await courseData.save();
      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      purchaseData.status = "completed";
      await purchaseData.save();

      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      // console.log("payment was successful")
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      purchaseData.status = "failed";
      await purchaseData.save();

      break;
    }
    default:
      console.log(`unhandled event type ${event.type}`);
      break;
  }

  response.json({ received: true });
};
