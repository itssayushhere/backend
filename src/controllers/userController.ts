import { prisma } from "../config/db.ts";
import { sendResponse } from "../utils/sendResponse.ts";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        profilePhoto: true,
        bio: true,
        DOB: true,
        gender: true,
      },
    });

    return sendResponse(res, 200, "Users fetched successfully", { users });
  } catch (error: any) {
    console.error("Get Users error:", error);
    return sendResponse(res, 500, "Internal server error", null, {
      message: error?.message ?? String(error),
    });
  }
}