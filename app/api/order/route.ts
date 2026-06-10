import { prisma } from "@/Tools/db";
import { verifyUserToken } from "@/Tools/verifyToken";
import { NextRequest, NextResponse } from "next/server";

// دالة حماية التحقق من صلاحيات المسؤول (Admin)
const requireAdmin = async (request: NextRequest) => {
    const user = await verifyUserToken(request);
    if (user === "401" || !user || user.Role?.toLowerCase() !== "admin") {
        return null;
    }
    return user;
};

/**
 * 1. جلب كافة الطلبيات (GET)
 * يتضمن جلب اسم العميل واسم الكابتن المسؤول عن التوصيل للعرض في الجدول الرئيسي
 */
export const GET = async (request: NextRequest) => {
    try {
        const user = await requireAdmin(request);
        if (!user) {
            return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 403 });
        }

        const orders = await prisma.order.findMany({
            include: {
                customer: {
                    select: {
                        name: true,
                        StoreName: true,
                    },
                },
                captain: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc", // ترتيب من الأحدث إلى الأقدم
            },
        });

        return NextResponse.json(orders, { status: 200 });
    } catch (error: unknown) {
        console.error("ERROR FETCHING ORDERS:", error);
        return NextResponse.json({ message: "حدث خطأ داخلي في السيرفر" }, { status: 500 });
    }
};

/**
 * 2. إنشاء طلبية جديدة (POST)
 * تدعم: تسجيل زبون جديد فوري، سعر التوصيل، وحالات الطلب الأربعة، وتاريخ مخصص
 */
export const POST = async (request: NextRequest) => {
    try {
        const user = await requireAdmin(request);
        if (!user) {
            return NextResponse.json({ message: "غير مصرح لك بالوصول" }, { status: 403 });
        }

        const body = await request.json();
        const {
            from,
            to,
            captainId,
            CustomerId,
            content,
            notes,
            status,
            isNewCustomer,
            customerName,
            customerPhone,
            price,
            customCreatedAt,
            clientPaid,
            captainPaid
        } = body;

        // التحقق من الحقول الإجبارية للطلب
        if (!from || !to || !captainId || !content) {
            return NextResponse.json({ message: "حقول الاستلام، التسليم، الكابتن ومحتوى الشحنة مطلوبة." }, { status: 400 });
        }

        // التحقق من تحديد العميل
        if (!isNewCustomer && !CustomerId) {
            return NextResponse.json({ message: "يرجى اختيار عميل مسجل أو إدخال بيانات العميل الجديد." }, { status: 400 });
        }

        // استخدام Transaction لضمان سلامة العمليات المتتالية في قاعدة البيانات
        const order = await prisma.$transaction(async (tx) => {
            let finalCustomerId = CustomerId;

            // إذا كان العميل جديداً، نقوم بإنشائه فوراً وحفظ معرّفه
            if (isNewCustomer) {
                if (!customerName) {
                    throw new Error("اسم العميل الجديد مطلوب.");
                }
                const newCustomer = await tx.customers.create({
                    data: {
                        name: customerName,
                        phone: customerPhone || "",
                        orderCount: 1,
                    }
                });
                finalCustomerId = newCustomer.id;
            }

            // إنشاء الطلبية وربط كافة البيانات والحالات بها
            const createdOrder = await tx.order.create({
                data: {
                    from,
                    to,
                    captainId,
                    CustomerId: finalCustomerId,
                    content,
                    price: price , // تخزين قيمة سعر التوصيل كرقم عشري
                    notes: notes || "",
                    status: status || "جاري التوصيل", // الحالة التشغيلية الافتراضية
                    clientPaid: clientPaid ?? false,
                    captainPaid: captainPaid ?? false,
                    // إذا حدد الأدمن تاريخاً مخصصاً (طلبية قديمة متأخرة) يتم حفظه، وإلا يسجل تاريخ اللحظة تلقائياً
                    ...(customCreatedAt && { createdAt: new Date(customCreatedAt) }),
                },
                include: {
                    customer: true,
                    captain: true,
                },
            });

            // تحديث عدّاد طلبيات العميل إذا كان مسجلاً مسبقاً
            if (!isNewCustomer) {
                await tx.customers.update({
                    where: { id: finalCustomerId },
                    data: { orderCount: { increment: 1 } },
                });
            }

            return createdOrder;
        });

        return NextResponse.json({ message: "تم إنشاء الطلب وتعيينه بنجاح", order }, { status: 201 });
    } catch (error: unknown) {
        console.error("ERROR CREATING ORDER:", error);
        const errorMessage = error instanceof Error ? error.message : "حدث خطأ داخلي في السيرفر";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
};