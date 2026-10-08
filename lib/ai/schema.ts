import { z } from "zod";

// ─── Issue categories ───
export const IssueCategoryEnum = z.enum([
  "water_moisture",
  "roof",
  "structure_cracks",
  "electrical",
  "plumbing",
  "mold_visual",
  "ventilation",
  "windows_doors",
  "flooring",
  "exterior",
  "hvac",
  "termite",
  "drainage_flood",
  "general_maintenance",
]);

export const SeverityEnum = z.enum(["high", "medium", "low", "unable_to_assess"]);
export const ConfidenceEnum = z.enum(["low", "medium", "high"]);

// ─── Observation ───
export const ObservationSchema = z.object({
  type: z.string(),
  description: z.string(),
});

// ─── Potential Issue ───
export const PotentialIssueSchema = z.object({
  category: IssueCategoryEnum,
  issue: z.string(),
  explanation: z.string(),
  severity: SeverityEnum,
  confidence: ConfidenceEnum,
});

// ─── Full analysis response ───
export const AnalysisResponseSchema = z.object({
  image_usable: z.boolean(),
  usability_note: z.string().nullable(),
  inspection_area: z.string(),
  observations: z.array(ObservationSchema),
  potential_issues: z.array(PotentialIssueSchema),
  missing_evidence: z.array(z.string()),
  recommended_action: z.string(),
});

export type IssueCategory = z.infer<typeof IssueCategoryEnum>;
export type Severity = z.infer<typeof SeverityEnum>;
export type Confidence = z.infer<typeof ConfidenceEnum>;
export type Observation = z.infer<typeof ObservationSchema>;
export type PotentialIssue = z.infer<typeof PotentialIssueSchema>;
export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;

// ─── Request schemas ───
export const PropertyContextSchema = z.object({
  type: z.string().optional(),
  age: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export const AnalyzeRequestSchema = z.object({
  stepId: z.string(),
  imageBase64: z.string(),
  mediaType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  language: z.enum(["en", "id"]),
  propertyContext: PropertyContextSchema.optional(),
});

export type PropertyContext = z.infer<typeof PropertyContextSchema>;
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

// ─── Step result (stored on client) ───
export interface StepResult {
  stepId: string;
  status: "analyzing" | "done" | "failed";
  thumbnailDataUrl?: string;
  analysis?: AnalysisResponse;
  error?: string;
}
