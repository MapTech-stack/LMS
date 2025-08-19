import { Webhook } from "svix";
import Stripe from "stripe";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/course.js";

// Clerk Webhook
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "Svix-id": req.headers["svix-id"],
      "Svix-timestamp": req.headers["svix-timestamp"],
      "Svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0]?.email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        res.json({});
    }
  } catch (error) {
    console.error("Clerk webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Stripe
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebHooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      req.body, // ⚠️ raw body (because of express.raw above)
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      if (
        !session.data ||
        !session.data[0] ||
        !session.data[0].metadata ||
        !session.data[0].metadata.purchaseId
      ) {
        console.error(
          "Session or purchaseId not found for payment intent:",
          paymentIntentId
        );
        return res
          .status(404)
          .json({ success: false, message: "Session or purchaseId not found" });
      }

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);
      if (!purchaseData) {
        console.error("Purchase not found for purchaseId:", purchaseId);
        return res
          .status(404)
          .json({ success: false, message: "Purchase not found" });
      }

      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(
        purchaseData.courseId?.toString()
      );

      if (courseData && userData) {
        courseData.enrolledStudents.push(userData._id);
        await courseData.save();

        userData.enrolledCourses.push(courseData._id);
        await userData.save();
      } else {
        console.error("User or Course not found for purchase:", purchaseId);
        return res
          .status(404)
          .json({ success: false, message: "User or Course not found" });
      }

      purchaseData.status = "completed";
      await purchaseData.save();
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
