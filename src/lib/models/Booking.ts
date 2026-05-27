import mongoose, { Schema, model, models } from 'mongoose';

export interface IBooking {
  _id: string;
  bookingReference: string;
  flightId: mongoose.Types.ObjectId;
  passengerName: string;
  passengerEmail?: string;
  status: 'booked' | 'cancelled';
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  bookingReference: { type: String, required: true, unique: true },
  flightId: { type: Schema.Types.ObjectId, ref: 'Flight', required: true },
  passengerName: { type: String, required: true },
  passengerEmail: { type: String },
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
  createdAt: { type: Date, default: Date.now },
});

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
