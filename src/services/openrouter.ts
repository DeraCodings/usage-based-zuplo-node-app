import OpenAI from "openai";
import type { Response as ExpressResponse } from "express";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("Missing OPENROUTER_API_KEY environment variable.");
    }

    client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });
  }
  return client;
}

export async function createStreamResponse(
  prompt: string,
  res: ExpressResponse,
) {
  const apiClient = getClient();
  const model = process.env.OPENROUTER_MODEL || "gpt-4o-mini";

  const stream = await apiClient.chat.completions.create({
    model,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
  });

  try {
    for await (const chunk of stream) {
      if (chunk.choices?.[0]?.delta?.content) {
        res.write(chunk.choices[0].delta.content);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    res.end();
  }
}
