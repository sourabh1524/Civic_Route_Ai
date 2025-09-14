import { NextRequest, NextResponse } from 'next/server';
import { routeComplaint } from '@/ai/flows/route-complaint-to-department';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { complaintText, complaintCategory, location } = body;

    if (!complaintText || !complaintCategory || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await routeComplaint({
      complaintText,
      complaintCategory,
      location,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error routing complaint:', error);
    return NextResponse.json(
      { error: 'Failed to route complaint' },
      { status: 500 }
    );
  }
}