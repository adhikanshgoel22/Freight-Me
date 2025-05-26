console.log('Incoming ticket payload:', req.body);

app.post('/ticket', async (req, res) => {
  const { text01, delivery_type } = req.body;

  if (!text01 || !delivery_type) {
    return res.status(400).json({ error: 'Missing text01 or delivery_type' });
  }

  try {
    // Check if the ticket exists
    const { data: existing, error: selectError } = await supabase
      .from('DeliveryUpdate')
      .select('*')
      .eq('text01', text01)
      .maybeSingle();

    if (selectError) {
      console.error('Select error:', selectError);
      return res.status(500).json({ error: 'Error checking ticket existence' });
    }

    if (!existing) {
      // Insert new ticket
      const { error: insertError } = await supabase
        .from('DeliveryUpdate')
        .insert([{ text01, delivery_type }]);

      if (insertError) {
        console.error('Insert error:', insertError);
        return res.status(500).json({ error: 'Error inserting ticket' });
      }
    } else {
      // Update delivery type
      const { error: updateError } = await supabase
        .from('DeliveryUpdate')
        .update({ delivery_type })
        .eq('text01', text01);

      if (updateError) {
        console.error('Update error:', updateError);
        return res.status(500).json({ error: 'Error updating delivery type' });
      }
    }

    return res.status(200).json({ success: true, message: 'Ticket updated' });
  } catch (err) {
    console.error('Unhandled error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
});
