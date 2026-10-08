import type { PropertyContext } from "./schema";

export const SYSTEM_PROMPT = `You are a cautious visual screening assistant for property buyers in Indonesia. You are NOT a licensed inspector. Analyze only what is visible in the photo. Only report what you can point to in the image. If nothing concerning is visible, return an empty potential_issues array. Always separate: (1) observation: what is visibly present, (2) potential explanation: what it could indicate, (3) recommended action. Never claim a property is safe, sound, free of defects, mold-free, or leak-free. Never say an inspector is unnecessary. Use phrases like 'possible', 'visible indication', 'appears consistent with', 'unable to determine from this photo'. If evidence is ambiguous, be conservative and list what additional photo would help. If the photo does not show the requested area or is too dark or blurry, set image_usable=false and explain what to capture. Consider Indonesian context: termites (rayap), tropical humidity and mold, roof leaks in heavy rain, flood/drainage history, soil settlement cracks, and common local construction (brick/plaster walls, wooden frames, clay or concrete roof tiles). Severity means priority to investigate, not that the property is dangerous. Confidence is only low, medium or high. Respond with JSON only, matching the schema, in the requested output language.`;

export function buildUserPrompt(
  expectedArea: string,
  language: "en" | "id",
  propertyContext?: PropertyContext
): string {
  const langLabel = language === "en" ? "English" : "Bahasa Indonesia";

  const contextParts: string[] = [];
  if (propertyContext?.type) contextParts.push(`Property type: ${propertyContext.type}`);
  if (propertyContext?.age) contextParts.push(`Property age: ${propertyContext.age}`);
  if (propertyContext?.location) contextParts.push(`Location: ${propertyContext.location}`);
  if (propertyContext?.notes) contextParts.push(`Notes: ${propertyContext.notes}`);

  const contextBlock =
    contextParts.length > 0
      ? `\n\nProperty context:\n${contextParts.join("\n")}`
      : "";

  return `Expected area in this photo: ${expectedArea}${contextBlock}

Output language for all text fields: ${langLabel}. Keep enum values and JSON keys in English.

Respond with valid JSON only, matching this schema:
{
  "image_usable": boolean,
  "usability_note": string | null,
  "inspection_area": string,
  "observations": [{ "type": string, "description": string }],
  "potential_issues": [{
    "category": "water_moisture" | "roof" | "structure_cracks" | "electrical" | "plumbing" | "mold_visual" | "ventilation" | "windows_doors" | "flooring" | "exterior" | "hvac" | "termite" | "drainage_flood" | "general_maintenance",
    "issue": string,
    "explanation": string,
    "severity": "high" | "medium" | "low" | "unable_to_assess",
    "confidence": "low" | "medium" | "high"
  }],
  "missing_evidence": [string],
  "recommended_action": string
}`;
}

export const RETRY_PROMPT = "Your previous response was not valid JSON matching the required schema. Return valid JSON only, no markdown fences, no extra text.";
