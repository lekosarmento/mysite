"use client";

import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { useLoading } from "./LoadingContext";

/**
 * Estado do Anfitrião (o agente-avatar do Leko).
 * hidden → some da tela · invite → balão convidando pro tour ·
 * idle → só o launcher no canto · tour → apresentando as cenas ·
 * chat → conversa com a IA.
 */
export type AgentMode = "hidden" | "invite" | "idle" | "tour" | "chat";

type AgentContextType = {
  mode: AgentMode;
  setMode: (m: AgentMode) => void;
  /** aceite/dispensa do convite ficam na sessão pra não reconvidar em toda navegação */
  dismissInvite: () => void;
};

const AgentContext = createContext<AgentContextType | null>(null);

const INVITE_DELAY_MS = 4500;
const DISMISS_KEY = "leko-agent-dismissed";

export function AgentProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AgentMode>("hidden");
  const { loading } = useLoading();

  // Convida depois que o preloader liberou a página (uma vez por sessão).
  useEffect(() => {
    if (loading) return;
    if (sessionStorage.getItem(DISMISS_KEY)) {
      setMode("idle");
      return;
    }
    const t = setTimeout(() => {
      setMode((m) => (m === "hidden" ? "invite" : m));
    }, INVITE_DELAY_MS);
    return () => clearTimeout(t);
  }, [loading]);

  const dismissInvite = useCallback(() => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setMode("idle");
  }, []);

  return (
    <AgentContext.Provider value={{ mode, setMode, dismissInvite }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent precisa estar dentro de <AgentProvider>");
  return ctx;
}
