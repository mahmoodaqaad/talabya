import { prisma } from "@/Tools/db";
import { verifyUserToken } from "@/Tools/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

// دالة التحقق من صلاحيات الآدمين
const requireAdmin = async (request: NextRequest) => {
    const user = await verifyUserToken(request);

    if (user === "401" || user?.Role?.toLowerCase() !== "admin") {
        return null;
    }

    return user;
};

// --- [GET] جلب بيانات العميل المفرد ---
export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const user = await requireAdmin(request);
        if (!user) {
            return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 403 });
        }

        const { id } = await params;
        const customer = await prisma.customers.findUnique({ where: { id } });

        if (!customer) {
            return NextResponse.json({ message: "العميل غير موجود" }, { status: 404 });
        }

        return NextResponse.json(customer);
    } catch (error: unknown) {
        console.error("ERROR FETCHING CUSTOMER:", error);
        return NextResponse.json({ message: "حدث خطأ غير متوقع في السيرفر" }, { status: 500 });
    }
};

// --- [PATCH] تحديث بيانات العميل الشاملة ---
export const PATCH = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const user = await requireAdmin(request);
        if (!user) {
            return NextResponse.json({ message: "غير مصرح لك بإجراء التعديل" }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const { name, email, phone, address, notes, isStoreOwner, StoreName } = body;

        /* 💡 إصلاح الثغرة المنطقية (Logical Bug Fix):
          إذا قام المسؤول بإلغاء تفعيل الخيار (isStoreOwner = false)، يجب مسح اسم المتجر تلقائياً 
          من قاعدة البيانات ليصبح `null` حتى لو قام المتصفح بإرسال قيمة اسم المتجر القديمة معلقاً في الـ state.
        */
        const finalStoreName = isStoreOwner === false ? null : (StoreName !== undefined ? StoreName || null : undefined);

        const customer = await prisma.customers.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
                ...(phone !== undefined && { phone: phone || null }),
                ...(address !== undefined && { address: address || null }),
                ...(notes !== undefined && { notes: notes || null }),
                ...(isStoreOwner !== undefined && { isStoreOwner: Boolean(isStoreOwner) }),
                ...(finalStoreName !== undefined && { StoreName: finalStoreName }),
            },
        });

        return NextResponse.json({ message: "تم تحديث بيانات ملف العميل بنجاح ✨", customer });
    } catch (error: unknown) {
        console.error("ERROR UPDATING CUSTOMER:", error);

        // استخدام نظام فحص أخطاء بريزما المحترف الكود الـ KnownRequestError
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return NextResponse.json({ message: "ملف العميل المطلوب غير موجود أو تم حذفه مسبقاً" }, { status: 404 });
            }
            if (error.code === "P2002") {
                return NextResponse.json({ message: "البريد الإلكتروني أو اسم المتجر هذا مسجل مسبقاً في النظام" }, { status: 400 });
            }
        }

        return NextResponse.json({ message: "فشل الحفظ بسبب مشكلة اتصال لحظية، يرجى المحاولة مجدداً" }, { status: 500 });
    }
};

// --- [DELETE] حذف ملف العميل نهائياً ---
export const DELETE = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const user = await requireAdmin(request);
        if (!user) {
            return NextResponse.json({ message: "غير مصرح لك بالحذف" }, { status: 403 });
        }

        const { id } = await params;
        await prisma.customers.delete({ where: { id } });

        return NextResponse.json({ message: "تم حذف ملف العميل من المنظومة بنجاح" });
    } catch (error: unknown) {
        console.error("ERROR DELETING CUSTOMER:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return NextResponse.json({ message: "الملف غير موجود بالفعل" }, { status: 404 });
            }
        }

        return NextResponse.json({ message: "فشل الحذف، يرجى التحقق من الشبكة وإعادة المحاولة" }, { status: 500 });
    }
};