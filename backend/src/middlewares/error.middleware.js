class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

class ValidationError extends ApiError {
  constructor(message) {
    super(400, message);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(404, message);
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

function errorHandler(err, req, res, next) {
  console.error(err);
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err.isJoi) {
    return res
      .status(400)
      .json({ message: err.details.map((d) => d.message).join(", ") });
  }

  res.status(500).json({ message: "Internal Server Error" });
}

export {
  ApiError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
  errorHandler,
};
