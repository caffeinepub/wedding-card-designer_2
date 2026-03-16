import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bot, Info, Save, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";

interface Props {
  onNavigate: (page: Page) => void;
}

export default function AdminPage({ onNavigate }: Props) {
  const [agentName, setAgentName] = useState(
    () => localStorage.getItem("agent_name") || "AI Assistant",
  );
  const [welcomeMessage, setWelcomeMessage] = useState(
    () =>
      localStorage.getItem("agent_welcome") ||
      "Assalam o Alaikum! Main aapka AI Assistant hoon. Aap mujhse koi bhi sawaal pooch sakte hain. 'help' type karein agar kuch jaanna ho.",
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!agentName.trim()) {
      toast.error("Agent name required hai.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    localStorage.setItem("agent_name", agentName.trim());
    localStorage.setItem("agent_welcome", welcomeMessage.trim());
    setSaving(false);
    toast.success("Settings save ho gayi! Chat reload karein changes ke liye.");
  };

  const handleClearSession = () => {
    localStorage.removeItem("chat_session_id");
    toast.success("Chat session clear ho gaya. Naya session shuru hoga.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            data-ocid="admin.back_button"
            onClick={() => onNavigate("chat")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-foreground text-base leading-tight">
                Admin Settings
              </h1>
              <p className="text-xs text-muted-foreground">
                Agent Configuration
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Notice banner */}
          <div
            className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3"
            data-ocid="admin.panel"
          >
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Yeh settings sirf is device par save hongi (localStorage). Dusre
              devices par yeh settings nazar nahi aayengi.
            </p>
          </div>

          {/* Agent Name */}
          <div className="space-y-2">
            <Label
              htmlFor="agent-name"
              className="text-sm font-medium text-foreground"
            >
              Agent Ka Naam
            </Label>
            <Input
              id="agent-name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Jaise: Support Bot, Sales Agent..."
              data-ocid="admin.input"
              className="bg-card border-border focus:border-primary/50"
            />
            <p className="text-xs text-muted-foreground">
              Yeh naam chat header mein dikhega.
            </p>
          </div>

          {/* Welcome Message */}
          <div className="space-y-2">
            <Label
              htmlFor="welcome-msg"
              className="text-sm font-medium text-foreground"
            >
              Welcome Message
            </Label>
            <Textarea
              id="welcome-msg"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Pehla message jo agent bhejega..."
              rows={4}
              data-ocid="admin.textarea"
              className="bg-card border-border focus:border-primary/50 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Jab bhi koi naya chat shuru kare, yeh message pehle dikhega.
            </p>
          </div>

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            data-ocid="admin.save_button"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Settings Save Karein
              </span>
            )}
          </Button>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Danger zone */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Danger Zone
            </h2>
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Chat Session Clear Karein
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Purani chat history reset ho jaayegi aur naya session shuru
                  hoga.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearSession}
                data-ocid="admin.delete_button"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Session Clear Karein
              </Button>
            </div>
          </div>

          {/* Back to chat link */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => onNavigate("chat")}
              data-ocid="admin.link"
              className="text-sm text-primary hover:underline font-medium"
            >
              ← Wapas Chat Par Jaayein
            </button>
          </div>

          <p className="text-center text-[10px] text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
