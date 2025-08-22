import { clerkClient } from "@clerk/express";

// Protect educator routes
export const protectEducator = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata.role !== "educator") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
