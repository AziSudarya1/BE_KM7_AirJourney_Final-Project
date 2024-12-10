export function uploadImage(_req, res) {
  const data = {
    imageUrl: res.locals.imageUrl
  };

  res.status(200).json({
    message: 'Image uploaded successfully',
    data
  });
}
