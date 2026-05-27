import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Flight from '@/lib/models/Flight';
import { AIRPORTS } from '@/lib/constants';
import { startOfDay, endOfDay } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orig = searchParams.get('orig');
  const dest = searchParams.get('dest');
  const date1 = searchParams.get('date1');
  const date2 = searchParams.get('date2');

  if (!orig || !dest || !date1) {
    return NextResponse.json({ error: 'Missing required search parameters (orig, dest, date1)' }, { status: 400 });
  }

  const airport = AIRPORTS[orig as keyof typeof AIRPORTS];
  if (!airport) {
    return NextResponse.json({ error: 'Invalid origin airport' }, { status: 400 });
  }

  await dbConnect();

  // Parse the date string as being in the airport's timezone
  // date1 is YYYY-MM-DD
  const start = fromZonedTime(`${date1} 00:00:00`, airport.tz);
  const end = fromZonedTime(`${date2 || date1} 23:59:59`, airport.tz);
  
  let query: any = {
    origin: orig,
    destination: dest,
    departureTime: { $gte: start, $lte: end },
  };

  const flights = await Flight.find(query).sort({ departureTime: 1 });

  return NextResponse.json(flights);
}
