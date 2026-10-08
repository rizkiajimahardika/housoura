/**
 * Client-side photo quality checks: brightness and blur detection.
 * Runs on a downscaled canvas (max 400px) before upload.
 */

export interface QualityResult {
  ok: boolean;
  issues: ("too_dark" | "too_bright" | "blurry")[];
}

const BRIGHTNESS_LOW = 55;
const BRIGHTNESS_HIGH = 220;
const BLUR_THRESHOLD = 60;

function loadImageToCanvas(
  file: File,
  maxDim: number
): Promise<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Cannot get 2d context"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve({ canvas, ctx });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

function getMeanBrightness(ctx: CanvasRenderingContext2D, w: number, h: number): number {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  let sum = 0;
  const pixelCount = w * h;
  for (let i = 0; i < data.length; i += 4) {
    // Luminance: 0.299*R + 0.587*G + 0.114*B
    sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return sum / pixelCount;
}

function getLaplacianVariance(ctx: CanvasRenderingContext2D, w: number, h: number): number {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Convert to grayscale array
  const gray = new Float32Array(w * h);
  for (let i = 0; i < gray.length; i++) {
    const idx = i * 4;
    gray[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  }

  // Apply Laplacian kernel [0, 1, 0; 1, -4, 1; 0, 1, 0]
  const laplacian = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      laplacian[idx] =
        gray[idx - w] +
        gray[idx - 1] +
        -4 * gray[idx] +
        gray[idx + 1] +
        gray[idx + w];
    }
  }

  // Compute variance
  let sum = 0;
  let sumSq = 0;
  const count = (w - 2) * (h - 2);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const v = laplacian[y * w + x];
      sum += v;
      sumSq += v * v;
    }
  }
  const mean = sum / count;
  return sumSq / count - mean * mean;
}

export async function checkImageQuality(file: File): Promise<QualityResult> {
  const { canvas, ctx } = await loadImageToCanvas(file, 400);
  const w = canvas.width;
  const h = canvas.height;

  const issues: QualityResult["issues"] = [];

  const brightness = getMeanBrightness(ctx, w, h);
  if (brightness < BRIGHTNESS_LOW) issues.push("too_dark");
  if (brightness > BRIGHTNESS_HIGH) issues.push("too_bright");

  const blurScore = getLaplacianVariance(ctx, w, h);
  if (blurScore < BLUR_THRESHOLD) issues.push("blurry");

  return {
    ok: issues.length === 0,
    issues,
  };
}
