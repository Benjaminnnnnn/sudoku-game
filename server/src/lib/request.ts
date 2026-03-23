import { z } from 'zod';
import { BadRequestError } from './errors.ts';

export async function parseJsonBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new BadRequestError('Invalid JSON body.');
  }

  return schema.parse(body);
}
