import * as airlineServices from '../services/airline.js';

export async function createAirline(req, res) {
  const airlineData = await airlineServices.createAirline(req.body);

  res.status(201).json({
    message: 'Airline created successfully',
    airlineData
  });
}

export async function getAirlineById(req, res) {
  const { id } = req.params;

  const airlineData = await airlineServices.getAirlineById(id);

  res.status(200).json({
    message: 'Airline retrieved by ID successfully',
    data: airlineData
  });
}

export async function updateAirline(req, res) {
  const { id } = req.params;

  const airlineData = await airlineServices.updateAirlineById(id, req.body);

  res.status(200).json({
    message: 'Airline updated successfully',
    data: airlineData
  });
}

export async function deleteAirline(req, res) {
  const { id } = req.params;

  const airlineData = await airlineServices.deleteAirlineById(id);

  res.status(200).json({
    message: 'Airline deleted successfully',
    data: airlineData
  });
}
