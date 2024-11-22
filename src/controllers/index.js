export function ping(_req, res){
  res.status(200).json({ message: 'Ping successfully' });
}
