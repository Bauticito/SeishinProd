import { ArrowRight, ShieldCheck, Server, Cpu, Lock, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { SITE_MEDIA } from "../../lib/siteMedia";

export default function LandingPage() {
  const { t } = useTranslation();

  const stats = useMemo(() => [
    { icon: Server,   label: t('jetson.stats_nodos'),      value: "12"     },
    { icon: Cpu,      label: t('jetson.stats_inferencias'), value: "2.4K"   },
    { icon: Activity, label: t('jetson.stats_uptime'),      value: "99.9%"  },
    { icon: Lock,     label: t('jetson.stats_sesiones'),    value: t('jetson.stats_seguras') },
  ], [t]);

  const capabilities = useMemo(() => [
    { title: t('jetson.capabilities.0.title'), desc: t('jetson.capabilities.0.desc') },
    { title: t('jetson.capabilities.1.title'), desc: t('jetson.capabilities.1.desc') },
    { title: t('jetson.capabilities.2.title'), desc: t('jetson.capabilities.2.desc') },
    { title: t('jetson.capabilities.3.title'), desc: t('jetson.capabilities.3.desc') },
    { title: t('jetson.capabilities.4.title'), desc: t('jetson.capabilities.4.desc') },
    { title: t('jetson.capabilities.5.title'), desc: t('jetson.capabilities.5.desc') },
  ], [t]);
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-hidden relative">
      <Navigation />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#E31E24] opacity-[0.06] blur-[140px]" />
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-[#3A3A3A] opacity-[0.15] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(227,30,36,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(227,30,36,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-16 space-y-16">

        {/* ── Header ── */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={SITE_MEDIA.logos.primary}
              alt="Seishin Logo"
              className="h-12 w-auto drop-shadow-lg"
            />
            <div>
              <p className="text-sm font-bold tracking-wide text-[var(--text-primary)]">
                Vigilancia SeishinIA
              </p>
              <p className="text-[11px] text-[var(--text-tertiary)] font-mono">
                NVIDIA Jetson · Edge AI Platform
              </p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            {t('jetson.header_badge')}
          </span>
        </header>

        {/* ── Hero ── */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E31E24]/30 bg-[#E31E24]/10 px-3 py-1.5">
              <ShieldCheck className="w-4 h-4 text-[#E31E24]" />
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#E31E24]">
                {t('jetson.system_active')}
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] leading-tight tracking-tight">
                {t('jetson.hero_h1_1')}
                <br />
                <span className="text-[#E31E24]">{t('jetson.hero_h1_2')}</span>
                <br />
                <span className="text-[var(--text-secondary)] text-3xl md:text-4xl font-light">
                  {t('jetson.hero_h1_3')}
                </span>
              </h1>
              <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
                {t('jetson.hero_desc')}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="glass rounded-2xl border border-[var(--border-color-light)] p-4 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#E31E24]" />
                    <p className="text-[10px] font-bold tracking-widest text-[var(--text-tertiary)] uppercase">
                      {label}
                    </p>
                  </div>
                  <p className="text-xl font-black text-[var(--text-primary)] font-mono">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative inline-flex">
                <button
                  disabled
                  className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold opacity-50 cursor-not-allowed"
                >
                  {t('jetson.cta_portal')}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <span className="absolute -top-2 -right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#E31E24] text-white tracking-wide">
                  {t('jetson.badge_pronto')}
                </span>
              </div>
              <Link
                to="/vigilancia"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold rounded-xl border border-[var(--border-color-light)] text-[var(--text-secondary)] hover:border-[#E31E24]/50 hover:text-[var(--text-primary)] transition-all duration-300"
              >
                {t('jetson.cta_calculator')}
              </Link>
            </div>
          </section>

          {/* Right — video card */}
          <section className="glass rounded-[2rem] border border-[var(--border-color-light)] overflow-hidden shadow-2xl">
            <div className="relative overflow-hidden rounded-t-[2rem] bg-black">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-56 md:h-64 object-cover opacity-90"
                style={{ objectPosition: "center 42%" }}
              >
                <source src={SITE_MEDIA.landing.introVideo} type="video/mp4" />
                <source src={SITE_MEDIA.landing.animatedLogo} type="video/mp4" />
              </video>
              {/* overlay scan line effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-[10px] font-mono text-white/70">{t('jetson.badge_live')}</span>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-5">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-tertiary)] font-mono mb-1">
                  {t('jetson.login_secure_access')}
                </p>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{t('jetson.login_welcome')}</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
                  {t('jetson.login_desc')}
                </p>
              </div>

              <div className="relative">
                <button
                  disabled
                  className="btn-primary flex items-center justify-center gap-2 w-full py-3 text-sm font-bold opacity-50 cursor-not-allowed"
                >
                  {t('jetson.login_btn')}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="absolute -top-2 -right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#E31E24] text-white tracking-wide">
                  {t('jetson.badge_pronto')}
                </span>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#E31E24]/30 to-transparent" />

              <p className="text-[11px] font-mono text-[var(--text-tertiary)] text-center">
                SeishinIA · NVIDIA Jetson AGX Thor · Build 2026.02
              </p>
            </div>
          </section>
        </main>

        {/* ── Capabilities grid ── */}
        <section>
          <div className="mb-8">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#E31E24]">{t('jetson.platform_badge')}</span>
            <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mt-2 tracking-tight">
              {t('jetson.platform_title')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="glass rounded-2xl border border-[var(--border-color-light)] p-5 hover:border-[#E31E24]/30 transition-all duration-300 group"
              >
                <div className="w-2 h-2 rounded-full bg-[#E31E24] mb-3 group-hover:shadow-[0_0_8px_#E31E24] transition-all" />
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">{cap.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="flex items-center justify-center gap-3 border-t border-[var(--border-color-light)] pt-8">
          <img src={SITE_MEDIA.logos.primary} alt="Seishin" className="h-8 w-auto opacity-80" />
          <span className="text-xs text-[var(--text-tertiary)] font-mono">
            {t('jetson.footer_rights')}
          </span>
        </footer>

      </div>
    </div>
  );
}
