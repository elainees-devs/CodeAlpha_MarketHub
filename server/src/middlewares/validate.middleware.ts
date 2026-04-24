import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils";

type RequestSource = "body" | "params" | "query";

export const validate =
  <T>(schema: ZodSchema<T>, source: RequestSource = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(
        new ApiError(400, "Validation failed", result.error.flatten())
      );
    }

    // replace only the validated part
    (req as any)[source] = result.data;

    next();
  };