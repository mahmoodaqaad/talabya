import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const verifyUserToken = async (req: NextRequest) => {
    try {

        const token = req.cookies.get("ip_t_s")?.value;
        if (!token) {
            return "401"
        }
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
        const userData = payload
        if (!userData) {
            return "401"
        }
        return userData as unknown as { id: string, Role: string };
    } catch (error) {
        return "401"
    }
}