"use server";

import { Resend } from 'resend';

// Initialize Resend with your environment variable
const resend = new Resend(process.env.RESEND_NEWSLETTER_KEY);

export async function handleNewsletter(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) return { success: false };

  try {
    await resend.emails.send({
      from: 'Adroiit Newsletter <onboarding@resend.dev>', // See note below about domain verification
      to: ['adroiit.technovations@gmail.com'], // Replace with your actual email address
      subject: 'New Newsletter Subscriber!',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #8c52ff;">We have got a new subscriber!</h2>
          <p>A new user has subscribed to the Adroiit Technovations newsletter:</p>
          <p style="font-size: 18px; font-weight: bold; background: #f9f9f9; padding: 10px; border-radius: 8px;">${email}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">This alert was sent automatically via Resend.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Newsletter Error:", error);
    return { success: false };
  }
}