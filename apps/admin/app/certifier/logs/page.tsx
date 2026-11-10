import VerificationLogsTable from "@/components/admin/VerificationLogsTable";

export default function VerificationLogsPage() {
  return (
    <main className="min-h-screen px-4 pb-8 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto -mt-18 w-full max-w-[1350px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8c52ff]">
            Certificate Verifications
          </p>

          <h1 className="mt-2 font-bricolage text-3xl font-bold tracking-tight text-white sm:text-3xl">
            Verification Logs
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            View certificate verification activity and verification timestamps.
          </p>
        </div>

        <VerificationLogsTable />
      </div>
    </main>
  );
}