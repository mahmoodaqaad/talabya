import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  {prisma}  from "@/Tools/db";
import { SignJWT } from "jose";
export const POST = async (req: NextRequest) => {

    try {
        const { email, password } = await req.json();

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                Role: true,
                email: true,
                password: true
            }
        })
        if (!existingUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }
        const Password = await bcrypt.compare(password, existingUser.password);
        if (!Password) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 })
        }

        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);
        const token = await new SignJWT({
            id: existingUser.id,
            email: existingUser.email,
            Role: existingUser.Role
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("10d")
            .sign(secretKey);

        const response = NextResponse.json({ message: "User logged in successfully", token, Role: existingUser.Role }, { status: 200     })

        response.cookies.set("ip_t_s", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 10

        })
        return response
    } catch (error) {

        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })

    }

}