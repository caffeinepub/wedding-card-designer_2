import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { FC } from "react";

const CELESTIAL_GALLERY_STARS = [
  { id: "cg1", l: "15%", t: "10%", o: 0.3 },
  { id: "cg2", l: "25%", t: "22%", o: 0.5 },
  { id: "cg3", l: "35%", t: "34%", o: 0.7 },
  { id: "cg4", l: "45%", t: "46%", o: 0.3 },
  { id: "cg5", l: "55%", t: "58%", o: 0.5 },
  { id: "cg6", l: "65%", t: "70%", o: 0.7 },
  { id: "cg7", l: "75%", t: "22%", o: 0.3 },
  { id: "cg8", l: "82%", t: "46%", o: 0.5 },
];

export interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  style: React.CSSProperties;
  className: string;
  textColor: string;
  accentColor: string;
  bgPreview: React.ReactNode;
}

const templates: Template[] = [
  {
    id: "floral",
    name: "Floral Romance",
    description: "Soft watercolor roses with blush pink elegance",
    tags: ["Romantic", "Classic"],
    style: {},
    className: "template-floral",
    textColor: "#7a3040",
    accentColor: "#d4748a",
    bgPreview: (
      <div className="relative w-full h-full overflow-hidden">
        <img
          src="/assets/generated/wedding-template-floral.dim_800x560.jpg"
          alt="Floral template"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/30 flex flex-col items-center justify-center gap-1">
          <p className="text-xs tracking-widest text-rose-600/70 uppercase">
            The Wedding of
          </p>
          <p className="font-script text-2xl text-rose-800">
            Sophia &amp; James
          </p>
          <div className="w-10 h-px bg-rose-300 my-1" />
          <p className="text-xs text-rose-600/70 italic">June 14, 2026</p>
        </div>
      </div>
    ),
  },
  {
    id: "modern",
    name: "Modern Sage",
    description: "Clean minimal lines with sage green accents",
    tags: ["Modern", "Minimal"],
    style: {},
    className: "template-modern",
    textColor: "#2c3a2a",
    accentColor: "#6b8f6b",
    bgPreview: (
      <div className="relative w-full h-full overflow-hidden">
        <img
          src="/assets/generated/wedding-template-modern.dim_800x560.jpg"
          alt="Modern template"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/40 flex flex-col items-center justify-center gap-2">
          <p className="text-xs tracking-[0.25em] text-[#5a7a55]/70 uppercase">
            You are invited
          </p>
          <p className="font-display text-xl text-[#2c3a2a] font-light">
            Emily &amp; Oliver
          </p>
          <div className="w-8 h-[1.5px] bg-[#6b8f6b]/50" />
          <p className="text-xs text-[#4a5e47]/70">August 20, 2026</p>
        </div>
      </div>
    ),
  },
  {
    id: "vintage",
    name: "Vintage Gold",
    description: "Victorian ornate frames with dusty rose tones",
    tags: ["Vintage", "Opulent"],
    style: {},
    className: "template-vintage",
    textColor: "#4a3000",
    accentColor: "#b8960c",
    bgPreview: (
      <div className="relative w-full h-full overflow-hidden">
        <img
          src="/assets/generated/wedding-template-vintage.dim_800x560.jpg"
          alt="Vintage template"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-amber-50/40 flex flex-col items-center justify-center gap-2">
          <p className="text-xs tracking-widest text-amber-700/60 uppercase">
            ~ Est. 2026 ~
          </p>
          <p className="font-display italic text-xl text-amber-900">
            Victoria &amp; Edward
          </p>
          <div className="text-amber-500/50 text-xs">❧</div>
          <p className="text-xs text-amber-700/70 italic">September 8, 2026</p>
        </div>
      </div>
    ),
  },
  {
    id: "garden",
    name: "Garden Whimsy",
    description: "Botanical greenery with whimsical script",
    tags: ["Botanical", "Whimsical"],
    style: {},
    className: "template-garden",
    textColor: "#2d5a1b",
    accentColor: "#4a7c2f",
    bgPreview: (
      <div
        className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center gap-2"
        style={{
          background:
            "linear-gradient(145deg, #f0f7ec 0%, #e8f5e1 50%, #f5f9f2 100%)",
        }}
      >
        <div className="absolute top-2 left-2 text-3xl opacity-10">🌿</div>
        <div className="absolute bottom-2 right-2 text-3xl opacity-10 scale-x-[-1]">
          🌿
        </div>
        <p
          className="text-xs text-[#3d6b25]/60 uppercase tracking-widest"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          With great joy
        </p>
        <p className="font-script text-2xl text-[#2d5a1b]">Clara &amp; Henry</p>
        <div className="text-[#4a7c2f]/40 text-xs">— ❀ —</div>
        <p
          className="text-xs text-[#3d6b25]/60"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          May 3, 2026
        </p>
      </div>
    ),
  },
  {
    id: "royal",
    name: "Royal Navy",
    description: "Deep navy with gold, regal symmetrical design",
    tags: ["Regal", "Formal"],
    style: {},
    className: "template-royal",
    textColor: "#f0d87a",
    accentColor: "#c8a850",
    bgPreview: (
      <div
        className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center gap-2"
        style={{
          background:
            "linear-gradient(180deg, #0d1b3e 0%, #1a2d5a 50%, #0d1b3e 100%)",
        }}
      >
        <div className="absolute inset-4 border border-[#f0d87a]/20 rounded" />
        <p
          className="text-xs tracking-[0.3em] text-[#f0d87a]/50 uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          The Union of
        </p>
        <div className="text-[#f0d87a]/40 text-xs">✦</div>
        <p className="font-display text-xl text-[#f0d87a] font-semibold">
          William &amp; Diana
        </p>
        <div className="w-10 h-px bg-[#f0d87a]/30" />
        <p
          className="text-xs text-[#c8a850]/60 italic"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          November 20, 2026
        </p>
      </div>
    ),
  },
  {
    id: "celestial",
    name: "Celestial Dreams",
    description: "Midnight blue with silver stars and moon motifs",
    tags: ["Dreamy", "Celestial"],
    style: {},
    className: "template-celestial",
    textColor: "#c8d8f0",
    accentColor: "#9ab5d5",
    bgPreview: (
      <div
        className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center gap-2"
        style={{
          background:
            "linear-gradient(180deg, #05091a 0%, #0c1535 50%, #050820 100%)",
        }}
      >
        {CELESTIAL_GALLERY_STARS.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: "2px",
              height: "2px",
              left: star.l,
              top: star.t,
              opacity: star.o,
            }}
          />
        ))}
        <p
          className="text-xs tracking-[0.25em] text-[#c8d8f0]/40 uppercase"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Under the Stars
        </p>
        <p className="font-script text-2xl text-[#c8d8f0]">Luna &amp; Orion</p>
        <div className="text-[#c8d8f0]/30 text-xs">☽ · ☾</div>
        <p
          className="text-xs text-[#9ab5d5]/50"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          December 12, 2026
        </p>
      </div>
    ),
  },
];

interface TemplateGalleryProps {
  onSelect: (templateId: string) => void;
}

const TemplateGallery: FC<TemplateGalleryProps> = ({ onSelect }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          Begin Your Story
        </p>
        <h2 className="font-display text-4xl font-medium text-foreground mb-4">
          Choose Your Template
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
          Each design tells a different story. Select the one that speaks to
          your love.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            data-ocid={`template.item.${index + 1}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            onClick={() => onSelect(template.id)}
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 group-hover:-translate-y-1">
              {/* Card Preview */}
              <div className="h-48 relative overflow-hidden">
                {template.bgPreview}
              </div>

              {/* Info */}
              <div className="bg-card border-t border-border px-5 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-medium text-foreground text-base">
                      {template.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 mt-1 shrink-0" />
                </div>
                <div className="flex gap-1.5 mt-3">
                  {template.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TemplateGallery;
