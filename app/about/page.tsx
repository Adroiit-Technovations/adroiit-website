"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { motion } from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";
import { Lightbulb, Target, Rocket, Shield, Users, Zap, Sparkles } from "lucide-react";
import Image from "next/image";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export default function About() {
  const coreValues = [
    {
      title: "Practical Education",
      desc: "We believe true learning happens through action. Our learners explore, experiment, build and innovate real solutions — not just study concepts.",
      icon: <Zap size={20} />,
    },
    {
      title: "Excellence Built on Quality",
      desc: "Quality is the foundation of everything we create and deliver. Every experience, solution and product is held to the highest standards.",
      icon: <Sparkles size={20} />,
    },
    {
      title: "Advancement Driven by Innovation",
      desc: "We constantly evolve by embracing new technologies and creative thinking, empowering learners to stay ahead in a rapidly changing world.",
      icon: <Lightbulb size={20} />,
    },
    {
      title: "Reach Empowered by Inclusivity",
      desc: "We ensure transformative education and innovation is accessible to all, fostering inclusivity to expand opportunities and amplify impact.",
      icon: <Shield size={20} />,
    },
    {
      title: "Learning Fueled by Collaboration",
      desc: "We believe the best ideas emerge when dynamic minds work together through teamwork, shared knowledge and open communication.",
      icon: <Users size={20} />,
    },
  ];

  return (
    <div className={`${bricolage.className} bg-black text-white min-h-screen`}>
      <Navbar />

      <main className="pt-32 pb-20">

        {/* 🔥 Heading Section */}
        <section className="max-w-5xl mx-auto text-center mb-8 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-4xl font-bold tracking-tighter"
          >
            <span className="text-[#8c52ff]">About Adroiit Technovations</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 text-white text-lg md:text-xl leading-relaxed max-w-4xl mx-auto"
          >
            Adroiit Technovations is an Ed-Tech and Innovation firm empowering the next generation through experiential STEM education and advanced technological innovation. We bridge classroom theory with real-world, application-driven learning across Robotics, IoT, Embedded Systems, 3D Printing, Drone Technology, and Artificial Intelligence.
          </motion.p>
        </section>

        {/* 📖 OUR STORY (2 Columns: Text Left, Image Right) */}
        <section className="w-full py-6 bg-gradient-to-b from-white to-purple-50 text-black">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center px-6">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-2xl font-bold mb-6">
                <span className="text-[#8c52ff]">Our Story</span>
              </h2>

              <div className="space-y-6 text-gray-800 leading-relaxed text-justify text-base md:text-lg">
                <p>
                  Adroiit Technovations was founded with a vision to transform traditional education by bridging the gap between theoretical knowledge and real-world application.
                </p>
                <p>
                  We built an ecosystem centered around experiential learning — where students explore, experiment, build, and innovate through practical STEM education.
                </p>
                <p>
                  Today, we stand as a hub of education and innovation, delivering impactful learning experiences and engineering cutting-edge technological solutions.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[400px] w-full rounded-[2.5rem] overflow-hidden shadow-xl"
            >
              <Image 
                src="/about-hero.jpg" // Replace with your actual image path
                alt="Innovation and Learning"
                fill
                className="object-cover"
              />
            </motion.div>

          </div>
        </section>

        {/* 🚀 Mission & Vision */}
        <section className="max-w-6xl mx-auto my-8 grid md:grid-cols-2 gap-8 px-6">

          {/* Mission */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-black border border-[#8c52ff]/30 rounded-[2.5rem] p-10 shadow-[0_0_30px_rgba(140,82,255,0.15)] hover:shadow-[0_0_40px_rgba(140,82,255,0.3)] transition-all duration-500"
          >
            <Rocket size={24} className="text-[#8c52ff] mb-6" />
            <h2 className="text-2xl font-bold mb-4 text-[#8c52ff]">Our Mission</h2>
            <p className="text-gray-200 leading-relaxed text-justify">
              To deliver transformative STEM and technical education through immersive, hands-on learning that empowers next-gen innovators, while developing cutting-edge technological solutions that create enduring global impact.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-black border border-[#8c52ff]/30 rounded-[2.5rem] p-10 shadow-[0_0_30px_rgba(140,82,255,0.15)] hover:shadow-[0_0_40px_rgba(140,82,255,0.3)] transition-all duration-500"
          >
            <Target size={24} className="text-[#8c52ff] mb-6" />
            <h2 className="text-2xl font-bold mb-4 text-[#8c52ff]">Our Vision</h2>
            <p className="text-gray-200 leading-relaxed text-justify">
              To forge a new era in STEM and technical education through experiential learning that nurtures trailblazing innovators, while building technological solutions that deliver lasting global impact.
            </p>
          </motion.div>

        </section>

        {/* 💎 CORE VALUES */}
        <section className="w-full py-8 bg-gradient-to-b from-purple-50 to-white text-black">
          <div className="max-w-6xl mx-auto text-center px-6">
            
            <h2 className="text-3xl md:text-3xl font-bold mb-8 tracking-tighter">
              <span className="text-[#8c52ff]">Our Core Values</span>
            </h2>

            {/* Top 3 */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {coreValues.slice(0, 3).map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-[2rem] border border-purple-100 shadow-sm"
                >
                  <div className="text-[#8c52ff] mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-lg text-[#8c52ff] mb-2">{value.title}</h3>
                  <p className="text-gray-800 text-sm">{value.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Bottom 2 */}
            <div className="flex flex-col md:flex-row justify-center gap-6">
              {coreValues.slice(3).map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-[2rem] border border-purple-100 shadow-sm w-full md:w-[32%]"
                >
                  <div className="text-[#8c52ff] mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-lg text-[#8c52ff] mb-2">{value.title}</h3>
                  <p className="text-gray-800 text-sm">{value.desc}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}