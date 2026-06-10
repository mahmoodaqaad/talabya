import { prisma } from '@/Tools/db';
import { NextRequest, NextResponse } from 'next/server';


export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch expenses', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, amount } = body;

    if (!title || amount === undefined || isNaN(amount)) {
      return NextResponse.json({ error: 'Title and amount are required' }, { status: 400 });
    }

    const newExpense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount.toString()),
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('Failed to create expense', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
    }

    await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Expense deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete expense', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
