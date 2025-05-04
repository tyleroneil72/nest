import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  let insights = await prisma.userInsights.findUnique({ where: { userId: user.id } });

  if (!insights) {
    insights = await prisma.userInsights.create({ data: { userId: user.id } });
  }

  return NextResponse.json(insights);
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();

    const updated = await prisma.userInsights.upsert({
      where: { userId: user.id },
      update: {
        goal: body.goal,
        monthlyContribution: body.monthlyContribution,
        growthRate: body.growthRate,
        dividendYield: body.dividendYield
      },
      create: {
        userId: user.id,
        goal: body.goal,
        monthlyContribution: body.monthlyContribution,
        growthRate: body.growthRate,
        dividendYield: body.dividendYield
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/insights error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
