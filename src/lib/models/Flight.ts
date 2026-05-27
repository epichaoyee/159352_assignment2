import mongoose, { Schema, model, models } from 'mongoose';

export interface IBookingEmbedded {
  _id?: string;
  bookingReference: string;
  passengerName: string;
  passengerEmail?: string;
  status: 'booked' | 'cancelled';
  createdAt: Date;
}

export interface IFlight {
  _id?: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  aircraft: string;
  capacity: number;
  price: number;
  bookings: IBookingEmbedded[];
}

const BookingEmbeddedSchema = new Schema<IBookingEmbedded>({
  bookingReference: { type: String, required: true },
  passengerName: { type: String, required: true },
  passengerEmail: { type: String },
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
  createdAt: { type: Date, default: Date.now },
});

const FlightSchema = new Schema<IFlight>({
  flightNumber: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  aircraft: { type: String, required: true },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  bookings: [BookingEmbeddedSchema],
});

const Flight = models.Flight || model<IFlight>('Flight', FlightSchema);

export default Flight;
