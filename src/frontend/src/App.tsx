import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookOpen, Edit3, Heart, LayoutGrid } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Design } from "./backend.d";
import CardEditor from "./components/CardEditor";
import MyDesigns from "./components/MyDesigns";
import TemplateGallery from "./components/TemplateGallery";

const queryClient = new QueryClient();

type Tab = "gallery" | "editor" | "designs";

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("gallery");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("floral");
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setEditingDesign(null);
    setActiveTab("editor");
  };

  const handleEditDesign = (design: Design) => {
    setSelectedTemplate(design.templateId);
    setEditingDesign(design);
    setActiveTab("editor");
  };

  const handleChangeTemplate = () => {
    setActiveTab("gallery");
  };

  const handleSaved = () => {
    // stay on editor after save
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="font-script text-xl text-foreground leading-none">
                  Wedding Card Designer
                </h1>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground">
                  Create · Personalize · Cherish
                </p>
              </div>
            </div>

            {/* Nav tabs */}
            <nav className="flex items-center gap-1">
              <button
                type="button"
                data-ocid="nav.templates_tab"
                onClick={() => setActiveTab("gallery")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "gallery"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Templates</span>
              </button>
              <button
                type="button"
                data-ocid="nav.editor_tab"
                onClick={() => setActiveTab("editor")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "editor"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Editor</span>
              </button>
              <button
                type="button"
                data-ocid="nav.designs_tab"
                onClick={() => setActiveTab("designs")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "designs"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">My Designs</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TemplateGallery onSelect={handleSelectTemplate} />
            </motion.div>
          )}
          {activeTab === "editor" && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <CardEditor
                templateId={selectedTemplate}
                existingDesign={editingDesign}
                onChangeTemplate={handleChangeTemplate}
                onSaved={handleSaved}
              />
            </motion.div>
          )}
          {activeTab === "designs" && (
            <motion.div
              key="designs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <MyDesigns
                onEdit={handleEditDesign}
                onCreateNew={() => setActiveTab("gallery")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/60 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with{" "}
            <Heart
              className="inline w-3 h-3 text-primary mx-0.5"
              strokeWidth={2}
            />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <Toaster richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
