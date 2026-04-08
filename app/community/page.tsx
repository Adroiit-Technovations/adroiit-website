"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Globe,
  Users,
  Award,
  Rocket,
  CheckCircle,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export default function CommunityPage() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: dir === "left" ? -width : width, behavior: "smooth" });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const upcomingEvents = [
    {
      level: "Beginner",
      title: "ROS 2: Build Robot Simulation in Gazebo",
      desc: "Kickstart your ROS 2 journey with hands-on learning.",
      date: "Aug 31, 2025",
      time: "10:00 AM - 12:00 PM",
      mode: "Online",
      image: "/events/ros2.jpg",
    },
    {
      level: "Intermediate",
      title: "3D Printing Masterclass",
      desc: "Learn slicing & real-world printing workflows.",
      date: "Sep 10, 2025",
      time: "11:00 AM - 1:00 PM",
      mode: "Online",
      image: "/events/3d.jpg",
    },
    {
      level: "Advanced",
      title: "AI Vision Bootcamp",
      desc: "Build object detection systems using OpenCV.",
      date: "Oct 2025",
      time: "2 hours",
      mode: "Online",
      image: "/events/ai.jpg",
    },
  ];

  const pastEvents = [
    {
      level: "Beginner",
      title: "Arduino Bootcamp",
      desc: "100+ students trained",
      date: "July 2025",
      time: "Completed",
      mode: "Offline",
      image: "/events/arduino.jpg",
    },
    {
      level: "Intermediate",
      title: "IoT Hackathon",
      desc: "24-hour innovation challenge",
      date: "May 2025",
      time: "Completed",
      mode: "Offline",
      image: "/events/iot.jpg",
    },
    {
      level: "Advanced",
      title: "AI Workshop",
      desc: "Computer vision projects",
      date: "June 2025",
      time: "Completed",
      mode: "Online",
      image: "/events/ai2.jpg",
    },
  ];

  const events = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className={`${bricolage.className} bg-gradient-to-b from-black via-[#5921c7]/10 to-black text-white min-h-screen`}>
      <main className="pt-32 px-6 max-w-7xl mx-auto">

        {/* Header */}
        <header className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The <span className="text-[#8c52ff]">Adroiit Technovators</span> Tribe
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A high-impact community of innovators building real-world projects.
          </p>
        </header>

        {/* About */}
        <section className="grid md:grid-cols-2 gap-12 mb-32">
          <div>
            <h2 className="text-3xl font-bold mb-4">What is the Tribe?</h2>
            <p className="text-gray-400">
              A collaborative ecosystem where students build, innovate, and grow with mentorship.
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            {["Projects", "Mentorship", "Events", "Career Growth"].map((i, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2 text-gray-300">
                <CheckCircle className="text-[#8c52ff]" size={16} /> {i}
              </div>
            ))}
          </div>
        </section>

        {/* Why Join */}
        <section className="mb-32 text-center">
          <h2 className="text-3xl font-bold mb-10">Why Join?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ title: "Projects", icon: <Rocket /> }, { title: "Mentors", icon: <Award /> }, { title: "Network", icon: <Users /> }].map((item, i) => (
              <div key={i} className="p-6 bg-white/5 border rounded-xl">
                <div className="text-[#8c52ff] mb-2 flex justify-center">{item.icon}</div>
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mb-32">
          <h2 className="text-3xl font-bold mb-4">Join the Tribe</h2>
          <button onClick={scrollToForm} className="bg-[#8c52ff] px-8 py-3 rounded-xl">Apply Now</button>
        </section>

        {/* Events Toggle */}
        <div className="flex justify-center mb-10">
          <div className="relative flex bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md">
            {/* Sliding Indicator */}
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-[#8c52ff] transition-all duration-300 ${activeTab === "upcoming" ? "left-1" : "left-1/2"}`}
            />

            {/* Buttons */}
            <button
              onClick={() => setActiveTab("upcoming")}
              className="relative z-10 px-6 py-2 text-sm font-semibold w-32"
            >
              Upcoming
            </button>

            <button
              onClick={() => setActiveTab("past")}
              className="relative z-10 px-6 py-2 text-sm font-semibold w-32"
            >
              Past
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="relative mb-32">
          <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 p-2 rounded-full">
            <ChevronLeft />
          </button>

          <div ref={scrollRef} className="flex gap-6 overflow-x-auto px-10 justify-center">
            {events.map((event, i) => (
              <div key={i} className="min-w-[280px] max-w-[280px] flex flex-col justify-between bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <img src={event.image} className="h-36 w-full object-cover" />

                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-xs text-[#8c52ff]">{event.level}</span>
                  <h3 className="font-bold text-sm mt-1">{event.title}</h3>
                  <p className="text-gray-400 text-xs mt-2 flex-grow">{event.desc}</p>

                  <div className="text-xs text-gray-400 mt-3 space-y-1">
                    <div className="flex items-center gap-1"><Calendar size={12} /> {event.date}</div>
                    <div className="flex items-center gap-1"><Clock size={12} /> {event.time}</div>
                    <div className="flex items-center gap-1"><Globe size={12} /> {event.mode}</div>
                  </div>

                  {activeTab === "upcoming" && (
                    <button className="mt-4 bg-[#5921c7] py-2 rounded-lg text-sm">
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 p-2 rounded-full">
            <ChevronRight />
          </button>
        </div>

        {/* Form */}
        <section ref={formRef} className="mb-32">
          <h2 className="text-3xl font-bold text-center mb-6">Apply</h2>
          <form className="max-w-xl mx-auto grid gap-4">
            <input placeholder="Name" className="p-3 bg-white/5 border rounded" />
            <input placeholder="Email" className="p-3 bg-white/5 border rounded" />
            <button className="bg-[#8c52ff] py-2 rounded">Submit</button>
          </form>
        </section>

      </main>
      <Footer />
    </div>
  );
}
