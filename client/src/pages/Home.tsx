import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  HeartPulse,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  UserRound,
  X,
  ArrowUp
} from "lucide-react";

const HERO_IMAGE = "/hero.webp";

const bodyPlans = {
  shoulder: {
    label: "Shoulder & neck",
    eyebrow: "Mobility, strength, confidence",
    title: "Move overhead without guarding every reach.",
    copy: "We pair hands-on mobility work with a simple strength progression so your shoulder feels supported—not fragile—when life gets busy.",
    bullets: ["Rotator cuff & labral rehab", "Post-op range-of-motion plans", "Desk and overhead movement coaching"],
    color: "mint",
  },
  back: {
    label: "Back & core",
    eyebrow: "Stability, capacity, calm",
    title: "Build a back you trust again.",
    copy: "Your plan starts with the why, then layers in the right amount of mobility, trunk control, and real-world lifting practice.",
    bullets: ["Persistent low-back pain", "Core and lifting mechanics", "Return-to-work conditioning"],
    color: "coral",
  },
  knee: {
    label: "Knee",
    eyebrow: "Strength, control, return",
    title: "A clear path from surgery to stride.",
    copy: "From the first careful bend to your first confident run, we measure progress and adjust the work to your actual goals.",
    bullets: ["ACL, meniscus & joint replacement rehab", "Running and jumping progressions", "Swelling and load management"],
    color: "sand",
  },
  hip: {
    label: "Hip & pelvis",
    eyebrow: "Control, balance, freedom",
    title: "Make room for the movements you miss.",
    copy: "We help you reconnect with your hips through targeted strength, balance, and movement strategies that fit your routine.",
    bullets: ["Hip impingement and tendon rehab", "Post-surgery gait retraining", "Return to sport and daily activity"],
    color: "mint",
  },
  ankle: {
    label: "Ankle & foot",
    eyebrow: "Balance, bounce, resilience",
    title: "Get steady on the ground beneath you.",
    copy: "A thoughtful progression restores range, balance, and the spring you need for sport, stairs, and everything in between.",
    bullets: ["Sprains and instability", "Achilles and plantar fascia care", "Return-to-running plans"],
    color: "coral",
  },
} as const;

type BodyPart = keyof typeof bodyPlans;

type Therapist = {
  name: string;
  role: string;
  initials: string;
  bio: string;
  focus: string[];
  accent: string;
};

const therapists: Therapist[] = [
  {
    name: "Maya Chen, PT, DPT",
    role: "Founder · Sports rehab",
    initials: "MC",
    bio: "Former collegiate runner who believes the best rehab plan is one that makes sense in your real life.",
    focus: ["Running injuries", "Knee & ankle", "Return to sport"],
    accent: "mint",
  },
  {
    name: "Jordan Ellis, PT, DPT",
    role: "Post-surgery specialist",
    initials: "JE",
    bio: "Known for calm, precise coaching that turns post-op milestones into steady momentum.",
    focus: ["ACL & joint replacement", "Shoulder rehab", "Strength rebuilding"],
    accent: "coral",
  },
  {
    name: "Leila Okafor, PT, DPT",
    role: "Movement & pain care",
    initials: "LO",
    bio: "A movement problem-solver who helps people feel capable in their bodies, whatever their starting point.",
    focus: ["Back & hip", "Persistent pain", "Mobility"],
    accent: "sand",
  },
];

