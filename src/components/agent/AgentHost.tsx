"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAgent } from "@/lib/AgentContext";
import { useLanguage } from "@/lib/LanguageContext";
import { SCENES } from "@/components/deck/scenes";
import { sceneScrollTop } from "@/components/deck/useDeck";

/** Pose → arquivo. Poses ainda não geradas caem no fallback mais próximo. */
const POSES = {
  acenando: "/images/agent/avatar-acenando.png",
  neutro: "/images/agent/avatar-neutro.png",
  apresentando: "/images/agent/avatar-base.png",
} as const;

type ChatMsg = { role: "user" | "assistant"; content: string };

/** Digitação do balão: revela o texto caractere a caractere. */
function useTypewriter(text: string, speed = 18) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown("");
    setDone(false);
    if (!text) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(text);
      setDone(true);
      return;
    }
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return { shown, done };
}

export function AgentHost() {
  const { mode, setMode, dismissInvite } = useAgent();
  const { t, locale } = useLanguage();
  const [step, setStep] = useState(0);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isLastStep = step >= SCENES.length - 1;

  // Texto do balão conforme o estado
  const bubbleText: string =
    mode === "invite"
      ? t("agent.invite.text")
      : mode === "tour"
        ? t(`agent.tour.steps.${SCENES[step].id}`)
        : "";
  const { shown, done } = useTypewriter(bubbleText);

  const startTour = useCallback(() => {
    setStep(0);
    setMode("tour");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [setMode]);

  const goToStep = useCallback((i: number) => {
    setStep(i);
    window.scrollTo({ top: sceneScrollTop(i), behavior: "smooth" });
  }, []);

  const nextStep = useCallback(() => {
    if (!isLastStep) goToStep(step + 1);
  }, [step, isLastStep, goToStep]);

  const endTour = useCallback(() => {
    sessionStorage.setItem("leko-agent-dismissed", "1");
    setMode("idle");
  }, [setMode]);

  const openChat = useCallback(() => {
    sessionStorage.setItem("leko-agent-dismissed", "1");
    setMode("chat");
    if (msgs.length === 0) {
      setMsgs([{ role: "assistant", content: t("agent.chat.greeting") }]);
    }
  }, [setMode, msgs.length, t]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    const next: ChatMsg[] = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12), locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: t("agent.chat.error") }]);
    } finally {
      setSending(false);
    }
  }, [input, sending, msgs, locale, t]);

  // Autoscroll do chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, sending]);

  // ESC fecha chat/tour
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (mode === "chat") setMode("idle");
      if (mode === "tour") endTour();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, setMode, endTour]);

  if (mode === "hidden") return null;

  const pose =
    mode === "invite" ? POSES.acenando : mode === "tour" ? POSES.apresentando : POSES.neutro;

  return (
    <>
      {/* Penumbra de palco durante o tour */}
      <div className={`ag-dim ${mode === "tour" ? "on" : ""}`} aria-hidden="true" />

      <div className={`ag-root ag-${mode}`}>
        {/* Launcher (estado idle): só o avatar redondo */}
        {mode === "idle" && (
          <button className="ag-launcher" onClick={openChat} aria-label={t("agent.launcher.label")}>
            <Image src={POSES.neutro} alt="" width={72} height={72} className="ag-launcher-img" />
            <span className="ag-launcher-dot" />
          </button>
        )}

        {/* Convite + Tour: avatar grande com balão */}
        {(mode === "invite" || mode === "tour") && (
          <div className="ag-scene">
            <div className="ag-bubble" role="dialog" aria-live="polite">
              {mode === "tour" && (
                <span className="ag-bubble-tag">
                  {String(step + 1).padStart(2, "0")}/{String(SCENES.length).padStart(2, "0")} ·{" "}
                  {t(SCENES[step].labelKey)}
                </span>
              )}
              <p>
                {shown}
                {!done && <i className="ag-caret" />}
              </p>
              {done && mode === "invite" && (
                <div className="ag-actions">
                  <button className="ag-btn ag-btn-primary" onClick={startTour}>
                    {t("agent.invite.yes")}
                  </button>
                  <button className="ag-btn" onClick={dismissInvite}>
                    {t("agent.invite.no")}
                  </button>
                </div>
              )}
              {done && mode === "tour" && (
                <div className="ag-actions">
                  {!isLastStep ? (
                    <>
                      <button className="ag-btn ag-btn-primary" onClick={nextStep}>
                        {t("agent.tour.next")}
                      </button>
                      <button className="ag-btn" onClick={endTour}>
                        {t("agent.tour.skip")}
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="ag-btn ag-btn-primary" onClick={openChat}>
                        {t("agent.tour.chat")}
                      </button>
                      <button className="ag-btn" onClick={endTour}>
                        {t("agent.tour.close")}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <Image
              src={pose}
              alt={t("agent.launcher.label")}
              width={220}
              height={220}
              priority
              className="ag-avatar"
            />
          </div>
        )}

        {/* Chat */}
        {mode === "chat" && (
          <div className="ag-chat" role="dialog" aria-label={t("agent.chat.title")}>
            <header className="ag-chat-head">
              <Image src={POSES.neutro} alt="" width={40} height={40} className="ag-chat-face" />
              <div>
                <strong>{t("agent.chat.title")}</strong>
                <small>{t("agent.chat.disclaimer")}</small>
              </div>
              <button className="ag-chat-close" onClick={() => setMode("idle")} aria-label="Fechar">
                ✕
              </button>
            </header>
            <div className="ag-chat-log">
              {msgs.map((m, i) => (
                <div key={i} className={`ag-msg ag-msg-${m.role}`}>
                  {m.content}
                </div>
              ))}
              {sending && (
                <div className="ag-msg ag-msg-assistant ag-msg-typing">
                  <span />
                  <span />
                  <span />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form
              className="ag-chat-input"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("agent.chat.placeholder")}
                maxLength={600}
                autoFocus
              />
              <button type="submit" disabled={sending || !input.trim()}>
                {t("agent.chat.send")}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
