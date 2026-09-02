'use client'

import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { capabilityPillars, company, scaleFacts } from './data/company'
import { services, type Service } from './data/services'

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const publicAsset = (path: string) => `${publicBasePath}${path}`

type IconName = Service['icon'] | 'arrow' | 'phone' | 'mail' | 'pin' | 'plus' | 'menu' | 'close' | 'chevron' | 'check'

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></>,
    chevron: <path d="m8 10 4 4 4-4"/>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    phone: <path d="M5.5 3.8 8.2 3l1.7 4.3-1.8 1.1a15.5 15.5 0 0 0 7.4 7.4l1.1-1.8 4.3 1.7-.8 2.7c-.3 1-1.2 1.6-2.3 1.5C10.2 19.2 4.8 13.8 4.1 6.1c-.1-1 .5-2 1.4-2.3Z"/>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    structure: <><path d="M4 20V9l8-5 8 5v11"/><path d="M3 20h18M8 20v-7h8v7M9 9h6"/></>,
    civil: <><path d="M3 19h18M5 19V7h14v12M8 7V4h8v3M8 12h2m4 0h2m-8 4h2m4 0h2"/></>,
    building: <><path d="M5 21V4h11v17M2 21h20M8 8h2m2 0h2M8 12h2m2 0h2M8 16h2m2 0h2M16 10h3v11"/></>,
    grid: <><path d="M4 20 9 4l3 9 3-6 5 13M3 20h18"/><path d="M7 14h10"/></>,
    road: <><path d="M7 21 10 3m4 0 3 18M3 21h18"/><path d="M12 6v2m0 4v2m0 4v2"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="1"/><path d="M8 7V5h8v2M3 12h18M10 12v2h4v-2"/></>,
    tender: <><path d="M7 3h8l3 3v15H7z"/><path d="M15 3v4h4M10 11h5m-5 4h5"/></>,
    transport: <><path d="M3 17h18M5 17V8h10v9M15 11h3l2 3v3h-5"/><circle cx="8" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
    repair: <><path d="m14 6 4-3 3 3-3 4-2-2-7 7-3-3 7-7Z"/><path d="m5 14-2 2 5 5 2-2"/></>,
    tools: <><path d="M14 6a4 4 0 0 0-5 5L3 17l4 4 6-6a4 4 0 0 0 5-5l-3 3-3-3 2-4Z"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title
    const descriptionElement = document.querySelector('meta[name="description"]')
    descriptionElement?.setAttribute('content', description)
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = window.location.href
  }, [title, description])
}

function useReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (reducedMotion) {
      items.forEach((item) => item.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  })
}

function AppLink({ to, children, className = '', onClick, ariaLabel }: { to: string; children: ReactNode; className?: string; onClick?: () => void; ariaLabel?: string }) {
  return <a href={to} className={className} onClick={onClick} aria-label={ariaLabel}>{children}</a>
}

const navItems = [
  ['Home', '/'], ['Contact', '/contact'],
]

