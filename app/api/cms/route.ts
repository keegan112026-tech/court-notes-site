import { NextResponse } from 'next/server';
import { fetchAllCMS } from '@/lib/notion';

export const revalidate = 60; // ISR: regenerate every 60s

export async function GET() {
    try {
        const cms = await fetchAllCMS();
        return NextResponse.json({ ok: true, data: cms });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
