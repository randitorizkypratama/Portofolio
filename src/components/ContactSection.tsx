import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
          <div className="glow-border rounded-2xl bg-bg-elevated p-6 sm:p-10 relative overflow-hidden">
            {/* Decorative pixel elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan/5 rounded-tr-full" />

            <div className="grid lg:grid-cols-2 gap-10 relative">
              {/* Left */}
              <div>
                <span className="retro-font text-[10px] text-primary block mb-3">
                  Get In Touch
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Let's Build Something{" "}
                  <span className="gradient-text">Great!</span>
                </h2>
                <p className="text-text-secondary mb-8">
                  {siteConfig.contactDescription}
                </p>

                {/* Decorative elements */}
                <div className="hidden lg:flex items-end gap-4 mt-auto">
                  <div className="animate-float">
                    <img
                      src="/images/avatar.webp"
                      alt=""
                      aria-hidden="true"
                      className="w-12 h-12 rounded-lg object-cover border border-border"
                    />
                  </div>
                  <div className="glow-border rounded-lg p-3 bg-bg-secondary">
                    <p className="retro-font text-[7px] text-cyan">
                      Thanks for visiting!
                    </p>
                  </div>
                  <img
                    src="/images/decoration.webp"
                    alt=""
                    aria-hidden="true"
                    className="w-16 h-16 object-contain opacity-60"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Right - Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text-secondary mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    {...register("name")}
                    className="w-full px-4 py-2.5 bg-bg-main border border-border rounded-lg text-sm text-text-main placeholder:text-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text-secondary mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    className="w-full px-4 py-2.5 bg-bg-main border border-border rounded-lg text-sm text-text-main placeholder:text-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-text-secondary mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Your message..."
                    {...register("message")}
                    className="w-full px-4 py-2.5 bg-bg-main border border-border rounded-lg text-sm text-text-main placeholder:text-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {submitted ? (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle size={16} />
                    Opening your email client...
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Send Message
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