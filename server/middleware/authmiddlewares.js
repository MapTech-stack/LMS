import { clerkClient } from "@clerk/express";

// middleware (protect educator route)

export const protectEducator = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const response = await clerkClient.users.getUser(userId);
    if (response.publicMetadata.role !== "educator") {
      return res.json({ success: false, message: "Access denied" });
    }
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
