/**
 * Client-side image resize/compress.
 * Ensures the long edge is max 1600px and output is JPEG under 3 MB.
 */

const MAX_LONG_EDGE = 1600;
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB
const INITIAL_QUALITY = 0.8;
const QUALITY_STEP = 0.05;
const MIN_QUALITY = 0.3;

const THUMBNAIL_MAX = 300;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

function drawToCanvas(img: HTMLImageElement, maxDim: number): HTMLCanvasElement {
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot get 2d context");
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

function canvasToBase64(canvas: HTMLCanvasElement, quality: number): string {
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return dataUrl.split(",")[1];
}

function base64ByteLength(base64: string): number {
  // Approximate decoded size
  return Math.ceil((base64.length * 3) / 4);
}

export interface ResizeResult {
  /** Base64 string WITHOUT the data: prefix */
  base64: string;
  /** Always image/jpeg */
  mediaType: "image/jpeg";
  /** Approximate byte size of the decoded image */
  byteSize: number;
}

export async function resizeImage(file: File): Promise<ResizeResult> {
  const img = await loadImage(file);
  const canvas = drawToCanvas(img, MAX_LONG_EDGE);

  let quality = INITIAL_QUALITY;
  let base64 = canvasToBase64(canvas, quality);

  // Step down quality until under MAX_BYTES
  while (base64ByteLength(base64) > MAX_BYTES && quality > MIN_QUALITY) {
    quality -= QUALITY_STEP;
    base64 = canvasToBase64(canvas, quality);
  }

  return {
    base64,
    mediaType: "image/jpeg",
    byteSize: base64ByteLength(base64),
  };
}

export async function createThumbnail(file: File): Promise<string> {
  const img = await loadImage(file);
  const canvas = drawToCanvas(img, THUMBNAIL_MAX);
  return canvas.toDataURL("image/jpeg", 0.6);
}
