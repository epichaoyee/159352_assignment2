import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Flight from '@/lib/models/Flight';

export async function DELETE(
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

    if (booking.status === 'cancelled') {
      return NextResponse.json({ error: 'Booking is already cancelled' }, { status: 400 });
    }

    booking.status = 'cancelled';
    await flight.save();

    return NextResponse.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
