
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  CheckCircle2,
  Paperclip,
  Camera,
  ChevronRight,
  ChevronLeft,
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { handleInternshipApplication } from "@/app/internship-action";

export default function InternshipApplication({
  isOpen,
  onClose,
  selectedDomain,
}: any) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const [photoFileName, setPhotoFileName] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");

  const [formDataState, setFormDataState] = useState({
    fullName: "",
    gender: "",
    dob: "",
    email: "",
    whatsapp: "",
    city: "",
    state: "",
    collegeName: "",
    collegeCity: "",
    collegeState: "",
    stream: "",
    linkedin: "",
    yearOfStudy: "",
    passingYear: "",
    hasExperience: "",
    motivation: "",
    skills: [] as string[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormDataState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillChange = (skill: string) => {
    setFormDataState((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const skillOptions: Record<string, string[]> = {
    "Embedded Systems & IoT": [
      "C Programming",
      "Arduino",
      "ESP32",
      "Raspberry Pi",
      "PCB Designing",
      "Electronic Simulation",
    ],
    "Drone Technology": ["Pixhawk", "Ardupilot", "Crossflight"],
    "Mechanical CAD": [
      "AutoCAD",
      "Fusion 360",
      "Solidworks",
      "Ansys",
      "3D Printing",
    ],
    "Research & Development": [
      "Arduino",
      "ESP32",
      "Raspberry Pi",
      "Prototyping",
      "PCB Designing",
      "PCB Testing",
      "Fusion 360",
      "Electronic Simulation",
      "Programming",
      "3D Printing",
    ],
    "Founders' Office": [
      "Documentation",
      "Strategy Planning",
      "Marketing",
      "Sales",
      "Team Management",
      "Fluent English Fluency",
    ],
    "Digital Marketing": [
      "Graphic Designer",
      "Video Editor",
      "Content Writer",
      "Social Media Manager",
      "Video Jockey",
    ],
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const steps = [
    {
      number: 1,
      title: "Personal",
      icon: UserRound,
    },
    {
      number: 2,
      title: "Academic",
      icon: GraduationCap,
    },
    {
      number: 3,
      title: "Internship",
      icon: BriefcaseBusiness,
    },
    {
      number: 4,
      title: "Documents",
      icon: FileText,
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setLoading(true);

    const formEl = e.currentTarget;
    const finalData = new FormData();

    Object.entries(formDataState).forEach(([key, value]) => {
      if (key === "skills") {
        formDataState.skills.forEach((skill) =>
          finalData.append("skills", skill)
        );
      } else {
        finalData.append(key, value as string);
      }
    });

    finalData.append("selectedDomain", selectedDomain);

    const photo = (
      formEl.querySelector('input[name="photo"]') as HTMLInputElement
    ).files?.[0];

    const resume = (
      formEl.querySelector('input[name="resume"]') as HTMLInputElement
    ).files?.[0];

    if (photo) finalData.append("photo", photo);
    if (resume) finalData.append("resume", resume);

    try {
      const res = await handleInternshipApplication(finalData);

      if (res.success) {
        setSubmitted(true);
      } else {
        alert("Submission failed. Please check all fields and try again.");
      }
    } catch {
      alert("Submission failed. Please check all fields and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const inputClass = "modal-input-dark";
  const labelClass = "modal-label";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-3 sm:p-5">

        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#030208]/90 backdrop-blur-xl"
        />

        {/* MODAL BACKGROUND GLOWS */}
        <div className="pointer-events-none absolute left-0 top-0 h-[350px] w-[350px] rounded-full bg-[#5921c7]/15 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-[#8c52ff]/10 blur-[130px]" />

        {/* MAIN MODAL */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 25 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative my-auto flex max-h-[94vh] w-full max-w-[900px] flex-col overflow-hidden rounded-[24px] border border-white/[0.10] bg-[#080611] shadow-[0_30px_100px_rgba(0,0,0,0.65)] sm:rounded-[30px]"
        >

          {/* TOP ACCENT */}
          <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#8c52ff] to-transparent" />

          {/* HEADER */}
          <div className="relative shrink-0 border-b border-white/[0.08] px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-7 md:px-10">

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <h2 className="text-xl font-extrabold leading-tight tracking-[-0.045em] text-white sm:text-2xl md:text-[27px]">
                  <span className="bg-gradient-to-r from-[#8c52ff] to-[#c4a9ff] bg-clip-text text-transparent">
                    Internship Application
                  </span>
                </h2>

                <p className="mt-2 max-w-[600px] text-[12px] leading-6 text-white text-[14px]">
                  Application for{" "}
                  <span className="text-white">
                    {selectedDomain}
                  </span>{" "}
                  Internship
                </p>

              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-400 transition-all hover:border-[#8c52ff]/40 hover:bg-[#5921c7]/20 hover:text-white"
              >
                <X size={17} />
              </button>

            </div>

            {/* STEP PROGRESS */}
            {!submitted && (
              <div className="mt-4">

                <div className="mb-4 flex items-center justify-between gap-2">

                  {steps.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = step === item.number;
                    const isCompleted = step > item.number;

                    return (
                      <div
                        key={item.number}
                        className="flex min-w-0 flex-1 items-center gap-2"
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 sm:h-9 sm:w-9 ${
                            isActive
                              ? "border-[#8c52ff] bg-[#5921c7] text-white shadow-[0_0_20px_rgba(140,82,255,0.25)]"
                              : isCompleted
                                ? "border-[#8c52ff]/50 bg-[#5921c7]/20 text-[#b99aff]"
                                : "border-white/10 bg-white/[0.03] text-gray-600"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <Icon size={16} />
                          )}
                        </div>

                        <span
                          className={`hidden truncate text-[11px] font-semibold uppercase tracking-[0.12em] sm:block ${
                            isActive
                              ? "text-white"
                              : isCompleted
                                ? "text-[#b99aff]"
                                : "text-gray-600"
                          }`}
                        >
                          {item.title}
                        </span>

                        {index !== steps.length - 1 && (
                          <div className="h-px min-w-[8px] flex-1 bg-white/10 sm:mx-1">
                            <motion.div
                              initial={false}
                              animate={{
                                width: step > item.number ? "100%" : "0%",
                              }}
                              className="h-full bg-[#8c52ff]"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-300">
                    Step {step} of 4
                  </p>
                </div>

                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#5921c7] to-[#a87ffb]"
                    animate={{ width: `${step * 25}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

              </div>
            )}

          </div>

          {/* FORM CONTENT */}
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-4 md:px-10 no-scrollbar">

            {submitted ? (

              /* SUCCESS SCREEN */
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[350px] flex-col items-center justify-center py-10 text-center"
              >

                <div className="relative mb-2">

                  <div className="absolute inset-0 rounded-full bg-[#8c52ff]/20 blur-2xl" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[25px] border border-[#8c52ff]/30 bg-gradient-to-br from-[#5921c7]/30 to-[#8c52ff]/10">
                    <CheckCircle2
                      size={38}
                      strokeWidth={1.6}
                      className="text-[#b99aff]"
                    />
                  </div>

                </div>

                <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Application{" "}
                  <span className="bg-gradient-to-r from-[#8c52ff] to-[#b99aff] bg-clip-text text-transparent">
                    Sent!
                  </span>
                </h2>

                <p className="mx-auto mt-4 max-w-[430px] text-sm leading-7 text-gray-400">
                  Thank you for applying with Adroiit Technovations. We will
                  review your profile and reach out to you.
                </p>

                <button
                  onClick={onClose}
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#5921c7] px-9 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-[0_8px_25px_rgba(89,33,199,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#713be0]"
                >
                  Close
                  <ChevronRight size={16} />
                </button>

              </motion.div>

            ) : (

              <form
                onSubmit={handleSubmit}
                className="flex flex-col"
              >

                <AnimatePresence mode="wait">

                  {/* ==================================================
                      STEP 01 — PERSONAL INFORMATION
                  ================================================== */}
                  {step === 1 && (

                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-7"
                    >

                      <div className="space-y-3">

                        {/* FULL NAME */}
                        <div className="form-group">
                          <label className={labelClass}>
                            Full Name
                          </label>

                          <input
                            required
                            name="fullName"
                            value={formDataState.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your Full Name"
                            className={inputClass}
                          />
                        </div>

                        {/* GENDER + DOB */}
                        <div className="grid gap-5 md:grid-cols-2">

                          <div className="form-group">
                            <label className={labelClass}>
                              Gender
                            </label>

                            <select
                              required
                              name="gender"
                              value={formDataState.gender}
                              onChange={handleInputChange}
                              className={`${inputClass} custom-select`}
                            >
                              <option value="" disabled hidden>
                                Select Gender
                              </option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className={labelClass}>
                              Date of Birth
                            </label>

                            <input
                              required
                              name="dob"
                              type="date"
                              value={formDataState.dob}
                              onChange={handleInputChange}
                              className={`${inputClass} dark-calendar`}
                            />
                          </div>

                        </div>

                        {/* EMAIL + WHATSAPP */}
                        <div className="grid gap-5 md:grid-cols-2">

                          <div className="form-group">
                            <label className={labelClass}>
                              Email Address
                            </label>

                            <input
                              required
                              name="email"
                              type="email"
                              value={formDataState.email}
                              onChange={handleInputChange}
                              placeholder="example@mail.com"
                              className={inputClass}
                            />
                          </div>

                          <div className="form-group">
                            <label className={labelClass}>
                              WhatsApp Number
                            </label>

                            <input
                              required
                              name="whatsapp"
                              type="tel"
                              pattern="[0-9]*"
                              value={formDataState.whatsapp}
                              onChange={handleInputChange}
                              placeholder="Enter 10-digit number"
                              className={inputClass}
                            />
                          </div>

                        </div>

                        {/* CITY + STATE */}
                        <div className="grid gap-5 md:grid-cols-2">

                          <div className="form-group">
                            <label className={labelClass}>
                              City
                            </label>

                            <input
                              required
                              name="city"
                              value={formDataState.city}
                              onChange={handleInputChange}
                              placeholder="e.g. Puducherry"
                              className={inputClass}
                            />
                          </div>

                          <div className="form-group">
                            <label className={labelClass}>
                              State / UT
                            </label>

                            <select
                              required
                              name="state"
                              value={formDataState.state}
                              onChange={handleInputChange}
                              className={`${inputClass} custom-select`}
                            >
                              <option value="" disabled hidden>
                                Select state
                              </option>

                              {indianStates.map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </select>
                          </div>

                        </div>

                      </div>

                    </motion.div>
                  )}

                  {/* ==================================================
                      STEP 02 — ACADEMIC BACKGROUND
                  ================================================== */}
                  {step === 2 && (

                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-7"
                    >

                      <div className="space-y-5">

                        {/* COLLEGE NAME */}
                        <div className="form-group">
                          <label className={labelClass}>
                            College Name
                          </label>

                          <input
                            required
                            name="collegeName"
                            value={formDataState.collegeName}
                            onChange={handleInputChange}
                            placeholder="Enter College / University Name"
                            className={inputClass}
                          />
                        </div>

                        {/* COLLEGE CITY + STATE */}
                        <div className="grid gap-5 md:grid-cols-2">

                          <div className="form-group">
                            <label className={labelClass}>
                              College City
                            </label>

                            <input
                              required
                              name="collegeCity"
                              value={formDataState.collegeCity}
                              onChange={handleInputChange}
                              placeholder="City where College is located"
                              className={inputClass}
                            />
                          </div>

                          <div className="form-group">
                            <label className={labelClass}>
                              College State / UT
                            </label>

                            <select
                              required
                              name="collegeState"
                              value={formDataState.collegeState}
                              onChange={handleInputChange}
                              className={`${inputClass} custom-select`}
                            >
                              <option value="" disabled hidden>
                                Select State
                              </option>

                              {indianStates.map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </select>
                          </div>

                        </div>

                        {/* STREAM + LINKEDIN */}
                        <div className="grid gap-5 md:grid-cols-2">

                          <div className="form-group">
                            <label className={labelClass}>
                              Branch / Stream
                            </label>

                            <input
                              required
                              name="stream"
                              value={formDataState.stream}
                              onChange={handleInputChange}
                              placeholder="e.g. B.Tech - ECE"
                              className={inputClass}
                            />
                          </div>

                          <div className="form-group">
                            <label className={labelClass}>
                              LinkedIn Profile
                            </label>

                            <input
                              required
                              name="linkedin"
                              value={formDataState.linkedin}
                              onChange={handleInputChange}
                              placeholder="linkedin.com/in/username"
                              className={inputClass}
                            />
                          </div>

                        </div>

                        {/* YEAR OF STUDY + PASSING YEAR */}
                        <div className="grid gap-5 md:grid-cols-2">

                          <div className="form-group">
                            <label className={labelClass}>
                              Current Year of Study
                            </label>

                            <select
                              required
                              name="yearOfStudy"
                              value={formDataState.yearOfStudy}
                              onChange={handleInputChange}
                              className={`${inputClass} custom-select`}
                            >
                              <option value="" disabled hidden>
                                Select Year
                              </option>

                              <option value="I">I</option>
                              <option value="II">II</option>
                              <option value="III">III</option>
                              <option value="IV">IV</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className={labelClass}>
                              Year of Graduation
                            </label>

                            <select
                              required
                              name="passingYear"
                              value={formDataState.passingYear}
                              onChange={handleInputChange}
                              className={`${inputClass} custom-select`}
                            >
                              <option value="" disabled hidden>
                                Select Year of Graduation
                              </option>

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

                  {/* ==================================================
                      STEP 03 — INTERNSHIP INFORMATION
                  ================================================== */}
                  {step === 3 && (

                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-7"
                    >

                      <div className="space-y-5">

                        {/* EXPERIENCE */}
                        <div className="form-group">
                          <label className={labelClass}>
                            Do you have prior internship experience?
                          </label>

                          <select
                            required
                            name="hasExperience"
                            value={formDataState.hasExperience}
                            onChange={handleInputChange}
                            className={`${inputClass} custom-select`}
                          >
                            <option value="" disabled hidden>
                              Select Option
                            </option>

                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* MOTIVATION */}
                        <div className="form-group">
                          <label className={labelClass}>
                            Why do you want to intern with us?
                          </label>

                          <textarea
                            required
                            name="motivation"
                            value={formDataState.motivation}
                            onChange={handleInputChange}
                            placeholder="Tell us what excites you about this role..."
                            className={`${inputClass} min-h-[125px] resize-none py-4`}
                          />
                        </div>

                      </div>

                      {/* SKILLS */}
                      <div className="form-group">
                        <label className={labelClass}>
                          Relevant Skills for {selectedDomain} Internship
                        </label>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {skillOptions[selectedDomain]?.map((s) => {
                            const selected = formDataState.skills.includes(s);

                            return (
                              <label
                                key={s}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 ${
                                  selected
                                    ? "border-[#8c52ff]/50 bg-[#5921c7]/10"
                                    : "border-white/[0.09] bg-white/[0.025] hover:border-white/20"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => handleSkillChange(s)}
                                  className="h-4 w-4 shrink-0 cursor-pointer accent-[#8c52ff]"
                                />

                                <span
                                  className={`text-[11px] font-semibold transition-colors ${
                                    selected ? "text-white" : "text-gray-400"
                                  }`}
                                >
                                  {s}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {/* ==================================================
                      STEP 04 — DOCUMENT SUBMISSION
                  ================================================== */}
                  {step === 4 && (

                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-7"
                    >
                      <div className="grid gap-5 md:grid-cols-2">

                        {/* PHOTO UPLOAD */}
                        <div className="group relative flex min-h-[225px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-6 text-center transition-all duration-300 hover:border-[#8c52ff]/60 hover:bg-[#5921c7]/[0.07]">

                          <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8c52ff]/25 bg-[#5921c7]/15 text-[#b99aff]">
                            <Camera size={21} />
                          </div>

                          <p className="relative text-xs font-semibold uppercase tracking-[0.12em] text-gray-300">
                            Formal Photo (JPG/PNG)
                          </p>

                          <input
                            required
                            id="photo-upload"
                            name="photo"
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={(e) =>
                              setPhotoFileName(e.target.files?.[0]?.name ?? "")
                            }
                            className="hidden"
                          />

                          <label
                            htmlFor="photo-upload"
                            className="mt-5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#5921c7] px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#713be0]"
                          >
                            <Camera size={14} />
                            Choose Photo
                          </label>

                          <p className="mt-3 max-w-full truncate text-[11px] text-gray-400">
                            {photoFileName || "No file chosen"}
                          </p>

                        </div>

                        {/* RESUME UPLOAD */}
                        <div className="group relative flex min-h-[225px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-6 text-center transition-all duration-300 hover:border-[#8c52ff]/60 hover:bg-[#5921c7]/[0.07]">

                          <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8c52ff]/25 bg-[#5921c7]/15 text-[#b99aff]">
                            <Paperclip size={21} />
                          </div>

                          <p className="relative text-xs font-semibold uppercase tracking-[0.12em] text-gray-300">
                            Latest Resume (PDF)
                          </p>

                          <input
                            required
                            id="resume-upload"
                            name="resume"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={(e) =>
                              setResumeFileName(e.target.files?.[0]?.name ?? "")
                            }
                            className="hidden"
                          />

                          <label
                            htmlFor="resume-upload"
                            className="mt-5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#5921c7] px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#713be0]"
                          >
                            <Paperclip size={14} />
                            Choose Resume
                          </label>

                          <p className="mt-3 max-w-full truncate text-[11px] text-gray-400">
                            {resumeFileName || "No file chosen"}
                          </p>

                        </div>

                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>

                {/* ==================================================
                    NAVIGATION BUTTONS
                ================================================== */}
                <div className="mt-8 flex items-center gap-3 border-t border-white/[0.08] pt-6">

                  {step > 1 && (

                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      disabled={loading}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-gray-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:opacity-50 sm:flex-none sm:px-7"
                    >
                      <ChevronLeft size={16} />
                      Back
                    </button>

                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex flex-[2] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5921c7] to-[#713be0] px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.17em] text-white shadow-[0_8px_25px_rgba(89,33,199,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#713be0] hover:to-[#8c52ff] hover:shadow-[0_12px_30px_rgba(89,33,199,0.35)] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-[2]"
                  >

                    {loading ? (

                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Submitting
                      </>

                    ) : (

                      <>
                        {step === 4 ? "Final Submit" : "Next Step"}

                        {step < 4 && (
                          <ChevronRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        )}
                      </>

                    )}

                  </button>

                </div>

              </form>

            )}

          </div>

        </motion.div>

      </div>

      {/* ==================================================
          CUSTOM STYLES
      ================================================== */}
      <style jsx>{`

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .modal-label {
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #f3f4f6;
          margin-left: 3px;
        }

        .modal-input-dark {
          width: 100%;
          min-height: 46px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 12px;
          padding: 11px 14px;
          font-size: 12px;
          outline: none;
          transition: all 0.25s ease;
          color: white;
          font-family: inherit;
          color-scheme: dark;
        }

        .modal-input-dark:hover {
          border-color: rgba(140, 82, 255, 0.3);
          background: rgba(255, 255, 255, 0.045);
        }

        .modal-input-dark:focus {
          border-color: #8c52ff;
          background: rgba(89, 33, 199, 0.08);
          box-shadow: 0 0 0 3px rgba(140, 82, 255, 0.10);
        }

        .modal-input-dark::placeholder {
          color: #9ca3af;
        }

        .modal-input-dark[type="date"] {
          color: #9ca3af;
        }

        .modal-input-dark[type="date"]:valid,
        .modal-input-dark[type="date"]:focus {
          color: white;
        }

        select.modal-input-dark:invalid {
          color: #9ca3af;
        }

        select option {
          background-color: #100b1d;
          color: white;
        }

        .custom-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a87ffb'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 14px;
          padding-right: 38px;
          cursor: pointer;
        }

        .dark-calendar::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.45;
          cursor: pointer;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        input[type="file"]::file-selector-button {
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .modal-input-dark {
            min-height: 44px;
            font-size: 12px;
          }
        }

      `}</style>

    </AnimatePresence>
  );
}
