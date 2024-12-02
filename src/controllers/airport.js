import * as airportService from '../services/airport.js';

export async function createAirport(req, res) {
  const data = await airportService.createAirport(req.body);

  res.status(201).json({
    message: 'Airport created successfully',
    data
  });
}

export async function getAirportById(req, res) {
  const { id } = req.params;

  const data = await airportService.getAirportById(id);

  res.status(200).json({ data });
}

export async function updateAirport(req, res) {
  const { id } = req.params;

  const data = await airportService.updateAirport(id, req.body);

  res.status(200).json({
    message: 'Airport updated successfully',
    data
  });
}

export async function deleteAirport(req, res) {
  const { id } = req.params;

  await airportService.deleteAirport(id);

  res.status(200).json({
    message: 'Airport deleted successfully'
  });
}
