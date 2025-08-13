import { Svix, Webhook } from "svix";

import User from "../models/User.js";

// API controller function to manage clerk User with database

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
      case "user.created": // Handle user created event
      {
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
      case "user.updated": // Handle user updated event
      {
        const userData = {
          email: data.email_address[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": // Handle user deleted event
      {
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
