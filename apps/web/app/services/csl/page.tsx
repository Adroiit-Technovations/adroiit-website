"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Sprout,
  Cog,
  HeartHandshake,
  CircuitBoard,
  Monitor,
  Utensils,
  Stethoscope,
  Shirt,
  CarFront,
  BrainCircuit,
  ShieldCheck,
  Wrench,
  BookOpen,
  Users,
  ClipboardCheck,
  Ruler,
  Boxes,
  GraduationCap,
  Building2,
  Handshake,
  Lightbulb,
  CheckCircle2,
  Hammer,
  Leaf,
  Laptop,
  FlaskConical,
  Presentation,
  Settings2,
  Award,
  Factory,
  Layers3,
  PackageCheck,
  Compass,
  FileCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const viewport = { once: true, amount: 0.14 };

function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
  center = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={`${center ? "mx-auto text-center" : ""} max-w-[780px]`}
    >
      <div
        className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 ${
          dark
            ? "border-white/15 bg-white/[0.06] text-[#c4a9ff]"
            : "border-[#5921c7]/15 bg-[#5921c7]/[0.06] text-[#5921c7]"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#ffcc00]" />
        <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
          {eyebrow}
        </span>
      </div>
      <h2
        className={`text-[32px] font-bold leading-[1.12] tracking-[-0.045em] ${
          dark ? "text-white" : "text-[#17121f]"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-[14px] leading-[1.85] sm:text-[15px] ${
            dark ? "text-white/60" : "text-[#625d69]"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

const workDomains = [
  {
    number: "01",
    title: "Work with Life Forms",
    subtitle: "Explore nature. Understand life.",
    description:
      "Students explore living systems and learn how scientific knowledge can be applied to agriculture, food production, environmental care and sustainable practices.",
    icon: Sprout,
    color: "#8bd6a0",
    examples: [
      "School gardening and plant care",
      "Seed germination and nursery activities",
      "Soil and water observation",
      "Basic agricultural technologies",
      "Composting and sustainability",
      "Food production fundamentals",
    ],
  },
  {
    number: "02",
    title: "Work with Machines & Materials",
    subtitle: "Design. Build. Experiment.",
    description:
      "Students work with tools, materials, machines and technology to understand how things function and develop the ability to design, construct and improve solutions.",
    icon: Cog,
    color: "#b89aff",
    examples: [
      "Electronics and electrical circuits",
      "Mechanical systems and mechanisms",
      "Robotics and automation",
      "Woodwork and material exploration",
      "CAD and 3D design",
      "IT, coding and digital technologies",
    ],
  },
  {
    number: "03",
    title: "Work with Human Services",
    subtitle: "Understand people. Create impact.",
    description:
      "Students understand how services support everyday life and explore practical skills through healthcare, hospitality, communication, entrepreneurship and community-oriented activities.",
    icon: HeartHandshake,
    color: "#ffcf70",
    examples: [
      "Health and wellness awareness",
      "First-aid learning activities",
      "Food preparation and hygiene",
      "Communication and teamwork",
      "Hospitality and service activities",
      "Community problem-solving",
    ],
  },
];

const sectorCards = [
  {
    title: "Electronics & Electrical",
    description:
      "Understand circuits, components, electrical systems and practical troubleshooting.",
    icon: CircuitBoard,
    tag: "Machines & Materials",
  },
  {
    title: "Robotics & Automation",
    description:
      "Explore mechanisms, sensors, actuators, control systems and automation.",
    icon: Cog,
    tag: "Machines & Materials",
  },
  {
    title: "IT & Digital Technologies",
    description:
      "Develop digital literacy through coding, computing and technology-based activities.",
    icon: Monitor,
    tag: "Machines & Materials",
  },
  {
    title: "AI & Emerging Technologies",
    description:
      "Discover how artificial intelligence and emerging technologies can solve real problems.",
    icon: BrainCircuit,
    tag: "Digital Integration",
  },
  {
    title: "Agriculture & Sustainability",
    description:
      "Learn about plants, cultivation, environmental responsibility and sustainable practices.",
    icon: Leaf,
    tag: "Life Forms",
  },
  {
    title: "Healthcare & Wellness",
    description:
      "Explore health awareness, hygiene, safety and basic service-oriented learning.",
    icon: Stethoscope,
    tag: "Human Services",
  },
  {
    title: "Food Production & Hospitality",
    description:
      "Understand food handling, hygiene, preparation and hospitality-related skills.",
    icon: Utensils,
    tag: "Human Services",
  },
  {
    title: "Apparel & Design",
    description:
      "Explore fabrics, materials, basic design, measurement and creative making.",
    icon: Shirt,
    tag: "Machines & Materials",
  },
  {
    title: "Mechanical & Automotive",
    description:
      "Understand mechanical systems, tools, motion, components and engineering principles.",
    icon: CarFront,
    tag: "Machines & Materials",
  },
];

const secondaryStage = [
  {
    title: "Explore Vocations",
    description:
      "Introduce students to selected vocational areas across the three forms of work.",
    icon: Compass,
  },
  {
    title: "Develop Practical Competencies",
    description:
      "Provide structured opportunities to practise tools, techniques and workplace-oriented skills.",
    icon: Wrench,
  },
  {
    title: "Experience Real Work",
    description:
      "Connect learning with local industries, professionals and relevant workplace exposure.",
    icon: Factory,
  },
  {
    title: "Build a Portfolio",
    description:
      "Document projects, practical experiences, reflections and demonstrated competencies.",
    icon: ClipboardCheck,
  },
];

const packageFeatures = [
  {
    id: "01",
    name: "Foundation CSL",
    subtitle: "Start with the essentials.",
    description:
      "A structured starting point for schools looking to establish a functional Composite Skill Lab with foundational resources and guided practical learning.",
    label: "FOUNDATION",
    icon: Building2,
    features: [
      "Essential lab infrastructure planning",
      "Foundational toolkits across all three forms of work",
      "Basic electronics and making resources",
      "Life-form exploration resources",
      "Human-services activity resources",
      "Starter project and activity bank",
      "Basic safety and storage provisions",
      "Teacher orientation",
    ],
    suitable: "Schools establishing their first Composite Skill Lab.",
  },
  {
    id: "02",
    name: "Advanced CSL",
    subtitle: "Expand practical possibilities.",
    description:
      "A more equipped and activity-rich lab with dedicated learning stations that allow students to explore multiple vocational and technology domains.",
    label: "ADVANCED",
    icon: Layers3,
    featured: true,
    features: [
      "Enhanced lab layout and modular workstations",
      "Expanded resources across all three forms of work",
      "Electronics, robotics and automation toolkits",
      "CAD and 3D design resources",
      "Agriculture and sustainability activity kits",
      "Human-services learning resources",
      "Structured project-based curriculum support",
      "Teacher training and implementation guidance",
      "Project documentation and assessment support",
      "Maintenance and technical assistance",
    ],
    suitable:
      "Schools seeking a broader, more hands-on skill development ecosystem.",
  },
  {
    id: "03",
    name: "Integrated CSL",
    subtitle: "Build a complete skill ecosystem.",
    description:
      "A comprehensive implementation model integrating infrastructure, multiple skill sectors, curriculum support, teacher development and ongoing student project mentoring.",
    label: "INTEGRATED",
    icon: Boxes,
    features: [
      "Comprehensive lab planning and space utilisation",
      "Multiple dedicated practical learning stations",
      "Expanded resources across all three forms of work",
      "Advanced electronics, robotics and IoT resources",
      "Digital technologies and AI learning resources",
      "CAD, prototyping and fabrication facilities",
      "Life sciences and sustainability activities",
      "Human-services and vocational activity resources",
      "Curriculum and project planning support",
      "Teacher capacity-building programmes",
      "Student project mentoring and portfolio support",
      "Showcase and Kaushal Mela preparation",
      "Ongoing technical support and maintenance",
    ],
    suitable:
      "Schools looking for a long-term, fully supported skill education ecosystem.",
  },
];

const implementationSteps = [
  {
    number: "01",
    title: "Understand the School",
    description:
      "Study the available space, student strength, school priorities, local context and implementation requirements.",
    icon: Building2,
  },
  {
    number: "02",
    title: "Design the Lab",
    description:
      "Plan the layout, learning stations, equipment, storage, safety provisions and activity zones.",
    icon: Ruler,
  },
  {
    number: "03",
    title: "Equip & Set Up",
    description:
      "Provide suitable tools, equipment, learning resources and practical infrastructure based on the selected scope.",
    icon: PackageCheck,
  },
  {
    number: "04",
    title: "Train & Implement",
    description:
      "Orient teachers, structure learning activities and support the school in introducing practical programmes.",
    icon: GraduationCap,
  },
  {
    number: "05",
    title: "Assess & Improve",
    description:
      "Support project documentation, student portfolios, showcases and continuous improvement of lab activities.",
    icon: TrendingUp,
  },
];

const infrastructure = [
  {
    title: "Flexible Workstations",
    description:
      "Adaptable work areas for individual activities, group projects and demonstrations.",
    icon: Settings2,
  },
  {
    title: "Tools & Equipment",
    description:
      "Age-appropriate tools, equipment and resources selected for planned skill domains.",
    icon: Wrench,
  },
  {
    title: "Storage & Organisation",
    description:
      "Organised storage for materials, tools, student projects and consumables.",
    icon: Boxes,
  },
  {
    title: "Digital Infrastructure",
    description:
      "Computing and digital resources to support technology-enabled learning.",
    icon: Laptop,
  },
  {
    title: "Practical Learning Zones",
    description:
      "Activity areas for making, experimentation, observation and demonstrations.",
    icon: FlaskConical,
  },
  {
    title: "Safety Provisions",
    description:
      "Appropriate safety equipment, first-aid provisions and clear operating practices.",
    icon: ShieldCheck,
  },
];

const whyAdroiit = [
  {
    title: "Education Meets Engineering",
    description:
      "A practical approach that connects classroom concepts with real engineering, technology and everyday applications.",
    icon: Lightbulb,
  },
  {
    title: "Multi-Domain Learning",
    description:
      "A broader skill ecosystem covering life forms, machines and materials, and human services.",
    icon: Layers3,
  },
  {
    title: "Hands-On by Design",
    description:
      "Learning experiences built around exploration, experimentation, making, problem-solving and project work.",
    icon: Hammer,
  },
  {
    title: "Teacher Enablement",
    description:
      "Orientation and implementation support to help teachers confidently facilitate practical learning.",
    icon: Users,
  },
  {
    title: "In-House Technical Expertise",
    description:
      "Engineering-led support for electronics, embedded systems, robotics, IoT, prototyping and emerging technologies.",
    icon: CircuitBoard,
  },
  {
    title: "Long-Term Partnership",
    description:
      "Support beyond installation through curriculum guidance, technical assistance and continuous improvement.",
    icon: Handshake,
  },
];

const faqs = [
  {
    question: "What is a Composite Skill Lab?",
    answer:
      "A Composite Skill Lab is a practical learning space that enables students to develop vocational and applied skills through hands-on experiences across different sectors. CBSE's framework organises this learning around three forms of work: work with life forms, work with machines and materials, and work with human services.",
  },
  {
    question: "Which classes can use the Composite Skill Lab?",
    answer:
      "CBSE's Composite Skill Lab framework covers Classes VI to X. The school can plan age-appropriate activities and learning experiences according to the relevant stage and curriculum.",
  },
  {
    question: "Is a CSL only a robotics or STEM lab?",
    answer:
      "No. Robotics, electronics and digital technologies can be important components, but a Composite Skill Lab is broader. It should provide opportunities to explore all three forms of work, including life forms and human services.",
  },
  {
    question: "Can the lab be customised for our school?",
    answer:
      "Yes. The selection of sectors, equipment and learning activities can be planned according to the school's available space, local context, student needs, resources and implementation priorities.",
  },
  {
    question: "Does Adroiit provide teacher training?",
    answer:
      "Teacher orientation and capacity-building support can be included in the selected implementation package. The scope can be planned according to the school's requirements.",
  },
  {
    question: "Does setting up a CSL automatically guarantee CBSE compliance?",
    answer:
      "No. The school is responsible for meeting the applicable CBSE affiliation and skill education requirements. Adroiit can support planning, infrastructure, equipment and implementation, while the final configuration should be checked against the latest CBSE guidelines and the school's specific requirements.",
  },
];

function CheckItem({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={`flex items-start gap-2.5 text-[12px] leading-[1.75] ${dark ? "text-white/65" : "text-[#514b59]"}`}>
      <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${dark ? "text-[#b99cff]" : "text-[#5921c7]"}`} />
      <span>{children}</span>
    </div>
  );
}

