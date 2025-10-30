// ===== SUPABASE CONFIGURATION =====
const SUPABASE_URL = 'https://erqushtknxvrgjdcqmzw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVycXVzaHRrbnh2cmdqZGNxbXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MDI1NjcsImV4cCI6MjA3NzM3ODU2N30.QR7GAfAanw9QTtq2BaprSATD-JUfCXNhCNrWiU2ElM8';

// Inicjalizacja Supabase klienta
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase client initialized');
