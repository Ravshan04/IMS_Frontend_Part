import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Globe, Search, Menu, ChevronRight, X, BarChart3, TrendingUp, ShieldCheck, Layers, Activity, Box, Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import { APP_NAME } from "@/constants/common";
import { motion } from "framer-motion";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "uz";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-slate-900 hover:bg-transparent hover:text-slate-600 px-2 h-8 font-semibold text-[13px]">
          Global ({currentLang.toUpperCase()}) <ChevronRight className="w-3 h-3 rotate-90" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-none shadow-xl border-slate-200 bg-white text-slate-900 min-w-[120px]">
        <DropdownMenuItem onClick={() => i18n.changeLanguage("uz")} className="cursor-pointer hover:bg-slate-50 font-medium">
          O'zbekcha
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("ru")} className="cursor-pointer hover:bg-slate-50 font-medium">
          Русский
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage("en")} className="cursor-pointer hover:bg-slate-50 font-medium">
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
} as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};

const Landing = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Navbar (EPAM White Style) */}
      <motion.header 
        initial={{ y: -72 }} 
        animate={{ y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-[72px] border-b border-slate-200 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8"
      >
        
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center h-full">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center justify-center w-[72px] h-full border-r border-slate-200 hover:bg-slate-50 transition-colors -ml-4 md:-ml-8 mr-6 group">
                {isMenuOpen ? <X className="w-6 h-6 text-slate-900 group-hover:scale-110 transition-transform" strokeWidth={1.5} /> : <Menu className="w-6 h-6 text-slate-900 group-hover:scale-110 transition-transform" strokeWidth={1.5} />}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] p-0 bg-white border-r border-slate-200 shadow-2xl">
               <div className="flex flex-col h-full overflow-y-auto pt-4">
                 <Accordion type="single" collapsible className="w-full">
                    
                    {/* Services */}
                    <AccordionItem value="services" className="border-b border-slate-100 px-6">
                      <AccordionTrigger className="hover:no-underline py-5 text-[16px] font-bold text-slate-900">
                        Services
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <ul className="space-y-4 text-[15px] text-slate-600 font-medium">
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Cloud Asset Architecture</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Predictive Maintenance</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Data Intelligence & AI</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Security & Compliance</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Legacy Migration Services</Link></li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Industries */}
                    <AccordionItem value="industries" className="border-b border-slate-100 px-6">
                      <AccordionTrigger className="hover:no-underline py-5 text-[16px] font-bold text-slate-900">
                        Industries
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <ul className="space-y-4 text-[15px] text-slate-600 font-medium">
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Manufacturing & Industrial</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Logistics & Supply Chain</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Retail & E-commerce</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Healthcare & Life Sciences</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Public Sector</Link></li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Insights */}
                    <AccordionItem value="insights" className="border-b border-slate-100 px-6">
                      <AccordionTrigger className="hover:no-underline py-5 text-[16px] font-bold text-slate-900">
                        Insights
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <ul className="space-y-4 text-[15px] text-slate-600 font-medium">
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Engineering Blog</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Client Case Studies</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Technology Radar</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Whitepapers & Reports</Link></li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    {/* About */}
                    <AccordionItem value="about" className="border-b border-slate-100 px-6">
                      <AccordionTrigger className="hover:no-underline py-5 text-[16px] font-bold text-slate-900">
                        About
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <ul className="space-y-4 text-[15px] text-slate-600 font-medium">
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Company Overview</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Leadership Team</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Global Presence</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Partner Network</Link></li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Careers */}
                    <AccordionItem value="careers" className="border-b border-slate-100 px-6">
                      <AccordionTrigger className="hover:no-underline py-5 text-[16px] font-bold text-slate-900">
                        Careers
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <ul className="space-y-4 text-[15px] text-slate-600 font-medium">
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Open Positions</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Life at OmborPro</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Students & Graduates</Link></li>
                          <li><Link to="#" className="hover:text-[#009688] transition-colors">Culture & Values</Link></li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                 </Accordion>
               </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="OmborPro Logo" className="h-20 w-auto scale-[2] origin-left mix-blend-multiply" />
          </Link>
        </div>

        {/* Center: Desktop Nav with Hover Dropdowns */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
           {[
             { label: "Services", items: ["Cloud Asset Architecture", "Predictive Maintenance", "Data Intelligence & AI", "Security & Compliance", "Legacy Migration Services"] },
             { label: "Industries", items: ["Manufacturing & Industrial", "Logistics & Supply Chain", "Retail & E-commerce", "Healthcare & Life Sciences", "Public Sector"] },
             { label: "Insights", items: ["Engineering Blog", "Client Case Studies", "Technology Radar", "Whitepapers & Reports"] },
             { label: "About", items: ["Company Overview", "Leadership Team", "Global Presence", "Partner Network"] },
             { label: "Careers", items: ["Open Positions", "Life at OmborPro", "Students & Graduates", "Culture & Values"] },
           ].map((nav, i) => (
             <div key={i} className="relative group">
               <button className="text-[14px] font-bold text-slate-900 hover:text-[#009688] transition-colors tracking-wide py-6">
                 {nav.label}
               </button>
               <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                 <div className="bg-white border border-slate-200 shadow-2xl min-w-[260px] py-4">
                   {nav.items.map((sub, j) => (
                     <Link key={j} to="#" className="block px-6 py-2.5 text-[13px] font-medium text-slate-600 hover:text-[#009688] hover:bg-slate-50 transition-colors">
                       {sub}
                     </Link>
                   ))}
                 </div>
               </div>
             </div>
           ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/register" className="hidden md:block">
             <Button className="rounded-full bg-slate-950 text-white hover:bg-slate-800 font-bold text-[12px] h-9 px-6 uppercase tracking-[0.1em] transition-all border-none">
               {t("landing.ctaStart") || "Contact Us"}
             </Button>
          </Link>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <button className="flex items-center justify-center hover:bg-slate-50 p-2 rounded-full transition-colors">
             <Search className="w-5 h-5 text-slate-900" strokeWidth={1.5} />
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex w-full relative">
        
        {/* Hero Section (EPAM Vibrant Gradient Style) */}
        <section className="relative w-full min-h-[calc(100vh-72px)] flex items-center overflow-hidden">
          
          {/* Extremely Vibrant Abstract Gradient Background mimicking the red/purple/cyan waves */}
          <div className="absolute inset-0 bg-slate-950">
             {/* Base dark purple */}
             <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] via-[#2d0a31] to-[#0a0f1c]"></div>
             
             {/* Dynamic Floating Neon Orbs */}
             <motion.div 
               animate={{ 
                 scale: [1, 1.2, 1], 
                 x: ['0%', '-5%', '2%', '0%'],
                 y: ['0%', '10%', '-5%', '0%'] 
               }}
               transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/40 via-blue-900/20 to-transparent blur-3xl mix-blend-screen"
             ></motion.div>
             
             <motion.div 
               animate={{ 
                 scale: [1.5, 1.2, 1.5], 
                 x: ['0%', '10%', '-5%', '0%'],
                 y: ['0%', '-10%', '5%', '0%'],
                 rotate: [12, -5, 12]
               }}
               transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
               className="absolute bottom-[0%] left-[10%] w-[80%] h-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/50 via-rose-900/30 to-transparent blur-3xl mix-blend-screen transform rotate-12 scale-150"
             ></motion.div>
             
             <motion.div 
               animate={{ 
                 scale: [1.5, 1.8, 1.5], 
                 x: ['0%', '-8%', '8%', '0%'],
                 y: ['0%', '8%', '-8%', '0%'],
               }}
               transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-[30%] left-[20%] w-[100%] h-[40%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/40 via-fuchsia-900/20 to-transparent blur-3xl mix-blend-screen transform -rotate-12 scale-150"
             ></motion.div>
             
             {/* Sweep lines mimicking motion */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 w-full pt-12 pb-32">
            <motion.div 
              initial="hidden"
              animate="show"
              variants={staggerContainer}
              className="max-w-4xl"
            >
              <motion.h1 
                variants={fadeInUp}
                className="text-[56px] md:text-[80px] lg:text-[96px] font-light tracking-tight text-white mb-6 leading-[1.05]"
              >
                {t("landing.heroTitle").split(' ').map((word, i) => (
                  <span key={i} className={i % 3 === 0 ? "text-cyan-400 font-medium" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className="text-[24px] md:text-[32px] text-white/90 font-light max-w-3xl leading-[1.3] mt-8"
              >
                Driving AI-Native<br />
                Enterprise-Wide Transformation
              </motion.p>
            </motion.div>
          </div>
        </section>

      </main>

      {/* EPAM Style Stats Ribbon */}
      <section className="bg-white py-16 border-b border-slate-200 overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "1M+", label: "Assets Tracked" },
            { value: "50+", label: "Global Facilities" },
            { value: "24/7", label: "Real-Time Sync" },
            { value: "0.1s", label: "Data Latency", highlight: true }
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeInUp} className={`flex flex-col border-l-2 ${stat.highlight ? 'border-[#009688]' : 'border-slate-900'} pl-6`}>
              <div className={`text-4xl lg:text-5xl font-light ${stat.highlight ? 'text-[#009688]' : 'text-slate-900'} mb-2 tracking-tighter`}>{stat.value}</div>
              <div className="text-[13px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Core Capabilities - EPAM Engineering Style Layout */}
      <section id="capabilities" className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
          >
            <div className="max-w-2xl">
              <h2 className="text-[32px] md:text-[48px] font-light text-slate-900 tracking-tight leading-[1.1]">
                Engineering operational excellence through <span className="font-medium text-[#009688]">data intelligence.</span>
              </h2>
            </div>
            <Button 
              variant="link" 
              onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-900 hover:text-[#009688] uppercase tracking-widest font-bold text-[12px] p-0 h-auto flex items-center gap-2 group"
            >
              Explore Capabilities <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: BarChart3, title: "Distributed Tracking", desc: "Implement comprehensive monitoring infrastructure to track inventory across distributed geographical nodes in real-time." },
              { icon: TrendingUp, title: "Predictive Analytics", desc: "Utilize advanced data aggregation and machine learning to forecast demand and eliminate supply chain bottlenecks." },
              { icon: ShieldCheck, title: "Zero-Trust Security", desc: "Secure your operational data with granular, zero-trust role-based access controls designed for strict compliance." }
            ].map((cap, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white p-10 group border-t-4 border-transparent hover:border-[#009688] transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                <cap.icon className="w-10 h-10 text-slate-900 mb-8 group-hover:text-[#009688] transition-colors" strokeWidth={1} />
                <h4 className="font-bold text-xl mb-4 text-slate-900">{cap.title}</h4>
                <p className="text-slate-500 leading-relaxed text-[15px]">{cap.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enterprise Solutions - High Contrast Section */}
      <section className="py-24 bg-[#0a0f1c] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInRight}
          >
            <h2 className="text-[32px] md:text-[48px] font-light tracking-tight mb-8 leading-[1.1]">
              Built for scale.<br/>
              <span className="font-medium text-purple-400">Designed for performance.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
              Our architecture provides a robust foundation for your most critical inventory operations, ensuring high availability, security, and uncompromising performance in multi-tenant environments.
            </p>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Layers, text: "Microservices Infrastructure" },
                { icon: ShieldCheck, text: "End-to-End Encryption" },
                { icon: Activity, text: "Automated Compliance" },
                { icon: Globe, text: "Open API Integration" }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp} className="flex items-center gap-4 p-4 border border-white/10 hover:bg-white/5 transition-colors cursor-pointer group">
                  <item.icon className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="font-medium text-[14px] text-white/90">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInLeft}
            className="relative aspect-square md:aspect-[4/3] bg-[#131b2f] border border-white/10 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="relative z-10 w-3/4 h-3/4 border border-purple-500/30 flex items-center justify-center"
            >
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                 className="w-2/3 h-2/3 border border-cyan-500/30 flex items-center justify-center bg-[#0a0f1c]/50 backdrop-blur-sm shadow-[0_0_50px_rgba(34,211,238,0.1)]"
               >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Box className="w-16 h-16 text-cyan-400" strokeWidth={1} />
                  </motion.div>
               </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* EPAM Style Complex Dark Footer */}
      <footer className="bg-black text-white pt-20 pb-10">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0">
          
          {/* Column 1: Brands / Hub / Partners */}
          <div className="md:col-span-4 md:border-r border-white/20 md:pr-12">
            <h4 className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[13px] mb-8">Our Modules</h4>
            <ul className="space-y-5 text-[12px] font-bold uppercase tracking-wider text-white">
              <li><Link to="#" className="hover:text-cyan-400 transition-colors">Core Inventory</Link></li>
              <li><Link to="#" className="hover:text-cyan-400 transition-colors">Asset Management</Link></li>
              <li><Link to="#" className="hover:text-cyan-400 transition-colors">Predictive Analytics</Link></li>
              <li><Link to="#" className="hover:text-cyan-400 transition-colors">Compliance Engine</Link></li>
            </ul>

            <h4 className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[13px] mt-12 mb-6">Integrations Hub</h4>
            <p className="text-white/70 text-[13px] leading-relaxed pr-8">
              Explore our enterprise software integrations, open API standards and accelerators on <Link to="#" className="text-white font-bold underline hover:text-cyan-400 decoration-cyan-400 underline-offset-4">OmborPro SolutionsHub</Link>.
            </p>

            <h4 className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[13px] mt-12 mb-6">Partners</h4>
            <p className="text-white/70 text-[13px] leading-relaxed pr-8">
              Learn more about our <Link to="#" className="text-white font-bold underline hover:text-cyan-400 decoration-cyan-400 underline-offset-4">Alliances and Partnerships</Link>.
            </p>
          </div>

          {/* Column 2: Policies */}
          <div className="md:col-span-5 md:border-r border-white/20 md:px-12 mt-12 md:mt-0">
            <h4 className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[13px] mb-8">Policies</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-[12px] font-bold uppercase tracking-wider text-white">
              <Link to="#" className="hover:text-cyan-400 transition-colors">Investors</Link>
              <Link to="#" className="hover:text-cyan-400 transition-colors">Applicant Privacy Notice</Link>
              
              <Link to="#" className="hover:text-cyan-400 transition-colors">Open Source</Link>
              <Link to="#" className="hover:text-cyan-400 transition-colors">Web Accessibility</Link>
              
              <Link to="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-cyan-400 transition-colors pr-4">UK Modern Slavery Statement (PDF)</Link>
              
              <Link to="#" className="hover:text-cyan-400 transition-colors">Platform Policy</Link>
              <Link to="#" className="hover:text-cyan-400 transition-colors pr-4">Recruitment Fraud Disclaimer</Link>
              
              <Link to="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</Link>
              <Link to="#" className="hover:text-cyan-400 transition-colors pr-4">Code of Ethical Conduct (PDF)</Link>
            </div>
          </div>

          {/* Column 3: Social & Subscribe */}
          <div className="md:col-span-3 md:pl-12 mt-12 md:mt-0">
            <h4 className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[13px] mb-8">Social</h4>
            <div className="flex items-center gap-6 mb-12">
              <Link to="#" className="hover:text-cyan-400 transition-colors hover:-translate-y-1 transform inline-block"><Linkedin className="w-5 h-5" strokeWidth={1.5} /></Link>
              <Link to="#" className="hover:text-cyan-400 transition-colors hover:-translate-y-1 transform inline-block"><Facebook className="w-5 h-5" strokeWidth={1.5} /></Link>
              <Link to="#" className="hover:text-cyan-400 transition-colors hover:-translate-y-1 transform inline-block"><Instagram className="w-5 h-5" strokeWidth={1.5} /></Link>
              <Link to="#" className="hover:text-cyan-400 transition-colors hover:-translate-y-1 transform inline-block"><Youtube className="w-5 h-5" strokeWidth={1.5} /></Link>
            </div>

            <h4 className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-[13px] mb-6">Subscribe</h4>
            <p className="text-white/80 text-[13px] leading-relaxed">
              Manage and customize your <Link to="#" className="text-white font-bold underline hover:text-cyan-400 decoration-cyan-400 underline-offset-4">email subscription</Link> preferences.
            </p>
          </div>

        </div>

        {/* Footer Bottom / Copyright */}
        <div className="max-w-[1400px] mx-auto px-6 mt-20 pt-8 border-t border-white/10">
          <p className="text-[11px] text-white/50 max-w-sm leading-relaxed">
            &copy; {new Date().getFullYear()} {APP_NAME} Systems, Inc. All Rights Reserved. {APP_NAME} and the {APP_NAME} logo are registered trademarks of {APP_NAME} Systems, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
