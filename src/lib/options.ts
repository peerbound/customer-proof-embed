import { z } from "zod";

const filterSchema = z.object({
  field_name: z.string(),
  object_name: z.string(),
  values: z.array(z.string()),
});

export const optionsSchema = z.object({
  id: z.uuid({
    message:
      "`embed-id` is missing or invalid. Find your embed ID at https://app.peerbound.com/settings/embed",
  }),
  token: z.string().optional(),
  count: z.coerce
    .number({ message: "`count` must be a number" })
    .int({ message: "`count` must be a whole number" })
    .min(1, { message: "`count` must be between 1 and 50" })
    .max(50, { message: "`count` must be between 1 and 50" })
    .optional(),
  hidePhotos: z.preprocess((val) => val === "true", z.boolean()),
  hidePeerboundBadge: z.preprocess((val) => val === "true", z.boolean()),
  filters: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "`filters` must be valid JSON" },
    )
    .transform((val) => {
      if (!val) return undefined;

      const filterRecord = JSON.parse(val) as Record<string, string | string[]>;
      return Object.entries(filterRecord).map(([key, values]) => {
        const [object_name, field_name] = key.split(":");
        return {
          field_name,
          object_name,
          values: Array.isArray(values) ? values : [values],
        };
      });
    })
    .pipe(z.array(filterSchema).optional()),
});

export type EmbedOptions = z.infer<typeof optionsSchema>;
