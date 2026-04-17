import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/auth";
import { generateImage, IMAGE_PROMPTS, type ImagePromptKey } from "@repo/ai";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "XAI_API_KEY not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { key, customPrompt } = body as { key?: ImagePromptKey; customPrompt?: string };

  const prompt = customPrompt ?? (key ? IMAGE_PROMPTS[key] : null);
  if (!prompt) {
    return NextResponse.json({ error: "prompt or key required" }, { status: 400 });
  }

  const category = key?.startsWith("lifestyle")
    ? "lifestyle"
    : key?.startsWith("physician")
      ? "physician"
      : "treatment";

  try {
    const { b64, revisedPrompt } = await generateImage({
      prompt,
      category,
      apiKey,
    });

    // Save to apps/marketing/public/generated/
    const filename = `${key ?? `custom-${Date.now()}`}.jpg`;
    const generatedDir = join(process.cwd(), "..", "marketing", "public", "generated");
    await mkdir(generatedDir, { recursive: true });
    await writeFile(join(generatedDir, filename), Buffer.from(b64, "base64"));

    return NextResponse.json({
      filename,
      path: `/generated/${filename}`,
      revisedPrompt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Image generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
