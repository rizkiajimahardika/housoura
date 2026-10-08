import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequestSchema, type AnalysisResponse } from "@/lib/ai/schema";
import { analyzePhoto } from "@/lib/ai/vision";
import { checkRateLimit } from "@/lib/rateLimit";
import { VALID_STEP_IDS } from "@/lib/steps";
import { STEPS, EXTRA_STEP } from "@/lib/steps";

// ─── Banned claims ───
const BANNED_CLAIMS = [
  "safe to buy",
  "structurally sound",
  "no structural problem",
  "no mold",
  "no leak",
  "free of defects",
  "you don't need an inspector",
  "good investment",
  "aman untuk dibeli",
  "struktur aman",
  "tidak ada jamur",
  "tidak ada kebocoran",
  "tidak perlu inspektur",
  "investasi bagus",
];

const FALLBACK_EN = "Unable to determine from this photo.";
const FALLBACK_ID = "Tidak dapat dipastikan dari foto ini.";

function sanitizeBannedClaims(
  data: AnalysisResponse,
  language: "en" | "id"
): AnalysisResponse {
  const fallback = language === "id" ? FALLBACK_ID : FALLBACK_EN;

  function checkAndReplace(value: string): string {
    const lower = value.toLowerCase();
    for (const banned of BANNED_CLAIMS) {
      if (lower.includes(banned)) {
        console.warn(`Banned claim detected and replaced: "${banned}"`);
        return fallback;
      }
    }
    return value;
  }

  function sanitizeObj<T extends Record<string, unknown>>(obj: T): T {
    const result = { ...obj };
    for (const key of Object.keys(result)) {
      const val = result[key];
      if (typeof val === "string") {
        (result as Record<string, unknown>)[key] = checkAndReplace(val);
      }
    }
    return result;
  }

  return {
    ...data,
    usability_note: data.usability_note
      ? checkAndReplace(data.usability_note)
      : null,
    inspection_area: checkAndReplace(data.inspection_area),
    observations: data.observations.map((o) => sanitizeObj(o)),
    potential_issues: data.potential_issues.map((p) => sanitizeObj(p)),
    missing_evidence: data.missing_evidence.map((s) => checkAndReplace(s)),
    recommended_action: checkAndReplace(data.recommended_action),
  };
}

// ─── Max decoded image size: 3.5 MB ───
const MAX_IMAGE_BYTES = 3.5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request
    const body = await request.json();
    const parseResult = AnalyzeRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parseResult.error.issues },
        { status: 400 }
      );
    }

    const { stepId, imageBase64, mediaType, language, propertyContext } =
      parseResult.data;

    // Validate stepId
    if (!VALID_STEP_IDS.includes(stepId)) {
      return NextResponse.json(
        { error: "Unknown step ID" },
        { status: 400 }
      );
    }

    // Validate image size (decoded)
    const decodedSize = Math.ceil((imageBase64.length * 3) / 4);
    if (decodedSize > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 3.5 MB." },
        { status: 400 }
      );
    }

    // 2. Rate limit by IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const rateLimitResult = checkRateLimit(ip);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error:
            language === "id"
              ? "Terlalu banyak permintaan. Silakan tunggu beberapa saat."
              : "Too many requests. Please wait a moment.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.resetInSeconds),
          },
        }
      );
    }

    // 3. Get expected area from step definition
    let expectedArea: string;
    if (stepId === "extra") {
      expectedArea = EXTRA_STEP.expectedArea;
    } else {
      const step = STEPS.find((s) => s.id === stepId);
      expectedArea = step?.expectedArea ?? "General property area";
    }

    // 4. Call AI
    const analysis = await analyzePhoto(
      imageBase64,
      mediaType,
      expectedArea,
      language,
      propertyContext
    );

    // 5. Post-process: sanitize banned claims
    const sanitized = sanitizeBannedClaims(analysis, language);

    return NextResponse.json(sanitized);
  } catch (error) {
    // Never return raw provider errors
    console.error("Analysis error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "An error occurred during analysis. Please try again." },
      { status: 502 }
    );
  }
}
