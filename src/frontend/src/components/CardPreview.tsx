import type { FC } from "react";

export interface CardData {
  partner1Name: string;
  partner2Name: string;
  weddingDate: string;
  venue: string;
  message: string;
  rsvpDetails: string;
  templateId: string;
}

interface CardPreviewProps {
  data: CardData;
  previewId?: string;
  scale?: number;
}

const CELESTIAL_STARS = [
  { id: "s1", w: "3px", h: "3px", l: "10%", t: "5%", o: 0.45 },
  { id: "s2", w: "2px", h: "2px", l: "17.5%", t: "16%", o: 0.6 },
  { id: "s3", w: "2px", h: "2px", l: "25%", t: "27%", o: 0.75 },
  { id: "s4", w: "3px", h: "3px", l: "32.5%", t: "38%", o: 0.45 },
  { id: "s5", w: "2px", h: "2px", l: "40%", t: "49%", o: 0.6 },
  { id: "s6", w: "2px", h: "2px", l: "47.5%", t: "60%", o: 0.75 },
  { id: "s7", w: "3px", h: "3px", l: "55%", t: "71%", o: 0.45 },
  { id: "s8", w: "2px", h: "2px", l: "62.5%", t: "82%", o: 0.6 },
  { id: "s9", w: "2px", h: "2px", l: "70%", t: "8%", o: 0.75 },
  { id: "s10", w: "3px", h: "3px", l: "77.5%", t: "30%", o: 0.45 },
  { id: "s11", w: "2px", h: "2px", l: "85%", t: "55%", o: 0.6 },
  { id: "s12", w: "2px", h: "2px", l: "20%", t: "75%", o: 0.75 },
];

const GALLERY_STARS = [
  { id: "gs1", l: "15%", t: "10%", o: 0.3 },
  { id: "gs2", l: "25%", t: "22%", o: 0.5 },
  { id: "gs3", l: "35%", t: "34%", o: 0.7 },
  { id: "gs4", l: "45%", t: "46%", o: 0.3 },
  { id: "gs5", l: "55%", t: "58%", o: 0.5 },
  { id: "gs6", l: "65%", t: "70%", o: 0.7 },
  { id: "gs7", l: "75%", t: "22%", o: 0.3 },
  { id: "gs8", l: "82%", t: "46%", o: 0.5 },
];

const FloralDecorations: FC = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-white/40" />
    <div className="absolute inset-3 border border-white/50 rounded" />
  </div>
);

const ModernDecorations: FC = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-white/50" />
    <div className="absolute top-0 left-0 right-0 h-1 bg-[#6b8f6b]/60" />
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#6b8f6b]/60" />
  </div>
);

const VintageDecorations: FC = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-amber-50/50" />
    <div className="absolute inset-4 border-2 border-[#b8960c]/60" />
    <div className="absolute inset-6 border border-[#b8960c]/40" />
  </div>
);

