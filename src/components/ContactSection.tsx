import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { siteConfig } from "../data/portfolio";
import { ScrollReveal } from "./ScrollReveal";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    const subject = encodeURIComponent(`Portfolio Contact from ${data.name}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
    );
    window.open(`mailto:${siteConfig.email}?subject=${subject}&body=${body}`);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
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
                  Let's Build Something{" "}
                  <span className="text-gold">Great!</span>
                </h2>
                <p className="text-text-secondary mb-8 text-sm">
                  {siteConfig.contactDescription}
                </p>

                {/* Decorative */}
                <div className="hidden lg:flex items-end gap-4 mt-auto">
                  <motion.img
                    src="/images/avatar.webp"
                    alt=""
                    aria-hidden="true"
                    className="w-12 h-12 rounded-lg border-2 border-border"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="game-border rounded-lg p-3">
                    <p className="retro-font text-[6px] text-cyan">
                      Thanks for visiting!
                    </p>
                  </div>
                  <motion.img
                    src="/images/decoration.webp"
                    alt=""
                    aria-hidden="true"
                    className="w-14 h-14 object-contain opacity-50"
                    loading="lazy"
                    animate={{ y: [0, -3, 0], rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Right - Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="retro-font text-[6px] text-text-secondary block mb-1.5">
                    NAME
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
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
                    EMAIL
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
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
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Your message..."
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
                    Message sent!
                  </div>
                ) : (
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
                    SEND MESSAGE
                  </button>
                )}
              </form>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}