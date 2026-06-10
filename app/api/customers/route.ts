import { prisma } from "@/Tools/db";
import { verifyUserToken } from "@/Tools/verifyToken";
import { NextRequest, NextResponse } from "next/server";

const requireAdmin = async (request: NextRequest) => {
    const user = await verifyUserToken(request);

    if (user === "401" || user?.Role?.toLowerCase() !== "admin") {
        return null;
    }

    return user;
};

const getErrorCode = (error: unknown) =>
    typeof error === "object" && error !== null && "code" in error
        ? (error as { code?: string }).code
        : undefined;

export const GET = async (request: NextRequest) => {
    try {
        const user = await requireAdmin(request);

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const customers = await prisma.customers.findMany({
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { customerOrders: true } } },
        });

        return NextResponse.json(customers);
    } catch (error) {
        console.error("ERROR GETTING CUSTOMERS:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};

export const POST = async (request: NextRequest) => {
    try {
        const user = await requireAdmin(request);

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await request.json();
        const { name, email, phone, address, notes, isStoreOwner, StoreName } = body;

        if (!name || !email) {
            return NextResponse.json({ message: "Name and email are required." }, { status: 400 });
        }

        const customer = await prisma.customers.create({
            data: {
                name,
                email,
                phone: phone || null,
                address: address || null,
                notes: notes || null,
                isStoreOwner: Boolean(isStoreOwner),
                StoreName: isStoreOwner ? StoreName || null : null,
            },
        });

        return NextResponse.json({ message: "Customer created successfully", customer }, { status: 201 });
    } catch (error: unknown) {
        console.error("ERROR CREATING CUSTOMER:", error);
        const code = getErrorCode(error);

        if (code === "P2002") {
            return NextResponse.json({ message: "Email or store name already exists." }, { status: 400 });
        }

        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};
