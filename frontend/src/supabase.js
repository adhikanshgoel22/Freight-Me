import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bfebcxtrnydrjyobrbdz.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmZWJjeHRybnlkcmp5b2JyYmR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzAwMDIsImV4cCI6MjA2MzUwNjAwMn0.JhHx6sCnsrToj57LHOqILt7CVUPtMA58LEvp6caS73E"

export const supabase = createClient(supabaseUrl, supabaseKey)
