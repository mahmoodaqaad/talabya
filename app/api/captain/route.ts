import { prisma } from '@/Tools/db'
import { verifyUserToken } from '@/Tools/verifyToken'
import { NextRequest, NextResponse } from 'next/server'

const requireAdmin = async (request: NextRequest) => {
    const user = await verifyUserToken(request)

    if (user === "401" || user?.Role?.toLowerCase() !== "admin") {
        return null
    }

    return user
}

const getErrorCode = (error: unknown) =>
    typeof error === "object" && error !== null && "code" in error
        ? (error as { code?: string }).code
        : undefined

export async function POST(request: NextRequest) {
    try {
        const user = await requireAdmin(request)

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }

        const body = await request.json()
        const { name, email, phone, address, notes, bike, area } = body

        if (!name ||!phone) {
            return NextResponse.json(
                { message: 'Name and Phone are required.' },
                { status: 400 }
            )
        }

        const existCap = await prisma.captain.findFirst({
            where: {
                OR: [
                    { name },
                    { phone }

                ]
            },
            select: {
                id: true,
                name: true,
                phone: true
            }
        })

        if (existCap && existCap.name===name && existCap.phone===phone) return NextResponse.json({ message: "هذا الكابتن موجود في القاعدة", existCap },{status:400})
        if (existCap && existCap.name===name) return NextResponse.json({ message: "هذا الاسم موجود في القاعدة", existCap },{status:400})
        if (existCap && existCap.phone === phone) return NextResponse.json({ message: "هذا الرقم موجود في القاعدة", existCap },{status:400})
        const newCaptain = await prisma.captain.create({
            data: {
                name,
                email: email || null,
                bike: bike || null,
                phone: phone || null,
                Area: area, address: address || null,
                notes: notes || null,
            }
        })

        return NextResponse.json(
            { message: 'تم تسجيل الكابتن بنجاح', captain: newCaptain },
            { status: 201 }
        )

    } catch (error: unknown) {
        console.error("ERROR IN CAPTAIN ROUTE:", error)
        const code = getErrorCode(error)

        if (code === 'P2002') {
            return NextResponse.json(
                { message: 'This email is already used by another captain.' },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
export const GET = async (req: NextRequest) => {

    try {

        const user = await requireAdmin(req)

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
        }

        const captain = await prisma.captain.findMany({
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { Orders: true } } }
        })

        return NextResponse.json(captain, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
