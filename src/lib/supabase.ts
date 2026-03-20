import { createClient } from '@supabase/supabase-js';

// Fallback values for Demo/Development mode
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key';

// Initialize Supabase client with safety check
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for server-side operations (webhooks)
export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo-service-role-key';
  return createClient(supabaseUrl, serviceRoleKey);
}
