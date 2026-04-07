import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";

const WINE = "#8B0000";
const BLACK = "#0A0A0A";
const WHITE = "#FFFFFF";
const INK = "#111111";
const CREAM = "#F8F5F0";

// ─── Parallax split section ─────────────────────────────────────────────────

function SplitSection({
  image,
  imageAlt = "",
  imagePosition = "left",
  label,
  heading,
  body,
  dark = false,
}: {
  image: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  label: string;
  heading: React.ReactNode;
  body: React.ReactNode;
  dark?: boolean;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const imgOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.6, 0.9],
    [0, 1, 1, 0]
  );
  const imgScale = useTransform(scrollYProgress, [0, 0.15, 0.85], [1.06, 1, 1.06]);

  const textX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.75, 0.95],
    [imagePosition === "left" ? 40 : -40, 0, 0, imagePosition === "left" ? -20 : 20]
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.7, 0.93],
    [0, 1, 1, 0]
  );

  const smImgX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85],
    [imagePosition === "left" ? -20 : 20, 0, imagePosition === "left" ? 10 : -10]
  );

  const bg = dark ? BLACK : CREAM;
  const textColor = dark ? WHITE : INK;
  const subColor = dark ? "rgba(255,255,255,0.45)" : "rgba(17,17,17,0.45)";
  const borderColor = dark ? "rgba(255,255,255,0.06)" : "rgba(17,17,17,0.06)";

  const imageCol = (
    <motion.div
      style={{
        position: "relative",
        overflow: "hidden",
        height: "100%",
        minHeight: 560,
        x: smImgX,
        opacity: imgOpacity,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: "-10%",
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: imgY,
          scale: imgScale,
          filter: dark ? "saturate(0.6)" : "saturate(0.75)",
        }}
      />
      {dark && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(10,10,10,0.3), transparent)",
          }}
        />
      )}
    </motion.div>
  );

  const textCol = (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "5rem 4rem",
        x: textX,
        opacity: textOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ width: 32, height: 1, background: WINE }} />
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            color: WINE,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2rem, 3.2vw, 3.2rem)",
          fontWeight: 400,
          color: textColor,
          lineHeight: 1.25,
          marginBottom: "1.75rem",
          letterSpacing: "-0.01em",
        }}
      >
        {heading}
      </h2>
      <div
        style={{
          width: 40,
          height: 1,
          background: borderColor,
          marginBottom: "1.75rem",
        }}
      />
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.9rem",
          color: subColor,
          lineHeight: 1.95,
        }}
      >
        {body}
      </div>
    </motion.div>
  );

  return (
    <section
      ref={sectionRef}
      style={{
        background: bg,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {imagePosition === "left" ? (
        <>
          {imageCol}
          {textCol}
        </>
      ) : (
        <>
          {textCol}
          {imageCol}
        </>
      )}
    </section>
  );
}

// ─── Scroll-driven text line ──────────────────────────────────────────────────

function ScrollLine({
  text,
  dark = true,
}: {
  text: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 0.5, 1], ["-4%", "0%", "4%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.65, 0.9],
    [0, 1, 1, 0]
  );

  return (
    <div
      ref={ref}
      style={{
        overflow: "hidden",
        padding: "7rem 0",
        background: dark ? BLACK : WHITE,
      }}
    >
      <motion.div
        style={{
          x,
          opacity,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(3rem, 8vw, 7rem)",
          fontWeight: 300,
          color: dark ? WHITE : INK,
          whiteSpace: "nowrap",
          textAlign: "center",
          letterSpacing: "-0.02em",
        }}
      >
        {text}
      </motion.div>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = document.querySelector(".scroll-root");
    const onScroll = () => setScrolled((el?.scrollTop ?? 0) > 60);
    el?.addEventListener("scroll", onScroll, { passive: true });
    return () => el?.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "1.4rem 3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(10,10,10,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        transition: "all 0.5s ease",
        borderBottom: scrolled ? "1px solid rgba(139,0,0,0.15)" : "none",
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1rem",
          letterSpacing: "0.4em",
          color: WHITE,
          fontWeight: 300,
          textTransform: "uppercase",
        }}
      >
        Apotheca
      </span>
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
        {["Menú", "Catas", "Reservar"].map((item) => (
          <span
            key={item}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.6)",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = WHITE)
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)")
            }
          >
            {item}
          </span>
        ))}
        <div style={{ width: "1.2rem", height: 1, background: WINE }} />
      </div>
    </motion.nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.7], [0.5, 0.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: BLACK,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: "-5%",
          backgroundImage: "url(/__mockup/images/apotheca-hero.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          scale: imgScale,
          opacity: imgOpacity,
          filter: "saturate(0.65)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.15) 40%, rgba(10,10,10,0.75) 100%)",
        }}
      />

      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 2rem",
          maxWidth: 860,
          y: textY,
          opacity: textOpacity,
        }}
      >
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          style={{
            width: 40,
            height: 1,
            background: WINE,
            margin: "0 auto 2.5rem",
            transformOrigin: "left",
          }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
            fontWeight: 300,
            color: WHITE,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
          }}
        >
          Entre humo,
          <br />
          <em>historia</em> y agave
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.75rem",
            letterSpacing: "0.28em",
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            marginBottom: "3.5rem",
          }}
        >
          Un refugio oculto en la Juárez
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Btn variant="outline">Explorar experiencia</Btn>
          <Btn variant="solid">Reservar cata</Btn>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 56, background: "rgba(255,255,255,0.35)" }}
        />
      </motion.div>
    </section>
  );
}

