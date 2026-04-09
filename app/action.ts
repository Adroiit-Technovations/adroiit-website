"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactForm(prevState: any, formData: FormData) {
  // Extract data from your form fields
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const service = formData.get("service") as string;
  const message = formData.get("message") as string;

  try {
    // 1. Send the Email to yourself
    await resend.emails.send({
      from: 'Adroiit Website <onboarding@resend.dev>',
      to: 'adroiit.technovations@gmail.com',
      subject: `New Inquiry: ${service} from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #8c52ff;">New Website Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Location:</strong> ${city}, ${state}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>
      `,
    });

    // 2. Format the WhatsApp URL
    const whatsappNumber = "918870002908";
    const text = `*New Inquiry from Website*%0A%0A*Name:* ${name}%0A*Service:* ${service}%0A*Location:* ${city}, ${state}%0A*Message:* ${message}`;
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${text}`;

    return { 
      success: true, 
      message: "Success! Redirecting to WhatsApp...", 
      whatsappURL 
    };

  } catch (error) {
    return { 
      success: false, 
      message: "Something went wrong. Please try again." 
    };
  }
}