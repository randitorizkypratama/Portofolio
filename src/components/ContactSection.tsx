import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { siteConfig } from "../data/portfolio";
import { ScrollReveal } from "./ScrollReveal";
import { trackAndNotify } from "../game/toast";
import { useLocale, pick, type Locale } from "../i18n";
import { ui } from "../data/content";

function makeContactSchema(lang: Locale) {
  return z.object({
    name: z.string().min(2, pick(ui.errName, lang)),
    email: z.string().email(pick(ui.errEmail, lang)),
    message: z.string().min(10, pick(ui.errMessage, lang)),
  });
}

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export function ContactSection() {
  const lang = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(makeContactSchema(lang)),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(false);
    try {
      const res = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(siteConfig.email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `Portfolio Contact from ${data.name}`,
            name: data.name,
            email: data.email,
            message: data.message,
          }),
        }
      );
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
      trackAndNotify("message");
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setSubmitError(true);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="dialogue-box rounded-lg p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/3 rounded-bl-full" />

            <div className="grid lg:grid-cols-2 gap-10 relative">
              {/* Left */}
              <div>
                <span className="retro-font text-[8px] text-gold block mb-3">
                  ✦ MESSAGE BOARD ✦
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-cream">
                  {pick(ui.contactTitle, lang)}{" "}
                  <span className="text-gold">{pick(ui.contactTitleAccent, lang)}</span>
                </h2>
                <p className="text-text-secondary mb-8 text-sm">
                  {pick(ui.contactBody, lang)}
                </p>

                {/* Decorative */}
                <div className="hidden lg:flex items-end gap-4 mt-auto">
                  <img
                    src="/images/avatar.webp"
                    alt=""
                    aria-hidden="true"
                    className="w-12 h-12 rounded-lg border-2 border-border anim-bob"
                  />
                  <div className="game-border rounded-lg p-3">
                    <p className="retro-font text-[6px] text-cyan">
                      {pick(ui.thanksForVisiting, lang)}
                    </p>
                  </div>
                  <img
                    src="/images/decoration.webp"
                    alt=""
                    aria-hidden="true"
                    className="w-14 h-14 object-contain opacity-50 anim-bob-tilt"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Right - Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="retro-font text-[6px] text-text-secondary block mb-1.5">
                    {pick(ui.labelName, lang)}
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder={pick(ui.phName, lang)}
                    {...register("name")}
                    className="w-full px-3 py-2 bg-bg-main border-2 border-border rounded text-sm text-cream placeholder:text-text-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                  {errors.name && (
                    <p className="mt-1 retro-font text-[6px] text-hp">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="retro-font text-[6px] text-text-secondary block mb-1.5">
                    {pick(ui.labelEmail, lang)}
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={pick(ui.phEmail, lang)}
                    {...register("email")}
                    className="w-full px-3 py-2 bg-bg-main border-2 border-border rounded text-sm text-cream placeholder:text-text-secondary/40 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                  {errors.email && (
                    <p className="mt-1 retro-font text-[6px] text-hp">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="retro-font text-[6px] text-text-secondary block mb-1.5">
                    {pick(ui.labelMessage, lang)}
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder={pick(ui.phMessage, lang)}
                    {...register("message")}
                    className="w-full px-3 py-2 bg-bg-main border-2 border-border rounded text-sm text-cream placeholder:text-text-secondary/40 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  />
                  {errors.message && (
                    <p className="mt-1 retro-font text-[6px] text-hp">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {submitted ? (
                  <div className="flex items-center gap-2 retro-font text-[7px] text-xp">
                    <CheckCircle size={14} />
                    {pick(ui.msgSent, lang)}
                  </div>
                ) : (
                  <>
                    {submitError && (
                      <p className="retro-font text-[6px] text-hp">
                        {pick(ui.msgFailed, lang)}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="game-btn w-full flex items-center justify-center gap-2 text-[8px] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      {pick(ui.sendMessage, lang)}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}