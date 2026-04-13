const express = require('express');
const QRCode = require('qrcode');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(express.static('public'));

// Route to generate UPI QR code
app.post('/generate-qr', (req, res) => {
  const { name, upiId, amount, paymentType } = req.body;

  // Validate input data
  if (!name || !upiId || !amount || !paymentType) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Construct the payment link based on UPI ID and payment type
  let paymentLink = '';
  if (paymentType === 'paytm') {
    paymentLink = `paytm://upi/upi?pa=${upiId}&pn=${name}&mc=YourMerchantCode&tid=YourTransactionId&tr=YourTransactionRef&tn=Payment+for+Product&am=${amount}&cu=INR`;
  } else if (paymentType === 'googlepay') {
    paymentLink = `upi://pay?pa=${upiId}&pn=${name}&mc=YourMerchantCode&tid=YourTransactionId&tr=YourTransactionRef&tn=Payment+for+Product&am=${amount}&cu=INR`;
  } else {
    return res.status(400).json({ error: 'Invalid payment type' });
  }

  // Generate QR code for the payment link
  QRCode.toDataURL(paymentLink, (err, url) => {
    if (err) {
      return res.status(500).json({ error: 'Error generating QR code' });
    }

    // Return the QR code as a data URL
    res.json({ qrCodeUrl: url });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