const footerItems = [
  ['About', '/#about'], ['Services', '/#services'], ['Capabilities', '/#capabilities'], ['Contact', '/contact'],
]

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 28)
    scroll(); window.addEventListener('scroll', scroll, { passive: true })
    return () => window.removeEventListener('scroll', scroll)
  }, [])
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])
  const pathname = usePathname()
  const rawPath = pathname.startsWith(publicBasePath) ? pathname.slice(publicBasePath.length) || '/' : pathname
  const path = rawPath.replace(/\/+$/, '') || '/'
  return <header className={`site-header ${scrolled || path !== '/' ? 'is-solid' : ''}`}>
    <div className="shell header-inner">
      <AppLink to="/" className="brand" onClick={() => setOpen(false)} ariaLabel="BNS Works home">
        <img src={publicAsset('/images/brand/bns-logo.png')} alt="BNS Works Contracts Private Limited" />
      </AppLink>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map(([label, to]) => <AppLink key={to} to={to} className={path === to ? 'active' : ''}>{label}</AppLink>)}
      </nav>
      <AppLink to="/contact" className="button button--header">Get in Touch <Icon name="arrow" size={16} /></AppLink>
      <button className="menu-button" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button>
    </div>
    <div className={`mobile-panel ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <nav aria-label="Mobile navigation">
        {navItems.map(([label, to], index) => <AppLink key={to} to={to} className="mobile-link" onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}<Icon name="arrow" /></AppLink>)}
      </nav>
      <div className="mobile-contact"><a href={`tel:+91${company.phone}`}><Icon name="phone" />{company.phoneDisplay}</a><a href={`mailto:${company.email}`}><Icon name="mail" />{company.email}</a></div>
    </div>
  </header>
}

function Footer() {
  return <>
    <footer className="footer">
      <div className="shell footer-top">
        <div><img className="footer-logo" src={publicAsset('/images/brand/bns-logo.png')} alt="BNS Works Contracts Private Limited" /><p>General construction, civil works and infrastructure execution across Punjab.</p></div>
        <div className="footer-nav"><span className="eyebrow">Explore</span>{footerItems.map(([label, to]) => <AppLink key={to} to={to}>{label}</AppLink>)}</div>
        <div className="footer-contact"><span className="eyebrow">Contact</span><p>{company.location}</p><a href={`tel:+91${company.phone}`}>{company.phoneDisplay}</a><a href={`mailto:${company.email}`}>{company.email}</a></div>
      </div>
      <div className="shell footer-base"><span>© {new Date().getFullYear()} BNS Works Contracts Private Limited</span><span>Punjab · Chandigarh · Mohali</span></div>
    </footer>
    <div className="mobile-actions"><a href={`tel:+91${company.phone}`}><Icon name="phone" size={17}/>Call</a><a href={`mailto:${company.email}`}><Icon name="mail" size={17}/>Email</a><AppLink to="/contact"><Icon name="arrow" size={17}/>Contact</AppLink></div>
  </>
}

function PageFrame({ children }: { children: ReactNode }) { return <><Header /><main>{children}</main><Footer /></> }

function Eyebrow({ children }: { children: ReactNode }) { return <p className="eyebrow"><span></span>{children}</p> }
function Button({ to, children, variant = 'primary' }: { to: string; children: ReactNode; variant?: 'primary' | 'ghost' }) { return <AppLink to={to} className={`button button--${variant}`}>{children}<Icon name="arrow" size={17} /></AppLink> }

function Hero() {
  return <section className="hero"><img className="hero-image" src={publicAsset('/images/general/bns-hero-construction.png')} alt="Construction and infrastructure development"/><div className="hero-shade"></div><div className="shell hero-content">
    <div className="hero-copy"><Eyebrow>General construction company · Punjab, India</Eyebrow><h1>Building infrastructure.<br/><em>Delivering what matters.</em></h1><p>Construction, civil works and infrastructure execution for Punjab, Chandigarh and Mohali.</p><div className="hero-actions"><Button to="/#capabilities">View our capabilities</Button><Button to="/contact" variant="ghost">Discuss your project</Button></div></div>
    <div className="hero-side"><span>01 / 01</span><span>Built for real-world work</span></div>
  </div><div className="hero-bottom shell"><span className="scroll-marker"><i></i>Scroll to explore</span><span>General Construction · Civil Works · Infrastructure</span></div></section>
}

function ScaleStrip() { return <section className="scale-strip"><div className="shell scale-grid">{scaleFacts.map((fact, index) => <div className="scale-item" data-reveal style={{ transitionDelay: `${index * 60}ms` }} key={fact.label + fact.value}><strong>{fact.value}</strong><div><b>{fact.label}</b><span>{fact.detail}</span></div></div>)}</div></section> }

function SectionHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: ReactNode; copy?: string; action?: ReactNode }) { return <div className="section-heading" data-reveal><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>{(copy || action) && <div className="section-heading__aside">{copy && <p>{copy}</p>}{action}</div>}</div> }

function ServiceIcon({ service }: { service: Service }) { return <span className="service-icon"><Icon name={service.icon} size={26}/></span> }
function ServicesGrid({ limit }: { limit?: number }) { const shown = limit ? services.slice(0, limit) : services; return <div className="services-grid">{shown.map((service, index) => <article className="service-card" data-reveal style={{ transitionDelay: `${(index % 5) * 55}ms` }} key={service.title}><ServiceIcon service={service}/><div><h3>{service.title}</h3><p>{service.description}</p></div><span className="card-arrow"><Icon name="arrow" size={17}/></span></article>)}</div> }

const coreExpertise = [
  ['road', 'Road & Highway Construction', 'End-to-end execution of state and national highway networks. We focus on utilizing high-durability materials, optimizing traffic flow, and maintaining rigorous safety standards to deliver roads built for the long haul.'],
  ['briefcase', 'Government & Public Works', 'Trusted contracting for public sector infrastructure and municipal developments. We have the expertise to navigate government compliance, ensuring all projects are completed strictly to regulatory standards, on time, and within budget.'],
  ['building', 'Civil Infrastructure & Real Estate Development', 'Comprehensive civil engineering services supporting large-scale commercial and residential real estate projects. From initial site preparation and foundational groundworks to structural completion, we build environments that last.'],
] as const

function OverviewSection() { return <section className="section overview" id="about"><div className="shell overview-grid"><div className="overview-visual" data-reveal><img src={publicAsset('/images/general/bns-hero-construction.png')} alt="Construction capability and building development"/><div className="visual-caption"><span>Construction capability</span><span>01 — 04</span></div></div><div className="overview-copy" data-reveal><Eyebrow>About BNS</Eyebrow><h2>Built for the work<br/>that <em>matters.</em></h2><p>BNS Works Contracts Private Limited brings together general construction, civil construction, building construction and infrastructure development in one focused execution offering.</p><p>Our work spans roads and highways, government contracting and tenders, engineering and transportation, maintenance and repair, and private civil works. With a 150+ employee workforce and operational reach across Punjab, Chandigarh and Mohali, BNS is structured for practical on-ground delivery.</p><Button to="/#services" variant="ghost">Explore our services</Button></div></div></section> }

function CoreExpertise() { return <section className="section core-expertise"><div className="shell"><SectionHeading eyebrow="Core capabilities" title={<>Our Core Areas<br/>of <em>Expertise.</em></>} copy="BNS delivers high-quality civil engineering, infrastructure, and real estate development solutions. We partner with public and private sectors to execute complex projects with precision, from foundational groundworks to completed road networks."/><div className="expertise-grid">{coreExpertise.map(([icon, title, copy], index) => <article className="expertise-card" data-reveal style={{ transitionDelay: `${index * 70}ms` }} key={title}><span className="expertise-card__icon"><Icon name={icon} size={25}/></span><span className="expertise-card__number">0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section> }

function GovernmentSection() { return <section className="government"><div className="shell government-grid"><div className="government-copy" data-reveal><Eyebrow>Government & infrastructure</Eyebrow><h2>Experience where<br/>infrastructure <em>matters.</em></h2><p>Experience across PWD projects, village roads and intercity roads informs our approach to construction and civil infrastructure work.</p><ul><li><Icon name="check" size={17}/>PWD project experience</li><li><Icon name="check" size={17}/>Village and intercity road works</li><li><Icon name="check" size={17}/>Government contracting support</li></ul><Button to="/#capabilities">View capabilities</Button></div><div className="government-visual" data-reveal><img src={publicAsset('/images/general/road-infrastructure-execution.png')} alt="Road infrastructure work in Punjab"/><div className="visual-data"><span>Infrastructure execution</span><b>PW<span>D</span></b><small>Experience</small></div></div></div></section> }

const capabilityItems = [
  ['Construction Capability', 'General, civil and building construction support.'],
  ['Road & Infrastructure', 'Road, highway and civil infrastructure work capability.'],
  ['Government Project Execution', 'Experience with PWD projects and government contracting requirements.'],
  ['Engineering & Transportation', 'Engineering and transportation support for site execution.'],
  ['Equipment & Machinery', 'Extensive project-ready equipment and machinery.'],
  ['Maintenance & Repair', 'Maintenance and repair capability for constructed assets.'],
] as const

function CapabilitiesPreview() { return <section className="capabilities-preview" id="capabilities"><div className="shell"><SectionHeading eyebrow="Execution capability" title={<>Resourced for the<br/><em>work ahead.</em></>} copy="A practical foundation for construction, civil works and infrastructure execution."/><div className="pillar-grid">{capabilityPillars.map((pillar, index) => <article className="pillar" data-reveal style={{ transitionDelay: `${index * 70}ms` }} key={pillar.number}><span>{pillar.number}</span><h3>{pillar.title}</h3><p>{pillar.copy}</p></article>)}</div><div className="resource-bar" data-reveal><div><span className="eyebrow"><i></i>People & equipment</span><h3>150+ employees</h3></div><p>Extensive project-ready equipment and machinery supporting field execution.</p><Button to="/contact" variant="ghost">Discuss a requirement</Button></div><div className="capability-list capability-list--home">{capabilityItems.map(([title, copy], index) => <article data-reveal key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div><Icon name="check"/></article>)}</div></div></section> }

const mapBounds = { west: 74.0, east: 77.0, north: 32.55, south: 29.55 }
const regionalCities = [
  { city: 'Amritsar', latitude: 31.6340, longitude: 74.8723, labelClass: 'label-left' },
  { city: 'Kapurthala', latitude: 31.3801, longitude: 75.3810, labelClass: 'label-left' },
  { city: 'Jalandhar', latitude: 31.3260, longitude: 75.5762, labelClass: 'label-right' },
  { city: 'Ludhiana', latitude: 30.9010, longitude: 75.8573, labelClass: 'label-left' },
  { city: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, labelClass: 'label-right' },
  { city: 'Mohali', latitude: 30.7046, longitude: 76.7179, labelClass: 'label-left' },
] as const

function mapPosition(latitude: number, longitude: number) {
  const mapLeft = 19.9
  const mapRight = 77.5
  const mapTop = 4.9
  const mapBottom = 95.7
  return {
    left: `${mapLeft + ((longitude - mapBounds.west) / (mapBounds.east - mapBounds.west)) * (mapRight - mapLeft)}%`,
    top: `${mapTop + ((mapBounds.north - latitude) / (mapBounds.north - mapBounds.south)) * (mapBottom - mapTop)}%`,
  }
}

function ReachSection() { return <section className="section reach"><div className="shell reach-grid"><div data-reveal><Eyebrow>Geographic presence</Eyebrow><h2>Present where<br/>Punjab <em>builds.</em></h2><p>Based in Ludhiana, BNS operates across all districts of Punjab, Chandigarh and Mohali.</p><Button to="/contact" variant="ghost">Discuss your project</Button></div><div className="regional-map" data-reveal><img src={publicAsset('/images/general/punjab-regional-map.png')} alt="Map of Punjab showing BNS presence in Amritsar, Kapurthala, Jalandhar, Ludhiana, Chandigarh and Mohali"/>{regionalCities.map(({ city, latitude, longitude, labelClass }) => <span className={`regional-map__marker ${labelClass}`} style={mapPosition(latitude, longitude)} key={city}><i></i><b>{city}</b></span>)}</div></div></section> }

function ContactCta() { return <section className="contact-cta"><div className="contact-cta__grid"></div><div className="shell contact-cta__inner" data-reveal><div><Eyebrow>Start a conversation</Eyebrow><h2>Have a project<br/>in <em>mind?</em></h2></div><div><p>To learn more about our contracting services or to discuss a prospective development, contact BNS Works Contracts Private Limited directly at <strong><a href={`tel:+91${company.phone}`}>{company.phoneDisplay}</a></strong>.</p><Button to="/contact">Discuss your project</Button></div></div></section> }

function Home() { usePageMeta('BNS Works Contracts Private Limited | General Construction', 'General construction, civil works and infrastructure execution across Punjab, Chandigarh and Mohali.'); useReveal(); return <PageFrame><Hero/><ScaleStrip/><OverviewSection/><CoreExpertise/><section className="section services-home" id="services"><div className="shell"><SectionHeading eyebrow="What we do" title={<>Practical capability<br/>across <em>construction.</em></>} copy="The complete general construction offering, brought together here on the home page."/><ServicesGrid/></div></section><GovernmentSection/><CapabilitiesPreview/><ReachSection/><ContactCta/></PageFrame> }

function InnerHero({ number, eyebrow, title, copy }: { number: string; eyebrow: string; title: ReactNode; copy: string }) { return <section className="inner-hero"><div className="inner-hero__lines"></div><div className="shell inner-hero__content"><span className="page-number">{number}</span><div data-reveal><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{copy}</p></div></div></section> }

function About() { usePageMeta('About BNS Works | General Construction', 'Learn about BNS Works Contracts Private Limited, a general construction company operating across Punjab.'); useReveal(); return <PageFrame><InnerHero number="01" eyebrow="About BNS Works" title={<>Construction built<br/>for <em>real work.</em></>} copy="A general construction company serving construction, civil work and infrastructure requirements across the region."/><section className="section about-detail"><div className="shell two-column"><div data-reveal><h2>What we do</h2></div><div data-reveal><p className="lead">BNS Works Contracts Private Limited brings together general construction, civil construction, building construction and infrastructure development in one focused execution offering.</p><p>Our work spans roads and highways, government contracting and tenders, engineering and transportation, maintenance and repair, and private civil works.</p></div></div></section><section className="about-workforce"><div className="shell" data-reveal><span className="eyebrow"><i></i>Workforce</span><h3>150+ <em>Employees</em></h3><p>A practical on-ground team supporting construction, civil works and infrastructure execution.</p></div></section><section className="section"><div className="shell"><SectionHeading eyebrow="How BNS is structured" title={<>Focused on the<br/><em>essentials.</em></>} copy="Construction resources, workforce and field-ready equipment are brought together around the needs of each requirement."/><div className="commitment-grid">{['Construction & civil works', 'Infrastructure execution', 'Road works & maintenance'].map((item, index) => <div className="commitment" data-reveal key={item}><span>0{index + 1}</span><h3>{item}</h3><p>Practical support for project requirements without overstating what is not yet documented.</p></div>)}</div></div></section><ContactCta/></PageFrame> }

function Services() { usePageMeta('Construction Services | BNS Works', 'Explore BNS Works construction, civil works, infrastructure and government contracting service capabilities.'); useReveal(); return <PageFrame><InnerHero number="02" eyebrow="Services" title={<>The capabilities<br/>to <em>get moving.</em></>} copy="A focused collection of construction and infrastructure services designed for public and private requirements."/><section className="section services-page"><div className="shell"><ServicesGrid/></div></section><section className="dark-statement"><div className="shell"><div><Eyebrow>One integrated partner</Eyebrow><h2>From civil work to<br/><em>infrastructure delivery.</em></h2></div><p>BNS brings a practical general construction perspective to the varied needs of construction, roads, government work, engineering and maintenance.</p></div></section><ContactCta/></PageFrame> }

function Capabilities() { usePageMeta('Capabilities | BNS Works', 'BNS Works construction capability, workforce and equipment readiness for civil and infrastructure work.'); useReveal(); return <PageFrame><InnerHero number="03" eyebrow="Capabilities" title={<>Ready to work<br/>at <em>ground level.</em></>} copy="People, equipment and practical construction capability aligned to project execution."/><section className="section capability-page"><div className="shell"><div className="capability-feature" data-reveal><div><span className="eyebrow"><i></i>Workforce</span><strong>150+</strong><p>Employees</p></div><div className="capability-feature__image"><img src={publicAsset('/images/general/indian-construction-workforce.png')} alt="Construction workers and engineers on site"/></div><div><span className="eyebrow"><i></i>Equipment</span><h3>Extensive<br/>project-ready resources</h3><p>Construction equipment and machinery supporting field execution.</p></div></div><div className="capability-list">{capabilityItems.map(([title, copy], index) => <article data-reveal key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div><Icon name="arrow"/></article>)}</div></div></section><ContactCta/></PageFrame> }

function Contact() {
  usePageMeta('Contact BNS Works', 'Contact BNS Works Contracts Private Limited in Ludhiana, Punjab for construction and infrastructure requirements.')
  useReveal()

  return <PageFrame>
    <InnerHero number="05" eyebrow="Contact" title={<>Let’s discuss<br/>your <em>requirement.</em></>} copy="Connect with BNS Works about a construction, civil works or infrastructure requirement."/>
    <section className="section contact-page">
      <div className="shell contact-grid">
        <div className="contact-info" data-reveal>
          <Eyebrow>Contact BNS Works</Eyebrow>
          <h2>Begin with a<br/><em>conversation.</em></h2>
        </div>
        <div className="contact-direct" data-reveal>
          <a className="direct-contact-action" href={`tel:+91${company.phone}`}><span className="direct-contact-action__icon"><Icon name="phone"/></span><span><small>Phone</small><strong>{company.phoneDisplay}</strong></span><Icon name="arrow"/></a>
          <a className="direct-contact-action" href={`mailto:${company.email}`}><span className="direct-contact-action__icon"><Icon name="mail"/></span><span><small>Email</small><strong>{company.email}</strong></span><Icon name="arrow"/></a>
          <div className="direct-contact-location"><span className="direct-contact-action__icon"><Icon name="pin"/></span><span><small>Location</small><strong>{company.location}</strong></span></div>
        </div>
      </div>
    </section>
  </PageFrame>
}

function NotFound() { usePageMeta('Page not found | BNS Works', 'BNS Works Contracts Private Limited.'); useReveal(); return <PageFrame><section className="not-found"><div className="shell"><span>404</span><h1>That page is not<br/><em>on the drawing.</em></h1><Button to="/">Return home</Button></div></section></PageFrame> }

export default function SiteApp() { const pathname = usePathname(); const rawPath = pathname.startsWith(publicBasePath) ? pathname.slice(publicBasePath.length) || '/' : pathname; const path = rawPath.replace(/\/+$/, '') || '/'; if (path === '/') return <Home/>; if (path === '/about') return <About/>; if (path === '/services') return <Services/>; if (path === '/capabilities') return <Capabilities/>; if (path === '/contact') return <Contact/>; return <NotFound/> }
