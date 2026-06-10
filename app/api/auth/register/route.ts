import {prisma} from "@/Tools/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {SignJWT} from "jose";
export const POST = async (req: NextRequest) => {

    try {
        const { name, email, password, address, phone } = await req.json();

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 })
        }
        const newPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: newPassword,
                address,
                phone,
                Role: "User"
            }
        })
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);
        const token = await new SignJWT({
            id: newUser.id,
            email: newUser.email,
            Role: newUser.Role // أضفنا الـ Role هنا عشان الميدلوير يشوفها
        })
            .setProtectedHeader({ alg: "HS256" }) // تحديد خوارزمية التشفير (إجباري في jose)
            .setExpirationTime("10d")            // مدة الصلاحية
            .sign(secretKey);
        const response = NextResponse.json({ message: "User created successfully", token, Role: newUser.Role }, { status: 201 })

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