const GardenDecorations: FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div
      className="absolute top-0 left-0 w-24 h-24 opacity-20"
      style={{
        background: "radial-gradient(circle, #4a7c2f 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute bottom-0 right-0 w-32 h-32 opacity-20"
      style={{
        background: "radial-gradient(circle, #3d6b25 0%, transparent 70%)",
      }}
    />
    <div className="absolute top-1/2 left-4 -translate-y-1/2 text-4xl opacity-15">
      🌿
    </div>
    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-4xl opacity-15 scale-x-[-1]">
      🌿
    </div>
  </div>
);

const RoyalDecorations: FC = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-4 border border-[#f0d87a]/30" />
    <div className="absolute inset-6 border border-[#f0d87a]/20" />
    <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[#f0d87a]/40 text-2xl">
      ♛
    </div>
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#f0d87a]/40 text-2xl">
      ✦
    </div>
  </div>
);

const CelestialDecorations: FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {CELESTIAL_STARS.map((star) => (
      <div
        key={star.id}
        className="absolute rounded-full bg-white"
        style={{
          width: star.w,
          height: star.h,
          left: star.l,
          top: star.t,
          opacity: star.o,
        }}
      />
    ))}
    <div className="absolute top-6 right-8 text-[#c8d8f0]/30 text-xl">☽</div>
    <div className="absolute bottom-6 left-8 text-[#c8d8f0]/30 text-xl">✦</div>
  </div>
);

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const CardPreview: FC<CardPreviewProps> = ({
  data,
  previewId = "card-preview",
  scale,
}) => {
  const {
    partner1Name,
    partner2Name,
    weddingDate,
    venue,
    message,
    rsvpDetails,
    templateId,
  } = data;

  const p1 = partner1Name || "Partner One";
  const p2 = partner2Name || "Partner Two";
  const dateDisplay = formatDate(weddingDate) || "October 12, 2026";
  const venueDisplay = venue || "A Beautiful Venue, City, Country";
  const messageDisplay =
    message ||
    "Together with their families, invite you to celebrate their love";
  const rsvpDisplay =
    rsvpDetails || "RSVP by September 1, 2026 · rsvp@wedding.com";

  const wrapperStyle: React.CSSProperties = scale
    ? { transform: `scale(${scale})`, transformOrigin: "top center" }
    : {};

  if (templateId === "floral") {
    return (
      <div
        id={previewId}
        className="template-floral relative w-[400px] h-[560px] flex flex-col items-center justify-center text-center p-8 overflow-hidden rounded"
        style={wrapperStyle}
      >
        <FloralDecorations />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <p className="text-sm uppercase tracking-widest text-rose-500/80 font-light">
            The Wedding of
          </p>
          <div className="flex flex-col items-center">
            <span className="font-script text-4xl text-rose-800">{p1}</span>
            <span className="text-rose-400 text-xl my-1">&amp;</span>
            <span className="font-script text-4xl text-rose-800">{p2}</span>
          </div>
          <div className="w-20 h-px bg-rose-300 my-2" />
          <p className="font-display italic text-lg text-rose-700">
            {dateDisplay}
          </p>
          <p className="text-sm text-rose-600/80">{venueDisplay}</p>
          <div className="w-14 h-px bg-rose-200 my-2" />
          <p className="text-xs text-rose-600/70 leading-relaxed max-w-xs italic">
            {messageDisplay}
          </p>
          {rsvpDisplay && (
            <p className="text-xs text-rose-500/60 mt-3">{rsvpDisplay}</p>
          )}
        </div>
      </div>
    );
  }

  if (templateId === "modern") {
    return (
      <div
        id={previewId}
        className="template-modern relative w-[400px] h-[560px] flex flex-col items-center justify-center text-center p-10 overflow-hidden rounded"
        style={wrapperStyle}
      >
        <ModernDecorations />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#5a7a55]/70">
            You are invited to celebrate
          </p>
          <div>
            <div className="font-display font-light text-3xl text-[#2c3a2a]">
              {p1}
            </div>
            <div className="text-[#6b8f6b] text-base my-1">— and —</div>
            <div className="font-display font-light text-3xl text-[#2c3a2a]">
              {p2}
            </div>
          </div>
          <div className="w-16 h-[1.5px] bg-[#6b8f6b]/50 my-1" />
          <div className="bg-[#6b8f6b]/10 px-6 py-2 rounded-full">
            <p className="text-sm text-[#2c3a2a] font-medium">{dateDisplay}</p>
          </div>
          <p className="text-sm text-[#4a5e47]/80">{venueDisplay}</p>
          <div className="w-10 h-[1px] bg-[#6b8f6b]/40 my-1" />
          <p className="text-xs text-[#4a5e47]/70 leading-relaxed max-w-[260px]">
            {messageDisplay}
          </p>
          {rsvpDisplay && (
            <p className="text-xs text-[#5a7a55]/50 mt-2">{rsvpDisplay}</p>
          )}
        </div>
      </div>
    );
  }

  if (templateId === "vintage") {
    return (
      <div
        id={previewId}
        className="template-vintage relative w-[400px] h-[560px] flex flex-col items-center justify-center text-center p-10 overflow-hidden rounded"
        style={wrapperStyle}
      >
        <VintageDecorations />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <p className="text-xs uppercase tracking-widest text-amber-700/60">
            ~ Marriage Celebration ~
          </p>
          <div className="text-amber-600/50 text-lg">❧</div>
          <div>
            <div className="font-display italic font-semibold text-3xl text-amber-900">
              {p1}
            </div>
            <div className="text-amber-600 text-base my-1 font-display italic">
              &amp;
            </div>
            <div className="font-display italic font-semibold text-3xl text-amber-900">
              {p2}
            </div>
          </div>
          <div className="text-amber-600/50 text-lg">❧</div>
          <div className="bg-amber-700/10 px-6 py-1.5 border border-amber-600/30">
            <p className="text-sm text-amber-800 font-display italic">
              {dateDisplay}
            </p>
          </div>
          <p className="text-xs text-amber-700/80">{venueDisplay}</p>
          <div className="w-16 h-px bg-amber-400/40 my-1" />
          <p className="text-xs text-amber-700/70 leading-relaxed max-w-[260px] italic">
            {messageDisplay}
          </p>
          {rsvpDisplay && (
            <p className="text-xs text-amber-600/50 mt-2">{rsvpDisplay}</p>
          )}
        </div>
      </div>
    );
  }

  if (templateId === "garden") {
    return (
      <div
        id={previewId}
        className="template-garden relative w-[400px] h-[560px] flex flex-col items-center justify-center text-center p-8 overflow-hidden rounded"
        style={wrapperStyle}
      >
        <GardenDecorations />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <p
            className="text-xs uppercase tracking-widest text-[#3d6b25]/70"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            With great joy
          </p>
          <div className="text-[#4a7c2f]/40 text-sm">✿ ✿ ✿</div>
          <div>
            <div className="font-script text-4xl text-[#2d5a1b]">{p1}</div>
            <div className="text-[#5a8a3a] text-lg my-1 font-script">& </div>
            <div className="font-script text-4xl text-[#2d5a1b]">{p2}</div>
          </div>
          <div className="text-[#4a7c2f]/40 text-sm">— ❀ —</div>
          <p
            className="text-sm text-[#2d5a1b]/80"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {dateDisplay}
          </p>
          <p
            className="text-xs text-[#3d6b25]/70"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {venueDisplay}
          </p>
          <div className="w-14 h-px bg-[#4a7c2f]/30 my-1" />
          <p
            className="text-xs text-[#3d6b25]/65 leading-relaxed max-w-[260px]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {messageDisplay}
          </p>
          {rsvpDisplay && (
            <p
              className="text-xs text-[#4a7c2f]/50 mt-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {rsvpDisplay}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (templateId === "royal") {
    return (
      <div
        id={previewId}
        className="template-royal relative w-[400px] h-[560px] flex flex-col items-center justify-center text-center p-10 overflow-hidden rounded"
        style={wrapperStyle}
      >
        <RoyalDecorations />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="text-[#f0d87a]/60 text-2xl">✦</div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#f0d87a]/50">
            The Union of
          </p>
          <div>
            <div className="font-display font-semibold text-3xl text-[#f0d87a]">
              {p1}
            </div>
            <div className="text-[#c8a850]/60 text-base my-1">✦ and ✦</div>
            <div className="font-display font-semibold text-3xl text-[#f0d87a]">
              {p2}
            </div>
          </div>
          <div className="w-20 h-[1px] bg-[#f0d87a]/30 my-2" />
          <p className="text-sm text-[#f0d87a]/80 font-display italic">
            {dateDisplay}
          </p>
          <p className="text-xs text-[#c8a850]/60">{venueDisplay}</p>
          <div className="w-12 h-[1px] bg-[#f0d87a]/20 my-2" />
          <p className="text-xs text-[#f0d87a]/55 leading-relaxed max-w-[260px] italic">
            {messageDisplay}
          </p>
          {rsvpDisplay && (
            <p className="text-xs text-[#c8a850]/40 mt-3">{rsvpDisplay}</p>
          )}
          <div className="text-[#f0d87a]/30 text-sm mt-1">✦</div>
        </div>
      </div>
    );
  }

  // celestial
  return (
    <div
      id={previewId}
      className="template-celestial relative w-[400px] h-[560px] flex flex-col items-center justify-center text-center p-8 overflow-hidden rounded"
      style={wrapperStyle}
    >
      <CelestialDecorations />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="text-[#c8d8f0]/40 text-xl">✦ · ✦</div>
        <p
          className="text-xs uppercase tracking-[0.3em] text-[#c8d8f0]/40"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Under the Stars
        </p>
        <div>
          <div className="font-script text-4xl text-[#c8d8f0]">{p1}</div>
          <div className="text-[#9ab5d5]/50 text-base my-1">☽ &amp; ☾</div>
          <div className="font-script text-4xl text-[#c8d8f0]">{p2}</div>
        </div>
        <div className="w-20 h-px bg-[#c8d8f0]/20 my-2" />
        <p
          className="text-sm text-[#c8d8f0]/70"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {dateDisplay}
        </p>
        <p
          className="text-xs text-[#9ab5d5]/50"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {venueDisplay}
        </p>
        <div className="w-12 h-px bg-[#c8d8f0]/15 my-2" />
        <p className="text-xs text-[#c8d8f0]/50 leading-relaxed max-w-[260px] italic">
          {messageDisplay}
        </p>
        {rsvpDisplay && (
          <p
            className="text-xs text-[#9ab5d5]/35 mt-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {rsvpDisplay}
          </p>
        )}
        <div className="text-[#c8d8f0]/25 text-sm mt-1">✦ · ✦</div>
      </div>
    </div>
  );
};

export { GALLERY_STARS };
export default CardPreview;
