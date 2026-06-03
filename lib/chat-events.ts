/**
 * Tiny event bus so any button (navbar, hero, etc.) can open the AI concierge
 * without prop-drilling. The ChatWidget listens for "qc:open-chat".
 */
export const OPEN_CHAT_EVENT = "qc:open-chat";

export function openChat(prompt?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: { prompt } }));
}
