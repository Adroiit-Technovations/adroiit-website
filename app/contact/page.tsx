"use client";

import React, { useActionState, useState, Fragment, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, ChevronDown, Check } from "lucide-react";
import { Combobox, Transition } from "@headlessui/react";
import { sendContactForm } from "@/app/action";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const indianStatesAndUTs = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"];

const indianCities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur", "Kanchipuram", "Karur", "Namakkal", "Nagercoil", "Kanyakumari", "Kovilpatti", "Pollachi", "Rajapalayam", "Sivakasi", "Tirunelveli", "Tuticorin", "Virudhunagar", "Cuddalore", "Villupuram", "Puducherry", "Karaikal", "Yanam", "Mahe", "Ooty", "Kodaikanal", "Yercaud", "Hosur", "Krishnagiri", "Dharmapuri", "Attur", "Mettur", "Rasipuram", "Gobichettipalayam", "Sathyamangalam", "Bhavani", "Mettupalayam", "Udumalpet", "Palani", "Oddanchatram", "Nilgiris", "Kotagiri", "Coonoor", "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Kannur", "Kottayam", "Alappuzha", "Malappuram", "Kasaragod", "Pathanamthitta", "Idukki", "Ernakulam", "Wayanad", "Aluva", "Perumbavoor", "Angamaly", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Davanagere", "Ballari", "Shivamogga", "Vijayapura", "Tumakuru", "Raichur", "Bidar", "Hospet", "Gadag", "Udupi", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Jamshedpur", "Ranchi", "Dhanbad", "Bokaro", "Asansol", "Durgapur", "Siliguri", "Guwahati", "Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Amritsar", "Jalandhar", "Patiala", "Dehradun", "Haridwar", "Haldwani", "Rudrapur"];

const services = [
  "STEM Tinkering and Innovation Lab (TIL)",
  "STEM Workshop",
  "STEM Bootcamp",
  "Center of Excellence (CoE)",
  "Value Added Courses",
  "Technical Workshop",
  "Custom Product Fabrication",
  "3D Printing",
  "Mechanical CAD"
];

