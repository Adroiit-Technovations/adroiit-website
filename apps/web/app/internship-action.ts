"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_INTERNSHIP_KEY);

export async function handleInternshipApplication(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    
    const photo = formData.get("photo") as File;
    const resume = formData.get("resume") as File;
    const attachments = [];

    if (photo && photo.size > 0) {
      const photoBuffer = Buffer.from(await photo.arrayBuffer());
      attachments.push({ 
        content: photoBuffer, 
        filename: `Photo_${data.fullName}_${photo.name}` 
      });
    }

    if (resume && resume.size > 0) {
      const resumeBuffer = Buffer.from(await resume.arrayBuffer());
      attachments.push({ 
        content: resumeBuffer, 
        filename: `Resume_${data.fullName}_${resume.name}` 
      });
    }

    const skillsList = formData.getAll("skills").join(", ");

    const { error } = await resend.emails.send({
      from: 'Adroiit Technovations - Internship Portal<onboarding@resend.dev>',
      to: ['adroiit.technovations@gmail.com'],
      subject: `Internship Application: ${data.fullName} - ${data.selectedDomain}`,
      attachments: attachments,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; border: 1px solid #e0e0e0; padding: 30px; border-radius: 15px;">
          <h2 style="color: #8c52ff; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 0;">New Internship Application Received</h2>
          <p style="font-size: 14px; color: #666;"><b>Applied For:</b> <span style="color: #8c52ff; font-weight: bold;">${data.selectedDomain}</span></p>

          <h3 style="color: #333; font-size: 16px; margin-bottom: 10px; border-left: 4px solid #8c52ff; padding-left: 10px;">1. Personal Information</h3>
          <p style="margin: 5px 0;"><b>Full Name:</b> ${data.fullName}</p>
          <p style="margin: 5px 0;"><b>Gender:</b> ${data.gender}</p>
          <p style="margin: 5px 0;"><b>Date of Birth:</b> ${data.dob}</p>
          <p style="margin: 5px 0;"><b>Email:</b> ${data.email}</p>
          <p style="margin: 5px 0;"><b>WhatsApp Number:</b> ${data.whatsapp}</p>
          <p style="margin: 5px 0;"><b>Current Location:</b> ${data.city}, ${data.state}</p>

          <h3 style="color: #333; font-size: 16px; margin-bottom: 10px; border-left: 4px solid #8c52ff; padding-left: 10px; margin-top: 25px;">2. Academic Background</h3>
          <p style="margin: 5px 0;"><b>College/University:</b> ${data.collegeName}</p>
          <p style="margin: 5px 0;"><b>College Location:</b> ${data.collegeCity}, ${data.collegeState}</p>
          <p style="margin: 5px 0;"><b>Stream/Branch:</b> ${data.stream}</p>
          <p style="margin: 5px 0;"><b>Current Year of Study:</b> ${data.yearOfStudy}</p>
          <p style="margin: 5px 0;"><b>Expected Year of Graduation:</b> ${data.passingYear}</p>
          <p style="margin: 5px 0;"><b>LinkedIn Profile:</b> ${data.linkedin}</p>

          <h3 style="color: #333; font-size: 16px; margin-bottom: 10px; border-left: 4px solid #8c52ff; padding-left: 10px; margin-top: 25px;">3. Experience & Skills</h3>
          <p style="margin: 5px 0;"><b>Prior Internship:</b> ${data.hasExperience}</p>
          <p style="margin: 5px 0;"><b>Selected Skills:</b> ${skillsList || 'None selected'}</p>
          <p style="margin: 15px 0 5px 0;"><b>Statement of Motivation:</b></p>
          <div style="background: #f8f5ff; border: 1px solid #e9defa; padding: 15px; border-radius: 8px; font-style: italic; color: #444;">
            ${data.motivation}
          </div>

          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center;">
            This is an automated notification from the Adroiit Technovations Internship Portal.
          </div>
        </div>
      `,
    });

    if (error) return { success: false };
    return { success: true };
  } catch (err) {
    console.error("Server Error:", err);
    return { success: false };
  }
}