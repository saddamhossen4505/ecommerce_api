// Create custom errorHandler.
export const errorHandler = (error, req, res, next) => {
  // statusCode.
  const status = res.statusCode ? res.statusCode : 500;

  // Send response.
  res.status(status).json({ message: error.message });

  next();
};
