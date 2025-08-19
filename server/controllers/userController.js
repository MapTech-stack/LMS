import express from "express";
import User from "../models/User.js";
import Course from "../models/course.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";

// get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// to get user enrolled courses with lecture links

export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate("enrolledCourses");
    res
      .status(200)
      .json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found" });
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,

      // amount: (
      //   courseData.coursePrice -
      //   (courseData.discount * courseData.coursePrice) / 100
      // ).toFixed(2),

      amount: Number(
        (
          courseData.coursePrice -
          (courseData.discount * courseData.coursePrice) / 100
        ).toFixed(2)
      ),
    };

    const newPurchase = await Purchase.create(purchaseData);

    // stripe Getway initialize
    if (!process.env.STRIPE_SECRET_KEY || !process.env.CURRENCY) {
      return res.status(500).json({ success: false, message: "Stripe configuration missing" });
    }
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    // creating line items for stripe
    const lineItems = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          unit_amount: Math.round(newPurchase.amount * 100),
            // images: [courseData.thumbnail],
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];

    // create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      // payment_method_types: ["card"],
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: lineItems,
      mode: "payment",
      metadata: {
        // userId: userData._id,
        // courseId: courseData._id,
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
