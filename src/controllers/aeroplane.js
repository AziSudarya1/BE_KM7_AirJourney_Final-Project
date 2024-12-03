import * as aeroplaneServices from '../services/aeroplane.js';

export async function createAeroplane(req, res) {
  const aeroplaneData = await aeroplaneServices.createAeroplane(req.body);

  res.status(201).json({
    message: 'aeroplane created succesfully',
    aeroplaneData
  });
}

export async function getAeroplaneById(req, res) {
  const { id } = req.params;

  const aeroplaneData = await aeroplaneServices.getAeroplaneById(id);

  res.status(200).json({
    message: 'Aeroplane retrieved by id successfully',
    data: aeroplaneData
  });
}

export async function updateAeroplane(req, res) {
  const { id } = req.params;

  const aeroplaneData = await aeroplaneServices.updateAeroplaneById(
    id,
    req.body
  );

  res.status(200).json({
    message: 'Aeroplae updated succesfully',
    data: aeroplaneData
  });
}

export async function deleteAeroplane(req, res) {
  const { id } = req.params;

  const aeroplaneData = await aeroplaneServices.deleteAeroplaneById(
    id,
    req.body
  );

  res.status(200).json({
    message: 'Aeroplae deleted succesfully',
    data: aeroplaneData
  });
}
