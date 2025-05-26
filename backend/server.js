import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bcrypt from 'bcrypt'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_ANON_KEY
)

const PORT = process.env.PORT || 5000

// ✅ REGISTER SERVER USER (username + password only)
app.post('/server-register', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  try {
    // Check if username exists
    const { data: existingUser, error: selectError } = await supabase
      .from('server_users')
      .select('*')
      .eq('username', username)
      .single()

    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data: newUser, error: insertError } = await supabase
      .from('server_users')
      .insert([{ username, password: hashedPassword }])
      .select()
      .single()

    if (insertError) throw insertError

    // Don't send password back in response
    delete newUser.password

    res.status(201).json({ message: 'Server user registered', user: newUser })
  } catch (err) {
    console.error('Server register error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ✅ LOGIN Endpoint (From Supabase Table)
app.post('/login', async (req, res) => {
  const { email, password } = req.body

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  res.status(200).json({ message: 'Login successful', user })
})

// POST /server-login
app.post('/server-login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' })

  try {
    const { data: user, error } = await supabase
      .from('server_users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    delete user.password
    res.status(200).json({ user })
  } catch (err) {
    console.error('Server login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ✅ GET all tickets
app.get('/tickets', async (req, res) => {
  try {
    const { data, error } = await supabase.from('DeliveryUpdate').select('*')
    if (error) throw error

    res.status(200).json({ tickets: data })
  } catch (err) {
    console.error('Fetch tickets error:', err)
    res.status(500).json({ error: 'Failed to fetch tickets' })
  }
})

// ✅ Create or Update Ticket
app.post('/ticket', async (req, res) => {
  const { text01, delivery_type } = req.body

  if (!text01 || !delivery_type) {
    return res.status(400).json({ error: 'text01 and delivery_type are required' })
  }

  try {
    const { data: existing, error: selectError } = await supabase
      .from('DeliveryUpdate')
      .select('*')
      .eq('text01', text01)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError
    }

    if (!existing) {
      const { data: insertData, error: insertError } = await supabase
        .from('DeliveryUpdate')
        .insert([{ text01, delivery_type }])
        .select()

      if (insertError) throw insertError

      return res.status(201).json({ message: 'Ticket created', ticket: insertData[0] })
    } else {
      const { data: updateData, error: updateError } = await supabase
        .from('DeliveryUpdate')
        .update({ delivery_type })
        .eq('text01', text01)
        .select()

      if (updateError) throw updateError

      return res.status(200).json({ message: 'Ticket updated', ticket: updateData[0] })
    }
  } catch (err) {
    console.error('Ticket error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
