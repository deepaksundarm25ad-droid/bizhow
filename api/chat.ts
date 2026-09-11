const SYSTEM_CONTEXT = `You are GovFlow AI Assistant, an intelligent compliance advisor for Indian businesses.
You help business owners understand government approvals, licences, NOCs, registrations, and compliance requirements.
The current user is managing "NovaTech Manufacturing Pvt Ltd" — a medium-sized manufacturing unit in Sriperumbudur, Tamil Nadu with 150 employees.
Their active applications include: Fire Safety Approval (Inspection Scheduled), Pollution Control NOC (Under Review), Factory Licence (Approved), Local Authority Trade Licence (Documents Required), MSME Udyam Registration (Submitted), Business Registration (Approved).
Be concise, professional, and helpful. Use specific Indian regulatory context. Format responses clearly with bullet points where appropriate. Keep answers under 200 words unless a detailed explanation is needed.`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Gemini API key is missing from server environment." }));
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { action, messages, newMessage, businessProfile } = body || {};
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let contents: any[] = [];
  if (action === "analyze") {
    const prompt = `Analyze the compliance requirements for this business:
${Object.entries(businessProfile || {}).map(([k, v]) => `${k}: ${v}`).join("\n")}
List the top 5 most critical approvals/licences needed with brief explanations. Be specific to Indian regulations.`;
    contents = [{ role: "user", parts: [{ text: SYSTEM_CONTEXT + "\n\n" + prompt }] }];
  } else {
    contents = [
      { role: "user", parts: [{ text: SYSTEM_CONTEXT }] },
      { role: "model", parts: [{ text: "Understood. I am GovFlow AI Assistant, ready to help with compliance and approvals." }] },
      ...(Array.isArray(messages) ? messages : []).map((m: any) => ({
        role: m.role === "model" ? "model" : "user",
        parts: [{ text: m.text || "" }],
      })),
      { role: "user", parts: [{ text: newMessage || "Hello" }] },
    ];
  }

  try {
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
      }),
    });

    if (!geminiRes.ok) {
      res.statusCode = geminiRes.status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "AI service request failed." }));
      return;
    }

    const data = await geminiRes.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received from AI.";

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ text: replyText }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Unable to connect to AI server endpoint." }));
  }
}
