export function isValidGoogleOauthCode(req, res, next) {
  const { code } = req.query;

  if (!code) {
    res.status(400).json({
      message: 'Code is required'
    });
    return;
  }

  if (typeof code !== 'string') {
    res.status(400).json({
      message: 'Code must be string'
    });
    return;
  }

  next();
}
