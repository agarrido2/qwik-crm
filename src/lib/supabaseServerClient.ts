import { createServerClient } from 'supabase-auth-helpers-qwik';
import type { RequestEvent, RequestEventLoader } from '@builder.io/qwik-city';

export const getSupabaseServerClient = (event: RequestEventLoader) => {
  return createServerClient(
    event.env.get('PUBLIC_SUPABASE_URL')!,
    event.env.get('PUBLIC_SUPABASE_ANON_KEY')!,
    {
      request: event.request,
      // @ts-expect-error QwikCity RequestEventLoader es válido para auth helpers
      response: event as unknown as RequestEvent,
    }
  );
};
