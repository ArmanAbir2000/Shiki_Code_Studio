import { useEffect, useState, type CSSProperties } from "react";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router";
import { api } from "@/convex/_generated/api";
import { sendViaWeb3Forms } from "@/lib/web3forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { FolioShell } from "@/components/folio-shell";
import { useSiteTheme } from "@/hooks/use-site-theme";
import { MaskText } from "@/components/motion-primitives";
import { EASE } from "@/lib/motion";
import { useDocumentMeta } from "@/lib/seo";

export default function Contact() {
  useDocumentMeta({
    title: "Contact — Shiki Code Studio",
    description:
      "Get in touch about a Flutter app, a Laravel API, or a full product build.",
  });

  const sendMessage = useMutation(api.messages.sendMessage);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  // Inline confirmation auto-clears after a few seconds.
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(null), 6000);
    return () => clearTimeout(timer);
  }, [status]);
  const { theme } = useSiteTheme();
  const folio = theme === "folio";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // no page reload / redirect
    setSending(true);
    setStatus(null);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim() || "New message from your portfolio",
      message: body.trim(),
    };

    // Email straight to my inbox via Web3Forms + keep a record in Convex.
    const [sent, saved] = await Promise.all([
      sendViaWeb3Forms(payload),
      sendMessage({
        name: payload.name,
        email: payload.email,
        subject,
        body,
      })
        .then(() => true)
        .catch((err) => {
          console.error(err);
          return false;
        }),
    ]);

    if (sent) {
      setStatus({ ok: true, text: "Message sent successfully!" });
      if (!saved) console.error("Message emailed but not saved to inbox.");
      setName("");
      setEmail("");
      setSubject("");
      setBody("");
    } else if (saved) {
      setStatus({
        ok: true,
        text: "Received — it's queued in my inbox and I'll reply soon.",
      });
    } else {
      setStatus({
        ok: false,
        text: "Could not send right now. Please try again in a moment.",
      });
    }

    if (sent) {
      toast("Message sent.", {
        description: "Expect a reply within one business day.",
      });
    }

    setSending(false);
  };

  const fields = (
    <>
      <div className="fl-form-row">
        <div className="fl-field">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            required
            maxLength={100}
          />
        </div>
        <div className="fl-field">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            required
            maxLength={200}
          />
        </div>
      </div>
      <div className="fl-field">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="New build inquiry"
          maxLength={150}
        />
      </div>
      <div className="fl-field">
        <Label htmlFor="contact-body">Message</Label>
        <Textarea
          id="contact-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={7}
          maxLength={3000}
          placeholder="Tell me a little about what you need."
          required
        />
      </div>
    </>
  );

  if (folio) {
    return (
      <FolioShell>
        <div className="fl-wrap fl-sec-head">
          <span className="fl-mono">06 — CONTACT</span>
          <span className="fl-mono">OPEN CORRESPONDENCE</span>
        </div>
        <div className="fl-wrap fl-page-head">
          <h1 className="fl-rv">
            SEND A
            <br />
            MESSAGE
          </h1>
          <p className="fl-page-lede fl-rv" style={{ "--d": ".08s" } as CSSProperties}>
            Not ready to book a slot? Send a <em>short note</em> instead —
            questions about a project, availability, or rates are all welcome.
          </p>
        </div>
        <div className="fl-wrap fl-form-wrap">
          <form onSubmit={handleSubmit} className="fl-form">
            <p className="fl-mono fl-form-legend">01 — YOUR DETAILS</p>
            {fields}
            <button type="submit" className="fl-submit fl-mono" disabled={sending}>
              {sending ? "SENDING…" : "SEND MESSAGE →"}
            </button>
            <div aria-live="polite">
              {status && (
                <p
                  className={
                    "fl-status fl-mono" + (status.ok ? " fl-ok" : " fl-bad")
                  }
                >
                  {status.text}
                </p>
              )}
            </div>
          </form>
          <aside className="fl-form-aside fl-mono">
            <small>PREFER TO TALK LIVE?</small>
            <Link className="fl-open" to="/book">
              BOOK AN APPOINTMENT →
            </Link>
            <small>RESPONSE TIME</small>
            <div>WITHIN ONE BUSINESS DAY</div>
            <small>BASED IN</small>
            <div>DHAKA, BANGLADESH</div>
            <small>WORKING ON</small>
            <div>FLUTTER · DART · LARAVEL</div>
          </aside>
        </div>
      </FolioShell>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-24 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <MaskText
              as="h1"
              text="Send a message"
              className="block text-3xl font-bold tracking-tight sm:text-4xl"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
              className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground"
            >
              Not ready to book a slot? Send a short note instead — questions
              about a project, availability, or rates are all welcome.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
              className="mt-4 text-sm text-muted-foreground"
            >
              Prefer to talk live?{" "}
              <Link
                to="/book"
                className="link-sweep cursor-pointer hover:text-foreground"
              >
                Book an appointment
              </Link>{" "}
              instead.
            </motion.p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            onSubmit={handleSubmit}
            className="mt-12 max-w-xl space-y-6"
          >
            {fields}
            <Button
              type="submit"
              size="lg"
              disabled={sending}
              className="cursor-pointer transition-transform active:scale-[0.98]"
            >
              {sending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Send message
            </Button>

            {/* Inline result message — styled with existing theme tokens */}
            <div aria-live="polite">
              {status && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={
                    "flex items-center gap-2 rounded-md border px-4 py-3 text-sm " +
                    (status.ok
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-destructive/40 bg-destructive/10 text-red-400")
                  }
                >
                  {status.ok ? (
                    <CheckCircle2 className="size-4 shrink-0" />
                  ) : (
                    <TriangleAlert className="size-4 shrink-0" />
                  )}
                  {status.text}
                </motion.p>
              )}
            </div>
          </motion.form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