// ─── Alternating double-image section ────────────────────────────────────────

function DoubleImageSection({
  images,
  textPosition = "right",
  label,
  heading,
  body,
  dark = false,
}: {
  images: [string, string];
  textPosition?: "left" | "right";
  label: string;
  heading: React.ReactNode;
  body: React.ReactNode;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const img1Y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const img2Y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const colOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.7, 0.92],
    [0, 1, 1, 0]
  );
  const textX = useTransform(
    scrollYProgress,
    [0, 0.18, 0.72, 0.92],
    [textPosition === "right" ? 50 : -50, 0, 0, textPosition === "right" ? -25 : 25]
  );

  const bg = dark ? BLACK : CREAM;
  const textColor = dark ? WHITE : INK;
  const subColor = dark ? "rgba(255,255,255,0.45)" : "rgba(17,17,17,0.45)";

  const imagesCol = (
    <motion.div
      style={{
        display: "grid",
        gridTemplateRows: "1fr 1fr",
        gap: "1rem",
        padding: "3rem",
        opacity: colOpacity,
      }}
    >
      <motion.div
        style={{
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: "-12%",
            backgroundImage: `url(${images[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            y: img1Y,
            filter: dark ? "saturate(0.55)" : "saturate(0.7)",
          }}
        />
      </motion.div>
      <motion.div
        style={{
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: "-12%",
            backgroundImage: `url(${images[1]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            y: img2Y,
            filter: dark ? "saturate(0.55)" : "saturate(0.7)",
          }}
        />
      </motion.div>
    </motion.div>
  );

  const textCol = (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "5rem 4rem",
        x: textX,
        opacity: colOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ width: 28, height: 1, background: WINE }} />
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            color: WINE,
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2rem, 3.2vw, 3.2rem)",
          fontWeight: 400,
          color: textColor,
          lineHeight: 1.25,
          marginBottom: "1.75rem",
        }}
      >
        {heading}
      </h2>
      <div style={{ width: 36, height: 1, background: dark ? "rgba(255,255,255,0.08)" : "rgba(17,17,17,0.08)", marginBottom: "1.75rem" }} />
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.88rem",
          color: subColor,
          lineHeight: 2,
        }}
      >
        {body}
      </div>
    </motion.div>
  );

  return (
    <section
      ref={ref}
      style={{
        background: bg,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {textPosition === "right" ? (
        <>
          {imagesCol}
          {textCol}
        </>
      ) : (
        <>
          {textCol}
          {imagesCol}
        </>
      )}
    </section>
  );
}

// ─── Menu cinematic ───────────────────────────────────────────────────────────

function MenuSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.25], [60, 0]);
  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.7, 0.9],
    [0, 1, 1, 0]
  );

  const items = [
    { nombre: "Espadín", region: "San Luis Potosí", notas: "Ahumado · Cítrico · Pimienta", copa: "$140", botella: "$795", tag: "Oaxaca" },
    { nombre: "Cupreata", region: "Guerrero", notas: "Floral · Mineral · Tierra húmeda", copa: "$180", botella: "$1,050", tag: "Especial" },
    { nombre: "Bacanora", region: "Sonora", notas: "Seco · Herbal · Madera ahumada", copa: "$200", botella: "$1,200", tag: "Especial" },
    { nombre: "Mezcal de Flores", region: "Oaxaca", notas: "Tropical · Floral · Especiado", copa: "$220", botella: "$1,350", tag: "Especial" },
    { nombre: "Abraxas", region: "Oaxaca", notas: "Terroso · Complejo · Largo final", copa: "$260", botella: "$1,600", tag: "Reserva" },
  ];

  return (
    <section
      ref={sectionRef}
      style={{ background: WHITE, padding: "8rem 0", overflow: "hidden" }}
    >
      <motion.div
        style={{ y: headingY, opacity: headingOpacity, textAlign: "center", marginBottom: "5rem", padding: "0 3rem" }}
      >
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: WINE, textTransform: "uppercase", marginBottom: "1.5rem" }}>
          Carta de mezcales
        </div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(3rem, 6vw, 5rem)",
            fontWeight: 300,
            color: INK,
            letterSpacing: "-0.02em",
          }}
        >
          Cada mezcal, <em>una historia</em>
        </h2>
      </motion.div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 3rem" }}>
        {items.map((item, i) => (
          <MenuRow key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

function MenuRow({ item, index }: { item: { nombre: string; region: string; notas: string; copa: string; botella: string; tag: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 0.3, 0.75, 0.95], [-40, 0, 0, 20]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.7, 0.95], [0, 1, 1, 0]);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        padding: "2rem 0",
        borderBottom: "1px solid rgba(17,17,17,0.07)",
        x,
        opacity,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.8rem", marginBottom: "0.3rem" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.75rem", fontWeight: 400, color: hovered ? WINE : INK, transition: "color 0.3s", margin: 0 }}>
            {item.nombre}
          </h3>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: "rgba(139,0,0,0.6)", border: "1px solid rgba(139,0,0,0.2)", padding: "0.15rem 0.5rem", textTransform: "uppercase" }}>
            {item.tag}
          </span>
        </div>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "rgba(17,17,17,0.38)", letterSpacing: "0.04em" }}>
          {item.region} · {item.notas}
        </span>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: INK, fontWeight: 500 }}>
          {item.copa}{" "}
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "rgba(17,17,17,0.3)" }}>copa</span>
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "rgba(17,17,17,0.4)" }}>
          {item.botella} botella
        </div>
      </div>
    </motion.div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const quotes = [
    { text: "The best part of my time in CDMX.", author: "James W. · New York" },
    { text: "El mezcal es fantástico y la vibra es aún mejor.", author: "María G. · Guadalajara" },
    { text: "Drop everything and go!", author: "Claire D. · Paris" },
    { text: "Lugar de culto.", author: "Rodrigo V. · Ciudad de México" },
  ];

  return (
    <section ref={ref} style={{ background: BLACK, padding: "9rem 3rem", overflow: "hidden" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          {quotes.map((q, i) => (
            <QuoteCard key={i} quote={q} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteCard({ quote, index }: { quote: { text: string; author: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 0.3, 0.75, 0.95], [50, 0, 0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.72, 0.94], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: index % 3 === 0 ? "3rem" : "2.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: index % 3 === 0 ? 220 : 170,
        y,
        opacity,
      }}
    >
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: index % 3 === 0 ? "1.6rem" : "1.25rem", color: WHITE, fontStyle: "italic", lineHeight: 1.5, marginBottom: "1.5rem", flex: 1 }}>
        "{quote.text}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: 20, height: 1, background: WINE }} />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", color: "rgba(255,255,255,0.32)", letterSpacing: "0.08em" }}>
          {quote.author}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Reservation CTA ──────────────────────────────────────────────────────────

function ReservationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.4, 0.85], [60, 0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 0.97], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        padding: "11rem 3rem",
        background: INK,
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/__mockup/images/apotheca-room.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          filter: "saturate(0)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(139,0,0,0.18) 0%, transparent 70%)",
        }}
      />
      <motion.div style={{ position: "relative", zIndex: 2, y, opacity }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: WINE, textTransform: "uppercase", marginBottom: "2rem" }}>
          Reservaciones
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, color: WHITE, marginBottom: "1.5rem", letterSpacing: "-0.01em" }}>
          Reserva tu lugar<br /><em>en la experiencia</em>
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.38)", marginBottom: "3.5rem", lineHeight: 1.8 }}>
          Espacio limitado. Atención personalizada.<br />Cada visita es única.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Btn variant="solid">Reservar experiencia</Btn>
          <Btn variant="outline">WhatsApp directo</Btn>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const left = useTransform(scrollYProgress, [0, 0.25, 0.8], [-40, 0, 0]);
  const right = useTransform(scrollYProgress, [0, 0.25, 0.8], [40, 0, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 0.97], [0, 1, 1, 0]);

  const horarios = [
    { dia: "Miércoles", hora: "5:00 – 10:00 PM" },
    { dia: "Jueves", hora: "5:00 PM – 12:00 AM" },
    { dia: "Sábado", hora: "3:00 PM – 1:00 AM" },
    { dia: "Domingo", hora: "3:00 – 9:00 PM" },
  ];

  return (
    <section ref={ref} style={{ background: CREAM, padding: "9rem 3rem", overflow: "hidden" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7rem" }}>
        <motion.div style={{ x: left, opacity }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: WINE, textTransform: "uppercase", marginBottom: "2rem" }}>
            Encuéntranos
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 500, color: INK, marginBottom: "0.4rem" }}>
            C. Versalles 113
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(17,17,17,0.45)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            Colonia Juárez, Cuauhtémoc<br />
            06600 Ciudad de México<br />
            <em style={{ fontStyle: "normal", color: "rgba(139,0,0,0.65)" }}>Dentro de Casa Versalles</em>
          </p>
          <a href="tel:+5215534747098" style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: INK, textDecoration: "none", marginBottom: "0.5rem" }}>
            +52 55 3474 7098
          </a>
          <a href="https://wa.me/5215534747098" target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: WINE, textDecoration: "none", letterSpacing: "0.08em" }}>
            WhatsApp para reservaciones →
          </a>
        </motion.div>
        <motion.div style={{ x: right, opacity }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: WINE, textTransform: "uppercase", marginBottom: "2rem" }}>
            Horarios
          </div>
          {horarios.map((h) => (
            <div key={h.dia} style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0", borderBottom: "1px solid rgba(17,17,17,0.07)" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: INK, fontWeight: 500 }}>{h.dia}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(17,17,17,0.42)", letterSpacing: "0.04em" }}>{h.hora}</span>
            </div>
          ))}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", color: "rgba(17,17,17,0.3)", marginTop: "1rem", fontStyle: "italic" }}>
            Lunes, martes y viernes cerrado. Eventos privados bajo consulta.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  return (
    <footer ref={ref} style={{ background: BLACK, padding: "7rem 3rem 4rem", textAlign: "center", overflow: "hidden" }}>
      <motion.div style={{ y, opacity }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(4.5rem, 13vw, 11rem)", fontWeight: 300, color: WHITE, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "2rem", opacity: 0.9 }}>
          APOTHECA
        </h2>
        <div style={{ width: 40, height: 1, background: WINE, margin: "0 auto 1.5rem" }} />
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>
          Donde el espíritu encuentra su origen
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.18em", marginTop: "3rem", textTransform: "uppercase" }}>
          Mezcal artesanal con propósito · CDMX
        </p>
      </motion.div>
    </footer>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

function Btn({ children, variant = "outline" }: { children: React.ReactNode; variant?: "outline" | "solid" }) {
  const [hov, setHov] = useState(false);
  const solid = variant === "solid";
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "0.9rem 2.25rem",
        border: solid ? `1px solid ${WINE}` : "1px solid rgba(255,255,255,0.3)",
        background: solid ? (hov ? "rgba(139,0,0,0.82)" : WINE) : hov ? "rgba(255,255,255,0.08)" : "transparent",
        color: WHITE,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.65rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      {children}
    </motion.button>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ApothecaSite() {
  return (
    <div style={{ background: WHITE, overflowX: "hidden" }}>
      <Nav />
      <Hero />

      {/* Sección 1: imagen grande izquierda + texto derecha */}
      <SplitSection
        image="/__mockup/images/apotheca-pour.png"
        imagePosition="left"
        label="El concepto"
        heading={<>Apotheca no es un bar.<br /><em>Es una botica contemporánea.</em></>}
        body="Cada botella es una pieza de historia viva. Cada sorbo, una conversación entre el fuego, la tierra y el tiempo. Aquí no se sirve mezcal — se guía una experiencia que transforma la percepción."
        dark={false}
      />

      <ScrollLine text="Mezcal artesanal con propósito" dark />

      {/* Sección 2: texto izquierda + imagen grande derecha */}
      <SplitSection
        image="/__mockup/images/apotheca-bottles.png"
        imagePosition="right"
        label="La colección"
        heading={<>Espíritus de origen.<br /><em>Selección editorial.</em></>}
        body="Curada con precisión desde Oaxaca, Guerrero y Sonora. Cada mezcal que encontrarás aquí fue elegido por su carácter único, su proceso artesanal y su capacidad de contar una historia distinta."
        dark={false}
      />

      <ScrollLine text="Entre humo, historia y agave" dark={false} />

      {/* Sección 3: 2 imágenes izquierda + texto derecha — oscuro */}
      <DoubleImageSection
        images={["/__mockup/images/apotheca-room.png", "/__mockup/images/apotheca-hero.png"]}
        textPosition="right"
        label="La experiencia"
        heading={<>"No solo servimos mezcal,<br /><em>te guiamos a través de él"</em></>}
        body={<>Nuestro equipo — Karen, Paco e Ingrid — te acompaña en un recorrido sensorial diseñado para revelar la complejidad del mezcal artesanal. Pet friendly · Música curada · Maridaje de autor.</>}
        dark
      />

      {/* Menú editorial */}
      <MenuSection />

      <ScrollLine text="Un espacio pequeño. Una experiencia profunda." dark />

      {/* Sección 4: texto izquierda + imagen derecha — oscuro */}
      <SplitSection
        image="/__mockup/images/apotheca-human.png"
        imagePosition="right"
        label="El lugar"
        heading={<>Un refugio oculto<br /><em>en la Colonia Juárez.</em></>}
        body="Versalles 113, dentro de Casa Versalles. Un espacio íntimo, diseñado para desconectarse del ruido de la ciudad y conectar con el ritual del mezcal. Solo para quienes saben buscar."
        dark
      />

      {/* Testimonios */}
      <TestimonialsSection />

      {/* Reservaciones */}
      <ReservationSection />

      {/* Contacto */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
