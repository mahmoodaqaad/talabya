import { prisma } from "@/Tools/db";
import { verifyUserToken } from "@/Tools/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const userData = await verifyUserToken(req);
// return NextResponse.json(userData)
        if (userData=="401") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({
            where: {
                id: userData?.id
            }
        })
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }

}