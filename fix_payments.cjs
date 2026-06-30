const axios = require('axios');

async function fixPayments() {
  try {
    const res = await axios.get('https://zeta-connect-api.vercel.app/api/invoices');
    const invoices = res.data.data?.data || res.data.data || res.data;
    
    // Cari invoice yang Paid tapi tidak punya payment
    const missingPayments = invoices.filter(inv => inv.status === 'Paid' && (!inv.payments || inv.payments.length === 0));
    
    console.log(`Found ${missingPayments.length} invoices missing payments.`);
    
    for (const inv of missingPayments) {
      console.log(`Fixing payment for ${inv.id}...`);
      
      // Update the invoice to Unpaid temporarily so we can create a payment
      await axios.put(`https://zeta-connect-api.vercel.app/api/invoices/${inv.id}`, {
        status: 'Unpaid'
      });
      
      // Now post the payment
      const paymentData = {
        invoice_id: inv.id,
        cashier_id: inv.owner_id || 1, // Fallback
        payment_method: inv.payment_method || 'Tunai',
        amount_paid: inv.total_amount,
        notes: 'Auto-fixed from previous frontend bug'
      };
      
      await axios.post('https://zeta-connect-api.vercel.app/api/payments', paymentData, {
        headers: { 'Accept': 'application/json' }
      });
      console.log(`Fixed ${inv.id}`);
    }
  } catch (err) {
    console.error(err.message);
    if (err.response) {
      console.error(err.response.data);
    }
  }
}

fixPayments();
