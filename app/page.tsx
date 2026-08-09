"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Headphones,
  Home,
  Landmark,
  LockKeyhole,
  Menu,
  PiggyBank,
  ShieldCheck,
  Smartphone,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import { useLanguage } from "../components/LanguageProvider";
import { usePublicBrand } from "../components/usePublicBrand";

const slides = [
  {
    image: "/images/landing/family-finance.png",
    eyebrow: "BANKING FOR EVERY CHAPTER",
    title: "Build today. Plan for what comes next.",
    copy: "Everyday accounts, flexible savings, and lending tools brought together in one clear digital experience.",
    primary: "Open an account",
    secondary: "Explore personal banking",
    href: "#personal",
  },
  {
    image: "/images/landing/business-owner.png",
    eyebrow: "BUILT FOR BUSINESS OWNERS",
    title: "Your ambition deserves a bank that keeps pace.",
    copy: "Separate business finances, move funds, and stay close to cash flow from one dependable workspace.",
    primary: "Explore business banking",
    secondary: "View account options",
    href: "#business",
  },
  {
    image: "/images/landing/family-home.png",
    eyebrow: "BORROW WITH CLARITY",
    title: "Turn the next milestone into a clear plan.",
    copy: "Compare loan terms, understand monthly payments, and follow every step from application to payoff.",
    primary: "Explore lending",
    secondary: "Try the loan center",
    href: "#borrowing",
    mobilePosition: "71% center",
  },
];

const products = [
  { icon: WalletCards, label: "Checking", copy: "Daily banking made simple", href: "#personal" },
  { icon: PiggyBank, label: "Savings", copy: "Make progress toward a goal", href: "#personal" },
  { icon: CreditCard, label: "Virtual cards", copy: "Safer digital spending", href: "/app/cards" },
  { icon: Home, label: "Home lending", copy: "Plan a future purchase", href: "#borrowing" },
  { icon: BriefcaseBusiness, label: "Business", copy: "Tools for growing ideas", href: "#business" },
];

type PublicWebsiteSettings = {
  heroHeading: string;
  heroMessage: string;
  supportEmail: string;
  showChecking: boolean;
  showSavings: boolean;
  showLoans: boolean;
  maintenanceMode: boolean;
};

const defaultPublicWebsiteSettings: PublicWebsiteSettings = {
  heroHeading: slides[0].title,
  heroMessage: slides[0].copy,
  supportEmail: "support@northstar.test",
  showChecking: true,
  showSavings: true,
  showLoans: true,
  maintenanceMode: false,
};

