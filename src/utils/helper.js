export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateJoiError(error) {
  const message = error.details.map((err) => err.message);
  return message;
}

export function calculateAmount(passengers, ticketPrice, returnFlightId) {
  let amount = 0;

  for (const passenger of passengers) {
    if (passenger.type === 'INFANT') {
      continue;
    }
    amount += ticketPrice;
  }

  if (returnFlightId) {
    amount += ticketPrice;
  }

  return amount;
}
