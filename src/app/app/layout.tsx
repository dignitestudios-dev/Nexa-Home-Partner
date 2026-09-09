import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";
import SignatureGuard from "./_components/signature-guard";
import PartnerActiveGuard from "./_components/partner-active-guard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className=" ">
        <div className="flex bg-[#004D54] max-h-screen overflow-y-auto">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 p-6 bg-[#EAFCFF] rounded-tl-[20px] rounded-bl-[20px] h-screen overflow-y-auto">
            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <PartnerActiveGuard>
              <SignatureGuard>
                <div className="mt-6 ">{children}</div>
              </SignatureGuard>
            </PartnerActiveGuard>
          </div>
        </div>
      </body>
    </html>
  );
}
