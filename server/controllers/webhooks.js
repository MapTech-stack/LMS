import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import { Webhook as SvixWebhook } from "svix";

// Initialize Stripe instance (singleton pattern for serverless)
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-21", // Always use latest stable
});

// -----------------------
// Clerk Webhooks Handler
// -----------------------
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new SvixWebhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify and parse event
    const evt = whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = evt;

    switch (type) {
      case "user.created":
        await User.create({
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
          enrolledCourses: [],
        });
        break;

      case "user.updated":
        await User.findByIdAndUpdate(
          data.id,
          {
            email: data.email_addresses?.[0]?.email_address || "",
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            imageUrl: data.image_url || "",
          },
          { new: true }
        );
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;

      default:
        console.log(`Unhandled Clerk event type: ${type}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Clerk webhook error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// -----------------------
// Stripe Webhooks Handler
// -----------------------
export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Parse and verify Stripe webhook
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      // Successful checkout
      case "checkout.session.completed": {
        const session = event.data.object;
        const purchaseId = session.metadata?.purchaseId;
        if (!purchaseId) break;

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) break;

        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId);
        if (!userData || !courseData) break;

        // Add user to course enrolledStudents
        if (!courseData.enrolledStudents.includes(userData._id)) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
        }

        // Add course to user enrolledCourses
        if (!userData.enrolledCourses.includes(courseData._id)) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        // Mark purchase completed
        purchaseData.status = "completed";
        await purchaseData.save();

        console.log(`✅ Purchase ${purchaseId} marked as completed`);
        break;
      }

      // Failed payments
      case "checkout.session.async_payment_failed":
      case "payment_intent.payment_failed": {
        const session = event.data.object;
        const purchaseId = session.metadata?.purchaseId;

        if (purchaseId) {
          const purchaseData = await Purchase.findById(purchaseId);
          if (purchaseData) {
            purchaseData.status = "failed";
            await purchaseData.save();
            console.log(`❌ Purchase ${purchaseId} marked as failed`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handling error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
