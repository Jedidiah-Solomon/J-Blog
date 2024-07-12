// Middleware for handling errors
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Render error page using your template engine (e.g., EJS)
  res.render("error", {
    error: err,
    showStack: process.env.NODE_ENV !== "production",
  });
};

module.exports = {
  errorHandler,
};
