import OpenAI from "openai";

export type ImageCategory = "lifestyle" | "physician" | "treatment";

export interface GenerateImageOptions {
  prompt: string;
  category: ImageCategory;
  apiKey: string;
}

export interface GeneratedImage {
  b64: string; // base64-encoded JPEG/PNG
  revisedPrompt?: string;
}

export async function generateImage({
  prompt,
  apiKey,
}: GenerateImageOptions): Promise<GeneratedImage> {
  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.x.ai/v1",
  });

  const response = await client.images.generate({
    model: "grok-2-image",
    prompt,
    n: 1,
    response_format: "b64_json",
  });

  const item = response.data?.[0];
  if (!item?.b64_json) {
    throw new Error("No image data returned from xAI");
  }

  return {
    b64: item.b64_json,
    revisedPrompt: item.revised_prompt ?? undefined,
  };
}

// ─── Prompt templates ────────────────────────────────────────────────────────

export const IMAGE_PROMPTS = {
  // Lifestyle / ambiance
  lifestyle_hero:
    "Luxury medical spa interior, soft natural light, marble surfaces, fresh white orchids, muted warm tones, serene and clinical, editorial photography style, no people",
  lifestyle_consultation:
    "Elegant medical consultation room, warm neutral tones, modern minimalist furniture, soft window light, high-end medspa aesthetic, no people, architectural photography",
  lifestyle_products:
    "Premium skincare and aesthetic treatment products arranged on white marble, soft diffused lighting, luxury spa aesthetic, editorial product photography",
  lifestyle_ambiance:
    "Modern luxury medical spa waiting area, cream and white tones, soft ambient lighting, fresh flowers, high-end interior design, no people",

  // Physicians
  physician_portrait:
    "Professional headshot of a female physician in her late 30s, friendly confident smile, wearing a white medical coat, soft studio lighting, clean white background, medical aesthetics practice, photorealistic",
  physician_consultation:
    "Female physician in white coat consulting with a patient in a modern medical aesthetics office, warm professional lighting, candid natural interaction, photorealistic",
  physician_treatment:
    "Female aesthetic physician carefully performing a facial injection treatment, focused expression, medical gloves, clean clinical environment, soft lighting, photorealistic",

  // Treatments
  treatment_botox:
    "Close-up of a glowing, smooth complexion after botox treatment, natural healthy skin, soft diffused lighting, beauty editorial photography, no visible needles or medical instruments",
  treatment_filler:
    "Beautiful natural lip enhancement result, subtle volume, healthy glowing skin, close-up beauty photography, clean white background, soft light",
  treatment_cheeks:
    "Elegant female profile showing lifted cheekbones and youthful facial contour, soft side lighting, natural makeup, beauty editorial photography",
  treatment_undereyes:
    "Refreshed bright eyes, reduced dark circles, natural healthy skin, close-up beauty photography, soft natural light",
  treatment_jawline:
    "Defined elegant jawline and chin profile, natural beauty, soft studio lighting, beauty editorial photography",
  treatment_peel:
    "Glowing radiant skin after a chemical peel, even skin tone, healthy luminous complexion, close-up beauty photography, soft light",
} as const;

export type ImagePromptKey = keyof typeof IMAGE_PROMPTS;
