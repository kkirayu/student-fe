const axios = require('axios');

async function seed() {
  try {
    const response = await axios.post('https://zeta-connect-api.vercel.app/api/invoices', {
      appointment_id: 3, // dummy appointment_id
      owner_id: 3,
      cashier_id: 1,
      payment_method: 'Tunai',
      discount: 0,
      items: [
        {
          item_type: 'Service',
          item_id: 1,
          quantity: 1,
          price: 250000
        },
        {
          item_type: 'Product',
          item_id: 2,
          quantity: 2,
          price: 50000
        }
      ]
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Success:', response.data);
  } catch (err) {
    if (err.response) {
      console.error('API Error:', err.response.data);
      
      // Try again with another appointment ID if unique constraint fails
      if (err.response.data.errors && err.response.data.errors.appointment_id) {
          try {
              const res2 = await axios.post('https://zeta-connect-api.vercel.app/api/invoices', {
                  appointment_id: Math.floor(Math.random() * 1000) + 10,
                  owner_id: 3,
                  cashier_id: 1,
                  payment_method: 'Tunai',
                  discount: 0,
                  items: [
                    {
                      item_type: 'Service',
                      item_id: 1,
                      quantity: 1,
                      price: 250000
                    }
                  ]
                }, {
                  headers: { 'Accept': 'application/json' }
                });
              console.log('Success retry:', res2.data);
          } catch(e) {
              console.error('Retry error:', e.response ? e.response.data : e.message);
          }
      }
    } else {
      console.error('Error:', err.message);
    }
  }
}

seed();
