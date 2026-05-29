import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Flight from '@/lib/models/Flight';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();

  const flights = await Flight.find(
    { 'bookings.status': 'booked' },
    { 'bookings': 1 }
  ).limit(50);

  const names = new Set<string>();

  for (const flight of flights) {
    for (const booking of flight.bookings) {
      if (booking.status === 'booked' && booking.passengerName) {
        names.add(booking.passengerName);
        if (names.size >= 15) break;
      }
    }
    if (names.size >= 15) break;
  }

  return NextResponse.json({ names: Array.from(names) });
}
