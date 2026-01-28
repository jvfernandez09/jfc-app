import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="mb-6 flex justify-center">
            <Image
              src="/jblogo.png"
              alt="Logo"
              width={60}
              height={60}
              priority
            />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