const faqs = [
  {
    q: "What happens at the first visit?",
    a: "Your first 60-minute visit includes a conversation about what you want to get back to, a movement assessment, and a starter plan you can use right away. No referral is needed to get started.",
  },
  {
    q: "Do I need a referral?",
    a: "Usually, no. Direct access rules vary by state and insurance plan, so we’ll help you confirm the right path when you book.",
  },
  {
    q: "Do you take insurance?",
    a: "We’re in-network with several major plans and offer simple superbills for out-of-network reimbursement. Bring your benefits questions—we’ll walk through them with you.",
  },
  {
    q: "How often will I come in?",
    a: "Most people start with one visit per week, then space out as they build confidence. Your plan is based on your goals, not a preset number of visits.",
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [activePart, setActivePart] = useState<BodyPart>("knee");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "assistant" | "user"; text: string }[]>([
    { role: "assistant", text: "Hi, I’m MoveMate. Ask me about visits, insurance, or what to expect." },
  ]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showTop, setShowTop] = useState(false);
useEffect(() => {
  const onScroll = () => setShowTop(window.scrollY > 500);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);

  const activePlan = bodyPlans[activePart];
  const currentFaq = expandedFaq === null ? null : faqs[expandedFaq];

  const chatReplies = useMemo(
    () => ({
      price: "The first visit is $120 and includes a full movement assessment plus a starter plan. We can also help you check your insurance benefits.",
      insurance: "We’re in-network with several major plans and can provide a superbill for out-of-network reimbursement. Bring your member details when you book.",
      appointment: "You can request a visit in under a minute using the booking form. Pick a preferred therapist, date, and time—we’ll confirm the details by phone.",
      default: "I can help with first-visit pricing, insurance, what to expect, and appointment requests. Try asking one of those.",
    }),
    [],
  );

  function sendChat(text = chatMessage) {
    const clean = text.trim();
    if (!clean) return;
    const lower = clean.toLowerCase();
    const reply = lower.includes("price") || lower.includes("cost") || lower.includes("120") || lower.includes("first visit")
      ? chatReplies.price
      : lower.includes("insurance") || lower.includes("coverage")
        ? chatReplies.insurance
        : lower.includes("book") || lower.includes("appointment") || lower.includes("schedule")
          ? chatReplies.appointment
          : chatReplies.default;
    setChatHistory((history) => [...history, { role: "user", text: clean }, { role: "assistant", text: reply }]);
    setChatMessage("");
  }

  function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingComplete(true);
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <a className="brand" href="#top" aria-label="FreeMove home">
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span>Free<span>Move</span></span>
          </a>
          <nav className={`main-nav ${mobileMenuOpen ? "is-open" : ""}`} aria-label="Main navigation">
            <a href="#approach" onClick={() => setMobileMenuOpen(false)}>Our approach</a>
            <a href="#care" onClick={() => setMobileMenuOpen(false)}>Care by body</a>
            <a href="#team" onClick={() => setMobileMenuOpen(false)}>Our team</a>
            <a href="#stories" onClick={() => setMobileMenuOpen(false)}>Stories</a>
          </nav>
          <div className="topbar-actions">
            <a className="phone-link" href="tel:+14155550128"><Phone size={15} /> (415) 555-0128</a>
            <button className="button button-coral button-small" onClick={() => setBookingOpen(true)}>Book a visit <ArrowRight size={16} /></button>
            <button className="menu-toggle" aria-label="Toggle navigation" onClick={() => setMobileMenuOpen((open) => !open)}>
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-backdrop" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> Physical therapy for real life</div>
              <h1>Come back to <em>what moves you.</em></h1>
              <p className="hero-lede">Thoughtful rehab for sports injuries, post-surgery recovery, and the everyday moments you want to feel confident in again.</p>
              <div className="hero-actions">
                <button className="button button-coral" onClick={() => setBookingOpen(true)}>Start your recovery <ArrowRight size={18} /></button>
                <button className="text-link" onClick={() => scrollToSection("care")}>Explore our care <ChevronRight size={18} /></button>
              </div>
              <div className="hero-proof">
                <div className="avatar-stack" aria-hidden="true"><span>MC</span><span>JE</span><span>LO</span></div>
                <div><strong>3 clinicians. One connected plan.</strong><small>Personal care from your first hello.</small></div>
              </div>
            </div>
            <div className="hero-image-wrap">
              <img src={HERO_IMAGE} alt="Physical therapist guiding an athlete through an ankle mobility exercise" className="hero-image" />
              <div className="hero-note note-top"><Sparkles size={16} /><span>Care that meets you<br /><strong>where you are.</strong></span></div>
              <div className="hero-note note-bottom"><span className="note-number">01</span><span>Listen first.<br />Move forward together.</span></div>
            </div>
          </div>
          <div className="hero-scroll"><span /> Scroll to explore</div>
        </section>

        <section className="intro-section" id="approach">
          <div className="container intro-grid">
            <div className="section-kicker">A different kind of PT</div>
            <div className="intro-statement"><h2>Progress feels better when you understand <span>why.</span></h2><p>At FreeMove, your plan is built around the life you’re returning to—not just the body part that hurts. We listen closely, explain clearly, and give you the tools to keep moving between visits.</p></div>
            <div className="intro-stats"><div><strong>60</strong><span>minute first visit</span></div><div><strong>1:1</strong><span>care, every session</span></div><div><strong>3</strong><span>specialist therapists</span></div></div>
          </div>
        </section>

        <section className="care-section" id="care">
          <div className="container">
            <div className="section-heading split-heading"><div><div className="section-kicker">Care by body</div><h2>Let’s start with<br /><em>what’s asking for attention.</em></h2></div><p>Choose a body area to see how we think about your next step. Every plan is tailored, measurable, and made to fit your actual life.</p></div>
            <div className="body-map-layout">
              <div className="body-map-card">
                <div className="map-caption"><span>Tap a region</span><span className="map-line" /></div>
                <div className="body-map" aria-label="Interactive body map">
                  <svg viewBox="0 0 320 510" role="img" aria-label="Human body illustration with selectable treatment areas">
                    <path className="body-silhouette" d="M160 25c-27 0-43 22-43 48 0 18 8 32 20 40-2 11-9 19-19 24-23 12-34 29-38 56l-13 77c-2 13 2 25 13 31l23 13 6 101-13 72c-2 11 3 18 13 19h16c9 0 13-5 14-15l8-64 7-59 6 59 8 64c1 10 5 15 14 15h16c10-1 15-8 13-19l-13-72 6-101 23-13c11-6 15-18 13-31l-13-77c-4-27-15-44-38-56-10-5-17-13-19-24 12-8 20-22 20-40 0-26-16-48-43-48Z" />
                    <path className="body-core" d="M119 143c14 9 27 13 41 13s27-4 41-13c6 8 9 18 11 30l9 58-27 10-8 90h-52l-8-90-27-10 9-58c2-12 5-22 11-30Z" />
                    <rect className={`map-zone zone-shoulder ${activePart === "shoulder" ? "active" : ""}`} onClick={() => setActivePart("shoulder")} role="button" tabIndex={0} aria-label="Shoulder and neck treatment" />
                    <rect className={`map-zone zone-back ${activePart === "back" ? "active" : ""}`} onClick={() => setActivePart("back")} role="button" tabIndex={0} aria-label="Back and core treatment" />
                    <rect className={`map-zone zone-hip ${activePart === "hip" ? "active" : ""}`} onClick={() => setActivePart("hip")} role="button" tabIndex={0} aria-label="Hip and pelvis treatment" />
                    <rect className={`map-zone zone-knee ${activePart === "knee" ? "active" : ""}`} onClick={() => setActivePart("knee")} role="button" tabIndex={0} aria-label="Knee treatment" />
                    <rect className={`map-zone zone-ankle ${activePart === "ankle" ? "active" : ""}`} onClick={() => setActivePart("ankle")} role="button" tabIndex={0} aria-label="Ankle and foot treatment" />
                  </svg>
                  <div className="map-label label-shoulder">Shoulder</div><div className="map-label label-back">Back</div><div className="map-label label-hip">Hip</div><div className="map-label label-knee">Knee</div><div className="map-label label-ankle">Ankle</div>
                </div>
                <div className="map-legend"><span><i className="legend-dot coral-dot" /> selected area</span><span><i className="legend-dot mint-dot" /> plan adapts with you</span></div>
              </div>
              <article className={`plan-card plan-${activePlan.color}`} key={activePart}>
                <div className="plan-topline"><span>{activePlan.label}</span><span className="plan-index">0{Object.keys(bodyPlans).indexOf(activePart) + 1} / 05</span></div>
                <div className="plan-content"><div className="section-kicker">{activePlan.eyebrow}</div><h3>{activePlan.title}</h3><p>{activePlan.copy}</p><ul>{activePlan.bullets.map((bullet) => <li key={bullet}><Check size={16} /> {bullet}</li>)}</ul></div>
                <button className="plan-cta" onClick={() => setBookingOpen(true)}>Talk to a therapist about this <ArrowRight size={16} /></button>
              </article>
            </div>
          </div>
        </section>

        <section className="specialty-section">
          <div className="container specialty-grid"><div className="specialty-label"><div className="section-kicker">What we’re known for</div><h2>Small steps.<br /><em>Big return.</em></h2></div><div className="specialty-cards"><article><div className="icon-circle"><Target size={20} /></div><h3>Sports injury rehab</h3><p>From the weekend warrior to the serious competitor, we help you return with a smarter plan for strength and confidence.</p><a href="#care" onClick={(event) => { event.preventDefault(); scrollToSection("care"); }}>See how we work <ArrowRight size={15} /></a></article><article><div className="icon-circle coral-icon"><Stethoscope size={20} /></div><h3>Post-surgery rehab</h3><p>Clear milestones, careful progression, and a team that knows when to challenge you—and when to give you room.</p><a href="#booking" onClick={(event) => { event.preventDefault(); setBookingOpen(true); }}>Plan your next step <ArrowRight size={15} /></a></article></div></div>
        </section>

        <section className="team-section" id="team">
          <div className="container"><div className="section-heading split-heading"><div><div className="section-kicker">Meet your care team</div><h2>Three perspectives.<br /><em>More ways forward.</em></h2></div><p>Different specialties, one shared belief: good therapy should feel collaborative, specific, and surprisingly human.</p></div><div className="team-grid">{therapists.map((therapist) => <article className="therapist-card" key={therapist.name}><div className={`therapist-avatar avatar-${therapist.accent}`}><span>{therapist.initials}</span><div className="avatar-badge"><HeartPulse size={13} /></div></div><div className="therapist-role">{therapist.role}</div><h3>{therapist.name}</h3><p>{therapist.bio}</p><div className="focus-tags">{therapist.focus.map((focus) => <span key={focus}>{focus}</span>)}</div><button className="card-link" onClick={() => setBookingOpen(true)}>Book with {therapist.name.split(" ")[0]} <ArrowRight size={15} /></button></article>)}</div></div>
        </section>

        <section className="pricing-section" id="pricing">
          <div className="container pricing-grid"><div className="pricing-copy"><div className="section-kicker">Simple to start</div><h2>Good care shouldn’t feel like a <em>mystery.</em></h2><p>We’ll make the practical parts clear, so you can focus on feeling better.</p><button className="button button-dark" onClick={() => setBookingOpen(true)}>Check availability <CalendarDays size={17} /></button></div><div className="pricing-card"><div className="price-tag"><span>First visit</span><strong>$120</strong><small>60 minutes · 1:1 with your therapist</small></div><div className="price-divider" /><div className="insurance-row"><div className="insurance-icon"><ShieldCheck size={21} /></div><div><strong>Insurance, made easier</strong><p>In-network with several major plans. Out-of-network? We provide a simple superbill for reimbursement.</p></div><ChevronRight size={19} /></div><div className="pricing-footnote"><Check size={15} /> No referral needed to request a visit</div><div className="pricing-footnote"><Check size={15} /> HSA / FSA cards welcome</div></div></div>
        </section>

        <section className="stories-section" id="stories">
          <div className="container"><div className="section-heading split-heading"><div><div className="section-kicker">Recovery, in their words</div><h2>Progress looks<br /><em>different on everyone.</em></h2></div><p>These are real-feeling wins: the first jog, the pain-free reach, the moment your body stops being the thing you’re thinking about.</p></div><div className="stories-grid"><article className="story-card story-featured"><div className="quote-mark">“</div><blockquote>I came in hoping to get back to running. I left with a better understanding of how to keep running.</blockquote><div className="story-meta"><div className="story-avatar">AR</div><div><strong>Alex R.</strong><span>Back to half-marathon training</span></div><span className="story-arrow"><ArrowRight size={18} /></span></div></article><article className="story-card story-light"><div className="story-rating"><Star size={15} fill="currentColor" /> <Star size={15} fill="currentColor" /> <Star size={15} fill="currentColor" /> <Star size={15} fill="currentColor" /> <Star size={15} fill="currentColor" /></div><blockquote>“The first time I walked downstairs without thinking about my knee, I texted my therapist.”</blockquote><div className="story-meta"><div className="story-avatar coral-avatar">JM</div><div><strong>Jules M.</strong><span>6 months after ACL surgery</span></div></div></article><article className="story-card story-outline"><div className="story-stat">3<span>wks</span></div><p>to feel confident lifting again after a back flare-up.</p><div className="story-meta"><div className="story-avatar mint-avatar">DK</div><div><strong>Devon K.</strong><span>Strength training, pain-free</span></div></div></article></div></div>
        </section>

        <section className="faq-section">
          <div className="container faq-grid"><div><div className="section-kicker">Questions, answered</div><h2>Let’s make the<br /><em>first step easy.</em></h2><p>Still wondering about something? Ask MoveMate in the corner or call our front desk at <a href="tel:+14155550128">(415) 555-0128</a>.</p></div><div className="faq-list">{faqs.map((faq, index) => <div className={`faq-item ${expandedFaq === index ? "is-open" : ""}`} key={faq.q}><button onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}><span>{faq.q}</span><ChevronDown size={18} /></button>{expandedFaq === index && <p>{faq.a}</p>}</div>)}</div></div>
        </section>

        <section className="final-cta-section"><div className="container final-cta"><div><div className="section-kicker">Your next chapter can start here</div><h2>Ready to feel more<br /><em>like yourself?</em></h2></div><button className="button button-coral" onClick={() => setBookingOpen(true)}>Book your first visit <ArrowRight size={18} /></button></div></section>
      </main>

      <footer className="footer"><div className="container footer-grid"><div><a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true"><span /></span><span>Free<span>Move</span></span></a><p>Physical therapy for real life.<br />San Francisco, CA</p></div><div><span className="footer-label">Visit</span><a href="#pricing">Pricing & insurance</a><a href="#stories">Patient stories</a></div><div><span className="footer-label">Connect</span><a href="tel:+14155550128">(415) 555-0128</a><a href="mailto:hello@freemovept.com">hello@freemovept.com</a></div><div><span className="footer-label">Hours</span><span>Mon–Fri · 7am–7pm</span><span>Sat · 8am–1pm</span></div></div><div className="container footer-bottom"><span>© 2026 FreeMove PT</span><span>Built for better days.</span></div></footer>

      <button
  className={`back-to-top ${showTop ? "is-visible" : ""}`}
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  aria-label="Back to top"
>
  <ArrowUp size={18} />
</button>

      <button className={`chat-launcher ${chatOpen ? "is-hidden" : ""}`} onClick={() => setChatOpen(true)} aria-label="Open MoveMate chat"><MessageCircle size={20} /><span>Ask MoveMate</span><span className="chat-pulse" /></button>
      {chatOpen && <div className="chat-panel" role="dialog" aria-label="MoveMate chat assistant"><div className="chat-header"><div className="chat-avatar"><Sparkles size={17} /></div><div><strong>MoveMate</strong><span>FreeMove’s quick-answer guide</span></div><button onClick={() => setChatOpen(false)} aria-label="Close chat"><X size={18} /></button></div><div className="chat-body">{chatHistory.map((message, index) => <div className={`chat-bubble ${message.role}`} key={`${message.role}-${index}`}>{message.text}</div>)}{chatHistory.length === 1 && <div className="chat-suggestions"><button onClick={() => sendChat("How much is the first visit?")}>First visit price</button><button onClick={() => sendChat("Do you take insurance?")}>Insurance</button><button onClick={() => sendChat("How do I book?")}>Book a visit</button></div>}</div><form className="chat-input" onSubmit={(event) => { event.preventDefault(); sendChat(); }}><input value={chatMessage} onChange={(event) => setChatMessage(event.target.value)} placeholder="Ask a question..." aria-label="Ask MoveMate a question" /><button type="submit" aria-label="Send message"><ArrowRight size={17} /></button></form></div>}

      {bookingOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBookingOpen(false); }}><div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title"><button className="modal-close" onClick={() => setBookingOpen(false)} aria-label="Close booking form"><X size={19} /></button>{bookingComplete ? <div className="booking-success"><div className="success-mark"><Check size={25} /></div><div className="section-kicker">Request received</div><h2>You’re on your way.</h2><p>Thanks for reaching out. Our front desk will call within one business day to confirm your appointment details.</p><button className="button button-dark" onClick={() => { setBookingComplete(false); setBookingOpen(false); }}>Done</button></div> : <><div className="section-kicker">Start your recovery</div><h2 id="booking-title">Tell us a little<br /><em>about your next step.</em></h2><p className="modal-intro">No referral needed to request a visit. We’ll confirm the details by phone.</p><form onSubmit={handleBooking} className="booking-form"><label>First and last name<input required name="name" placeholder="Alex Morgan" /></label><label>Email address<input required type="email" name="email" placeholder="alex@email.com" /></label><div className="form-row"><label>Preferred therapist<select name="therapist" defaultValue="Any therapist"><option>Any therapist</option>{therapists.map((therapist) => <option key={therapist.name}>{therapist.name.split(",")[0]}</option>)}</select></label><label>Preferred date<input required type="date" name="date" /></label></div><div className="form-row"><label>Preferred time<select name="time" defaultValue="Morning"><option>Morning</option><option>Midday</option><option>Afternoon</option><option>Evening</option></select></label><label>What brings you in?<select name="reason" defaultValue="Sports injury"><option>Sports injury</option><option>Post-surgery rehab</option><option>Persistent pain</option><option>Something else</option></select></label></div><button className="button button-coral booking-submit" type="submit">Request my visit <ArrowRight size={17} /></button></form></>}</div></div>}
    </div>
  );
}