export default function HomePage() {
  const {t}=useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerScrolled,setHeaderScrolled] = useState(false);
  const [websiteSettings,setWebsiteSettings] = useState(defaultPublicWebsiteSettings);
  const brand=usePublicBrand();

  useEffect(()=>{
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/website", { cache: "no-store" });
        if (!response.ok) return;
        const result = await response.json() as { content?: PublicWebsiteSettings };
        if (active&&result.content) setWebsiteSettings(result.content);
      } catch {
        // Static defaults keep the public site available if settings cannot be read.
      }
    };
    void load();
    const channel = new BroadcastChannel("northstar-website");
    channel.onmessage = ()=>void load();
    return ()=>{ active=false; channel.close(); };
  },[]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % slides.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(()=>{
    document.documentElement.classList.add("landing-motion-ready");
    const updateHeader=()=>setHeaderScrolled(window.scrollY>28);
    updateHeader();
    window.addEventListener("scroll",updateHeader,{passive:true});
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:"0px 0px -45px"});
    document.querySelectorAll(".bank-landing [data-reveal]").forEach((element)=>observer.observe(element));
    return()=>{
      window.removeEventListener("scroll",updateHeader);
      observer.disconnect();
      document.documentElement.classList.remove("landing-motion-ready");
    };
  },[]);

  function moveSlide(direction: -1 | 1) {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  }

  const visibleProducts = products.filter((product)=>
    product.label === "Checking" ? websiteSettings.showChecking
      : product.label === "Savings" ? websiteSettings.showSavings
        : product.label === "Home lending" ? websiteSettings.showLoans
          : true
  );
  const effectiveSlides = slides.map((slide,index)=>index===0
    ? { ...slide, title: websiteSettings.heroHeading, copy: websiteSettings.heroMessage }
    : slide);

  return (
    <main className="bank-landing" style={brand?{"--blue":brand.primaryColor} as React.CSSProperties:undefined}>
      <header className={`bank-header ${headerScrolled?"scrolled":""}`}>
        <div className="utility-nav">
          <div><span>{t("Personal")}</span><Link href="#business">{t("Business")}</Link></div>
          <div><Link href="#help">{t("Help center")}</Link></div>
        </div>
        <nav className="site-nav bank-site-nav" aria-label="Primary navigation">
          <Link href="/" className="brand" aria-label={`${brand?.bankName??"Northstar"} home`}>
            {brand?.logoUrl?<span className="brand-mark uploaded-brand-logo"><img src={brand.logoUrl} alt=""/></span>:<><span className="brand-mark"><Sparkles size={18}/></span>{brand?.shortName??"NORTHSTAR"}</>}
          </Link>
          <div className="nav-links bank-nav-links">
            <Link href="#personal">{t("Banking")} <ChevronDown size={13}/></Link>
            <Link href="#borrowing">{t("Borrow")} <ChevronDown size={13}/></Link>
            <Link href="#business">{t("Business")} <ChevronDown size={13}/></Link>
            <Link href="#security">{t("Security")}</Link>
          </div>
          <div className="nav-actions">
            <Link href="/login" className="bank-sign-in"><LockKeyhole size={14}/>{t("Sign in")}</Link>
            <Link href="/open-account" className="button button-blue">{t("Open an account")} <ArrowRight size={15}/></Link>
            <button className="mobile-menu-button" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={()=>setMenuOpen((open)=>!open)}>
              {menuOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </nav>
        {menuOpen&&(
          <div className="mobile-bank-menu">
            <Link href="#personal" onClick={()=>setMenuOpen(false)}>{t("Personal banking")}</Link>
            <Link href="#borrowing" onClick={()=>setMenuOpen(false)}>{t("Borrowing")}</Link>
            <Link href="#business" onClick={()=>setMenuOpen(false)}>{t("Business banking")}</Link>
            <Link href="#security" onClick={()=>setMenuOpen(false)}>{t("Security")}</Link>
            <Link href="/login" onClick={()=>setMenuOpen(false)}>{t("Customer sign in")}</Link>
          </div>
        )}
      </header>

      {websiteSettings.maintenanceMode&&<div className="public-maintenance-notice"><ShieldCheck size={16}/><span><b>Scheduled maintenance notice</b> Some services may be temporarily delayed. The public site remains available.</span></div>}

      <section
        className="bank-hero"
        aria-roledescription="carousel"
        aria-label="Featured banking services"
        onMouseEnter={()=>setPaused(true)}
        onMouseLeave={()=>setPaused(false)}
        onFocusCapture={()=>setPaused(true)}
        onBlurCapture={()=>setPaused(false)}
      >
        {effectiveSlides.map((slide, index)=>(
          <article
            className={`bank-hero-slide ${index === activeSlide ? "active" : ""}`}
            data-slide-index={index}
            style={{"--mobile-slide-position":slide.mobilePosition??"66% center"} as React.CSSProperties}
            aria-hidden={index !== activeSlide}
            key={slide.title}
          >
            <img src={slide.image} alt="" />
            <div className="bank-hero-shade"/>
            <div className="bank-hero-inner">
              <div className="bank-hero-copy">
                <span className="bank-kicker">{t(slide.eyebrow)}</span>
                <h1>{t(slide.title)}</h1>
                <p>{t(slide.copy)}</p>
                <div className="bank-hero-actions">
                  <Link href={index === 0 ? "/open-account" : slide.href} className="button bank-button-light">{t(slide.primary)}<ArrowRight size={16}/></Link>
                  <Link href={slide.href} className="bank-hero-text-link">{t(slide.secondary)}<ArrowUpRight size={15}/></Link>
                </div>
              </div>
            </div>
          </article>
        ))}
        <div className="hero-slider-controls">
          <button type="button" aria-label="Previous feature" onClick={()=>moveSlide(-1)}><ArrowLeft size={17}/></button>
          <div className="slider-dots" role="tablist" aria-label="Choose feature">
            {slides.map((slide,index)=>(
              <button
                type="button"
                role="tab"
                aria-label={`Show ${slide.eyebrow.toLowerCase()}`}
                aria-selected={index === activeSlide}
                className={index === activeSlide ? "active" : ""}
                onClick={()=>setActiveSlide(index)}
                key={slide.title}
              ><span/></button>
            ))}
          </div>
          <button type="button" aria-label="Next feature" onClick={()=>moveSlide(1)}><ArrowRight size={17}/></button>
        </div>
        <div className="hero-service-card">
          <span><Headphones size={18}/></span>
          <div><small>NEED SOME GUIDANCE?</small><b>We&apos;re here to help</b></div>
          <Link href="#help" aria-label="Visit help center"><ArrowUpRight size={16}/></Link>
        </div>
      </section>

      <section className="product-dock" aria-label="Explore products" data-reveal>
        <div className="product-dock-heading"><small>{t(`EXPLORE ${brand?.shortName??"NORTHSTAR"}`)}</small><b>{t("What can we help you with?")}</b></div>
        {visibleProducts.map(({icon:Icon,label,copy,href})=>(
          <Link href={href} className="product-dock-item" key={label}>
            <span><Icon size={19}/></span>
            <div><b>{t(label)}</b><small>{t(copy)}</small></div>
            <ArrowUpRight size={15}/>
          </Link>
        ))}
      </section>

      <section className="bank-section personal-section" id="personal" data-reveal>
        <div className="bank-section-heading">
          <span className="bank-kicker dark">PERSONAL BANKING</span>
          <h2>One financial home for everyday life.</h2>
          <p>From your first deposit to long-term savings, {brand?.bankName??"Northstar Bank"} keeps every account easy to understand and simple to manage.</p>
        </div>
        <div className="bank-product-grid">
          {websiteSettings.showChecking&&<article className="bank-product-card featured">
            <span className="product-icon"><WalletCards size={22}/></span>
            <small>EVERYDAY CHECKING</small>
            <h3>Banking that keeps the essentials close.</h3>
            <p>Track available funds, pay bills, move money, and see every posted transaction in one clear timeline.</p>
            <ul><li><Check size={14}/>No monthly maintenance fee</li><li><Check size={14}/>Instant internal transfers</li><li><Check size={14}/>Virtual card controls</li></ul>
            <Link href="/open-account">Open checking <ArrowRight size={15}/></Link>
          </article>}
          {websiteSettings.showSavings&&<article className="bank-product-card">
            <span className="product-icon green"><PiggyBank size={22}/></span>
            <small>GROWTH SAVINGS</small>
            <h3>Give every goal a place to grow.</h3>
            <p>Separate savings from everyday spending and follow progress without losing access to your money.</p>
            <Link href="/open-account">Explore savings <ArrowRight size={15}/></Link>
          </article>}
          <article className="bank-product-card">
            <span className="product-icon amber"><CreditCard size={22}/></span>
            <small>VIRTUAL CARDS</small>
            <h3>More control for every digital purchase.</h3>
            <p>Create, freeze, and manage a profile-linked virtual card directly from the customer portal.</p>
            <Link href="/app/cards">View card controls <ArrowRight size={15}/></Link>
          </article>
        </div>
      </section>

      <section className="digital-bank-section" data-reveal>
        <div className="digital-bank-photo">
          <img src="/images/landing/mobile-banking.png" alt="Customer using mobile banking in a café"/>
          <div className="digital-balance-card">
            <span><CircleDollarSign size={17}/></span>
            <div><small>AVAILABLE BALANCE</small><b>$25,680.40</b></div>
            <span className="digital-live">LIVE</span>
          </div>
        </div>
        <div className="digital-bank-copy">
          <span className="bank-kicker dark">DIGITAL BANKING</span>
          <h2>Your money, clearly organized wherever you are.</h2>
          <p>Move between accounts, manage beneficiaries, request external transfers, download polished statements, and reach support from a secure customer workspace.</p>
          <div className="digital-feature-list">
            <div><span><Smartphone size={18}/></span><div><b>One connected dashboard</b><p>Balances, activity, loans, cards, and support in one place.</p></div></div>
            <div><span><Clock3 size={18}/></span><div><b>Track every request</b><p>Follow transfers from submission through review and settlement.</p></div></div>
            <div><span><ShieldCheck size={18}/></span><div><b>Controls you can see</b><p>Session history, security settings, and clear status updates.</p></div></div>
          </div>
          <Link href="/login" className="button button-dark">Sign in to online banking <ArrowRight size={16}/></Link>
        </div>
      </section>

      {websiteSettings.showLoans&&<section className="bank-section borrowing-section" id="borrowing" data-reveal>
        <div className="bank-section-heading centered">
          <span className="bank-kicker dark">BORROW WITH CONFIDENCE</span>
          <h2>Clear terms. Useful tools. No surprises.</h2>
          <p>Explore credit options and understand the full repayment journey before making a decision.</p>
        </div>
        <div className="borrowing-grid">
          <article><span><CircleDollarSign size={22}/></span><small>PERSONAL LOANS</small><h3>For plans both big and small.</h3><p>Choose an amount and term, preview payments, and monitor approval status.</p><Link href="/app/loans">Explore personal loans <ArrowRight size={15}/></Link></article>
          <article className="borrowing-photo"><img src="/images/landing/family-home.png" alt="Family outside their new home"/><div><small>HOME LENDING</small><h3>Make room for what matters next.</h3><Link href="/app/loans">Explore home lending <ArrowRight size={15}/></Link></div></article>
          <article><span><Landmark size={22}/></span><small>LOAN TRACKING</small><h3>See the entire path to payoff.</h3><p>Follow principal, interest, due dates, and every completed payment.</p><Link href="/app/loans">View the loan center <ArrowRight size={15}/></Link></article>
        </div>
      </section>}

      <section className="business-bank-section" id="business" data-reveal>
        <img src="/images/landing/business-owner.png" alt="Small-business owner in her retail studio"/>
        <div className="business-bank-overlay"/>
        <div className="business-bank-copy">
          <span className="bank-kicker">BUSINESS BANKING</span>
          <h2>Built to support the business you&apos;re building.</h2>
          <p>Keep operating funds organized, pay vendors, and view every transaction with the clarity a growing business needs.</p>
          <div><span><Check size={14}/>Dedicated business account</span><span><Check size={14}/>Vendor and bill payments</span><span><Check size={14}/>Downloadable statements</span></div>
          <Link href="/open-account" className="button bank-button-light">Explore business banking <ArrowRight size={16}/></Link>
        </div>
      </section>

      <section className="bank-help-strip" id="help" data-reveal>
        <div><span><Headphones size={22}/></span><div><small>SUPPORT</small><h3>How can we help today?</h3></div></div>
        <div className="bank-help-links"><a href={`mailto:${brand?.supportEmail??websiteSettings.supportEmail}`}>{t("Email support")} <ArrowUpRight size={14}/></a><Link href="/app/support">{t("Message support")} <ArrowUpRight size={14}/></Link><Link href="/login">{t("Sign in help")} <ArrowUpRight size={14}/></Link></div>
      </section>

      <section className="bank-final-cta" data-reveal>
        <div><span className="bank-kicker">READY WHEN YOU ARE</span><h2>Start your {brand?.bankName??"Northstar Bank"} experience.</h2><p>Open an account and manage everyday banking.</p></div>
        <Link href="/open-account" className="button bank-button-light">{t("Open an account")} <ArrowRight size={16}/></Link>
      </section>

      <footer className="bank-footer">
        <div className="bank-footer-main">
          <div className="bank-footer-brand">
            <Link href="/" className="brand" aria-label={`${brand?.bankName??"Northstar"} home`}>{brand?.logoUrl?<span className="brand-mark uploaded-brand-logo dark-surface-logo"><img src={brand.logoUrl} alt=""/><img className="brand-color-layer" src={brand.logoUrl} alt=""/></span>:<><span className="brand-mark"><Sparkles size={18}/></span>{brand?.shortName??"NORTHSTAR"}</>}</Link>
            <p>Personal and business banking designed around clarity, control, and dependable service.</p>
          </div>
          <div><b>{t("Personal")}</b><Link href="#personal">{t("Checking")}</Link><Link href="#personal">{t("Savings")}</Link><Link href="/app/cards">{t("Virtual cards")}</Link><Link href="#borrowing">{t("Loans")}</Link></div>
          <div><b>{t("Business")}</b><Link href="#business">{t("Business banking")}</Link><Link href="#business">{t("Payments")}</Link><Link href="#business">{t("Cash flow")}</Link></div>
          <div><b>{t("Support")}</b><Link href="/app/support">{t("Help center")}</Link><Link href="/login">{t("Online banking")}</Link></div>
          <div><b>{t("Get started")}</b><Link href="/open-account">{t("Open an account")}</Link><Link href="/login">{t("Customer sign in")}</Link></div>
        </div>
        <div className="bank-footer-legal">
          <p>{t("Privacy")} · {t("Security")} · {t("Accessibility")} · <Link href="/simulation-disclosure">{t("Compliance disclosure")}</Link></p>
          <span>© 2026 {brand?.bankName??"Northstar"}. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
