// src/app/api/documents/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('http://localhost:5093/api/documento');
  const documents = await res.json();
  return NextResponse.json(documents);
}