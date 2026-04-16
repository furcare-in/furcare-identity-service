import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodEffects } from "zod";

import fs from "fs";

const validateRequest =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
    async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      try {
        const parsed = await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
          cookies: req.cookies,
        });
        req.body = parsed.body;
        return next();
      } catch (error) {
        console.error("Zod Error:", JSON.stringify(error, null, 2));
        fs.appendFileSync('/tmp/zod_error.log', new Date().toISOString() + ' : ' + JSON.stringify(error, null, 2) + '\n');
        next(error);
      }
    };

export default validateRequest;
