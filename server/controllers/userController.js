import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Get authenticated user data
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId).lean();

    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get user enrolled courses
export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId).populate("enrolledCourses").lean();

    res.json({ success: true, enrolledCourses: user.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Purchase a course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const { userId } = req.auth();

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "User or Course not found" });
    }

    const amount = parseFloat(
      (courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)
    );

    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount,
      status: "pending",
    });

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: [
        {
          price_data: {
            currency: process.env.CURRENCY.toLowerCase(),
            product_data: { name: courseData.courseTitle },
            unit_amount: Math.round(amount * 100), // amount in cents
          },
          quantity: 1,
        },
      ],
      metadata: { purchaseId: newPurchase._id.toString() },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
