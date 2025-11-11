import React from "react";
import Section from "./shared/Section";
import { Mail, Github, Linkedin, Coffee, Sparkles } from "lucide-react";

export default function Contact() {
  return (
    <Section id="contact" title="Contact">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: CTA + socials */}
        <div className="card">
          <h3 className="text-xl font-bold">Let’s build something cool ✨</h3>
          <p className="mt-2 text-white/85">
            Friendly human. Ships production. Loves spicy curries. Will absolutely
            add helpful micro-interactions.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a href="mailto:komalkumavat002@gmail.com" className="btn btn-primary">
              <Mail size={16} /> Email
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/komal-kumavat003"
              className="btn btn-ghost"
            >
              <Github size={16} /> GitHub
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/in/komal-kumavat-Profile"
              className="btn btn-ghost"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
            <a
              href="mailto:komalkumavat002@gmail.com?subject=Coffee%20Chat%20about%20AI&body=Hey%20Komal%2C%20let%E2%80%99s%20chat%20about..."
              className="btn btn-ghost"
              title="Coffee chat?"
            >
              <Coffee size={16} /> Coffee Chat
            </a>
          </div>

          <div className="mt-4 text-sm text-white/60 flex items-center gap-2">
            <Sparkles size={16} /> Available for AI/ML engineering & agentic systems work.
          </div>
        </div>

        {/* Right: simple form (works without backend) */}
        <form
          className="card"
          action="https://formsubmit.co/komalkumavat002@gmail.com"
          method="POST"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="Portfolio contact — Komal Kumavat" />
          <input type="hidden" name="_template" value="box" />

          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            required
            className="w-full rounded-2xl bg-white/10 border border-white/20 p-3 mb-3"
            placeholder="How should I address you?"
          />

          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-2xl bg-white/10 border border-white/20 p-3 mb-3"
            placeholder="you@company.com"
          />

          <label className="block text-sm mb-1">Message</label>
          <textarea
            name="message"
            rows="5"
            required
            className="w-full rounded-2xl bg-white/10 border border-white/20 p-3"
            placeholder="Tell me about your idea, problem, or spicy data puzzle 🌶️"
          />

          <div className="mt-4 flex gap-3">
            <button type="submit" className="btn btn-primary">Send</button>
            <a href="mailto:komalkumavat002@gmail.com" className="btn btn-ghost">Email instead</a>
          </div>
        </form>
      </div>
    </Section>
  );
}
