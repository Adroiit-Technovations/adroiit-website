"use client";

import { motion, type Variants } from "framer-motion";

import {

  ArrowRight,

  Settings,

  Zap,

  Users,

  ShieldCheck,

  Wrench,

  Lightbulb,

  Trophy,

  Microchip,

  LayoutDashboard,

  Cpu,

  Building2,

  GraduationCap,


  CheckCircle2,

  ClipboardCheck,

  BookOpen,

  Rocket,

  Workflow,

} from "lucide-react";

import Link from "next/link";

import Image from "next/image";

import { Bricolage_Grotesque } from "next/font/google";

import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const sectionVariants: Variants = {

  hidden: { opacity: 0, y: 30 },

  visible: {

    opacity: 1,

    y: 0,

    transition: {

      duration: 0.7,

      ease: "easeOut",

      staggerChildren: 0.1,

    },

  },

};

const fadeUp: Variants = {

  hidden: { opacity: 0, y: 22 },

  visible: (i: number = 0) => ({

    opacity: 1,

    y: 0,

    transition: {

      duration: 0.6,

      delay: i * 0.07,

      ease: "easeOut",

    },

  }),

};

const cardVariants: Variants = {

  hidden: { opacity: 0, y: 22 },

  visible: (i: number = 0) => ({

    opacity: 1,

    y: 0,

    transition: {

      duration: 0.55,

      delay: i * 0.07,

      ease: "easeOut",

    },

  }),

};

const domains = [

  {

    image: "/coe/robotics-ai.jpg",

    title: "Robotics",

    category: "Intelligent Machines",

    desc: "Hands-on learning in robot design, control systems and real-world applications, including autonomous and semi-autonomous systems.",

    icon: <Workflow size={19} />,

  },

  {

    image: "/coe/embedded.jpg",

    title: "Embedded Systems & IoT",

    category: "Connected Technology",

    desc: "Comprehensive training on microcontrollers, sensor interfacing, communication protocols and IoT-based smart systems.",

    icon: <Cpu size={19} />,

  },

  {

    image: "/coe/plc.jpg",

    title: "Industrial Automation",

    category: "Smart Manufacturing",

    desc: "Exposure to automation technologies used in industries, including PLCs, control systems and smart manufacturing concepts.",

    icon: <Settings size={19} />,

  },

  {

    image: "/coe/drone.jpg",

    title: "Drone Technology",

    category: "Unmanned Systems",

    desc: "Learning drone design, assembly, flight control and applications in fields such as surveillance, mapping and agriculture.",

    icon: <Rocket size={19} />,

  },

];

const supportServices = [

  {

    title: "Infrastructure Setup",

    desc: "Complete laboratory design and setup with suitable equipment, tools and learning infrastructure.",

    icon: <LayoutDashboard size={22} />,

  },

  {

    title: "Procurement Assistance",

    desc: "Guidance in identifying and sourcing the right components, equipment and technology systems.",

    icon: <ShieldCheck size={22} />,

  },

  {

    title: "Installation & Configuration",

    desc: "Professional installation, configuration and functional testing of hardware and software systems.",

    icon: <Settings size={22} />,

  },

  {

    title: "Faculty Training",

    desc: "Structured faculty development to help educators confidently use the CoE infrastructure.",

    icon: <GraduationCap size={22} />,

  },

  {

    title: "Student Training & Mentorship",

    desc: "Continuous practical training, technical guidance and mentorship for student learning.",

    icon: <Users size={22} />,

  },

  {

    title: "Project & Innovation Support",

    desc: "Support for project development, innovation activities, technical showcases and competitions.",

    icon: <Trophy size={22} />,

  },

];

const highlights = [

  {

    title: "Industry-grade lab infrastructure",

    desc: "A dedicated environment equipped for practical technology exploration.",

    icon: <Microchip size={23} />,

  },

  {

    title: "Experiential learning environment",

    desc: "Learning through experimentation, implementation and hands-on activities.",

    icon: <Wrench size={23} />,

  },

  {

    title: "Emerging technology exposure",

    desc: "Structured exposure to technologies shaping modern engineering industries.",

    icon: <Zap size={23} />,

  },

  {

    title: "Research and innovation culture",

    desc: "An environment that encourages curiosity, exploration and solution building.",

    icon: <Lightbulb size={23} />,

  },

  {

    title: "Academic and competition projects",

    desc: "A practical foundation for projects, demonstrations and technical challenges.",

    icon: <Trophy size={23} />,

  },

  {

    title: "Long-term institutional value",

    desc: "A sustainable ecosystem for continuous student and faculty development.",

    icon: <ShieldCheck size={23} />,

  },

];

