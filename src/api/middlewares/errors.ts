import { Request, Response, NextFunction } from "express";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequest extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class Forbidden extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class Unauthorized extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function middlewareError(
  err: any,
  req: Request,
  res: Response,
  nextFunction: NextFunction,
) {
  const msg = "Internal Server Errors";
  const errorCode = 500;

  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else if (err instanceof BadRequest) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof Unauthorized) {
    res.status(401).json({ error: err.message });
  } else if (err instanceof Forbidden) {
    res.status(403).json({ error: err.message });
  } else {
    console.log(msg);
    res.status(errorCode).json({
      error: msg,
    });
  }
}
