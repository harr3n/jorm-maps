import { z } from 'zod';

const CoordinatesSchema = z.array(z.tuple([z.number(), z.number()]));

const LineStringSchema = z.object({
  type: z.literal('LineString'),
  coordinates: CoordinatesSchema,
});

const PolygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(CoordinatesSchema),
});

const GeometrySchema = z.union([LineStringSchema, PolygonSchema]);

const Style = z
  .object({
    stroke: z
      .object({
        color: z.string().optional(),
        width: z.number().optional(),
      })
      .nullish(),
    fill: z
      .object({
        color: z.string().optional(),
      })
      .nullish(),
  })
  .optional();

type Style = z.infer<typeof Style>;

const Feature = z.object({
  type: z.literal('Feature'),
  geometry: GeometrySchema,
  properties: z.object({
    name: z.string().optional(),
    description: z.string().nullable().optional(),
    style: Style,
    id: z.string().nullable(),
  }),
});

type Feature = z.infer<typeof Feature>;

const FeatureCollection = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(Feature),
});

type FeatureCollection = z.infer<typeof FeatureCollection>;

export { FeatureCollection, Feature, Style };
