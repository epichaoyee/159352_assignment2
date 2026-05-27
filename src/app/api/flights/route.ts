import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Flight from '@/lib/models/Flight';
import { startOfDay, endOfDay } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const dateStr = searchParams.get('date');

  if (!origin || !destination || !dateStr) {
    return NextResponse.json({ error: 'Missing required search parameters' }, { status: 400 });
  }

  await dbConnect();

  const searchDate = new Date(dateStr);
  const start = startOfDay(searchDate);
  const end = endOfDay(searchDate);

  const flights = await Flight.find({
    origin,
    destination,
    departureTime: { $gte: start, $lte: end },
  }).sort({ departureTime: 1 });

  return NextResponse.json(flights);
}
