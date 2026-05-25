import React, { useState } from 'react';
import { 
  Phone, ArrowRight, Check, ChevronDown, ChevronUp, Download, 
  MapPin, Mail, FileText, CheckCircle, Clock, Shield, Lock, 
  Smartphone, Share2, Users, FileCheck, Layers, 
  DollarSign, Activity, Award, Star, ArrowUpRight, HelpCircle,
  Truck, Settings, RefreshCw, Send, AlertTriangle
} from 'lucide-react';

export default function LandingPage({ onLoginClick, onAdminLoginClick }) {
  const [activeFaq, setActiveFaq] = useState(null);

  // Seed actual system capabilities
  const stats = [
    { label: 'Unified Branches', count: '100% Cloud', desc: 'Sync multi-terminal cashboxes', icon: Layers, gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', shadow: 'rgba(59, 130, 246, 0.15)' },
    { label: 'Digital Bilty LR', count: 'Customizable', desc: 'Choose Format 1 & Format 2', icon: FileText, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', shadow: 'rgba(16, 185, 129, 0.15)' },
    { label: 'Vehicle Tracking', count: 'Live GPS', desc: 'Automated delay alerts & speed logs', icon: Truck, gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', shadow: 'rgba(245, 158, 11, 0.15)' },
    { label: 'Subuser Operators', count: 'Unlimited', desc: 'Granular permission parameters', icon: Users, gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', shadow: 'rgba(236, 72, 153, 0.15)' },
  ];

  // Colorful Why Roadwe list
  const whyRoadwe = [
    {
      title: 'Multi-Tenant Collaboration',
      desc: 'Create, edit, and share digital Bilties across all branch terminals, accountants, and transport managers in real-time.',
      icon: Users,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.05)',
      border: 'rgba(59, 130, 246, 0.2)'
    },
    {
      title: 'Dynamic Loading Slip (Parchi)',
      desc: 'Send instantaneous loading parchi agreements detailing driver commissions, loading agents, and advances to truck owners.',
      icon: FileCheck,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.05)',
      border: 'rgba(16, 185, 129, 0.2)'
    },
    {
      title: '1-Second Lightning Search',
      desc: 'Our index search scans drivers, vehicle plates, consignor details, and transit hubs to return matching LRs in a millisecond.',
      icon: Clock,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.05)',
      border: 'rgba(245, 158, 11, 0.2)'
    },
    {
      title: 'Drastic Expense Reduction',
      desc: 'Eliminate heavy multi-copy physical paper invoice notebooks, thermal roll costs, and administrative record-keeping delays.',
      icon: DollarSign,
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.05)',
      border: 'rgba(139, 92, 246, 0.2)'
    },
    {
      title: 'Digital Delivery Confirmation',
      desc: 'Send clean delivery confirmation links to the receiving party. Capture mobile photos of physical receiver signatures.',
      icon: Shield,
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.05)',
      border: 'rgba(236, 72, 153, 0.2)'
    }
  ];

  // Core product details - 6 real operational modules
  const coreFeatures = [
    {
      title: 'Lorry Receipt / Bilty Maker',
      desc: 'Simply create professional and elegant looking transport Bilty, LR within a minute and share with anyone right from your phone or desktop. Select from 3 customizable layout templates matching your brand guidelines.',
      features: ['GST-compliant templates', 'Digital verified stamps', 'Auto cargo weight conversions'],
      icon: FileText,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
      border: 'rgba(59, 130, 246, 0.25)'
    },
    {
      title: 'Loading Slip Advice (Parchi)',
      desc: 'Create your Parchi / Load Advices online and send it to the truck loading party within a second. Fully integrate fuel balances, broker commission rates, and supervisor loading clearances.',
      features: ['Driver commission tracks', 'Direct fuel pump advance links', 'Broker markup registers'],
      icon: FileCheck,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)',
      border: 'rgba(16, 185, 129, 0.25)'
    },
    {
      title: 'Dynamic Invoice Generator',
      desc: 'Make attractive, professional invoices in a single click. Our system auto-compiles loaded bilty lists, calculates total freight balances, deducts advances, and applies CGST/SGST variables in seconds.',
      features: ['CGST / SGST auto-ledger', 'Loading balance consolidations', 'Downloadable PDF records'],
      icon: DollarSign,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%)',
      border: 'rgba(245, 158, 11, 0.25)'
    },
    {
      title: 'SaaS Accounting Ledger',
      desc: 'Make an accounting ledger or journal to manage your business transactions. Real-time dashboards plot cashbox inflows, branch accounts, outstanding customer payments, and monthly ARR.',
      features: ['Party ledger summaries', 'Outstanding balance trackers', 'Excel tax report exports'],
      icon: Layers,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(109, 40, 217, 0.08) 100%)',
      border: 'rgba(139, 92, 246, 0.25)'
    },
    {
      title: 'Live GPS Vehicle Tracking',
      desc: 'Monitor active vehicles on an interactive operational timeline map. Track speed logs, segment deviations, transit delays, and estimated arrival times (ETA) for seamless dispatches.',
      features: ['Real-time location telemetry', 'Speed limit warning system', 'Dynamic ETA pathing alerts'],
      icon: Truck,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(219, 39, 119, 0.08) 100%)',
      border: 'rgba(236, 72, 153, 0.25)'
    },
    {
      title: 'Centralized Master Registries',
      desc: 'Maintain clean, centralized registers of frequent Parties (consignors/consignees), hired trucks, drivers with licensing credentials, and brokers to support rapid 1-click bilty generation.',
      features: ['Parties directories & KYC', 'Driver active license index', 'Standard fleet registration'],
      icon: Users,
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(8, 145, 178, 0.08) 100%)',
      border: 'rgba(6, 182, 212, 0.25)'
    }
  ];

  // Feature Matrix Modules
  const gridFeatures = [
    { title: '24x7 Tech Support', desc: 'Direct chat/call connection.', icon: Clock, color: '#3b82f6' },
    { title: 'Affordable Subscription Plans', desc: 'Curated plans starting at Rs. 299.', icon: DollarSign, color: '#10b981' },
    { title: 'Desktop & Mobile App', desc: 'Real-time multi-device cloud synchronization.', icon: Smartphone, color: '#f59e0b' },
    { title: 'Direct Instant Share', desc: 'Share on WhatsApp, SMS, or Email.', icon: Share2, color: '#8b5cf6' },
    { title: 'Easy To Use Portal', desc: 'Designed for simple transport operators.', icon: Award, color: '#ec4899' },
    { title: 'High-End Data Security', desc: 'Multi-tenant segregation & encryption.', icon: Lock, color: '#3b82f6' },
    { title: 'Invoice Generator', desc: 'Instantly bill multiple loaded bilties.', icon: FileText, color: '#10b981' },
    { title: 'Ledger Generator', desc: 'Organize debit/credit cash accounts.', icon: Layers, color: '#f59e0b' },
    { title: 'Load Invoice Feature', desc: 'Link freight and weight structures.', icon: FileCheck, color: '#8b5cf6' },
    { title: 'Lorry Receipt Bilty Maker', desc: 'Vibrant templates with multiple formats.', icon: FileText, color: '#ec4899' },
    { title: 'Multi-Account Login', desc: 'Assign sub-user operator roles.', icon: Users, color: '#3b82f6' },
    { title: 'Multiple Data Reports', desc: 'Audit branch cashflows and ARR.', icon: Activity, color: '#10b981' },
    { title: 'Realtime Data Sync', desc: 'Automatic background backup systems.', icon: CheckCircle, color: '#f59e0b' },
    { title: 'Receipt Acknowledgement', desc: 'Digital delivery signature confirmation.', icon: Shield, color: '#8b5cf6' }
  ];

  const plans = [
    {
      name: 'Trial Offer',
      price: 'Free',
      period: 'For 3 Months',
      desc: 'Take a trial of Roadwe, free of cost with all the premium cloud services and isolated databases.',
      features: [
        'Unlimited Bilty / Load Advice',
        'Edit Bilty / Edit Load Advice',
        'Receiver signature confirmation link',
        'Customized company logo & stamp'
      ],
      cta: 'Start Free Trial',
      popular: false,
      gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      glow: 'rgba(30, 41, 59, 0.15)'
    },
    {
      name: 'Silver Plan',
      price: 'Rs. 299/-',
      period: 'Pack for 3 months',
      desc: 'Ideal plan for local transporter agencies with moderate fleet operations.',
      features: [
        'Unlimited Bilty / Load Advice',
        'Edit Bilty / Edit Load Advice',
        'Receiver signature confirmation link',
        'Customized company logo uploads'
      ],
      cta: 'Choose Silver Now',
      popular: false,
      gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      glow: 'rgba(37, 99, 235, 0.15)'
    },
    {
      name: 'Gold Plan',
      price: 'Rs. 499/-',
      period: 'Pack for 6 months',
      desc: 'Our most popular plan, preferred by high-volume transport contractors.',
      features: [
        'Unlimited Bilty / Load Advice',
        'Edit Bilty / Edit Load Advice',
        'Receiver signature confirmation link',
        'Customized company logo & stamp',
        'Multi-device access & subuser roles'
      ],
      cta: 'Choose Gold (Recommended)',
      popular: true,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      glow: 'rgba(245, 158, 11, 0.2)'
    },
    {
      name: 'Platinum Plan',
      price: 'Rs. 899/-',
      period: 'Pack for 12 months',
      desc: 'Full enterprise-grade fleet control tower package with maximum features.',
      features: [
        'Unlimited Bilty / Load Advice',
        'Edit Bilty / Edit Load Advice',
        'Receiver signature confirmation link',
        'Customized company logo & stamp',
        'Full branch management access'
      ],
      cta: 'Go Platinum',
      popular: false,
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      glow: 'rgba(124, 58, 237, 0.15)'
    }
  ];

  const faqs = [
    {
      q: 'What is Roadwe?',
      a: 'Roadwe is an online Transport Bilty/LR, Loading Advice, and Invoice Maker platform through which you can create professional and elegant looking transport documents and share them with anyone instantly from your phone or desktop. It helps you digitize your bilty book and manage transport operations securely.'
    },
    {
      q: 'What is a Bilty?',
      a: 'A Bilty (or Lorry Receipt / LR) is a legal document issued by a transporter or carrier acknowledging that goods have been received for transit. It details the consignor, consignee, route, truck number, description of goods, freight rate, and payment balances.'
    },
    {
      q: 'What services does Roadwe provide?',
      a: 'Roadwe provides a complete Transport Management SaaS ecosystem including Bilty (LR) Maker, Loading Advice Slip (Parchi) online builder, Professional Invoice Generator, Branch Cashbox ledgers, Active Driver/Vehicle directories, Supplier Advance logs, and Live GPS segment coordinate tracking.'
    },
    {
      q: 'How do I install/use Roadwe on my device?',
      a: 'Roadwe is fully cloud-based and accessible immediately on any desktop or mobile browser. Simply click the "Web App Login" button to log into our advanced MERN dashboard. In addition, we offer a dedicated Android app downloadable via the Google Play Store for on-road mobile operations.'
    },
    {
      q: 'How do I get started on Roadwe?',
      a: 'Getting started is exceptionally simple! Just enter your mobile number in the hero input field above and click "USE IT ON WEB" or click "Web App Login" in the header to access our pre-seeded transporter sandbox client databases and preview premium features.'
    },
    {
      q: 'Is Roadwe cloud / web based?',
      a: 'Yes, Roadwe is a 100% secure web-based SaaS platform hosted in high-speed isolated cloud databases. Your data is synced automatically in real-time across all branch locations, desktops, and mobile app screens.'
    },
    {
      q: 'Do you sell customized apps?',
      a: 'Yes, for large logistics operators and enterprise fleets, our tech team offers white-labeled solutions, dedicated mobile apps under your company brand, custom domain mappings, and tailored API integrations.'
    },
    {
      q: 'How do I get support?',
      a: 'We offer 24x7 direct support. You can call us at +91 82692 03922, email hello@roadwe.com, or file a high-priority ticket directly through your transporter workspace or the platform admin console.'
    },
    {
      q: 'Can I access the same Roadwe account from two other devices?',
      a: 'Absolutely! Roadwe supports multi-account login with custom sub-user role permissions. Your operators, accountants, branch managers, and executives can all log in simultaneously from different devices with isolated access scopes.'
    }
  ];



  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const getFaqBorderColor = (idx, isOpen) => {
    if (!isOpen) return '#e2e8f0';
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    return colors[idx % colors.length];
  };

  return (
    <div style={{ 
      fontFamily: 'var(--font-body)', 
      backgroundColor: '#f8fafc', 
      color: '#1e293b', 
      minHeight: '100vh', 
      scrollBehavior: 'smooth',
      overflowX: 'hidden'
    }}>
            {/* 1. GLASSMORPHIC TOP HEADER (DARK SLATE STYLE OVER DARK HERO) */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(11, 14, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '14px 24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Glowing Gradient Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px', 
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <svg viewBox="0 0 100 100" width="22" height="22">
                <path d="M50 15 L35 85 M50 15 L65 85" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
                <path d="M50 15 L50 85" stroke="#ffffff" strokeWidth="6" strokeDasharray="12,12" />
              </svg>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '1.35rem', fontWeight: '900', color: '#ffffff', letterSpacing: '0.02em', background: 'linear-gradient(to right, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ROADWE</span>
              <div style={{ fontSize: '0.62rem', fontWeight: '900', color: '#f59e0b', letterSpacing: '0.12em', marginTop: '-3px' }}>LOGISTICS SAAS</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#home" style={{ fontSize: '0.88rem', fontWeight: '700', color: '#6366f1', textDecoration: 'none' }}>Home</a>
            <a href="#about" style={{ fontSize: '0.88rem', fontWeight: '700', color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>About</a>
            <a href="#features" style={{ fontSize: '0.88rem', fontWeight: '700', color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
            <a href="#pricing" style={{ fontSize: '0.88rem', fontWeight: '700', color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</a>
            <a href="#faq" style={{ fontSize: '0.88rem', fontWeight: '700', color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>FAQ</a>
            <a href="#contact" style={{ fontSize: '0.88rem', fontWeight: '700', color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }}>Contact</a>
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button 
              onClick={onLoginClick}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff',
                padding: '10px 22px', borderRadius: '8px',
                fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.25s ease', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <span>Web App Login</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </header>

      {/* 2. FLEETX-STYLE PREMIUM DARK HERO SECTION */}
      <section id="home" style={{ 
        padding: '120px 24px 130px 24px', 
        position: 'relative', 
        zIndex: 1,
        backgroundColor: '#0b0f19',
        backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Spotlights and Glows */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.25) 0%, transparent 60%), radial-gradient(circle at 10% 50%, rgba(37, 99, 235, 0.1) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)',
          pointerEvents: 'none', zIndex: 0
        }}></div>

        {/* Diagonal Light Spotlights */}
        <div style={{
          position: 'absolute', top: '-10%', left: '20%', width: '30%', height: '120%',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          transform: 'skewX(-25deg)', pointerEvents: 'none', filter: 'blur(40px)', zIndex: 0
        }}></div>
        <div style={{
          position: 'absolute', top: '-10%', left: '50%', width: '25%', height: '120%',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, transparent 70%)',
          transform: 'skewX(-25deg)', pointerEvents: 'none', filter: 'blur(30px)', zIndex: 0
        }}></div>

        {/* Technical Vector Grid Overlay */}
        <div style={{
          position: 'absolute', top: '10%', right: '2%', width: '55%', height: '80%',
          opacity: 0.12, pointerEvents: 'none', zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg viewBox="0 0 1000 500" width="100%" height="100%" style={{ stroke: '#6366f1', strokeWidth: 0.7, fill: 'none' }}>
            <path d="M 150,150 Q 200,100 250,180 T 350,220 T 450,150 T 550,200 T 650,130 T 750,220 T 900,120" strokeWidth="0.8" strokeDasharray="3,3" />
            <path d="M 100,250 Q 180,300 280,220 T 400,280 T 550,220 T 700,290 T 850,240" strokeWidth="0.8" strokeDasharray="4,4" />
            <circle cx="250" cy="180" r="3" fill="#6366f1" />
            <circle cx="450" cy="150" r="4" fill="#3b82f6" />
            <circle cx="650" cy="130" r="3" fill="#a78bfa" />
            <circle cx="280" cy="220" r="3.5" fill="#3b82f6" />
            <circle cx="550" cy="220" r="4.5" fill="#6366f1" />
            <circle cx="700" cy="290" r="3" fill="#a78bfa" />
            <line x1="250" y1="180" x2="280" y2="220" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="0.5" />
            <line x1="450" y1="150" x2="550" y2="220" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="0.5" />
            <line x1="550" y1="220" x2="650" y2="130" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="0.5" />
            <line x1="650" y1="130" x2="700" y2="290" stroke="rgba(167, 139, 250, 0.4)" strokeWidth="0.5" />
            <line x1="280" y1="220" x2="450" y2="150" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="0.5" />
          </svg>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '54px', paddingBottom: '40px' }}>
            
            <div style={{ maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Sparkle Badge */}
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                backgroundColor: 'rgba(99, 102, 241, 0.15)', 
                border: '1px solid rgba(99, 102, 241, 0.25)',
                padding: '6px 16px', 
                borderRadius: '30px', 
                width: 'fit-content'
              }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#818cf8" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#818cf8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Transport Management System
                </span>
              </div>

              {/* Title Header */}
              <h1 style={{ 
                fontFamily: 'var(--font-title)', 
                fontSize: '4.4rem', 
                fontWeight: '900', 
                lineHeight: '1.08', 
                letterSpacing: '-0.03em',
                color: '#ffffff'
              }}>
                Transform Your Freight <br/>
                <span style={{ 
                  background: 'linear-gradient(to right, #818cf8, #a78bfa, #f472b6)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}>Operations with AI</span>
              </h1>

              {/* Subtitle */}
              <p style={{ fontSize: '1.12rem', color: '#94a3b8', lineHeight: '1.6', maxWidth: '640px' }}>
                Intelligent transportation management for enterprises optimizing freight costs, digital dispatches, and delivery performance globally.
              </p>              {/* CTA Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px' }}>
                <button 
                  onClick={onLoginClick}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '16px 36px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span>Launch Transporter App</span>
                  <ArrowRight size={18} />
                </button>
                <button 
                  onClick={onLoginClick}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '16px 28px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#cbd5e1" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" fill="#cbd5e1" />
                  </svg>
                  <span>Watch Product Demo</span>
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Metrics Bar */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '40px'
          }}>
            {[
              { count: '4,50,000 +', label: 'Vehicles Served' },
              { count: '1000 +', label: 'Enterprise Customers' },
              { count: '20B +', label: 'Data Points / Day' },
              { count: '15M +', label: 'Workflows Digitized' }
            ].map((metric, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease'
              }}
              className="hover-card-glow-dark"
              >
                <span style={{ 
                  fontSize: '2rem', 
                  fontWeight: '950', 
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {metric.count}
                </span>
                <span style={{ 
                  fontSize: '0.82rem', 
                  color: '#94a3b8', 
                  fontWeight: '600',
                  letterSpacing: '0.02em'
                }}>
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. COLORFUL "ABOUT ROADWE" SECTION */}
      <section id="about" style={{ padding: '100px 24px', backgroundColor: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.05)', position: 'relative' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            backgroundColor: 'rgba(124, 58, 237, 0.08)', 
            border: '1px solid rgba(124, 58, 237, 0.15)',
            padding: '4px 16px', 
            borderRadius: '30px', 
            fontSize: '0.75rem', 
            fontWeight: '900', 
            color: '#7c3aed', 
            letterSpacing: '0.08em', 
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>
            About Roadwe
          </div>

          <h2 style={{ 
            fontFamily: 'var(--font-title)', 
            fontSize: '2.8rem', 
            fontWeight: '900', 
            letterSpacing: '-0.02em',
            color: '#0f172a',
            lineHeight: '1.2',
            marginBottom: '24px'
          }}>
            Vibrant, Detail-Oriented Logistics Software
          </h2>

          <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: '1.7', maxWidth: '840px', margin: '0 auto' }}>
            Roadwe is an Online Transport Bilty/LR, Loading Advice, and Invoice Maker through which you can create professional and elegant looking Transport Bilties, Loading advices, and Invoices and share them with anyone right from your phone or desktop. 
            Manage your digital bilty book, locate any LR within a second using our multi-field search engine, and collect digital delivery confirmations from consignees with third-party verification links in seconds.
          </p>

          {/* Glowing colorful features row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '50px' }}>
            {[
              { text: '⚡ Realtime Sync', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.05)' },
              { text: '🛡️ High-Security', color: '#10b981', glow: 'rgba(16, 185, 129, 0.05)' },
              { text: '📊 Advanced Ledgers', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.05)' },
              { text: '🚛 Multi-Branch Operations', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.05)' }
            ].map((tag, idx) => (
              <span key={idx} style={{
                backgroundColor: '#ffffff', 
                border: `1px solid rgba(0, 0, 0, 0.06)`, 
                padding: '14px 20px',
                borderRadius: '12px', 
                fontWeight: '800', 
                fontSize: '0.88rem', 
                color: tag.color,
                boxShadow: `0 4px 20px rgba(0, 0, 0, 0.02)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: tag.color }}></div>
                {tag.text}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* 4. VIBRANT "WHY ROADWE" GRID OF COLORFUL GLASS CARDS */}
      <section style={{ padding: '100px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: 'rgba(16, 185, 129, 0.08)', 
              border: '1px solid rgba(16, 185, 129, 0.15)',
              padding: '4px 16px', 
              borderRadius: '30px', 
              fontSize: '0.75rem', 
              fontWeight: '900', 
              color: '#10b981', 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              Why Roadwe
            </div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.6rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Empowering Transporters Across India
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {whyRoadwe.map((reason, idx) => {
              const IconComponent = reason.icon;
              return (
                <div key={idx} style={{
                  backgroundColor: '#ffffff', 
                  border: `1px solid rgba(0, 0, 0, 0.06)`,
                  padding: '24px', borderRadius: '16px',
                  display: 'flex', flexDirection: 'column', gap: '16px',
                  boxShadow: `0 8px 30px rgba(0,0,0,0.02)`,
                  transition: 'transform 0.2s ease, border-color 0.2s'
                }}
                className="hover-card-glow-colored"
                >
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px', 
                    backgroundColor: reason.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <IconComponent size={20} style={{ color: reason.color }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>{reason.title}</h4>
                    <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.4' }}>{reason.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. ROADWE CORE FEATURE SPECIFICS (DETAIL-ORIENTED BLOCKS WITH BULLETS) */}
      <section id="features" style={{ padding: '100px 24px', backgroundColor: '#ffffff', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ 
              display: 'inline-block', 
              backgroundColor: 'rgba(236, 72, 153, 0.08)', 
              border: '1px solid rgba(236, 72, 153, 0.15)',
              padding: '4px 16px', 
              borderRadius: '30px', 
              fontSize: '0.75rem', 
              fontWeight: '900', 
              color: '#ec4899', 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              Core Features
            </span>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.6rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
              The Operational Suite of Roadwe
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#475569', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              A robust, complete suite of cloud-powered tools constructed to run transport offices efficiently.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {coreFeatures.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div key={idx} style={{
                  background: feat.gradient,
                  border: `1px solid ${feat.border}`,
                  padding: '32px', borderRadius: '16px',
                  display: 'flex', flexDirection: 'column', gap: '20px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)'
                }}
                className="hover-card-glow-colored"
                >
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '12px',
                    backgroundColor: '#ffffff', border: `1px solid ${feat.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <IconComp size={22} style={{ color: feat.color }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>{feat.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', marginBottom: '16px' }}>{feat.desc}</p>
                    
                    {/* Bullet list for detail-oriented presentation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '16px' }}>
                      {feat.features.map((item, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: feat.color }}></div>
                          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569' }}>{item}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. ADVANCED NEW FEATURES MATRIX (COLORFUL ICONS) */}
      <section style={{ padding: '100px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ 
              display: 'inline-block', 
              backgroundColor: 'rgba(59, 130, 246, 0.08)', 
              border: '1px solid rgba(59, 130, 246, 0.15)',
              padding: '4px 16px', 
              borderRadius: '30px', 
              fontSize: '0.75rem', 
              fontWeight: '900', 
              color: '#2563eb', 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              Feature Matrix
            </span>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.6rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Comprehensive Feature Index
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {gridFeatures.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} style={{
                  backgroundColor: '#ffffff', 
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  padding: '20px', borderRadius: '12px',
                  display: 'flex', gap: '14px', alignItems: 'center',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
                }}
                className="hover-card-glow-colored"
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    backgroundColor: `${item.color}11`, border: `1px solid ${item.color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <IconComponent size={18} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b' }}>{item.title}</h4>
                    <span style={{ fontSize: '0.72rem', color: '#475569' }}>{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. HIGH IMPACT DYNAMIC STATISTICS HUD */}
      <section style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        padding: '80px 24px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', textAlign: 'center' }}>
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div key={idx} style={{
                  padding: '28px 20px', borderRadius: '16px',
                  backgroundColor: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: `0 10px 30px -10px ${stat.shadow}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: stat.gradient, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 4px 10px ${stat.shadow}`
                  }}>
                    <IconComp size={18} style={{ color: '#ffffff' }} />
                  </div>
                  <span style={{ fontSize: '2.4rem', fontWeight: '950', color: '#1e293b', letterSpacing: '-0.02em' }}>
                    {stat.count}
                  </span>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {stat.label}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{stat.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. VIBRANT SUBSCRIPTION PLANS COMPARISON GRID */}
      <section id="pricing" style={{ padding: '100px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ 
              display: 'inline-block', 
              backgroundColor: 'rgba(16, 185, 129, 0.08)', 
              border: '1px solid rgba(16, 185, 129, 0.15)',
              padding: '4px 16px', 
              borderRadius: '30px', 
              fontSize: '0.75rem', 
              fontWeight: '900', 
              color: '#10b981', 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              Pricing Scheme
            </span>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.6rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Flexible Enterprise SaaS Subscriptions
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#475569', maxWidth: '580px', margin: '8px auto 0 auto' }}>
              Select the plan that matches your transport network capacity. Start with our fully-featured 3-month free trial.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px', alignItems: 'stretch' }}>
            {plans.map((plan, idx) => (
              <div key={idx} style={{
                backgroundColor: '#ffffff',
                border: plan.popular ? `2px solid #f59e0b` : '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '20px', padding: '36px 24px',
                display: 'flex', flexDirection: 'column', gap: '22px',
                position: 'relative', transition: 'all 0.2s ease',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)'
              }}
              className="hover-card-glow-colored"
              >
                {plan.popular && (
                  <span style={{
                    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                    background: plan.gradient, color: '#ffffff', fontSize: '0.68rem', fontWeight: '900',
                    padding: '4px 16px', borderRadius: '30px', letterSpacing: '0.05em', textTransform: 'uppercase',
                    boxShadow: '0 4px 10px rgba(245,158,11,0.2)'
                  }}>
                    MOST POPULAR
                  </span>
                )}

                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: '850', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {plan.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
                    <span style={{ fontSize: '2.1rem', fontWeight: '950', color: '#0f172a', letterSpacing: '-0.02em' }}>{plan.price}</span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>/ {plan.period}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '10px', lineHeight: '1.4' }}>
                    {plan.desc}
                  </p>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(0, 0, 0, 0.06)', paddingTop: '20px' }}>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <Check size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                      <span style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.4' }}>{feat}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={onLoginClick}
                  style={{
                    background: plan.gradient,
                    color: '#ffffff', border: 'none', width: '100%',
                    padding: '12px', borderRadius: '10px', fontWeight: '800',
                    fontSize: '0.85rem', cursor: 'pointer', transition: 'transform 0.15s ease',
                    boxShadow: `0 4px 12px ${plan.glow}`
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. THE FAQ ACCORDION SUITE (INTERACTIVE COLOR HIGHLIGHTS) */}
      <section id="faq" style={{ padding: '100px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ 
              display: 'inline-block', 
              backgroundColor: 'rgba(124, 58, 237, 0.08)', 
              border: '1px solid rgba(124, 58, 237, 0.15)',
              padding: '4px 16px', 
              borderRadius: '30px', 
              fontSize: '0.75rem', 
              fontWeight: '900', 
              color: '#7c3aed', 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              FAQ Suite
            </span>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.6rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Common Queries Answered
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              const borderCol = getFaqBorderColor(idx, isOpen);
              return (
                <div key={idx} style={{
                  backgroundColor: '#ffffff', 
                  border: `1px solid ${isOpen ? borderCol : 'rgba(0, 0, 0, 0.06)'}`,
                  borderRadius: '12px', overflow: 'hidden', transition: 'all 0.25s ease',
                  boxShadow: isOpen ? `0 8px 24px -8px ${borderCol}22` : 'none'
                }}>
                  <button 
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%', display: 'flex', justify: 'space-between',
                      alignItems: 'center', padding: '20px 24px', border: 'none',
                      backgroundColor: 'transparent', cursor: 'pointer', textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: isOpen ? borderCol : '#1e293b' }}>
                      {faq.q}
                    </span>
                    {isOpen ? <ChevronUp size={16} style={{ color: borderCol }} /> : <ChevronDown size={16} style={{ color: '#64748b' }} />}
                  </button>
                  
                  <div style={{
                    maxHeight: isOpen ? '300px' : '0px',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '0 24px 20px 24px', fontSize: '0.88rem',
                      color: '#475569', lineHeight: '1.6', borderTop: '1px solid rgba(0, 0, 0, 0.06)'
                    }}>
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. ACTIVE CONTACT & FEEDBACK MODULE */}
      <section id="contact" style={{ padding: '100px 24px', backgroundColor: '#ffffff', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '48px' }}>
          
          <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <span style={{ 
                display: 'inline-block', 
                backgroundColor: 'rgba(239, 68, 68, 0.08)', 
                border: '1px solid rgba(239, 68, 68, 0.15)',
                padding: '4px 16px', 
                borderRadius: '30px', 
                fontSize: '0.75rem', 
                fontWeight: '900', 
                color: '#ef4444', 
                letterSpacing: '0.08em', 
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}>
                Contact Roadwe
              </span>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.6rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
                Get In Touch With Us
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#475569', marginTop: '8px', lineHeight: '1.5' }}>
                Have questions about custom plans, branch licenses, or multi-terminal operations? Reach out directly to our customer support desk.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <MapPin size={20} style={{ color: '#3b82f6' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '850', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Corporate Headquarters</h4>
                  <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px', lineHeight: '1.4' }}>
                    Parking no 9, Block No 19, Rawabhata, Transport Nagar, Raipur, Chhattisgarh 493221
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Smartphone size={20} style={{ color: '#10b981' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '850', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone Call Support</h4>
                  <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                    +91 82692 03922
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Mail size={20} style={{ color: '#f59e0b' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '850', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email Queries</h4>
                  <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                    hello@roadwe.com
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Form */}
          <div style={{ 
            flex: '1 1 450px', 
            backgroundColor: '#f8fafc', 
            padding: '36px', 
            borderRadius: '20px', 
            border: '1px solid rgba(0, 0, 0, 0.06)' 
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginBottom: '16px' }}>Leave a Message</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Your Name</label>
                <input type="text" required placeholder="Enter full name" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '0.85rem', color: '#0f172a', marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Message</label>
                <textarea required placeholder="Write message here..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '0.85rem', color: '#0f172a', minHeight: '80px', resize: 'vertical', marginTop: '4px' }}></textarea>
              </div>
              <button type="submit" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', transition: 'background-color 0.2s', marginTop: '8px' }}>
                Send Message
              </button>
            </form>

          </div>

        </div>
      </section>

      {/* 11. PREMIUM LIGHT FOOTER */}
      <footer style={{
        backgroundColor: '#ffffff', color: '#475569', padding: '60px 24px 30px 24px',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justify: 'space-between', gap: '40px', paddingBottom: '40px', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
          
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px', 
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg viewBox="0 0 100 100" width="20" height="20">
                  <path d="M50 15 L35 85 M50 15 L65 85" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
                  <path d="M50 15 L50 85" stroke="#ffffff" strokeWidth="6" strokeDasharray="12,12" />
                </svg>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#2563eb', letterSpacing: '0.04em', background: 'linear-gradient(to right, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ROADWE</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5' }}>
              Online Transport Bilty/LR, loading advices, and invoice book management. Cloud-based fleet management platform built with high security and enterprise-grade technologies.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '120px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Explore</h4>
              <a href="#home" style={{ fontSize: '0.8rem', color: '#475569', textDecoration: 'none' }}>Home</a>
              <a href="#about" style={{ fontSize: '0.8rem', color: '#475569', textDecoration: 'none' }}>About Us</a>
              <a href="#pricing" style={{ fontSize: '0.8rem', color: '#475569', textDecoration: 'none' }}>Pricing Plan</a>
              <a href="#faq" style={{ fontSize: '0.8rem', color: '#475569', textDecoration: 'none' }}>FAQs</a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '120px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Legal Policy</h4>
              <span style={{ fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>Terms & Conditions</span>
              <span style={{ fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>Privacy Policy</span>
              <span onClick={onAdminLoginClick} style={{ fontSize: '0.8rem', color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>System Admin Gate</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '240px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>USE IT ON WEB</h4>
              <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>
                Ready to manage your active lorry bilties, invoices, and branches? Click below to access your client TMS space instantly.
              </p>
              <button 
                onClick={onLoginClick}
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', color: '#ffffff', border: 'none',
                  padding: '10px 18px', borderRadius: '8px', fontWeight: '800',
                  fontSize: '0.8rem', cursor: 'pointer', transition: 'background-color 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 10px rgba(59, 130, 246, 0.15)'
                }}
              >
                <span>ACCESS WEB PORTAL</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* copyright row */}
        <div style={{ maxWidth: '1200px', margin: '24px auto 0 auto', display: 'flex', flexWrap: 'wrap', justify: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid rgba(0, 0, 0, 0.06)', paddingTop: '20px' }}>
          <span>© Copyright 2026 Roadwe Inc. All Rights Reserved.</span>
          <span>Made for Indian Transporters with ❤️</span>
        </div>
      </footer>
    </div>
  );
}
