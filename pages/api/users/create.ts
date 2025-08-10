import { NextApiResponse } from "next";
import { withRequiredAuth, AuthenticatedRequest } from "@/lib/auth";

type User = { 
  userId: string;
  email: string;
  name: string;
};

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  try {
    const { email, name } = req.body;
    
    // req.userId is guaranteed to exist due to withRequiredAuth
    const userId = req.userId!;
    
    // Your user creation logic here
    // const user: User = { userId, email, name };
    
    res.status(200).json({ 
      message: "User created",
      userId: userId 
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
}

export default withRequiredAuth(handler);