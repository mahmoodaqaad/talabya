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

export const PATCH = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const user = await requireAdmin(request);

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const { name, email, phone, address, notes, bike } = body;

        const captain = await prisma.captain.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
                ...(phone !== undefined && { phone: phone || null }),
                ...(address !== undefined && { address: address || null }),
                ...(notes !== undefined && { notes: notes || null }),
                ...(bike !== undefined && { bike: bike || null }),
            },
        });

        return NextResponse.json({ message: "Captain updated successfully", captain });
    } catch (error: unknown) {
        console.error("ERROR UPDATING CAPTAIN:", error);
        const code = getErrorCode(error);

        if (code === "P2025") {
            return NextResponse.json({ message: "Captain not found" }, { status: 404 });
        }

        if (code === "P2002") {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 });
        }

        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};

export const DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const user = await requireAdmin(request);

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;

        await prisma.captain.delete({ where: { id } });

        return NextResponse.json({ message: "Captain deleted successfully" });
    } catch (error: unknown) {
        console.error("ERROR DELETING CAPTAIN:", error);
        const code = getErrorCode(error);

        if (code === "P2025") {
            return NextResponse.json({ message: "Captain not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};
