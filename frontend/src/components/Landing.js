import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, visible] = useFadeIn();
  const transforms = {
    up:    visible ? "translateY(0)"  : "translateY(24px)",
    down:  visible ? "translateY(0)"  : "translateY(-24px)",
    left:  visible ? "translateX(0)"  : "translateX(-24px)",
    right: visible ? "translateX(0)"  : "translateX(24px)",
  };
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: transforms[direction],
      transition: `opacity 0.55s ease-out ${delay}ms, transform 0.55s ease-out ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

const features = [
  {
    emoji: "🎯",
    title: "Smart Predictions",
    description: "Get accurate CO₂ estimates powered by advanced machine learning algorithms",
    border: "border-emerald-100 hover:border-emerald-300",
    shadow: "hover:shadow-emerald-100",
    badge: "bg-emerald-50 text-emerald-700",
    badgeText: "ML Powered",
  },
  {
    emoji: "📊",
    title: "Track History",
    description: "Monitor all your predictions and see your environmental impact over time",
    border: "border-blue-100 hover:border-blue-300",
    shadow: "hover:shadow-blue-100",
    badge: "bg-blue-50 text-blue-700",
    badgeText: "Full History",
  },
  {
    emoji: "📈",
    title: "Analyze Trends",
    description: "Visualize patterns and optimize your travel for minimal carbon footprint",
    border: "border-purple-100 hover:border-purple-300",
    shadow: "hover:shadow-purple-100",
    badge: "bg-purple-50 text-purple-700",
    badgeText: "Data Insights",
  },
];

const stats = [
  { value: "AI", label: "Powered", sub: "Advanced Machine Learning", gradient: "from-emerald-600 to-green-600", border: "border-emerald-100" },
  { value: "⚡", label: "Real-Time", sub: "Instant Predictions",       gradient: "from-blue-600 to-cyan-600",    border: "border-blue-100"    },
  { value: "100%", label: "Eco-Focused", sub: "Carbon Awareness",      gradient: "from-purple-600 to-pink-600",  border: "border-purple-100"  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => { setTimeout(() => setHeaderVisible(true), 100); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 flex flex-col relative overflow-hidden">

      {/* Decorative blobs — same as other pages */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-teal-200/15 rounded-full blur-3xl" />
      </div>

      {/* Faint watermark + floating leaves */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] select-none pointer-events-none">
        <div className="text-[32rem] leading-none">🌍</div>
      </div>
      <div className="fixed inset-0 pointer-events-none select-none">
        <div className="absolute top-20 right-20 opacity-[0.06] text-[10rem] rotate-45">🍃</div>
        <div className="absolute bottom-40 left-32 opacity-[0.06] text-[8rem] -rotate-12">🍃</div>
        <div className="absolute top-60 left-1/4 opacity-[0.05] text-[7rem] rotate-90">🍃</div>
        <div className="absolute bottom-20 right-1/3 opacity-[0.05] text-[9rem] -rotate-45">🍃</div>
      </div>

      {/* ── Hero ── */}
      <div className="relative flex-grow flex flex-col items-center justify-center px-6 py-20">

        {/* Header — mount-based, same as other pages */}
        <div
          className="text-center mb-14 max-w-4xl"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            AI-Powered Emission Intelligence
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-5 leading-tight bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            Carbon Cast
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Make data-driven decisions for a sustainable future. Predict, track, and analyze
            your vehicle's carbon footprint with cutting-edge AI technology.
          </p>
        </div>

        {/* CTA */}
        <FadeIn direction="up" delay={100}>
          <div className="flex flex-col items-center gap-3 mb-16">
            <button
              onClick={() => navigate("/predict")}
              className="group relative bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold px-14 py-4 rounded-full shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-105 active:scale-100 transition-all duration-200 text-lg"
            >
              <span className="flex items-center gap-2">
                Start Your Prediction
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </span>
            </button>
            <p className="text-gray-400 text-xs">· Instant results · 100% free</p>
          </div>
        </FadeIn>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 max-w-4xl w-full">
          {features.map((f, i) => (
            <FadeIn key={f.title} direction="up" delay={i * 80}>
              <div className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-7 border shadow-sm ${f.border} hover:shadow-md ${f.shadow} transition-all duration-300 h-full`}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 inline-block">
                    {f.emoji}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${f.badge}`}>
                    {f.badgeText}
                  </span>
                </div>
                <h4 className="font-bold text-base text-gray-800 mb-2">{f.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full">
          {stats.map((s, i) => (
            <FadeIn key={s.label} direction="up" delay={i * 80}>
              <div className={`bg-white/80 backdrop-blur-sm text-center p-6 rounded-2xl border ${s.border} shadow-sm hover:shadow-md transition-all duration-300`}>
                <div className={`text-4xl font-black bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent mb-1`}>
                  {s.value}
                </div>
                <div className="text-gray-800 font-bold text-sm mb-0.5">{s.label}</div>
                <div className="text-xs text-gray-400">{s.sub}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white py-16 px-6 border-t border-green-500/20 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">

            {/* Brand */}
            <div className="col-span-1 md:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🌍</span>
                <h3 className="text-2xl font-black bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Carbon Cast
                </h3>
              </div>
              <p className="text-green-100/50 text-sm leading-relaxed mb-5 max-w-sm">
                Empowering a sustainable future through intelligent carbon emission tracking.
                Every journey matters, every decision counts.
              </p>
              <div className="flex gap-3">
                {["🐦", "💼", "📘", "📷"].map((icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-400 flex items-center justify-center transition-all hover:scale-110 text-base">
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform links */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="font-bold text-green-300 mb-4 text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2.5">
                {[["Home", "/"], ["Predict", "/predict"], ["History", "/history"], ["How It Works", "/how-it-works"]].map(([label, path]) => (
                  <li key={label}>
                    <button onClick={() => navigate(path)} className="text-green-100/60 hover:text-green-300 transition-colors text-sm">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="font-bold text-green-300 mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2.5">
                {["Documentation", "API Reference", "Blog", "Support"].map((label) => (
                  <li key={label}>
                    <button className="text-green-100/60 hover:text-green-300 transition-colors text-sm">{label}</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-1 md:col-span-3">
              <h4 className="font-bold text-green-300 mb-4 text-sm uppercase tracking-wider">Get In Touch</h4>
              <ul className="space-y-2.5">
                {[["📧", "info@carboncast.com"], ["🌐", "www.carboncast.com"], ["📍", "Global Platform"]].map(([icon, text]) => (
                  <li key={text} className="flex items-center gap-2 text-green-100/60 text-sm">
                    <span>{icon}</span><span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-green-500/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-green-100/40 text-xs">
              © 2026 Carbon Cast. All rights reserved. Built with 💚 for the planet.
            </p>
            <div className="flex gap-6 text-xs">
              {["Privacy", "Terms", "Cookies"].map((l) => (
                <button key={l} className="text-green-100/40 hover:text-green-300 transition-colors">{l}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}