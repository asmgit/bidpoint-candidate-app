import * as z from "zod";
import { slugToLabel } from "./string";

export const jsonSchemaToUISchema = (schema: z.core.JSONSchema.JSONSchema): Record<string, any> => {
  if (!schema) {
    return {};
  }

  const schemaWithProps = schema as {
    properties?: Record<string, z.core.JSONSchema._JSONSchema>;
    required?: string[];
  };

  const properties = schemaWithProps.properties ?? {};
  const requiredFields = new Set(schemaWithProps.required ?? []);
  const fields: Record<string, any> = {};

  Object.entries(properties).forEach(([key, props]) => {
    const propSchema = (props ?? {}) as Record<string, any>;
    let type = propSchema.type as string | undefined;
    let enumValues = propSchema.enum as unknown[] | undefined;
    const anyOf = propSchema.anyOf as Array<Record<string, any>> | undefined;

    let meta: Record<string, any> = { ...propSchema };
    delete meta.type;
    delete meta.enum;
    delete meta.anyOf;

    const label = slugToLabel(key);
    const field: Record<string, any> = {
      name: key,
      label,
      required: requiredFields.has(key),
      ...meta,
    };

    if (anyOf?.length) {
      const nonNullOption = anyOf.filter((option) => option?.type !== "null")[0];
      if (nonNullOption) {
        type = (nonNullOption.type as string | undefined) ?? type;
        enumValues = (nonNullOption.enum as unknown[] | undefined) ?? enumValues;
        delete nonNullOption.type;
        delete nonNullOption.enum;
        Object.assign(field, nonNullOption);
      }
    }

    if (enumValues?.length) {
      field.type = "select";
      field.items = enumValues.map((enumValue) => ({
        label: slugToLabel(String(enumValue)),
        value: enumValue,
      }));
      if (!field.required) {
        field.items.unshift({ label: "[ not selected ]", value: undefined, class: "text-dimmed" });
      }
    } else if (type) {
      field.type = type === "string" ? "text" : type;
    }

    fields[key] = field;
  });

  return fields;
};
