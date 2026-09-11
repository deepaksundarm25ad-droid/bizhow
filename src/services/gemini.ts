export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const AI_UNAVAILABLE = "AI service is unavailable right now. Please try again later.";

export async function sendChatMessage(
  messages: ChatMessage[],
  newMessage: string
): Promise<string> {
  if (!newMessage.trim()) return "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "chat",
        messages,
        newMessage: newMessage.trim(),
      }),
    });

    if (!res.ok) {
      return AI_UNAVAILABLE;
    }

    const data = await res.json();
    return data?.text ?? AI_UNAVAILABLE;
  } catch {
    return "Unable to reach AI service. Please check your internet connection and try again.";
  }
}

export async function analyzeCompliance(businessProfile: Record<string, string>): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "analyze",
        businessProfile,
      }),
    });

    if (!res.ok) {
      return AI_UNAVAILABLE;
    }

    const data = await res.json();
    return data?.text ?? AI_UNAVAILABLE;
  } catch {
    return AI_UNAVAILABLE;
  }
}

