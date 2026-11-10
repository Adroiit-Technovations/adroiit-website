"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Loader2, RefreshCw } from "lucide-react";

interface CertificateQRCodeProps {
  certificateId: string;
}

export default function CertificateQRCode({
  certificateId,
}: CertificateQRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const generateQRCode = async () => {
    if (!certificateId) {
      setError("Certificate ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        window.location.origin;

      const verificationUrl = `${baseUrl}/verify?id=${encodeURIComponent(
        certificateId
      )}`;

      const dataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 600,
        margin: 3,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error(err);
      setError("Unable to generate QR code.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [certificateId]);

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const safeFileName =
      certificateId
        .replace(/[^a-zA-Z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "") || "certificate";

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `${safeFileName}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div
        className="flex min-h-[280px] items-center justify-center rounded-2xl border"
        style={{
          borderColor: "var(--admin-border)",
          backgroundColor: "var(--admin-surface)",
        }}
      >
        <div
          className="flex items-center gap-2 text-sm"
          style={{ color: "var(--admin-text-muted)" }}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating QR code...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "rgba(239, 68, 68, 0.2)",
          backgroundColor: "rgba(239, 68, 68, 0.08)",
        }}
      >
        <p
          className="text-sm"
          style={{ color: "var(--admin-danger)" }}
        >
          {error}
        </p>

        <button
          type="button"
          onClick={generateQRCode}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition"
          style={{
            borderColor: "var(--admin-border)",
            color: "var(--admin-text-secondary)",
          }}
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        borderColor: "var(--admin-border)",
        backgroundColor: "var(--admin-surface)",
      }}
    >
      <div className="mb-5">
        <h3
          className="text-base font-semibold"
          style={{ color: "var(--admin-text)" }}
        >
          Verification QR Code
        </h3>

        <p
          className="mt-1 text-sm leading-6"
          style={{ color: "var(--admin-text-muted)" }}
        >
          Download this QR code and place it on the certificate created in
          Canva.
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="rounded-2xl bg-white p-4">
          {qrDataUrl && (
            <img
              src={qrDataUrl}
              alt={`QR code for certificate ${certificateId}`}
              className="h-56 w-56 sm:h-64 sm:w-64"
            />
          )}
        </div>

        <p
          className="mt-4 max-w-md break-all text-center text-xs leading-5"
          style={{ color: "var(--admin-text-subtle)" }}
        >
          Scanning this QR code opens the certificate verification page.
        </p>

        <button
          type="button"
          onClick={handleDownload}
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#5921C7] px-5 text-sm font-semibold text-white transition hover:bg-[#6d2ee3]"
        >
          <Download className="h-4 w-4" />
          Download QR Code
        </button>
      </div>
    </div>
  );
}