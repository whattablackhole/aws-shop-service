import { Schema, Validator } from "jsonschema";

export function validateBySchema(item: any, schema: Schema): boolean {
  return new Validator().validate(item, schema, { allowUnknownAttributes: false }).valid;
}
