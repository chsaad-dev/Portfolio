import { PROFILE, buildSystemPrompt } from "./profile.js";
const SYSTEM_PROMPT = buildSystemPrompt(PROFILE);

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

    try {
      const { message, history = [] } = await request.json();
      if (!message) return new Response(JSON.stringify({ error: "message required" }), { status: 400, headers: cors });

      const contents = [
        ...history.map(h => ({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: h.text }] })),
        { role: "user", parts: [{ text: message }] },
      ];

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: { temperature: 0.6, maxOutputTokens: 300 },
          }),
        }
      );

      const data = await geminiRes.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't process that.";
      return new Response(JSON.stringify({ reply }), { headers: { ...cors, "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: cors });
    }
  },
};
