// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gizfqnsngaqfbgyygkll.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpemZxbnNuZ2FxZmJneXlna2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2ODU0MjYsImV4cCI6MjA2MDI2MTQyNn0.df8oR7iuJKMMK1agIIx9-eYphsw79If04w6lnizVPE0'; // use your full anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