const implementationSteps = [

  {

    number: "01",

    title: "Understand",

    subtitle: "Institutional requirements",

    desc: "Discuss academic goals, available infrastructure, student needs and the institution's long-term vision.",

    icon: <Users size={23} />,

  },

  {

    number: "02",

    title: "Design",

    subtitle: "Plan the ecosystem",

    desc: "Define suitable domains, laboratory layout, equipment requirements and learning pathways.",

    icon: <ClipboardCheck size={23} />,

  },

  {

    number: "03",

    title: "Establish",

    subtitle: "Set up and enable",

    desc: "Coordinate procurement, installation, configuration and faculty orientation for the CoE.",

    icon: <Settings size={23} />,

  },

  {

    number: "04",

    title: "Activate",

    subtitle: "Train, build and innovate",

    desc: "Conduct practical training, mentor projects and support a continuing culture of innovation.",

    icon: <Rocket size={23} />,

  },

];

const outcomes = [

  "Practical exposure to emerging technologies",

  "Experience with relevant tools, components and platforms",

  "Technical project development and documentation",

  "Problem-solving and analytical thinking",

  "Collaborative work and interdisciplinary learning",

  "Confidence in demonstrating and presenting solutions",

];

export default function CoEPage() {

  return (

    <div className={`${bricolage.className} overflow-x-hidden bg-white text-[#17151c]`}>

      {/* SECTION 01 — HERO | DARK */}

      <section className="relative isolate overflow-hidden bg-[#090711] px-6 pb-20 pt-32 text-white md:pb-28 md:pt-40">

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#8c52ff]/20 blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-48 -left-40 h-[450px] w-[450px] rounded-full bg-[#5921c7]/20 blur-[110px]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:55px_55px]" />

        <motion.div

          initial="hidden"

          whileInView="visible"

          viewport={{ once: true, amount: 0.15 }}

          variants={sectionVariants}

          className="relative z-10 mx-auto max-w-[1240px]"

        >

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

            <div className="flex flex-col items-start">

              <motion.p custom={0} variants={fadeUp} className="mb-7 text-[11px] font-bold uppercase tracking-[0.18em] text-[#c4aaff]">
                Education · Research · Innovation
              </motion.p>

              <motion.h1 custom={1} variants={fadeUp} className="max-w-2xl text-[32px] font-extrabold leading-[1.12] tracking-tight text-white">

                Center of

                <span className="mt-2 block bg-gradient-to-r from-[#8c52ff] via-[#a77bff] to-[#d0baff] bg-clip-text text-transparent">

                  Excellence (CoE)

                </span>

              </motion.h1>

              <motion.div custom={2} variants={fadeUp} className="my-7 h-1.5 w-20 rounded-full bg-gradient-to-r from-[#8c52ff] to-[#b18aff]" />

              <motion.p custom={3} variants={fadeUp} className="max-w-xl text-[18px] font-semibold leading-relaxed text-[#f1edf8]">

                Building future-ready innovation ecosystems.

              </motion.p>

              <motion.p custom={4} variants={fadeUp} className="mt-5 max-w-xl text-[15px] leading-8 text-[#b7b1c1] md:text-[16px]">

                Adroiit Technovations partners with institutions to establish state-of-the-art Centers of Excellence that empower students with industry-relevant skills and advanced laboratory infrastructure.

              </motion.p>

              <motion.p custom={5} variants={fadeUp} className="mt-4 max-w-xl text-[15px] leading-8 text-[#b7b1c1] md:text-[16px]">

                We transform traditional learning environments into innovation-driven ecosystems where students gain real-world exposure, work on impactful projects and develop strong technical competencies.

              </motion.p>

              <motion.div custom={6} variants={fadeUp} className="mt-9 flex flex-wrap gap-4">

                <Link href="/contact" className="group inline-flex items-center gap-3 rounded-full bg-[#5921c7] px-7 py-4 text-[14px] font-bold text-white shadow-xl shadow-[#5921c7]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#4516a5]">

                  Partner with us

                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />

                </Link>

              </motion.div>

            </div>

            <motion.div custom={7} variants={fadeUp} className="relative mx-auto w-full max-w-[650px]">

              <div className="relative aspect-[16/10] w-full">

                <div className="absolute -inset-4 rounded-[35px] bg-[#8c52ff]/20 blur-2xl" />

                <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] shadow-2xl">

                  <Image

                    src="/services/coe2.png"

                    alt="Center of Excellence at Adroiit Technovations"

                    fill

                    priority

                    sizes="(max-width: 768px) 100vw, 50vw"

                    className="object-cover"

                  />

                </div>

              </div>

            </motion.div>

          </div>

        </motion.div>

      </section>

      {/* SECTION 02 — DOMAINS | LIGHT */}

      <section className="relative isolate overflow-hidden bg-[#f8f7fb] px-6 py-20 text-[#17151c] md:py-28">

        <div className="pointer-events-none absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-[#5921c7]/[0.07] blur-[140px]" />

        <div className="pointer-events-none absolute -bottom-48 right-0 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/[0.07] blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-[1240px]">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} className="mb-14 flex flex-col items-center justify-center gap-6 text-center">

            <div className="max-w-2xl">

              <motion.p custom={0} variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7d55c5]">Technology domains</motion.p>

              <motion.h2 custom={1} variants={fadeUp} className="mt-4 text-[32px] font-extrabold leading-tight tracking-tight text-[#211a2c]">

                Domains We <span className="bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">Offer</span>

              </motion.h2>

              <motion.p custom={2} variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-[#77717f] md:text-[16px]">

                Specialized technology centers tailored to your institution&apos;s goals, connecting academic learning with practical technology applications.

              </motion.p>

            </div>

          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {domains.map((domain, i) => (

              <motion.article key={domain.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={cardVariants} whileHover={{ y: -7 }} className="group overflow-hidden rounded-[1.5rem] border border-[#e9e3f1] bg-white p-2 shadow-sm transition-all duration-500 hover:border-[#b99bff] hover:shadow-[0_18px_45px_-25px_rgba(89,33,199,0.3)]">

                <div className="relative aspect-[5/4] overflow-hidden rounded-[1.1rem] bg-[#eee8f8]">

                  <Image src={domain.image} alt={domain.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                </div>

                <div className="px-3 pb-4 pt-4">

                  <h3 className="mb-3 text-[18px] font-bold leading-tight text-[#282130]">{domain.title}</h3>

                  <div className="mb-3 flex items-center gap-2 text-[#5921c7]">

                    {domain.icon}

                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7d55c5]">{domain.category}</span>

                  </div>

                  <p className="text-[13px] leading-7 text-[#77717f]">{domain.desc}</p>

                </div>

              </motion.article>

            ))}

          </div>

        </div>

      </section>

      {/* SECTION 03 — COE ECOSYSTEM | DARK */}

      <section className="relative isolate overflow-hidden bg-[#100b1b] px-6 py-20 text-white md:py-28">

        <div className="pointer-events-none absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/10 blur-[130px]" />

        <div className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>

            <motion.p custom={0} variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b99bff]">More than a laboratory</motion.p>

            <motion.h2 custom={1} variants={fadeUp} className="mt-4 text-[32px] font-extrabold leading-tight tracking-tight text-white">

              An Ecosystem for <span className="bg-gradient-to-r from-[#a77bff] to-[#d3bfff] bg-clip-text text-transparent">Learning & Innovation</span>

            </motion.h2>

            <motion.p custom={2} variants={fadeUp} className="mt-6 text-[15px] leading-8 text-[#b7b1c1] md:text-[16px]">

              A Center of Excellence brings infrastructure, mentorship and applied learning together in one collaborative environment. It gives students and faculty a place to explore technologies, test ideas and develop solutions.

            </motion.p>

            <motion.p custom={3} variants={fadeUp} className="mt-4 text-[15px] leading-8 text-[#b7b1c1] md:text-[16px]">

              Our approach connects the laboratory with the academic ecosystem through structured training, guided projects and ongoing technical support.

            </motion.p>

          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {[

              { icon: <Building2 size={23} />, title: "Infrastructure", desc: "A dedicated space with relevant equipment, tools and technology platforms." },

              { icon: <BookOpen size={23} />, title: "Structured Learning", desc: "Guided learning pathways that complement institutional academics." },

              { icon: <Wrench size={23} />, title: "Hands-on Practice", desc: "Practical exercises, experimentation and implementation-led learning." },

              { icon: <Rocket size={23} />, title: "Project Development", desc: "Mentorship to turn concepts into prototypes and working solutions." },

            ].map((item, i) => (

              <motion.div key={item.title} custom={i} variants={fadeUp} whileHover={{ y: -5 }} className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 transition-all duration-300 hover:border-[#8c52ff]/50 hover:bg-white/[0.075]">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5921c7] text-white shadow-lg shadow-[#5921c7]/20">{item.icon}</div>

                <h3 className="text-[17px] font-bold text-white">{item.title}</h3>

                <p className="mt-3 text-[13px] leading-7 text-[#b7b1c1]">{item.desc}</p>

              </motion.div>

            ))}

          </motion.div>

        </div>

      </section>

      {/* SECTION 04 — IMPLEMENTATION SUPPORT | LIGHT */}

      <section className="relative isolate overflow-hidden bg-white px-6 py-20 text-[#17151c] md:py-28">

        <div className="pointer-events-none absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/[0.07] blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-[1240px]">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} className="mx-auto mb-14 max-w-3xl text-center">

            <motion.p custom={0} variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7d55c5]">Complete implementation</motion.p>

            <motion.h2 custom={1} variants={fadeUp} className="mt-4 text-[32px] font-extrabold tracking-tight text-[#211a2c]">

              End-to-End <span className="bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">Implementation Support</span>

            </motion.h2>

            <motion.p custom={2} variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-[#77717f] md:text-[16px]">

              We support the complete journey, from planning and infrastructure development to faculty enablement and continuous student mentorship.

            </motion.p>

          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {supportServices.map((service, i) => (

              <motion.article key={service.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={cardVariants} whileHover={{ y: -6 }} className="group relative overflow-hidden rounded-[1.5rem] border border-[#e9e3f1] bg-[#fbfaff] p-7 transition-all duration-300 hover:border-[#b99bff] hover:bg-white hover:shadow-[0_18px_45px_-25px_rgba(89,33,199,0.25)]">

                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#8c52ff]/[0.07] transition-transform duration-500 group-hover:scale-150" />

                <div className="relative z-10">

                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5921c7] to-[#8c52ff] text-white shadow-lg shadow-[#5921c7]/20 transition-transform duration-300 group-hover:scale-110">{service.icon}</div>

                  <h3 className="text-[17px] font-bold text-[#282130] transition-colors group-hover:text-[#5921c7]">{service.title}</h3>

                  <p className="mt-3 text-[13px] leading-7 text-[#77717f]">{service.desc}</p>

                  <div className="mt-6 h-1 w-9 rounded-full bg-[#8c52ff]/40 transition-all duration-300 group-hover:w-14 group-hover:bg-[#8c52ff]" />

                </div>

              </motion.article>

            ))}

          </div>

        </div>

      </section>

      {/* SECTION 05 — IMPLEMENTATION JOURNEY | DARK */}

      <section className="relative isolate overflow-hidden bg-[#090711] px-6 py-20 text-white md:py-28">

        <div className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-[#5921c7]/20 blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-[1240px]">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} className="mx-auto mb-14 max-w-3xl text-center">

            <motion.p custom={0} variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b99bff]">A structured approach</motion.p>

            <motion.h2 custom={1} variants={fadeUp} className="mt-4 text-[32px] font-extrabold tracking-tight text-white">

              How We Establish Your <span className="bg-gradient-to-r from-[#8c52ff] to-[#c2a5ff] bg-clip-text text-transparent">CoE</span>

            </motion.h2>

            <motion.p custom={2} variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-[#b7b1c1] md:text-[16px]">

              A collaborative implementation journey that aligns the CoE with your institution&apos;s objectives and operating environment.

            </motion.p>

          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {implementationSteps.map((step, i) => (

              <motion.article key={step.number} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={cardVariants} className="relative rounded-2xl border border-white/10 bg-white/[0.045] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#8c52ff]/50 hover:bg-white/[0.075]">

                <div className="mb-6 flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5921c7] text-white shadow-lg shadow-[#5921c7]/20">{step.icon}</div>

                  <span className="text-[30px] font-extrabold text-white/20">{step.number}</span>

                </div>

                <h3 className="text-[18px] font-bold text-white">{step.title}</h3>

                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#b99bff]">{step.subtitle}</p>

                <p className="mt-4 text-[13px] leading-7 text-[#b7b1c1]">{step.desc}</p>

              </motion.article>

            ))}

          </div>

        </div>

      </section>

      {/* SECTION 06 — OUTCOMES | LIGHT */}

      <section className="relative isolate overflow-hidden bg-[#f8f7fb] px-6 py-20 text-[#17151c] md:py-28">

        <div className="pointer-events-none absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-[#5921c7]/[0.06] blur-[140px]" />

        <div className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>

            <motion.p custom={0} variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7d55c5]">Institutional impact</motion.p>

            <motion.h2 custom={1} variants={fadeUp} className="mt-4 text-[32px] font-extrabold leading-tight tracking-tight text-[#211a2c]">

              Building Skills That Extend <span className="bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">Beyond the Classroom</span>

            </motion.h2>

            <motion.p custom={2} variants={fadeUp} className="mt-6 text-[15px] leading-8 text-[#77717f] md:text-[16px]">

              A well-supported CoE can strengthen the connection between academic concepts and practical application. Students gain opportunities to work with technology, collaborate on projects and demonstrate what they learn.

            </motion.p>

          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} className="rounded-[2rem] border border-[#e9e3f1] bg-white p-7 shadow-sm sm:p-9">

            <motion.h3 custom={0} variants={fadeUp} className="mb-7 text-[18px] font-bold text-[#282130]">What the ecosystem can help students develop</motion.h3>

            <div className="space-y-4">

              {outcomes.map((outcome, i) => (

                <motion.div key={outcome} custom={i} variants={fadeUp} className="flex items-start gap-4 border-b border-[#eee8f4] pb-4 last:border-0 last:pb-0">

                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8c52ff]/10 text-[#5921c7]"><CheckCircle2 size={15} /></div>

                  <p className="text-[13px] leading-7 text-[#5f5968]">{outcome}</p>

                </motion.div>

              ))}

            </div>

          </motion.div>

        </div>

      </section>

      {/* SECTION 07 — HIGHLIGHTS | DARK */}

      <section className="relative isolate overflow-hidden bg-[#100b1b] px-6 py-20 text-white md:py-28">

        <div className="pointer-events-none absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/10 blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-[1240px]">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} className="mb-14 text-center">

            <motion.p custom={0} variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b99bff]">Why establish a CoE</motion.p>

            <motion.h2 custom={1} variants={fadeUp} className="mt-4 text-[32px] font-extrabold tracking-tight text-white">

              CoE <span className="bg-gradient-to-r from-[#8c52ff] to-[#c2a5ff] bg-clip-text text-transparent">Highlights</span>

            </motion.h2>

            <motion.p custom={2} variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-[#b7b1c1] md:text-[16px]">

              Delivering long-term institutional value through practical exposure, technical capability and a culture of continuous innovation.

            </motion.p>

          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

            {highlights.map((item, i) => (

              <motion.article key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={cardVariants} className="group flex min-h-[205px] flex-col items-center justify-center rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-5 text-center transition-all duration-500 hover:-translate-y-2 hover:border-[#8c52ff]/50 hover:bg-[#8c52ff]/[0.08] sm:p-6">

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8c52ff]/20 bg-[#8c52ff]/10 text-[#c4aaff] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#5921c7] group-hover:text-white">{item.icon}</div>

                <h3 className="text-[12px] font-bold leading-relaxed text-[#eeeaf5] transition-colors group-hover:text-white sm:text-[13px]">{item.title}</h3>

                <p className="mt-3 text-[11px] leading-5 text-[#a9a2b4]">{item.desc}</p>

              </motion.article>

            ))}

          </div>

        </div>

      </section>

      {/* SECTION 08 — CTA | LIGHT */}

      <section className="relative isolate overflow-hidden bg-white px-6 py-20 md:py-28">

        <div className="pointer-events-none absolute -left-40 -top-32 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/[0.08] blur-[130px]" />

        <div className="pointer-events-none absolute -bottom-40 -right-32 h-[450px] w-[450px] rounded-full bg-[#5921c7]/[0.06] blur-[130px]" />

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} className="relative z-10 mx-auto max-w-[900px] text-center">
          <motion.p variants={fadeUp} className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7d55c5]">Let&apos;s build the future together</motion.p>
          <motion.h2 variants={fadeUp} className="mx-auto max-w-3xl text-[32px] font-extrabold leading-tight tracking-tight text-[#211a2c]">
            Build Your Institution&apos;s <span className="bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">Innovation Hub</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mb-8 mt-5 max-w-2xl text-[14px] leading-8 text-[#716a7c] md:text-[16px]">
            Collaborate with Adroiit Technovations to establish a Center of Excellence and provide your students with the tools, knowledge and mentorship to explore and lead in emerging technologies.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link href="/contact" className="group inline-flex items-center gap-3 rounded-full bg-[#5921c7] px-8 py-4 text-[14px] font-bold text-white shadow-xl shadow-[#5921c7]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#4516a5]">
              Book a Consultation
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

      </section>

      <Footer />

    </div>

  );

}

