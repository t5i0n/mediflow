import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.js";

export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "You don't have permission to do this" });
    }
    next();
  };
}
