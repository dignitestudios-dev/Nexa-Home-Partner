import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[700px_1fr] w-full overflow-hidden shadow-2xl h-screen bg-white">
        {/* LEFT PANEL */}
        <div className="hidden lg:flex bg-[#005864] relative flex-col items-center justify-center text-center">
          {/* Glow circles */}
          <div className="absolute w-[900px] h-[650px] bg-[radial-gradient(ellipse,rgba(215,223,35,0.18)_0%,transparent_50%)] bottom-[-180px]" />

          <div className="relative z-10">
            {/* Brand */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <img
                src="/asset/authLogo.png"
                alt="BrandMark"
                className="w-[300px]"
              />
            </div>

            {/* Dots */}
          </div>
        </div>

        <div className="bg-white flex items-start justify-center p-10 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

