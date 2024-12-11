export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateJoiError(error) {
  const message = error.details.map((err) => err.message);
  return message;
}

export function calculateAmount(
  passengers,
  departurePrice,
  returnPrice,
  returnFlightId
) {
  const nonInfantPassengers = passengers.filter(
    (passenger) => passenger.type !== 'INFANT'
  ).length;

  const total =
    nonInfantPassengers * (departurePrice + (returnFlightId ? returnPrice : 0));

  return total;
}
