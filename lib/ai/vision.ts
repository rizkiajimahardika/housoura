import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt, RETRY_PROMPT } from "./prompts";
import { AnalysisResponseSchema, type AnalysisResponse, type PropertyContext } from "./schema";

const client = new Anthropic();

function stripCodeFences(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  return cleaned.trim();
}

export async function analyzePhoto(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif",
  expectedArea: string,
  language: "en" | "id",
  propertyContext?: PropertyContext
): Promise<AnalysisResponse> {
  const model = process.env.VISION_MODEL;
  if (!model) {
    throw new Error("VISION_MODEL environment variable is not set");
  }

  const userPrompt = buildUserPrompt(expectedArea, language, propertyContext);

  const makeRequest = async (isRetry: boolean) => {
    const messages: Anthropic.Messages.MessageParam[] = [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: isRetry ? RETRY_PROMPT : userPrompt,
          },
        ],
      },
    ];

    const response = await client.messages.create({
      model,
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages,
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text content in AI response");
    }

    return textBlock.text;
  };

  // First attempt
  let rawText = await makeRequest(false);
  let parsed: unknown;

  try {
    parsed = JSON.parse(stripCodeFences(rawText));
  } catch {
    // Retry once
    rawText = await makeRequest(true);
    try {
      parsed = JSON.parse(stripCodeFences(rawText));
    } catch {
      throw new Error("AI response is not valid JSON after retry");
    }
  }

  // Validate with zod
  const result = AnalysisResponseSchema.safeParse(parsed);
  if (!result.success) {
    // Retry once if validation fails
    rawText = await makeRequest(true);
    try {
      parsed = JSON.parse(stripCodeFences(rawText));
    } catch {
      throw new Error("AI response is not valid JSON after retry");
    }

    const retryResult = AnalysisResponseSchema.safeParse(parsed);
    if (!retryResult.success) {
      throw new Error("AI response does not match expected schema after retry");
    }
    return retryResult.data;
  }

  return result.data;
}
