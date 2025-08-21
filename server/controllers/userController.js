// get user

import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

import Stripe from "stripe";


export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not Found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// users enrolled Courses with lecture Links

export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.auth();
    const userData = await User.findById(userId).populate("enrolledCourses");

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



// to purchase ccourse

export const purchaseCourse = async (req, res) =>{
  try {
    const {courseId} = req.body;
    const {origin} = req.headers
    const { userId } = req.auth();
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);


    if (!userData || !courseData) {
      return res.json({ success: false, message: "User or Course not found" });
      
    }

    const purchaseData ={
      courseId: courseData._id,
      userId,
      amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
    }

    const newPurchase = await Purchase.create(purchaseData);


    // Stripe gateway initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const currency = process.env.CURRENCY.toLowerCase();

    // creating line items for Stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(purchaseData.amount) * 100 // amount in cents
        },
        quantity: 1
      }
    ]

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: "payment",
      metadata:{
        purchaseId: newPurchase._id.toString(),
      }


    });

    res.json({success:true, session_url: session.url})

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}