
"use client";

import React, { useActionState, useState, Fragment, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { Combobox, Transition } from "@headlessui/react";
import { sendContactForm } from "@/app/actions";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const indianStatesAndUTs = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const indianCities = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai",
  "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur",
  "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara",
  "Ghaziabad", "Ludhiana", "Coimbatore", "Madurai", "Tiruchirappalli",
  "Salem", "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Dindigul",
  "Thanjavur", "Kanchipuram", "Karur", "Namakkal", "Nagercoil",
  "Kanyakumari", "Kovilpatti", "Pollachi", "Rajapalayam", "Sivakasi",
  "Tirunelveli", "Tuticorin", "Virudhunagar", "Cuddalore", "Villupuram",
  "Puducherry", "Karaikal", "Yanam", "Mahe", "Ooty", "Kodaikanal",
  "Yercaud", "Hosur", "Krishnagiri", "Dharmapuri", "Attur", "Mettur",
  "Rasipuram", "Gobichettipalayam", "Sathyamangalam", "Bhavani",
  "Mettupalayam", "Udumalpet", "Palani", "Oddanchatram", "Nilgiris",
  "Kotagiri", "Coonoor", "Thiruvananthapuram", "Kochi", "Kozhikode",
  "Thrissur", "Kollam", "Palakkad", "Kannur", "Kottayam", "Alappuzha",
  "Malappuram", "Kasaragod", "Pathanamthitta", "Idukki", "Ernakulam",
  "Wayanad", "Aluva", "Perumbavoor", "Angamaly", "Mysuru", "Hubballi",
  "Mangaluru", "Belagavi", "Davanagere", "Ballari", "Shivamogga",
  "Vijayapura", "Tumakuru", "Raichur", "Bidar", "Hospet", "Gadag",
  "Udupi", "Warangal", "Nizamabad", "Karimnagar", "Khammam",
  "Ramagundam", "Mahbubnagar", "Jamshedpur", "Ranchi", "Dhanbad",
  "Bokaro", "Asansol", "Durgapur", "Siliguri", "Guwahati",
  "Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Amritsar",
  "Jalandhar", "Patiala", "Dehradun", "Haridwar", "Haldwani", "Rudrapur",
];

const services = [
  "STEM Tinkering and Innovation Lab (TIL)",
  "STEM Workshop",
  "STEM Bootcamp",
  "Center of Excellence (CoE)",
  "Value Added Courses",
  "Technical Workshop",
  "Custom Product Fabrication",
  "3D Printing",
  "Mechanical CAD",
];