export default function CompositeSkillLabPage() {
  return (
    <main className={`${bricolage.className} overflow-hidden bg-white`}>
      {/* 01 — HERO | LIGHT */}
      <section className="relative isolate overflow-hidden bg-[#f7f5fb] px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-36 lg:px-12 lg:pt-40">
        <div className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-[#5921c7]/10 blur-[130px]" />
        <div className="pointer-events-none absolute -right-40 top-24 h-[420px] w-[420px] rounded-full bg-[#8c52ff]/10 blur-[130px]" />
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#5921c7]/15 bg-white/80 px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffcc00]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#5921c7]">CBSE Skill Education Framework</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="max-w-[700px] text-[40px] font-bold leading-[1.04] tracking-[-0.055em] text-[#17121f] text-[52px] lg:text-[32px]">
              Composite Skill Lab
              <span className="mt-2 block bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#b28bff] bg-clip-text text-transparent">
                Beyond Classrooms.
                <br />
                Into Real Life.
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-7 max-w-[590px] text-[14px] leading-[1.9] text-[#625d69] sm:text-[16px]">
              Empower students with practical skills, vocational exposure and real-world experiences through a thoughtfully designed Composite Skill Lab aligned with the CBSE skill education framework.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="group inline-flex items-center gap-3 rounded-full bg-[#5921c7] px-7 py-4 text-[13px] font-bold text-white shadow-[0_12px_30px_rgba(89,33,199,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#713ce0]">
                Plan Your CSL <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              <a href="#packages" className="inline-flex items-center gap-3 rounded-full border border-[#5921c7]/20 bg-white px-7 py-4 text-[13px] font-bold text-[#5921c7] transition-all hover:border-[#5921c7] hover:bg-[#5921c7]/[0.04]">
                Explore Lab Packages <ArrowRight size={16} />
              </a>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#17121f]/10 pt-6">
              {["Classes VI – X", "Three Forms of Work", "Hands-On Learning"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[11px] font-semibold text-[#625d69]">
                  <CheckCircle2 size={15} className="text-[#5921c7]" /> {item}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96, x: 18 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative mx-auto w-full max-w-[580px]">
            <div className="absolute -inset-5 rounded-[34px] bg-gradient-to-br from-[#5921c7]/20 via-transparent to-[#ffcc00]/15 blur-2xl" />
            <div className="relative rounded-[28px] border border-white bg-white p-2.5 shadow-[0_28px_80px_rgba(36,20,65,0.13)]">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[21px]">
                <Image src="/stem-til2.png" alt="Students exploring practical STEM and skill-based learning" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-[#5921c7]/10 bg-white p-4 shadow-[0_15px_40px_rgba(36,20,65,0.12)] sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5921c7]/10 text-[#5921c7]"><GraduationCap size={22} /></div>
                <div><p className="text-[19px] font-bold text-[#17121f]">VI – X</p><p className="text-[11px] text-[#817a89]">Skill Education</p></div>
              </div>
            </div>
            <div className="absolute -right-3 -top-5 hidden rounded-2xl border border-[#5921c7]/10 bg-white p-4 shadow-[0_15px_40px_rgba(36,20,65,0.12)] sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffcc00]/20 text-[#947000]"><Lightbulb size={20} /></div>
                <div><p className="text-[12px] font-bold text-[#25202c]">Learn. Make. Apply.</p><p className="text-[10px] text-[#817a89]">Practical experiences</p></div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative mx-auto mt-16 max-w-[1280px] rounded-[22px] border border-[#5921c7]/10 bg-white p-6 shadow-[0_12px_40px_rgba(36,20,65,0.045)] sm:p-8">
          <div className="grid gap-6 md:grid-cols-[0.75fr_1.25fr] md:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5921c7]">Designed around the framework</p>
              <h2 className="mt-2 text-[22px] font-bold leading-tight tracking-[-0.035em] text-[#17121f]">A broader approach to skill education.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: "Life Forms", text: "Nature, agriculture and sustainability", icon: Sprout },
                { title: "Machines & Materials", text: "Tools, technology and making", icon: Cog },
                { title: "Human Services", text: "People, care and everyday services", icon: HeartHandshake },
              ].map((item) => {
                const Icon = item.icon;
                return <div key={item.title} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5921c7]/10 text-[#5921c7]"><Icon size={20} /></div>
                  <div><p className="text-[12px] font-bold text-[#292331]">{item.title}</p><p className="mt-1 text-[11px] leading-[1.6] text-[#827b89]">{item.text}</p></div>
                </div>;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 02 — THREE FORMS OF WORK | DARK */}
      <section className="relative overflow-hidden bg-[#100d1b] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="pointer-events-none absolute -right-48 top-10 h-[460px] w-[460px] rounded-full bg-[#5921c7]/20 blur-[130px]" />
        <div className="relative mx-auto max-w-[1280px]">
          <SectionHeading eyebrow="The Foundation of CSL" title="Three Forms of Work. Countless Learning Possibilities." description="A Composite Skill Lab goes beyond a conventional science or technology laboratory. It introduces students to different forms of work and helps them understand how knowledge, skills and practical experiences connect with everyday life." dark center />
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="mt-12 grid gap-5 lg:grid-cols-3">
            {workDomains.map((domain) => {
              const Icon = domain.icon;
              return <motion.div key={domain.number} variants={fadeUp} whileHover={{ y: -6 }} className="rounded-[23px] border border-white/10 bg-white/[0.045] p-7 transition-colors hover:border-[#8c52ff]/40 hover:bg-white/[0.065] sm:p-8">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${domain.color}20`, color: domain.color }}><Icon size={26} strokeWidth={1.8} /></div>
                  <span className="text-[12px] font-bold text-white/25">{domain.number}</span>
                </div>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.15em] text-[#c4a9ff]">{domain.subtitle}</p>
                <h3 className="mt-2 text-[22px] font-bold leading-tight tracking-[-0.035em] text-white">{domain.title}</h3>
                <p className="mt-4 text-[12px] leading-[1.85] text-white/55">{domain.description}</p>
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.13em] text-white/40">Learning Areas</p>
                  <div className="space-y-3">{domain.examples.map((example) => <CheckItem key={example} dark>{example}</CheckItem>)}</div>
                </div>
              </motion.div>;
            })}
          </motion.div>
          <p className="mx-auto mt-8 max-w-[760px] text-center text-[11px] leading-[1.8] text-white/40">The specific sectors, activities and resources can be selected according to the school's context, student needs, available infrastructure and local opportunities.</p>
        </div>
      </section>

      {/* 03 — SECTORS | LIGHT */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading eyebrow="Explore Multiple Sectors" title="One Lab. Multiple Worlds to Explore." description="Give students the opportunity to experience different sectors, discover their interests and understand how skills are applied in real-world environments." />
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sectorCards.map((sector, index) => {
              const Icon = sector.icon;
              return <motion.div key={sector.title} variants={fadeUp} whileHover={{ y: -5 }} className="group rounded-[20px] border border-black/[0.06] bg-[#faf9fc] p-6 transition-all duration-300 hover:border-[#8c52ff]/35 hover:bg-white hover:shadow-[0_15px_45px_rgba(36,20,65,0.07)]">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5921c7]/10 text-[#5921c7] transition-colors group-hover:bg-[#5921c7] group-hover:text-white"><Icon size={22} /></div>
                  <span className="text-[11px] font-bold text-[#b6b0c0]">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-5 text-[17px] font-bold tracking-[-0.025em] text-[#211b29]">{sector.title}</h3>
                <p className="mt-2 min-h-[62px] text-[12px] leading-[1.8] text-[#716a78]">{sector.description}</p>
                <div className="mt-4 inline-flex rounded-full border border-[#5921c7]/10 bg-[#5921c7]/[0.05] px-3 py-1.5 text-[10px] font-semibold text-[#5921c7]">{sector.tag}</div>
              </motion.div>;
            })}
          </motion.div>
          <div className="mt-10 rounded-[22px] border border-[#5921c7]/10 bg-[#f7f5fb] p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5921c7] text-white"><BrainCircuit size={24} /></div>
              <div><h3 className="text-[17px] font-bold text-[#211b29]">Digital Skills Across Every Domain</h3><p className="mt-2 max-w-[850px] text-[12px] leading-[1.8] text-[#716a78]">Coding, digital literacy, data awareness and emerging technologies such as AI can be integrated into relevant activities across the lab. Technology becomes a tool for solving problems, not just a subject to study.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — CBSE FRAMEWORK | DARK */}
      <section className="bg-[#0b0913] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading eyebrow="CBSE Skill Education Framework" title="Learning Pathways for Classes VI to X." description="The CBSE Composite Skill Lab framework connects practical learning with age-appropriate projects, vocational exploration and the development of competencies across school stages." dark />
          <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="rounded-[24px] border border-white/10 bg-white/[0.045] p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5921c7] text-white"><BookOpen size={22} /></div>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c4a9ff]">Middle Stage</p>
              <h3 className="mt-2 text-[27px] font-bold tracking-[-0.04em] text-white">Classes VI – VIII</h3>
              <p className="mt-4 text-[12px] leading-[1.9] text-white/55">Students explore all three forms of work through practical projects. CBSE's framework envisages three projects per grade, with one project from each form of work.</p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-[11px] font-bold text-[#c4a9ff]">Middle Stage Project Structure</p>
                <div className="mt-4 grid grid-cols-3 gap-3">{["Grade VI", "Grade VII", "Grade VIII"].map((grade) => <div key={grade} className="rounded-xl bg-white/[0.06] p-3 text-center"><p className="text-[10px] font-bold text-white/70">{grade}</p><p className="mt-2 text-[22px] font-bold text-[#c4a9ff]">3</p><p className="text-[10px] text-white/40">Projects</p></div>)}</div>
                <p className="mt-4 text-[10px] leading-[1.7] text-white/40">One project from each of the three forms of work per grade, as described in the CBSE framework.</p>
              </div>
              <div className="mt-5 flex items-start gap-3"><Presentation size={19} className="mt-0.5 shrink-0 text-[#c4a9ff]" /><p className="text-[11px] leading-[1.8] text-white/55">Students can showcase their learning and project outcomes through school-level Kaushal Melas.</p></div>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="rounded-[24px] border border-white/10 bg-white/[0.045] p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffcc00]/15 text-[#ffcc00]"><GraduationCap size={22} /></div>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffcc00]">Secondary Stage</p>
              <h3 className="mt-2 text-[27px] font-bold tracking-[-0.04em] text-white">Classes IX – X</h3>
              <p className="mt-4 text-[12px] leading-[1.9] text-white/55">Students move towards deeper vocational exposure and practical competency development through selected vocational areas, hands-on experiences and workplace connections.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">{secondaryStage.map((item) => { const Icon = item.icon; return <div key={item.title} className="rounded-2xl bg-white/[0.05] p-4"><Icon size={20} className="text-[#c4a9ff]" /><h4 className="mt-3 text-[13px] font-bold text-white">{item.title}</h4><p className="mt-2 text-[10px] leading-[1.8] text-white/45">{item.description}</p></div>; })}</div>
              <div className="mt-5 rounded-2xl border border-[#ffcc00]/25 bg-[#ffcc00]/[0.06] p-5"><p className="text-[11px] font-bold text-[#ffdc65]">Vocational Exposure</p><p className="mt-2 text-[11px] leading-[1.8] text-white/55">CBSE's framework describes six vocations over Classes IX and X, with two vocations from each of the three forms of work.</p></div>
            </motion.div>
          </div>
          <p className="mt-7 text-[10px] leading-[1.8] text-white/35">Curriculum and implementation should be planned with reference to the latest CBSE skill education curriculum and applicable school requirements.</p>
        </div>
      </section>

      {/* 05 — PACKAGES | LIGHT */}
      <section id="packages" className="bg-[#f7f5fb] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading eyebrow="Choose Your Lab Package" title="Three Ways to Build Your Composite Skill Lab." description="Every school has different infrastructure, priorities and implementation goals. Choose a lab package that matches your requirements, with scope customised to your school's context." center />
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
            {packageFeatures.map((pkg) => {
              const Icon = pkg.icon;
              return <motion.div key={pkg.id} variants={fadeUp} whileHover={{ y: -5 }} className={`relative flex flex-col rounded-[24px] border bg-white p-7 shadow-[0_12px_45px_rgba(36,20,65,0.045)] sm:p-8 ${pkg.featured ? "border-[#8c52ff]/60 shadow-[0_18px_55px_rgba(89,33,199,0.12)]" : "border-black/[0.07]"}`}>
                {pkg.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#5921c7] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">Popular Choice</div>}
                <div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5921c7]/10 text-[#5921c7]"><Icon size={22} /></div><span className="text-[11px] font-bold text-[#b6b0c0]">{pkg.id}</span></div>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.15em] text-[#5921c7]">{pkg.label}</p>
                <h3 className="mt-2 text-[23px] font-bold tracking-[-0.035em] text-[#211b29]">{pkg.name}</h3>
                <p className="mt-2 text-[12px] font-semibold text-[#7042bd]">{pkg.subtitle}</p>
                <p className="mt-4 min-h-[82px] text-[11px] leading-[1.85] text-[#716a78]">{pkg.description}</p>
                <div className="my-6 h-px bg-black/[0.07]" />
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.13em] text-[#625d69]">Package Includes</p>
                <div className="flex-1 space-y-3">{pkg.features.map((feature) => <CheckItem key={feature}>{feature}</CheckItem>)}</div>
                <div className="mt-7 rounded-xl bg-[#f7f5fb] p-4"><p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#928b99]">Suitable For</p><p className="mt-2 text-[11px] leading-[1.7] text-[#514b59]">{pkg.suitable}</p></div>
                <Link href={`/contact?subject=${encodeURIComponent(`Enquiry for ${pkg.name}`)}`} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[12px] font-bold transition-all ${pkg.featured ? "bg-[#5921c7] text-white hover:bg-[#713ce0]" : "border border-[#5921c7]/20 text-[#5921c7] hover:border-[#5921c7] hover:bg-[#5921c7]/[0.04]"}`}>Enquire About This Package <ArrowUpRight size={15} /></Link>
              </motion.div>;
            })}
          </motion.div>
          <p className="mx-auto mt-8 max-w-[800px] text-center text-[10px] leading-[1.8] text-[#928b99]">Package scope, equipment, infrastructure and implementation support are finalised after a school-level requirements assessment. Pricing is provided through a customised proposal.</p>
        </div>
      </section>

      {/* 06 — INFRASTRUCTURE | DARK */}
      <section className="relative overflow-hidden bg-[#100d1b] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="pointer-events-none absolute -left-48 top-10 h-[450px] w-[450px] rounded-full bg-[#5921c7]/20 blur-[130px]" />
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Infrastructure & Learning Environment" title="A Space Designed for Exploration." description="A well-planned Composite Skill Lab brings together flexible workspaces, practical resources, suitable equipment and safe learning environments." dark />
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-7 rounded-2xl border border-white/10 bg-white/[0.045] p-6">
              <div className="flex items-start gap-3"><Ruler size={21} className="mt-0.5 shrink-0 text-[#c4a9ff]" /><div><p className="text-[13px] font-bold text-white">CBSE Space Guidelines</p><p className="mt-2 text-[11px] leading-[1.85] text-white/55">The CBSE guidelines describe a minimum 600 sq. ft. single-room option for Classes VI–XII, or two rooms of at least 400 sq. ft. each for the VI–X and XI–XII stages respectively.</p></div></div>
              <p className="mt-4 border-t border-white/10 pt-4 text-[10px] leading-[1.7] text-white/35">Refer to the latest official CBSE Composite Skill Lab guidelines for the applicable configuration and requirements.</p>
            </motion.div>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="grid gap-4 sm:grid-cols-2">
            {infrastructure.map((item) => { const Icon = item.icon; return <motion.div key={item.title} variants={fadeUp} className="rounded-[19px] border border-white/10 bg-white/[0.045] p-5 transition-colors hover:border-[#8c52ff]/40 hover:bg-white/[0.065]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5921c7]/30 text-[#c4a9ff]"><Icon size={21} /></div><h3 className="mt-4 text-[14px] font-bold text-white">{item.title}</h3><p className="mt-2 text-[11px] leading-[1.8] text-white/50">{item.description}</p></motion.div>; })}
          </motion.div>
        </div>
      </section>

      {/* 07 — IMPLEMENTATION | LIGHT */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading eyebrow="Our Implementation Approach" title="From an Empty Space to an Active Learning Ecosystem." description="Adroiit supports schools through the planning, setup and implementation journey, helping turn infrastructure into meaningful student learning experiences." center />
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {implementationSteps.map((step, index) => { const Icon = step.icon; return <motion.div key={step.number} variants={fadeUp} className="relative rounded-[19px] border border-black/[0.07] bg-[#faf9fc] p-5">
              <div className="flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5921c7]/10 text-[#5921c7]"><Icon size={20} /></div><span className="text-[11px] font-bold text-[#b6b0c0]">{step.number}</span></div>
              <h3 className="mt-5 text-[15px] font-bold text-[#211b29]">{step.title}</h3><p className="mt-2 text-[11px] leading-[1.8] text-[#716a78]">{step.description}</p>
              {index !== implementationSteps.length - 1 && <div className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#5921c7]/10 bg-white text-[#5921c7] lg:flex"><ArrowRight size={12} /></div>}
            </motion.div>; })}
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-9 flex flex-col gap-5 rounded-[22px] bg-[#f7f5fb] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5921c7]">More Than Infrastructure</p><h3 className="mt-2 text-[21px] font-bold text-[#211b29]">We help make the lab work for learning.</h3><p className="mt-2 max-w-[650px] text-[11px] leading-[1.8] text-[#716a78]">Equipment is only the beginning. Effective implementation also needs relevant activities, teacher confidence, student participation and continuous support.</p></div>
            <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#5921c7] px-6 py-3.5 text-[12px] font-bold text-white transition-all hover:bg-[#713ce0]">Discuss Your Requirements <ArrowUpRight size={15} /></Link>
          </motion.div>
        </div>
      </section>

      {/* 08 — OUTCOMES | DARK */}
      <section className="bg-[#0b0913] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading eyebrow="Learning Outcomes" title="Skills That Extend Beyond the Lab." description="A meaningful skill education experience helps students develop practical competencies, confidence and an appreciation for different kinds of work." dark center />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="rounded-[23px] border border-white/10 bg-white/[0.045] p-7 sm:p-8">
              <div className="flex items-center gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5921c7] text-white"><Users size={21} /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#c4a9ff]">For Students</p><h3 className="text-[21px] font-bold text-white">Learn. Practise. Grow.</h3></div></div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">{["Practical and vocational awareness", "Problem-solving and critical thinking", "Creativity and design thinking", "Tool handling and material awareness", "Communication and teamwork", "Digital and technological literacy", "Entrepreneurial thinking", "Confidence through project work"].map((item) => <CheckItem key={item} dark>{item}</CheckItem>)}</div>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="rounded-[23px] border border-white/10 bg-white/[0.045] p-7 sm:p-8">
              <div className="flex items-center gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffcc00]/15 text-[#ffcc00]"><GraduationCap size={21} /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#ffcc00]">For Teachers & Schools</p><h3 className="text-[21px] font-bold text-white">Enable. Facilitate. Inspire.</h3></div></div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">{["Structured practical learning resources", "Teacher orientation and capacity-building", "Project planning and activity guidance", "Cross-disciplinary learning opportunities", "Student project documentation", "Assessment and reflection support", "School-level project showcases", "Technical and implementation assistance"].map((item) => <CheckItem key={item} dark>{item}</CheckItem>)}</div>
            </motion.div>
          </div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mt-7 rounded-[21px] border border-[#ffcc00]/20 bg-[#ffcc00]/[0.06] p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ffcc00]/15 text-[#ffcc00]"><Award size={22} /></div><div><h3 className="text-[16px] font-bold text-white">Showcase Learning Through Student Projects</h3><p className="mt-2 text-[11px] leading-[1.8] text-white/55">Encourage students to document their work, demonstrate practical skills, explain their ideas and present project outcomes through exhibitions and Kaushal Melas.</p></div></div>
          </motion.div>
        </div>
      </section>

      {/* 09 — WHY ADROIIT | LIGHT */}
      <section className="bg-[#f7f5fb] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_0.7fr]">
            <SectionHeading eyebrow="Why Adroiit Technovations" title="Engineering Expertise. Educational Impact." description="We bring together engineering, technology and experiential education to help schools create meaningful opportunities for students to explore, build and apply their skills." />
            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="max-w-[420px] text-[12px] leading-[1.9] text-[#716a78] lg:pb-1">Our approach focuses on more than supplying equipment. We work towards building a practical learning ecosystem that can evolve with the school's educational goals.</motion.p>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyAdroiit.map((item) => { const Icon = item.icon; return <motion.div key={item.title} variants={fadeUp} className="rounded-[20px] border border-black/[0.06] bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#8c52ff]/35 hover:shadow-[0_14px_40px_rgba(36,20,65,0.06)]"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5921c7]/10 text-[#5921c7]"><Icon size={22} /></div><h3 className="mt-5 text-[16px] font-bold text-[#211b29]">{item.title}</h3><p className="mt-2 text-[11px] leading-[1.85] text-[#716a78]">{item.description}</p></motion.div>; })}
          </motion.div>
        </div>
      </section>

      {/* 10 — FAQ | DARK */}
      <section className="bg-[#100d1b] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <SectionHeading eyebrow="Frequently Asked Questions" title="Everything You Need to Know." description="A few important things schools should understand while planning a Composite Skill Lab." dark />
            <div className="mt-7 rounded-[20px] border border-white/10 bg-white/[0.045] p-6">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5921c7]/30 text-[#c4a9ff]"><FileCheck size={20} /></div><div><p className="text-[12px] font-bold text-white">Need a customised proposal?</p><p className="mt-1 text-[10px] text-white/45">Let's understand your school's requirements.</p></div></div>
              <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-[12px] font-bold text-[#c4a9ff] transition-all hover:gap-3">Contact Our Team <ArrowRight size={14} /></Link>
            </div>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => <details key={faq.question} className="group rounded-[17px] border border-white/10 bg-white/[0.045] p-5 open:border-[#8c52ff]/40 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5"><span className="flex items-start gap-4"><span className="mt-0.5 text-[10px] font-bold text-[#c4a9ff]">{String(index + 1).padStart(2, "0")}</span><span className="text-[13px] font-bold leading-[1.5] text-white sm:text-[14px]">{faq.question}</span></span><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5921c7]/30 text-[#c4a9ff] transition-transform duration-300 group-open:rotate-45"><span className="text-[19px] leading-none">+</span></span></summary>
              <p className="ml-8 mt-4 max-w-[720px] text-[11px] leading-[1.9] text-white/55 sm:text-[12px]">{faq.answer}</p>
            </details>)}
          </div>
        </div>
      </section>

      {/* 11 — FINAL CTA | LIGHT */}
      <section className="relative isolate overflow-hidden bg-[#f7f5fb] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[470px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5921c7]/10 blur-[140px]" />
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="relative mx-auto max-w-[900px] text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5921c7]/10 text-[#5921c7]"><Sparkles size={24} /></div>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5921c7]">Let's Build the Future of Skill Education</p>
          <h2 className="mt-4 text-[32px] font-bold leading-[1.12] tracking-[-0.045em] text-[#17121f] sm:text-[42px]">
            Give Students a Space to
            <span className="block bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#b28bff] bg-clip-text text-transparent">Discover What They Can Do.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[650px] text-[13px] leading-[1.9] text-[#625d69]">Let's work together to plan a Composite Skill Lab that supports your school's vision, student needs and practical skill education goals.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="group inline-flex items-center gap-3 rounded-full bg-[#5921c7] px-8 py-4 text-[13px] font-bold text-white shadow-[0_12px_30px_rgba(89,33,199,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#713ce0]">Discuss Your CSL Project <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
            <a href="tel:+918870002908" className="inline-flex items-center gap-3 rounded-full border border-[#5921c7]/20 bg-white px-8 py-4 text-[13px] font-bold text-[#5921c7] transition-all hover:border-[#5921c7] hover:bg-[#5921c7]/[0.04]">Talk to Our Team</a>
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[10px] font-medium text-[#817a89]">
            <span className="flex items-center gap-2"><ShieldCheck size={13} className="text-[#5921c7]" /> School-focused implementation</span>
            <span className="flex items-center gap-2"><BookOpen size={13} className="text-[#5921c7]" /> Practical learning experiences</span>
            <span className="flex items-center gap-2"><Handshake size={13} className="text-[#5921c7]" /> Long-term support</span>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
