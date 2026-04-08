"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactForm(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const service = formData.get("service") as string;
  const message = formData.get("message") as string;

  try {
    // Only use 'contact@adroiittechnovations.in' AFTER Resend shows "Verified"
    const { error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", 
      to: "info@adroiittechnovations.in",
      subject: `New Lead: ${name} - ${service}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nLocation: ${city}, ${state}\nService: ${service}\n\nMessage: ${message}`,
    });

    if (error) throw error;

    const whatsappText = encodeURIComponent(`Hello Adroiit! I'm ${name}. I'm interested in ${service}.`);
    const whatsappURL = `https://wa.me/918870002908?text=${whatsappText}`;

    return { success: true, message: "Success!", whatsappURL };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: "Error sending message." };
  }
}