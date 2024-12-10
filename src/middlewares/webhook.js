import crypto from 'crypto';

export function verifyMidtransSignature(req, res, next) {
  const signatureKey = process.env.MIDTRANS_SIGNATURE_KEY;
  const { order_id, status_code, gross_amount } = req.body;

  const inputString = `${order_id}${status_code}${gross_amount}${signatureKey}`;
  const generatedSignature = crypto.createHash('sha512').update(inputString).digest('hex');

  if (req.body.signature_key !== generatedSignature) {
    return res.status(400).json({ message: 'Invalid Midtrans signature' });
  }

  next();
}
