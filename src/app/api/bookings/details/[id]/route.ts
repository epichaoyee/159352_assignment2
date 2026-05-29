import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Flight from '@/lib/models/Flight';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const flight = await Flight.findOne({ 'bookings._id': params.id });
    if (!flight) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = (flight.bookings as any).id(params.id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...booking.toObject(),
      flightId: flight.toObject()
    });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
}
