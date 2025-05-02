import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await prisma.stockHolding.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting stock:', error);
    return NextResponse.json({ error: 'Failed to delete stock' }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();

  const { ticker, name, shares, averagePrice, dividendYield, accountId } = body;

  if (!ticker || !name || !shares || !averagePrice || !accountId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const updatedStock = await prisma.stockHolding.update({
      where: { id },
      data: {
        ticker,
        name,
        shares: parseFloat(shares),
        averagePrice: parseFloat(averagePrice),
        dividendYield: parseFloat(dividendYield) || 0,
        accountId
      }
    });

    return NextResponse.json({ success: true, stock: updatedStock });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
