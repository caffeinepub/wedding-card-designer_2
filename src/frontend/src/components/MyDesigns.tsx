import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Edit2, Heart, MapPin, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { FC } from "react";
import { toast } from "sonner";
import type { Design } from "../backend.d";
import { useDeleteDesign, useGetAllDesigns } from "../hooks/useQueries";

const TEMPLATE_NAMES: Record<string, string> = {
  floral: "Floral Romance",
  modern: "Modern Sage",
  vintage: "Vintage Gold",
  garden: "Garden Whimsy",
  royal: "Royal Navy",
  celestial: "Celestial Dreams",
};

const TEMPLATE_COLORS: Record<string, string> = {
  floral: "bg-rose-100 text-rose-700",
  modern: "bg-green-100 text-green-700",
  vintage: "bg-amber-100 text-amber-700",
  garden: "bg-emerald-100 text-emerald-700",
  royal: "bg-blue-100 text-blue-800",
  celestial: "bg-indigo-100 text-indigo-800",
};

interface MyDesignsProps {
  onEdit: (design: Design) => void;
  onCreateNew: () => void;
}

const MyDesigns: FC<MyDesignsProps> = ({ onEdit, onCreateNew }) => {
  const { data: designs, isLoading, isError } = useGetAllDesigns();
  const deleteMutation = useDeleteDesign();
  const [deleteTarget, setDeleteTarget] = useState<Design | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Design deleted");
    } catch {
      toast.error("Failed to delete design");
    }
    setDeleteTarget(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Date TBD";
    try {
      const d = new Date(`${dateStr}T00:00:00`);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
            Your Collection
          </p>
          <h2 className="font-display text-4xl font-medium text-foreground">
            My Designs
          </h2>
        </div>
        <Button
          data-ocid="designs.primary_button"
          onClick={onCreateNew}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Design
        </Button>
      </motion.div>

      {isLoading && (
        <div
          data-ocid="designs.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(["sk1", "sk2", "sk3"] as const).map((sk) => (
            <div
              key={sk}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <Skeleton className="h-40 w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div data-ocid="designs.error_state" className="text-center py-16">
          <p className="text-destructive font-medium">Failed to load designs</p>
          <p className="text-muted-foreground text-sm mt-1">
            Please try refreshing the page
          </p>
        </div>
      )}

      {!isLoading && !isError && designs?.length === 0 && (
        <motion.div
          data-ocid="designs.empty_state"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-5">
            <Heart className="w-9 h-9 text-primary" strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-2xl font-medium text-foreground mb-2">
            No designs yet
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Create your first wedding card design and save it here for easy
            access.
          </p>
          <Button onClick={onCreateNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Your First Design
          </Button>
        </motion.div>
      )}

      {!isLoading && !isError && designs && designs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {designs.map((design, index) => (
              <motion.div
                key={design.id}
                data-ocid={`designs.item.${index + 1}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Visual header */}
                <div
                  className="h-36 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background:
                      design.templateId === "royal"
                        ? "linear-gradient(180deg, #0d1b3e 0%, #1a2d5a 100%)"
                        : design.templateId === "celestial"
                          ? "linear-gradient(180deg, #05091a 0%, #0c1535 100%)"
                          : design.templateId === "garden"
                            ? "linear-gradient(145deg, #f0f7ec 0%, #e8f5e1 100%)"
                            : undefined,
                  }}
                >
                  {(design.templateId === "floral" ||
                    design.templateId === "modern" ||
                    design.templateId === "vintage") && (
                    <img
                      src={`/assets/generated/wedding-template-${design.templateId}.dim_800x560.jpg`}
                      alt={design.templateId}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 text-center">
                    <p
                      className="font-script text-2xl"
                      style={{
                        color:
                          design.templateId === "royal" ||
                          design.templateId === "celestial"
                            ? "#f0d8a0"
                            : "#fff",
                        textShadow: "0 1px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      {design.partner1Name || "?"} &amp;{" "}
                      {design.partner2Name || "?"}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-medium text-foreground text-lg leading-tight">
                      {design.designName || "Untitled"}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                        TEMPLATE_COLORS[design.templateId] ||
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {TEMPLATE_NAMES[design.templateId] || design.templateId}
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    {design.weddingDate && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{formatDate(design.weddingDate)}</span>
                      </div>
                    )}
                    {design.venue && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{design.venue}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-border">
                    <Button
                      data-ocid={`designs.edit_button.${index + 1}`}
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(design)}
                      className="flex-1 text-xs h-8 gap-1.5"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      data-ocid={`designs.delete_button.${index + 1}`}
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(design)}
                      className="flex-1 text-xs h-8 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="designs.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete this design?
            </AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleteTarget?.designName}&quot; will be permanently
              deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="designs.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="designs.confirm_button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyDesigns;
