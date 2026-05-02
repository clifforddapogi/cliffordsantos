import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import api from "../lib/api";

export default function Contact({ site }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", error: "" });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "sending", error: "" });
    try {
      await api.post("/contact", form);
      setStatus({ state: "sent", error: "" });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === "string" ? detail : "Something went wrong.";
      setStatus({ state: "error", error: msg });
    }
  };

  return (
    <section id="contact" className="relative py-24 lg:py-36 bg-bone/60" data-testid="contact-section">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-[11px] uppercase tracking-[0.22em] text-cyan_brand font-bold">[ 05 — Contact ]</span>
          <div className="h-px flex-1 bg-navy/15" />
        </div>

        <div className="grid grid-cols-12 gap-10 lg:gap-16">
          <div className="col-span-12 lg:col-span-5">
            <h2 className="font-display font-bold text-navy tracking-tightest text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
              Got a brand, a brief, or a wild idea? <span className="italic font-light text-cyan_brand">Send it.</span>
            </h2>
            <p className="mt-8 text-lg text-ink/75 leading-relaxed max-w-md">
              I respond within 24 hours. For quick questions, the fastest line is email below.
            </p>
            <div className="mt-10 space-y-4">
              <Item k="Email" v={site?.email} href={`mailto:${site?.email}`} />
              <Item k="Phone" v={site?.phone} href={`tel:${site?.phone?.replace(/\D/g, "")}`} />
              <Item k="Location" v={site?.location} />
              <Item k="LinkedIn" v="ca.linkedin.com/in/cliffordsantos" href={site?.socials?.linkedin} />
            </div>
          </div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="col-span-12 lg:col-span-7 lg:pl-8"
            data-testid="contact-form"
          >
            <div className="space-y-2">
              <Field label="Name" name="name" form={form} setForm={setForm} required testid="contact-name" />
              <Field label="Email" name="email" type="email" form={form} setForm={setForm} required testid="contact-email" />
              <Field label="Phone (optional)" name="phone" form={form} setForm={setForm} testid="contact-phone" />
              <FieldArea label="Tell me about the project" name="message" form={form} setForm={setForm} required testid="contact-message" />
            </div>

            <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-ink/60">
                {status.state === "sent" && (
                  <span className="inline-flex items-center gap-2 text-cyan_brand font-medium" data-testid="contact-success">
                    <CheckCircle2 className="w-4 h-4" /> Message sent — I'll be in touch shortly.
                  </span>
                )}
                {status.state === "error" && (
                  <span className="text-red-600" data-testid="contact-error">{status.error}</span>
                )}
              </div>
              <button
                type="submit"
                disabled={status.state === "sending"}
                className="group inline-flex items-center gap-3 bg-navy text-cream rounded-full px-7 py-4 text-sm font-medium hover:bg-cyan_brand transition-colors disabled:opacity-60"
                data-testid="contact-submit"
              >
                {status.state === "sending" ? "Sending..." : "Send message"}
                <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", form, setForm, required, testid }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.22em] text-ink/55 font-bold">{label}</span>
      <input
        type={type}
        required={required}
        value={form[name]}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
        className="input-underline"
        data-testid={testid}
      />
    </label>
  );
}

function FieldArea({ label, name, form, setForm, required, testid }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.22em] text-ink/55 font-bold">{label}</span>
      <textarea
        rows={4}
        required={required}
        value={form[name]}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
        className="input-underline resize-none"
        data-testid={testid}
      />
    </label>
  );
}

function Item({ k, v, href }) {
  const inner = (
    <div className="flex items-baseline justify-between gap-4 py-3 border-b border-navy/15 group">
      <span className="text-[10px] uppercase tracking-[0.22em] text-ink/55 font-bold w-24">{k}</span>
      <span className="font-display text-lg lg:text-xl text-navy group-hover:text-cyan_brand transition-colors">{v}</span>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer">{inner}</a> : inner;
}