const uniqueCities = [...new Set(indianCities)];

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(sendContactForm, null);
  
  const [selectedCity, setSelectedCity] = useState<string | null>("");
  const [selectedState, setSelectedState] = useState<string | null>("");
  const [selectedService, setSelectedService] = useState<string | null>("");
  
  const [cityQuery, setCityQuery] = useState("");
  const [stateQuery, setStateQuery] = useState("");
  const [serviceQuery, setServiceQuery] = useState("");

  const filteredCities = cityQuery === "" ? uniqueCities.slice(0, 10) : uniqueCities.filter((city) => city.toLowerCase().includes(cityQuery.toLowerCase())).slice(0, 10);
  const filteredStates = stateQuery === "" ? indianStatesAndUTs : indianStatesAndUTs.filter((s) => s.toLowerCase().includes(stateQuery.toLowerCase()));
  const filteredServices = serviceQuery === "" ? services : services.filter((service) => service.toLowerCase().includes(serviceQuery.toLowerCase()));

  useEffect(() => {
    if (state?.success && state?.whatsappURL) {
      window.open(state.whatsappURL, "_blank");
    }
  }, [state]);

  return (
    <section key="contact-page" className={`${bricolage.className} min-h-screen py-20 md:py-28 px-4 md:px-6 bg-black text-white`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-20 items-stretch">
          
          {/* Form Side */}
          <div className="flex flex-col min-h-full">
            <div>
              <h2 className="text-2xl font-bold text-[#8c52ff]">Contact Us</h2>
              <p className="mt-2 text-gray-200">Have questions or want to collaborate?</p>
            </div>

            <form action={formAction} className="mt-6 space-y-3.5 flex flex-col flex-grow">
              <input name="name" placeholder="Your Name" required disabled={isPending} className="w-full p-2.5 bg-[#111] border border-gray-700 rounded-lg text-sm focus:border-[#8c52ff] outline-none" />
              <input name="email" type="email" placeholder="Email" required disabled={isPending} className="w-full p-2.5 bg-[#111] border border-gray-700 rounded-lg text-sm focus:border-[#8c52ff] outline-none" />
              <input name="phone" type="tel" placeholder="Phone Number" required disabled={isPending} className="w-full p-2.5 bg-[#111] border border-gray-700 rounded-lg text-sm focus:border-[#8c52ff] outline-none" />

              <div className="grid grid-cols-2 gap-3.5">
                <Combobox name="city" value={selectedCity} onChange={setSelectedCity} disabled={isPending}>
                  <div className="relative">
                    <Combobox.Input
                      className="w-full p-2.5 bg-[#111] border border-gray-700 rounded-lg text-sm focus:border-[#8c52ff] outline-none"
                      placeholder="City"
                      autoComplete="off"
                      onChange={(e) => { setCityQuery(e.target.value); setSelectedCity(e.target.value); }}
                    />
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#1a1a1a] py-1 text-sm z-[100] border border-gray-700 shadow-xl">
                        {cityQuery.length > 0 && !filteredCities.includes(cityQuery) && (
                          <Combobox.Option value={cityQuery} className={({ active }) => `relative cursor-default select-none py-2 px-4 ${active ? "bg-[#8c52ff] text-white" : "text-gray-300"}`}>Use "{cityQuery}"</Combobox.Option>
                        )}
                        {filteredCities.map((city) => (
                          <Combobox.Option key={city} value={city} className={({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? "bg-[#8c52ff] text-white" : "text-gray-300"}`}>{city}</Combobox.Option>
                        ))}
                      </Combobox.Options>
                    </Transition>
                  </div>
                </Combobox>

                <Combobox name="state" value={selectedState} onChange={setSelectedState} disabled={isPending}>
                  <div className="relative">
                    <Combobox.Input className="w-full p-2.5 bg-[#111] border border-gray-700 rounded-lg text-sm focus:border-[#8c52ff] outline-none" placeholder="State" autoComplete="off" onChange={(e) => setStateQuery(e.target.value)} />
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#1a1a1a] py-1 text-sm z-[100] border border-gray-700 shadow-xl">
                        {filteredStates.map((st) => (
                          <Combobox.Option key={st} value={st} className={({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? "bg-[#8c52ff] text-white" : "text-gray-300"}`}>{st}</Combobox.Option>
                        ))}
                      </Combobox.Options>
                    </Transition>
                  </div>
                </Combobox>
              </div>

              <Combobox name="service" value={selectedService} onChange={setSelectedService} disabled={isPending}>
                <div className="relative">
                  <div className="relative w-full cursor-default">
                    <Combobox.Input className="w-full p-2.5 bg-[#111] border border-gray-700 rounded-lg text-sm focus:border-[#8c52ff] outline-none text-left" placeholder="Select Service" displayValue={(service: string) => service} onChange={(e) => setServiceQuery(e.target.value)} />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3"><ChevronDown className="h-4 w-4 text-[#8c52ff]" /></Combobox.Button>
                  </div>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#1a1a1a] py-1 text-sm z-[100] border border-gray-700 shadow-xl">
                      {filteredServices.map((service) => (
                        <Combobox.Option key={service} value={service} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-[#8c52ff] text-white" : "text-gray-300"}`}>
                          {({ selected, active }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{service}</span>
                              {selected && <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-[#8c52ff]'}`}><Check className="h-4 w-4" /></span>}
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>

              <textarea name="message" placeholder="Message" required rows={4} disabled={isPending} className="w-full p-2.5 bg-[#111] border border-gray-700 rounded-lg text-sm focus:border-[#8c52ff] outline-none resize-none flex-grow" />

              <div className="mt-4">
                <button type="submit" disabled={isPending} className="w-full py-2.5 rounded-full bg-[#8c52ff] hover:bg-purple-600 transition disabled:opacity-60 text-sm font-medium">
                  {isPending ? "Sending..." : "Send Message"}
                </button>
                {state?.message && <p className={`mt-2 text-center text-xs ${state.success ? 'text-green-400' : 'text-red-400'}`}>{state.message}</p>}
              </div>
            </form>
          </div>

          {/* Info Side */}
          <div className="flex flex-col min-h-full">
            <h3 className="text-2xl font-semibold text-[#8c52ff]">Get in Touch</h3>
            <div className="mt-6 space-y-5 text-gray-300">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#8c52ff]" />
                <p className="text-sm md:text-base">+91 8870002908</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#8c52ff]" />
                <p className="text-sm md:text-base break-all">info@adroiittechnovations.in</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8c52ff] mt-1 shrink-0" />
                <p className="text-sm md:text-base leading-relaxed">
                  15A, Pavendhar Street, Thamizh Thai Nagar, Uppalam, Puducherry - 605004
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#8c52ff]" />
                <p className="text-sm md:text-base">Mon - Sat: 10:00 AM - 6:00 PM</p>
              </div>
            </div>

            {/* Map Container - Using Exact User Provided Iframe */}
            <div className="mt-8 md:mt-auto pt-6">
              <div className="w-full overflow-hidden rounded-xl border border-gray-800">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.7686421645653!2d79.81572427483617!3d11.921973788305209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5361f82ca8d2db%3A0x4cec9aaf4e89f084!2sADROIIT%20TECHNOVATIONS!5e1!3m2!1sen!2sin!4v1775739111207!5m2!1sen!2sin" 
                  width="100%" 
                  height="350" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}