const axios = require('axios');

async function seed() {
  try {
    const res = await axios.get('https://zeta-connect-api.vercel.app/api/appointments');
    const appointments = res.data.data;
    
    // Find an appointment for owner 3 that might not have an invoice
    // Or just create a new appointment first!
    console.log(appointments.map(a => `ID: ${a.id}, Owner: ${a.owner_id}, Status: ${a.status}`));

  } catch (err) {
    console.error(err.message);
  }
}

seed();
