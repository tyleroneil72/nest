import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { ticker, name, shares, averagePrice, dividendYield, accountId } = body;

  if (!ticker || !name || !shares || !averagePrice || !accountId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newStock = await prisma.stockHolding.create({
      data: {
        ticker,
        name,
        shares: parseFloat(shares),
        averagePrice: parseFloat(averagePrice),
        dividendYield: parseFloat(dividendYield) || 0,
        accountId
      }
    });

    return NextResponse.json({ success: true, stock: newStock });
  } catch (error) {
    console.error('Error creating stock:', error);
    return NextResponse.json({ error: 'Failed to create stock' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        portfolios: {
          include: { stocks: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ stocks: [] });
    }

    const stocks = user.portfolios.flatMap((portfolio) =>
      portfolio.stocks.map((stock) => ({
        id: stock.id,
        ticker: stock.ticker,
        name: stock.name,
        shares: stock.shares,
        avgPrice: stock.averagePrice,
        dividendYield: stock.dividendYield,
        account: portfolio.name,
        accountId: stock.accountId,
        value: stock.shares * stock.averagePrice
      }))
    );

    return NextResponse.json({ stocks });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
  }
}
