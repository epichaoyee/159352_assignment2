import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Flight, { IFlight } from '@/lib/models/Flight';
import { AIRCRAFT } from '@/lib/constants';
import { addDays, startOfWeek, setHours, setMinutes, addHours } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();

  // Clear existing flights
  const deleteResult = await Flight.deleteMany({});
  console.log(`Deleted ${deleteResult.deletedCount} existing flights.`);

  // Read passengers from CSV
  const csvPath = path.join(process.cwd(), '..', 'randomnames.csv');
  let passengers: { name: string; email: string }[] = [];
  
  try {
    const csvData = fs.readFileSync(csvPath, 'utf8');
    passengers = csvData.split(/\r?\n/)
      .filter(line => line.trim() !== '')
      .map(line => {
        const parts = line.split(',');
        if (parts.length < 6) return null;
        // Format: id,Title,FirstName,LastName,Gender,Email
        const firstName = parts[2].trim();
        const lastName = parts[3].trim();
        const email = parts[5].trim();
        return {
          name: `${firstName} ${lastName}`,
          email: email
        };
      })
      .filter((p): p is { name: string; email: string } => p !== null);
  } catch (error) {
    console.error('Error reading CSV:', error);
    // Fallback if file not found
    passengers = [{ name: 'Test Passenger', email: 'test@example.com' }];
  }

  const flights: any[] = []; // Using any[] temporarily to avoid strict Mongoose/TS interface conflicts during seed
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });



  for (let week = 0; week < 4; week++) {
    const weekStart = addDays(startDate, week * 7);

    // Helper to create initial bookings
    const createRandomBookings = (capacity: number) => {
      const numBookings = Math.floor(Math.random() * (capacity - 1)); // Leave at least one seat
      const result = [];
      for (let i = 0; i < numBookings; i++) {
        const p = passengers[Math.floor(Math.random() * passengers.length)];
        result.push({
          bookingReference: Math.random().toString(36).substring(2, 10).toUpperCase(),
          passengerName: p.name,
          passengerEmail: p.email,
          status: 'booked' as const,
          createdAt: new Date()
        });
      }
      return result;
    };

    // Sydney (YSSY)
    const sydOut = fromZonedTime(setMinutes(setHours(addDays(weekStart, 4), 10), 30), 'Pacific/Auckland');
    const sydIn = fromZonedTime(setMinutes(setHours(addDays(weekStart, 6), 15), 0), 'Australia/Sydney');
    
    flights.push({
      flightNumber: `DF${100 + week}1`,
      origin: 'NZNE',
      destination: 'YSSY',
      departureTime: sydOut,
      arrivalTime: addHours(sydOut, 3.5),
      aircraft: 'SJ30i',
      capacity: AIRCRAFT.SJ30i.capacity,
      price: 1200,
      bookings: createRandomBookings(AIRCRAFT.SJ30i.capacity)
    });
    flights.push({
      flightNumber: `DF${100 + week}2`,
      origin: 'YSSY',
      destination: 'NZNE',
      departureTime: sydIn,
      arrivalTime: addHours(sydIn, 3),
      aircraft: 'SJ30i',
      capacity: AIRCRAFT.SJ30i.capacity,
      price: 1200,
      bookings: createRandomBookings(AIRCRAFT.SJ30i.capacity)
    });

    // Rotorua (NZRO)
    for (let d = 0; d < 5; d++) {
      const day = addDays(weekStart, d);
      const times = [
        { h: 7, m: 0, out: true },
        { h: 8, m: 15, out: false },
        { h: 16, m: 30, out: true },
        { h: 18, m: 0, out: false }
      ];
      times.forEach((t, idx) => {
        const time = fromZonedTime(setMinutes(setHours(day, t.h), t.m), 'Pacific/Auckland');
        flights.push({
          flightNumber: `DF${200 + week}${d}${idx + 1}`,
          origin: t.out ? 'NZNE' : 'NZRO',
          destination: t.out ? 'NZRO' : 'NZNE',
          departureTime: time,
          arrivalTime: addHours(time, 0.75),
          aircraft: 'SF50',
          capacity: AIRCRAFT.SF50.capacity,
          price: 250,
          bookings: createRandomBookings(AIRCRAFT.SF50.capacity)
        });
      });
    }

    // Great Barrier (NZGB)
    [0, 2, 4].forEach((d, idx) => {
      const outTime = fromZonedTime(setMinutes(setHours(addDays(weekStart, d), 9), 0), 'Pacific/Auckland');
      flights.push({
        flightNumber: `DF30${week}${idx}1`,
        origin: 'NZNE',
        destination: 'NZGB',
        departureTime: outTime,
        arrivalTime: addHours(outTime, 0.5),
        aircraft: 'SF50',
        capacity: AIRCRAFT.SF50.capacity,
        price: 180,
        bookings: createRandomBookings(AIRCRAFT.SF50.capacity)
      });
    });
    [1, 3, 5].forEach((d, idx) => {
      const inTime = fromZonedTime(setMinutes(setHours(addDays(weekStart, d), 9), 0), 'Pacific/Auckland');
      flights.push({
        flightNumber: `DF30${week}${idx}2`,
        origin: 'NZGB',
        destination: 'NZNE',
        departureTime: inTime,
        arrivalTime: addHours(inTime, 0.5),
        aircraft: 'SF50',
        capacity: AIRCRAFT.SF50.capacity,
        price: 180,
        bookings: createRandomBookings(AIRCRAFT.SF50.capacity)
      });
    });

    // Chatham Islands (NZCI)
    [1, 4].forEach((d, idx) => {
      const outTime = fromZonedTime(setMinutes(setHours(addDays(weekStart, d), 10), 0), 'Pacific/Auckland');
      flights.push({
        flightNumber: `DF40${week}${idx}1`,
        origin: 'NZNE',
        destination: 'NZCI',
        departureTime: outTime,
        arrivalTime: addHours(outTime, 2.5),
        aircraft: 'HondaJet',
        capacity: AIRCRAFT.HondaJet.capacity,
        price: 450,
        bookings: createRandomBookings(AIRCRAFT.HondaJet.capacity)
      });
    });
    [2, 5].forEach((d, idx) => {
      const inTime = fromZonedTime(setMinutes(setHours(addDays(weekStart, d), 10), 0), 'Pacific/Chatham');
      flights.push({
        flightNumber: `DF40${week}${idx}2`,
        origin: 'NZCI',
        destination: 'NZNE',
        departureTime: inTime,
        arrivalTime: addHours(inTime, 2.2),
        aircraft: 'HondaJet',
        capacity: AIRCRAFT.HondaJet.capacity,
        price: 450,
        bookings: createRandomBookings(AIRCRAFT.HondaJet.capacity)
      });
    });

    // Lake Tekapo (NZTL)
    const tekOut = fromZonedTime(setMinutes(setHours(addDays(weekStart, 0), 11), 0), 'Pacific/Auckland');
    const tekIn = fromZonedTime(setMinutes(setHours(addDays(weekStart, 1), 11), 0), 'Pacific/Auckland');
    flights.push({
      flightNumber: `DF50${week}1`,
      origin: 'NZNE',
      destination: 'NZTL',
      departureTime: tekOut,
      arrivalTime: addHours(tekOut, 1.5),
      aircraft: 'HondaJet',
      capacity: AIRCRAFT.HondaJet.capacity,
      price: 350,
      bookings: createRandomBookings(AIRCRAFT.HondaJet.capacity)
    });
    flights.push({
      flightNumber: `DF50${week}2`,
      origin: 'NZTL',
      destination: 'NZNE',
      departureTime: tekIn,
      arrivalTime: addHours(tekIn, 1.5),
      aircraft: 'HondaJet',
      capacity: AIRCRAFT.HondaJet.capacity,
      price: 350,
      bookings: createRandomBookings(AIRCRAFT.HondaJet.capacity)
    });
  }

  await Flight.insertMany(flights);

  return NextResponse.json({ 
    message: `Successfully seeded ${flights.length} flights with random bookings from ${passengers.length} passengers.` 
  });
}
