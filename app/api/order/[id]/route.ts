import { prisma } from "@/Tools/db";
import { verifyUserToken } from "@/Tools/verifyToken";
import { NextRequest, NextResponse } from "next/server";

const requireAdmin = async (request: NextRequest) => {
    const user = await verifyUserToken(request);
    return user === "401" || user?.Role?.toLowerCase() !== "admin" ? null : user;
};

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const user = await requireAdmin(request);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        // 👈 فك تغليف params لأنها Promise في إصدارات Next.js الحديثة
        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id: id },
            include: { customer: true, captain: true }
        });

        if (!order) return NextResponse.json({ message: "الطلب غير موجود", id }, { status: 404 });
        return NextResponse.json(order);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};

// تحديث جزئي أو شامل (حالة، طلب، عميل، كابتن)
export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const user = await requireAdmin(request);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        // 👈 فك تغليف params هنا أيضاً
        const { id } = await params;

        const body = await request.json();
        const {
            from, to, captainId, content, notes, status, price, createdAt,
            customerName, customerPhone,
            captainName, captainPhone,
            clientPaid, captainPaid, captainPrice,
            

        } = body;

        const updatedData = await prisma.$transaction(async (tx) => {
            // 1. تحديث الطلب الأساسي
            const order = await tx.order.update({
                where: { id: id },
                data: {
                    ...(from && { from }),
                    ...(to && { to }),
                    ...(captainId && { captainId }),
                    ...(content && { content }),
                    ...(notes !== undefined && { notes }),
                    ...(status && { status }),
                    ...(price !== undefined && { price }),
                    ...(createdAt && { createdAt: new Date(createdAt) }),
                    ...(clientPaid !== undefined && { clientPaid }),
                    ...(captainPaid !== undefined && { captainPaid }),
                    ...(captainId && { captainPrice: Number(captainPrice) || Number(price) * 0.65 })
                }
            });

            // 2. تحديث بيانات العميل المرتبط بالطلب إذا أُرسلت
            if (customerName || customerPhone) {
                await tx.customers.update({
                    where: { id: order.CustomerId },
                    data: {
                        ...(customerName && { name: customerName }),
                        ...(customerPhone !== undefined && { phone: customerPhone })
                    }
                });
            }

            // 3. تحديث بيانات الكابتن المرتبط بالطلب إذا أُرسلت
            if ((captainName || captainPhone) && order.captainId) {
                await tx.captain.update({
                    where: { id: order.captainId },
                    data: {
                        ...(captainName && { name: captainName }),
                        ...(captainPhone !== undefined && { phone: captainPhone })
                    }
                });
            }

            return order;
        });

        return NextResponse.json({ message: "تم تحديث البيانات بنجاح", updatedData });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};

// حذف الطلب
export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const user = await requireAdmin(request);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

        // 👈 فك تغليف params هنا أيضاً
        const { id } = await params;

        await prisma.order.delete({ where: { id: id } });
        return NextResponse.json({ message: "تم حذف الطلب بنجاح" });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};
