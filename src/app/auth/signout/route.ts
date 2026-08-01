import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const url = new URL(request.url);
  const response = NextResponse.redirect(`${url.origin}/login`, {
    status: 302,
  });
  response.cookies.delete('vos_founder_code');
  response.cookies.delete('vansh_founder_auth');
  return response;
}
