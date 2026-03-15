import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Download, Loader2, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { toast } from "sonner";
import type { Design } from "../backend.d";
import { useSaveDesign, useUpdateDesign } from "../hooks/useQueries";
import CardPreview from "./CardPreview";
import type { CardData } from "./CardPreview";

const TEMPLATE_NAMES: Record<string, string> = {
  floral: "Floral Romance",
  modern: "Modern Sage",
  vintage: "Vintage Gold",
  garden: "Garden Whimsy",
  royal: "Royal Navy",
  celestial: "Celestial Dreams",
};

interface CardEditorProps {
  templateId: string;
  existingDesign?: Design | null;
  onChangeTemplate: () => void;
  onSaved?: () => void;
}

const CardEditor: FC<CardEditorProps> = ({
  templateId,
  existingDesign,
  onChangeTemplate,
  onSaved,
}) => {
  const [formData, setFormData] = useState<CardData>({
    partner1Name: existingDesign?.partner1Name ?? "",
    partner2Name: existingDesign?.partner2Name ?? "",
    weddingDate: existingDesign?.weddingDate ?? "",
    venue: existingDesign?.venue ?? "",
    message: existingDesign?.message ?? "",
    rsvpDetails: existingDesign?.rsvpDetails ?? "",
    templateId,
  });
  const [designName, setDesignName] = useState(
    existingDesign?.designName ?? "",
  );
  const editingId = useRef<string | null>(existingDesign?.id ?? null);

  const saveMutation = useSaveDesign();
  const updateMutation = useUpdateDesign();

  const isPending = saveMutation.isPending || updateMutation.isPending;

  // Sync template changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, templateId }));
  }, [templateId]);

  const handleField = (field: keyof CardData | "designName", value: string) => {
    if (field === "designName") {
      setDesignName(value);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    if (!designName.trim()) {
      toast.error("Please enter a design name");
      return;
    }
    try {
      if (editingId.current) {
        await updateMutation.mutateAsync({
          id: editingId.current,
          partner1Name: formData.partner1Name,
          partner2Name: formData.partner2Name,
          weddingDate: formData.weddingDate,
          venue: formData.venue,
          message: formData.message,
          rsvpDetails: formData.rsvpDetails,
          templateId: formData.templateId,
          designName,
        });
        toast.success("Design updated!");
      } else {
        const newId = await saveMutation.mutateAsync({
          partner1Name: formData.partner1Name,
          partner2Name: formData.partner2Name,
          weddingDate: formData.weddingDate,
          venue: formData.venue,
          message: formData.message,
          rsvpDetails: formData.rsvpDetails,
          templateId: formData.templateId,
          designName,
        });
        editingId.current = newId;
        toast.success("Design saved!");
      }
      onSaved?.();
    } catch {
      toast.error("Failed to save design. Please try again.");
    }
  };

  const handleDownload = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const element = document.getElementById("card-preview");
      if (!element) {
        toast.error("Preview not found");
        return;
      }
      toast("Preparing download...");
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `${designName || "wedding-card"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Card downloaded!");
    } catch {
      toast.error("Download failed. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col lg:flex-row gap-8"
      >
        {/* Left: Form */}
        <div className="flex-1 min-w-0">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-medium text-foreground">
                Design Your Card
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fill in your details to personalize your invitation
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="design-name"
                  className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
                >
                  Design Name
                </Label>
                <Input
                  id="design-name"
                  data-ocid="editor.design_name_input"
                  placeholder="e.g. Our Special Day"
                  value={designName}
                  onChange={(e) => handleField("designName", e.target.value)}
                  className="bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="partner1"
                    className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
                  >
                    Partner 1 Name
                  </Label>
                  <Input
                    id="partner1"
                    data-ocid="editor.partner1_input"
                    placeholder="e.g. Alexandra"
                    value={formData.partner1Name}
                    onChange={(e) =>
                      handleField("partner1Name", e.target.value)
                    }
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="partner2"
                    className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
                  >
                    Partner 2 Name
                  </Label>
                  <Input
                    id="partner2"
                    data-ocid="editor.partner2_input"
                    placeholder="e.g. Benjamin"
                    value={formData.partner2Name}
                    onChange={(e) =>
                      handleField("partner2Name", e.target.value)
                    }
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="wedding-date"
                    className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
                  >
                    Wedding Date
                  </Label>
                  <Input
                    id="wedding-date"
                    data-ocid="editor.date_input"
                    type="date"
                    value={formData.weddingDate}
                    onChange={(e) => handleField("weddingDate", e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="venue"
                    className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
                  >
                    Venue / Location
                  </Label>
                  <Input
                    id="venue"
                    data-ocid="editor.venue_input"
                    placeholder="e.g. The Rose Garden, Paris"
                    value={formData.venue}
                    onChange={(e) => handleField("venue", e.target.value)}
                    className="bg-background"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
                >
                  Personal Message
                </Label>
                <Textarea
                  id="message"
                  data-ocid="editor.message_textarea"
                  placeholder="Together with their families, they invite you to celebrate their love..."
                  value={formData.message}
                  onChange={(e) => handleField("message", e.target.value)}
                  rows={3}
                  className="bg-background resize-none"
                />
              </div>

              <div>
                <Label
                  htmlFor="rsvp"
                  className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block"
                >
                  RSVP Details
                </Label>
                <Textarea
                  id="rsvp"
                  data-ocid="editor.rsvp_textarea"
                  placeholder="Please RSVP by July 1, 2026 · rsvp@example.com"
                  value={formData.rsvpDetails}
                  onChange={(e) => handleField("rsvpDetails", e.target.value)}
                  rows={2}
                  className="bg-background resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-5 border-t border-border">
              <Button
                data-ocid="editor.save_button"
                onClick={handleSave}
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingId.current ? "Update Design" : "Save Design"}
                  </>
                )}
              </Button>
              <Button
                data-ocid="editor.download_button"
                variant="outline"
                onClick={handleDownload}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Card
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:w-[460px] shrink-0">
          <div className="sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Template:
                </span>
                <Badge variant="secondary" className="font-medium">
                  {TEMPLATE_NAMES[templateId] || templateId}
                </Badge>
              </div>
              <Button
                data-ocid="editor.change_template_button"
                variant="ghost"
                size="sm"
                onClick={onChangeTemplate}
                className="text-xs h-8"
              >
                <ChevronLeft className="mr-1 h-3 w-3" />
                Change Template
              </Button>
            </div>

            <div className="flex items-center justify-center">
              <div className="card-preview-wrapper rounded-lg overflow-hidden">
                <CardPreview data={formData} previewId="card-preview" />
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Live preview updates as you type
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CardEditor;
