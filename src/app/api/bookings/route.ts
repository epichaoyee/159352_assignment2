import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Flight from '@/lib/models/Flight';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { flightId, passengerName, passengerEmail } = await request.json();

    if (!flightId || !passengerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    // Check capacity using embedded bookings
    const activeBookings = flight.bookings.filter((b: any) => b.status === 'booked');
    if (activeBookings.length >= flight.capacity) {
      return NextResponse.json({ error: 'Flight is already full' }, { status: 400 });
    }

    const bookingReference = Math.random().toString(36).substring(2, 10).toUpperCase();

    const newBooking = {
      _id: new mongoose.Types.ObjectId(),
      bookingReference,
      passengerName,
      passengerEmail,
      status: 'booked',
      createdAt: new Date(),
    };

    flight.bookings.push(newBooking);
    await flight.save();

    return NextResponse.json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const passengerName = searchParams.get('passengerName');

  if (!passengerName) {
    return NextResponse.json({ error: 'Passenger name is required' }, { status: 400 });
  }

  try {
    // Search for flights that have this passenger in their bookings
    const flights = await Flight.find({
      'bookings': {
        $elemMatch: {
          passengerName: { $regex: new RegExp(`^${passengerName}$`, 'i') },
          status: 'booked'
        }
      }
    });

    // Extract the specific bookings for this passenger
    const userBookings = flights.flatMap(flight => 
      flight.bookings
        .filter((b: any) => 
          b.passengerName.toLowerCase() === passengerName.toLowerCase() && 
          b.status === 'booked'
        )
        .map((b: any) => ({
          ...b.toObject(),
          flightId: flight // Include flight info for the UI
        }))
    );

    return NextResponse.json(userBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
