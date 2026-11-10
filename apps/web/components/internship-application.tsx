"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, Paperclip, Camera, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { handleInternshipApplication } from "@/app/internship-action";

export default function InternshipApplication({ isOpen, onClose, selectedDomain }: any) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const [formDataState, setFormDataState] = useState({
    fullName: "", gender: "", dob: "", email: "", whatsapp: "", city: "", state: "",
    collegeName: "", collegeCity: "", collegeState: "", stream: "", linkedin: "",
    yearOfStudy: "", passingYear: "", hasExperience: "", motivation: "",
    skills: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormDataState(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (skill: string) => {
    setFormDataState(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill) 
        : [...prev.skills, skill]
    }));
  };

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
    
    const finalData = new FormData();
    Object.entries(formDataState).forEach(([key, value]) => {
      if (key === 'skills') {
        formDataState.skills.forEach(skill => finalData.append("skills", skill));
      } else {
        finalData.append(key, value as string);
      }
    });
    
    finalData.append("selectedDomain", selectedDomain);

    const formEl = e.currentTarget;
    const photo = (formEl.querySelector('input[name="photo"]') as HTMLInputElement).files?.[0];
    const resume = (formEl.querySelector('input[name="resume"]') as HTMLInputElement).files?.[0];
    if (photo) finalData.append("photo", photo);
    if (resume) finalData.append("resume", resume);

    const res = await handleInternshipApplication(finalData);
    
    if (res.success) {
      setSubmitted(true);
    } else {
      alert("Submission failed. Please check all fields and try again.");
    }
    setLoading(false);
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
        
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative bg-[#0F0F0F] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-8 md:p-12 no-scrollbar">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <X size={20}/>
          </button>

          {submitted ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h2 className="text-2xl text-white font-bold">Application Sent!</h2>
              <p className="text-gray-400 mt-2">Thank you for applying with Adroiit Technovations. We will review your profile and reach out to you.</p>
              <button onClick={onClose} className="mt-8 bg-purple-600 text-white px-8 py-2.5 rounded-xl uppercase text-sm tracking-widest hover:bg-purple-700 transition-all font-bold">Close</button>
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

              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-lg text-white/80 uppercase tracking-widest font-bold">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="modal-label font-bold">Full Name</label>
                      <input required name="fullName" value={formDataState.fullName} onChange={handleInputChange} placeholder="Enter your Full Name" className="modal-input-dark" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">Gender</label>
                        <select required name="gender" value={formDataState.gender} onChange={handleInputChange} className="modal-input-dark custom-select">
                            <option value="" disabled hidden>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">Date of Birth</label>
                        <input required name="dob" type="date" value={formDataState.dob} onChange={handleInputChange} className="modal-input-dark dark-calendar" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">Email Address</label>
                        <input required name="email" type="email" value={formDataState.email} onChange={handleInputChange} placeholder="example@mail.com" className="modal-input-dark" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">WhatsApp Number</label>
                        <input required name="whatsapp" type="tel" pattern="[0-9]*" value={formDataState.whatsapp} onChange={handleInputChange} placeholder="Enter 10-digit number" className="modal-input-dark" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">City</label>
                        <input required name="city" value={formDataState.city} onChange={handleInputChange} placeholder="e.g. Puducherry" className="modal-input-dark" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">State / UT</label>
                        <select required name="state" value={formDataState.state} onChange={handleInputChange} className="modal-input-dark custom-select">
                            <option value="" disabled hidden>Select state</option>
                            {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-lg text-white/80 uppercase tracking-widest font-bold">Academic Background</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="modal-label font-bold">College Name</label>
                      <input required name="collegeName" value={formDataState.collegeName} onChange={handleInputChange} placeholder="Enter College / University Name" className="modal-input-dark" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">College City</label>
                        <input required name="collegeCity" value={formDataState.collegeCity} onChange={handleInputChange} placeholder="City where College is located" className="modal-input-dark" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">College State / UT</label>
                        <select required name="collegeState" value={formDataState.collegeState} onChange={handleInputChange} className="modal-input-dark custom-select">
                            <option value="" disabled hidden>Select State</option>
                            {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="modal-label font-bold">Branch / Stream</label>
                            <input required name="stream" value={formDataState.stream} onChange={handleInputChange} placeholder="e.g. B.Tech - ECE" className="modal-input-dark" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="modal-label font-bold">LinkedIn Profile</label>
                            <input required name="linkedin" value={formDataState.linkedin} onChange={handleInputChange} placeholder="linkedin.com/in/username" className="modal-input-dark" />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="modal-label font-bold">Current Year of Study</label>
                            <select required name="yearOfStudy" value={formDataState.yearOfStudy} onChange={handleInputChange} className="modal-input-dark custom-select">
                                <option value="" disabled hidden>Select Year</option>
                                <option value="I">I</option>
                                <option value="II">II</option>
                                <option value="III">III</option>
                                <option value="IV">IV</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="modal-label font-bold">Year of Graduation</label>
                            <select required name="passingYear" value={formDataState.passingYear} onChange={handleInputChange} className="modal-input-dark custom-select">
                                <option value="" disabled hidden>Select Year of Graduation</option>
                                <option value="2027">2027</option>
                                <option value="2028">2028</option>
                                <option value="2029">2029</option>
                                <option value="2030">2030</option>
                            </select>
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <h3 className="text-lg text-white/80 uppercase tracking-widest font-bold">Internship Information</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">Do you have prior internship experience?</label>
                        <select required name="hasExperience" value={formDataState.hasExperience} onChange={handleInputChange} className="modal-input-dark custom-select">
                            <option value="" disabled hidden>Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="modal-label font-bold">Why do you want to intern with us?</label>
                        <textarea required name="motivation" value={formDataState.motivation} onChange={handleInputChange} placeholder="Tell us what excites you about this role..." className="modal-input-dark min-h-[100px] py-3 resize-none" />
                      </div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
                     <p className="text-xs text-white uppercase tracking-wider font-bold">Relevant Skills for {selectedDomain}:</p>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {skillOptions[selectedDomain]?.map(s => (
                            <label key={s} className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:border-purple-500/50 transition-all">
                                <input type="checkbox" checked={formDataState.skills.includes(s)} onChange={() => handleSkillChange(s)} className="accent-purple-500 w-3 h-3" /> 
                                <span className="text-[10px] text-gray-300 uppercase tracking-tighter font-bold">{s}</span>
                            </label>
                        ))}
                     </div>
                   </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h3 className="text-lg text-white/80 uppercase tracking-widest font-bold">Document Submission</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-6 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center hover:border-purple-500/40 transition-colors bg-white/[0.02]">
                        <Camera size={20} className="text-purple-500 mb-2"/>
                        <p className="text-[10px] text-white uppercase mb-4 font-bold">Formal Photo (JPG/PNG)</p>
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
        .modal-label { font-size: 13px; color: rgba(255, 255, 255, 0.4); margin-left: 4px; }
        .modal-input-dark { width: 100%; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 10px 16px; font-size: 13px; outline: none; transition: 0.3s; color: white; }
        .modal-input-dark[type="date"] { color: rgba(255, 255, 255, 0.2); }
        .modal-input-dark[type="date"]:valid, .modal-input-dark[type="date"]:focus { color: white; }
        select.modal-input-dark:invalid { color: rgba(255, 255, 255, 0.2); }
        select option[value=""][disabled] { display: none; }
        .modal-input-dark::placeholder { color: rgba(255, 255, 255, 0.2); }
        .modal-input-dark:focus { border-color: #a855f7; background: rgba(255, 255, 255, 0.06); }
        .custom-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.2)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1em; }
        select option { background-color: #0F0F0F; color: white; }
        .dark-calendar::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.2; cursor: pointer; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </AnimatePresence>
  );
}