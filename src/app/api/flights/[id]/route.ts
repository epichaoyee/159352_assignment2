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
       const flight = await Flight.findById(params.id);
    if (!flight) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }
       return NextResponse.json(flight);
  } catch (error) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
}
