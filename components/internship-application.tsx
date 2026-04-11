"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, Paperclip, Camera, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { handleInternshipApplication } from "@/app/internship-action";

export default function InternshipApplication({ isOpen, onClose, selectedDomain }: any) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const skillOptions: Record<string, string[]> = {
    "Embedded Systems & IoT": ["C Programming", "Arduino", "ESP32", "Raspberry Pi", "PCB Designing", "Electronic Simulation"],
    "Drone Technology": ["Pixhawk", "Ardupilot", "Crossflight"],
    "Mechanical CAD": ["AutoCAD", "Fusion 360", "Solidworks", "Ansys", "3D Printing"],
    "Research & Development": ["Arduino", "ESP32", "Raspberry Pi", "Prototyping", "PCB Designing", "PCB Testing", "Fusion 360", "Electronic Simulation", "Programming", "3D Printing"],
    "Founders' Office": ["Documentation", "Strategy Planning", "Marketing", "Sales", "Team Management", "Fluent English Fluency"],
    "Digital Marketing": ["Graphic Designer", "Video Editor", "Content Writer", "Social Media Manager", "Video Jockey"]
  };

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("domain", selectedDomain); // Ensure domain is sent
    const res = await handleInternshipApplication(formData);
    if (res.success) setSubmitted(true);
    else alert("Submission failed.");
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 30 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          className="relative bg-[#0F0F0F] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-8 md:p-12 no-scrollbar"
        >
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <X size={20}/>
          </button>

          {submitted ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h2 className="text-2xl text-white font-bold">Application Sent!</h2>
              <p className="text-gray-400 mt-2">We will review your profile shortly.</p>
              <button onClick={onClose} className="mt-8 bg-purple-600 text-white px-8 py-2.5 rounded-xl uppercase text-sm tracking-widest hover:bg-purple-700 transition-all font-bold">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-xl uppercase text-purple-500 tracking-tighter font-bold">Application for {selectedDomain} Internship</h2>
                <div className="flex items-center gap-4 mt-2">
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Step {step} of 4</p>
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-purple-500" animate={{ width: `${step * 25}%` }} />
                    </div>
                </div>
              </div>

              {/* SECTION 1: Personal Information */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-lg text-white/80 uppercase tracking-widest font-bold">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="modal-label font-bold">Full name</label>
                      <input required name="fullName" placeholder="Enter your full name" className="modal-input-dark" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">Gender</label>
                        <select required name="gender" defaultValue="" className="modal-input-dark custom-select">
                            <option value="" disabled hidden>Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">Date of birth</label>
                        <input required name="dob" type="date" className="modal-input-dark dark-calendar" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">Email address</label>
                        <input required name="email" type="email" placeholder="example@mail.com" className="modal-input-dark" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">WhatsApp number</label>
                        <input required name="whatsapp" placeholder="XXXXX XXXXX" className="modal-input-dark" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">City</label>
                        <input required name="city" placeholder="e.g. Mumbai" className="modal-input-dark" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">State / UT</label>
                        <select required name="state" defaultValue="" className="modal-input-dark custom-select">
                            <option value="" disabled hidden>Select state</option>
                            {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION 2: Academic Information */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-lg text-white/80 uppercase tracking-widest font-bold">Academic Background</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="modal-label font-bold">College name</label>
                      <input required name="collegeName" placeholder="Enter college/university name" className="modal-input-dark" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">College city</label>
                        <input required name="collegeCity" placeholder="City where college is located" className="modal-input-dark" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">College state / UT</label>
                        <select required name="collegeState" defaultValue="" className="modal-input-dark custom-select">
                            <option value="" disabled hidden>Select state</option>
                            {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="modal-label font-bold">Stream</label>
                            <input required name="stream" placeholder="e.g. B.Tech CSE" className="modal-input-dark" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="modal-label font-bold">LinkedIn profile</label>
                            <input required name="linkedin" placeholder="linkedin.com/in/username" className="modal-input-dark" />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="modal-label font-bold">Current year</label>
                            <select required name="yearOfStudy" defaultValue="" className="modal-input-dark custom-select">
                                <option value="" disabled hidden>Select year</option>
                                <option value="I">I</option>
                                <option value="II">II</option>
                                <option value="III">III</option>
                                <option value="IV">IV</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="modal-label font-bold">Passing year</label>
                            <input required name="passingYear" placeholder="e.g. 2026" className="modal-input-dark" />
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION 3: Internship Information */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                   <h3 className="text-lg text-white/80 uppercase tracking-widest font-bold">Internship Information</h3>
                   
                   <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">Do you have prior internship experience?</label>
                        <select required name="hasExperience" defaultValue="" className="modal-input-dark custom-select">
                            <option value="" disabled hidden>Select option</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">Why do you want to intern with us?</label>
                        <textarea required name="motivation" placeholder="Tell us what excites you about this role..." className="modal-input-dark min-h-[100px] py-3 resize-none" />
                      </div>
                   </div>

                   <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                    <p className="text-xs text-white uppercase tracking-wider font-bold">Relevant Skills for {selectedDomain}:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {skillOptions[selectedDomain]?.map(s => (
                            <label key={s} className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:border-purple-500/50 transition-all">
                                <input type="checkbox" name="skills" value={s} className="accent-purple-500 w-3 h-3" /> 
                                <span className="text-[10px] text-gray-300 uppercase tracking-tighter font-bold">{s}</span>
                            </label>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION 4: Document Submission */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-lg text-white/80 uppercase tracking-widest font-bold">Document Submission</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-6 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center hover:border-purple-500/40 transition-colors bg-white/[0.02]">
                        <Camera size={20} className="text-purple-500 mb-2"/>
                        <p className="text-[10px] text-white uppercase mb-4 font-bold">Formal Photo</p>
                        <input required name="photo" type="file" accept="image/*" className="text-[10px] text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[9px] file:bg-purple-600 file:text-white font-bold" />
                      </div>
                      <div className="p-6 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center hover:border-purple-500/40 transition-colors bg-white/[0.02]">
                        <Paperclip size={20} className="text-purple-500 mb-2"/>
                        <p className="text-[10px] text-white uppercase mb-4 font-bold">Latest Resume (PDF)</p>
                        <input required name="resume" type="file" accept=".pdf" className="text-[10px] text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[9px] file:bg-purple-600 file:text-white font-bold" />
                      </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                {step > 1 && (
                    <button type="button" onClick={() => setStep(step - 1)} className="flex-1 bg-white/5 text-white py-2.5 rounded-2xl uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-bold">
                        <ChevronLeft size={16} /> Back
                    </button>
                )}
                <button type="submit" disabled={loading} className="flex-[2] bg-purple-600 text-white py-2.5 rounded-2xl uppercase text-xs tracking-widest hover:bg-purple-700 transition-all flex items-center justify-center gap-2 font-bold">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>
                            {step === 4 ? "Final Submit" : "Next Step"}
                            {step < 4 && <ChevronRight size={16} />}
                        </>
                    )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .modal-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.2);
          margin-left: 4px;
        }
        .modal-input-dark { 
          width: 100%; 
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1); 
          border-radius: 12px; 
          padding: 10px 16px; 
          font-size: 13px; 
          outline: none; 
          transition: 0.3s; 
          color: white; 
        }

        .modal-input-dark[type="date"] {
          color: rgba(255, 255, 255, 0.2);
        }

        .modal-input-dark[type="date"]:valid,
        .modal-input-dark[type="date"]:focus {
          color: white;
        }

        select.modal-input-dark:invalid {
          color: rgba(255, 255, 255, 0.2);
        }
        
        select option[value=""][disabled] {
          display: none;
        }

        .modal-input-dark::placeholder {
           color: rgba(255, 255, 255, 0.2);
        }
        .modal-input-dark:focus { 
          border-color: #a855f7; 
          background: rgba(255, 255, 255, 0.06);
        }
        .custom-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.2)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1em;
        }
        select option {
          background-color: #0F0F0F;
          color: white;
        }
        .dark-calendar::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.2;
          cursor: pointer;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </AnimatePresence>
  );
}