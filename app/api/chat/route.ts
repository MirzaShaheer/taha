import { NextRequest } from "next/server";
import { buildSystemPrompt, guidedReply } from "@/lib/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

const encoder = new TextEncoder();

/** Stream a plain string to the client in small chunks (used for fallback). */
function streamText(text: string): ReadableStream {
  const words = text.split(/(\s+)/); // keep whitespace tokens
  let i = 0;
  return new ReadableStream({
    pull(controller) {
      if (i >= words.length) {
        controller.close();
        return;
      }
      // emit a few tokens per tick for a natural "typing" feel
      const slice = words.slice(i, i + 2).join("");
      i += 2;
      controller.enqueue(encoder.encode(slice));
    },
  });
}

export async function POST(req: NextRequest) {
  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m) => m && typeof m.content === "string"
  );
  const apiKey = process.env.AI_API_KEY?.trim();
  const baseUrl =
    process.env.AI_BASE_URL?.trim() || "https://api.groq.com/openai/v1";
  const model = process.env.AI_MODEL?.trim() || "llama-3.3-70b-versatile";

  // ---- Guided fallback mode (no API key configured) -----------------------
  if (!apiKey) {
    const reply = guidedReply(messages);
    return new Response(streamText(reply), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Concierge-Mode": "guided",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  }

  // ---- Live AI mode (OpenAI-compatible streaming) -------------------------
  const payload = {
    model,
    stream: true,
    temperature: 0.5, // a touch lower -> more consistent, less likely to drift
    max_tokens: 700,
    messages: [
      { role: "system", content: buildSystemPrompt() },
      ...messages.slice(-16), // keep more context so it remembers the thread
    ],
  };

  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Network error -> graceful fallback so the widget never dies.
    return new Response(streamText(guidedReply(messages)), {
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Concierge-Mode": "guided-fallback" },
    });
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("AI provider error:", upstream.status, detail.slice(0, 500));
    return new Response(streamText(guidedReply(messages)), {
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Concierge-Mode": "guided-fallback" },
    });
  }

  // Transform provider SSE -> plain text delta stream for the client.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async pull(controller) {
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const data = trimmed.replace(/^data:\s*/, "");
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const delta: string =
              json.choices?.[0]?.delta?.content ??
              json.choices?.[0]?.message?.content ??
              "";
            if (delta) controller.enqueue(encoder.encode(delta));
          } catch {
            // ignore keep-alive / partial frames
          }
        }
        // got at least one chunk — yield control
        return;
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Concierge-Mode": "live",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