const uniqueCities = [...new Set(indianCities)];

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-[#100d18] px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-300 hover:border-white/20 focus:border-[#8c52ff] focus:ring-2 focus:ring-[#8c52ff]/20 disabled:cursor-not-allowed disabled:opacity-50";

const dropdownClassName =
  "absolute z-[100] mt-2 max-h-60 w-full overflow-auto rounded-xl border border-white/10 bg-[#171220] py-2 text-sm shadow-2xl shadow-black/50";

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(sendContactForm, null);

  const [selectedCity, setSelectedCity] = useState<string | null>("");
  const [selectedState, setSelectedState] = useState<string | null>("");
  const [selectedService, setSelectedService] = useState<string | null>("");

  const [cityQuery, setCityQuery] = useState("");
  const [stateQuery, setStateQuery] = useState("");
  const [serviceQuery, setServiceQuery] = useState("");

  const filteredCities =
    cityQuery === ""
      ? uniqueCities.slice(0, 10)
      : uniqueCities
          .filter((city) =>
            city.toLowerCase().includes(cityQuery.toLowerCase())
          )
          .slice(0, 10);

  const filteredStates =
    stateQuery === ""
      ? indianStatesAndUTs
      : indianStatesAndUTs.filter((s) =>
          s.toLowerCase().includes(stateQuery.toLowerCase())
        );

  const filteredServices =
    serviceQuery === ""
      ? services
      : services.filter((service) =>
          service.toLowerCase().includes(serviceQuery.toLowerCase())
        );

  useEffect(() => {
    if (state?.success && state?.whatsappURL) {
      window.open(state.whatsappURL, "_blank");
    }
  }, [state]);

  return (
    <section
      className={`${bricolage.className} relative isolate min-h-screen overflow-hidden bg-[#05030A] px-4 py-20 text-white sm:px-6 md:py-34`}
    >
      {/* BACKGROUND EFFECTS */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#5921c7]/20 blur-[150px]" />
        <div className="absolute -right-40 top-[35%] h-[450px] w-[450px] rounded-full bg-[#8c52ff]/10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#30106f]/20 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at center, black 0%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 0%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* PAGE INTRODUCTION */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-3xl text-left md:mb-5"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#a87ffb] sm:text-sm">
            Get in Touch
          </p>

          <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-3xl">
            Let's Start a{" "}
            <span className="bg-gradient-to-r from-[#8c52ff] via-[#a87ffb] to-purple-300 bg-clip-text text-transparent">
              Conversation.
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-200 sm:text-base sm:leading-8">
            Have a question, an idea, or a project in mind? We'd love to hear
            from you. Tell us what you're looking for, and let's explore how
            we can create something meaningful together.
          </p>
        </motion.div>

        {/* TWO-COLUMN CARD LAYOUT */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {/* LEFT COLUMN - CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex h-full min-w-0 flex-col rounded-2xl border border-white/[0.09] bg-[#0d0a14]/90 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6 lg:p-7"
          >
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c52ff]">
                Send an Enquiry
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-xl">
                Tell us about your needs.
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-gray-400">
                Fill in the details below and our team will get back to you.
              </p>
            </div>

            <form action={formAction} className="flex flex-1 flex-col space-y-3.5">
              {/* FULL NAME */}
              <div>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Full Name *"
                  aria-label="Full Name"
                  required
                  disabled={isPending}
                  className={inputClassName}
                />
              </div>

              {/* EMAIL */}
              <div>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  aria-label="Email Address"
                  required
                  disabled={isPending}
                  className={inputClassName}
                />
              </div>

              {/* PHONE */}
              <div>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone Number *"
                  aria-label="Phone Number"
                  required
                  disabled={isPending}
                  className={inputClassName}
                />
              </div>

              {/* CITY AND STATE */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <Combobox
                    name="city"
                    value={selectedCity}
                    onChange={(value) => {
                      setSelectedCity(value);
                      setCityQuery(value ?? "");
                    }}
                    disabled={isPending}
                  >
                    <div className="relative">
                      <Combobox.Input
                        className={inputClassName}
                        placeholder="City"
                        aria-label="City"
                        autoComplete="off"
                        displayValue={(city: string | null) => city ?? ""}
                        onChange={(e) => {
                          setCityQuery(e.target.value);
                          setSelectedCity(e.target.value);
                        }}
                      />

                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Combobox.Options className={dropdownClassName}>
                          {cityQuery.length > 0 &&
                            !filteredCities.some(
                              (city) =>
                                city.toLowerCase() === cityQuery.toLowerCase()
                            ) && (
                              <Combobox.Option
                                value={cityQuery}
                                className={({ active }) =>
                                  `cursor-pointer px-4 py-2.5 ${
                                    active
                                      ? "bg-[#5921c7] text-white"
                                      : "text-gray-300"
                                  }`
                                }
                              >
                                Use "{cityQuery}"
                              </Combobox.Option>
                            )}

                          {filteredCities.map((city) => (
                            <Combobox.Option
                              key={city}
                              value={city}
                              className={({ active }) =>
                                `cursor-pointer px-4 py-2.5 ${
                                  active
                                    ? "bg-[#5921c7] text-white"
                                    : "text-gray-300"
                                }`
                              }
                            >
                              {city}
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      </Transition>
                    </div>
                  </Combobox>
                </div>

                <div>
                  <Combobox
                    name="state"
                    value={selectedState}
                    onChange={(value) => {
                      setSelectedState(value);
                      setStateQuery(value ?? "");
                    }}
                    disabled={isPending}
                  >
                    <div className="relative">
                      <Combobox.Input
                        className={inputClassName}
                        placeholder="State / UT"
                        aria-label="State / UT"
                        autoComplete="off"
                        displayValue={(value: string | null) => value ?? ""}
                        onChange={(e) => setStateQuery(e.target.value)}
                      />

                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Combobox.Options className={dropdownClassName}>
                          {filteredStates.map((st) => (
                            <Combobox.Option
                              key={st}
                              value={st}
                              className={({ active }) =>
                                `cursor-pointer px-4 py-2.5 ${
                                  active
                                    ? "bg-[#5921c7] text-white"
                                    : "text-gray-300"
                                }`
                              }
                            >
                              {st}
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      </Transition>
                    </div>
                  </Combobox>
                </div>
              </div>

              {/* SERVICE */}
              <div>
                <Combobox
                  name="service"
                  value={selectedService}
                  onChange={(value) => {
                    setSelectedService(value);
                    setServiceQuery(value ?? "");
                  }}
                  disabled={isPending}
                >
                  <div className="relative">
                    <Combobox.Input
                      className={`${inputClassName} pr-11`}
                      placeholder="Service of Interest"
                      aria-label="Service of Interest"
                      autoComplete="off"
                      displayValue={(service: string | null) =>
                        service ?? ""
                      }
                      onChange={(e) => setServiceQuery(e.target.value)}
                    />

                    <Combobox.Button
                      aria-label="Show services"
                      className="absolute inset-y-0 right-0 flex items-center pr-4"
                    >
                      <ChevronDown className="h-4 w-4 text-[#a87ffb]" />
                    </Combobox.Button>

                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Combobox.Options className={dropdownClassName}>
                        {filteredServices.map((service) => (
                          <Combobox.Option
                            key={service}
                            value={service}
                            className={({ active }) =>
                              `relative cursor-pointer py-3 pl-10 pr-4 ${
                                active
                                  ? "bg-[#5921c7] text-white"
                                  : "text-gray-300"
                              }`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-semibold" : "font-normal"
                                  }`}
                                >
                                  {service}
                                </span>

                                {selected && (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                      active
                                        ? "text-white"
                                        : "text-[#a87ffb]"
                                    }`}
                                  >
                                    <Check className="h-4 w-4" />
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    </Transition>
                  </div>
                </Combobox>
              </div>

              {/* MESSAGE */}
              <div>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Your Message *"
                  aria-label="Your Message"
                  required
                  rows={4}
                  disabled={isPending}
                  className={`${inputClassName} min-h-[100px] resize-none`}
                />
              </div>

              {/* SUBMIT */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isPending}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#5921c7] to-[#8c52ff] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5921c7]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#5921c7]/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Sending Message..." : "Send Message"}
                  {!isPending && (
                    <ArrowUpRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  )}
                </button>

                {state?.message && (
                  <p
                    className={`mt-3 text-center text-sm ${
                      state.success ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {state.message}
                  </p>
                )}
              </div>
            </form>
          </motion.div>

          {/* RIGHT COLUMN - COMPACT CONTACT INFORMATION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex h-full min-w-0 flex-col rounded-2xl border border-white/[0.09] bg-[#0d0a14]/90 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6 lg:p-7"
          >
            {/* HEADING */}
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c52ff]">
                Contact Information
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Let's Connect.
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-gray-400">
                Have a question or an idea? Reach out to our team.
              </p>
            </div>

            {/* CONTACT DETAILS */}
            <div className="space-y-2">
              <a
                href="tel:+918870002908"
                className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 transition-all duration-300 hover:border-[#8c52ff]/40 hover:bg-[#8c52ff]/[0.06]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#5921c7]/20 text-[#a87ffb] transition-colors group-hover:bg-[#5921c7]/35">
                  <Phone size={17} />
                </div>

                <p className="min-w-0 flex-1 text-sm font-semibold text-white">
                  +91 8870002908
                </p>

                <ArrowUpRight
                  size={16}
                  className="text-gray-600 transition-colors group-hover:text-[#a87ffb]"
                />
              </a>

              <a
                href="mailto:info@adroiittechnovations.in"
                className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 transition-all duration-300 hover:border-[#8c52ff]/40 hover:bg-[#8c52ff]/[0.06]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#5921c7]/20 text-[#a87ffb] transition-colors group-hover:bg-[#5921c7]/35">
                  <Mail size={17} />
                </div>

                <p className="min-w-0 flex-1 break-all text-sm font-semibold text-white">
                  info@adroiittechnovations.in
                </p>

                <ArrowUpRight
                  size={16}
                  className="text-gray-600 transition-colors group-hover:text-[#a87ffb]"
                />
              </a>

              <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#5921c7]/20 text-[#a87ffb]">
                  <MapPin size={17} />
                </div>

                <p className="min-w-0 flex-1 text-sm font-semibold leading-5 text-white">
                  15A, Pavendhar Street, Near Amalorpavam Primary Campus, <br></br>Thamizh Thai Nagar, Uppalam, Puducherry - 605004
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#5921c7]/20 text-[#a87ffb]">
                  <Clock size={17} />
                </div>

                <p className="min-w-0 flex-1 text-sm font-semibold text-white">
                  Monday - Saturday: 10.00 A.M. - 6.00 P.M.                 
                </p>
              </div>
            </div>

            {/* MAP */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white">
                  Find Our Location
                </h3>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=ADROIIT+TECHNOVATIONS+Puducherry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#a87ffb] transition-colors hover:text-white"
                >
                  Directions
                  <ArrowUpRight size={13} />
                </a>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#100d18]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.7686421645653!2d79.81572427483617!3d11.921973788305209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5361f82ca8d2db%3A0x4cec9aaf4e89f084!2sADROIIT%20TECHNOVATIONS!5e1!3m2!1sen!2sin!4v1775739111207!5m2!1sen!2sin"
                  width="100%"
                  height="155"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Adroiit Technovations Location"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
