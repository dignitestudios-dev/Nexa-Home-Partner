"use client";

import { ChangeEvent, useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { uploadSignature } from "@/lib/api/dashboard.api";
import { getMe } from "@/lib/slices/authSlice";
import { toast } from "sonner";

interface SignatureGuardProps {
  children: React.ReactNode;
}

export default function SignatureGuard({ children }: SignatureGuardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'agreement' | 'upload' | 'type'>('agreement');

  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [savedSignaturePreview, setSavedSignaturePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typedSignature, setTypedSignature] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const hasSignature = !!(user.signature || user.data?.signature);
      setIsAgreementModalOpen(!hasSignature);
      if (hasSignature) {
        setCurrentScreen('agreement');
      }
    }
  }, [user]);

  const openUploadModal = () => {
    setCurrentScreen('upload');
  };

  const openTypeModal = () => {
    setCurrentScreen('type');
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/") || file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif")) {
      toast.error("Please upload a valid image file (JPG, PNG, JPEG). GIF is not allowed.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImagePreview(reader.result as string);
      setUploadedImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImage = () => {
    if (!uploadedImagePreview) {
      return;
    }
    setSavedSignaturePreview(null);
    setCurrentScreen('agreement');
  };

  const handleSaveTypedSignature = () => {
    if (!typedSignature.trim()) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "italic 48px 'Brush Script MT', 'Lucida Handwriting', 'Segoe Script', cursive";
      ctx.fillStyle = "#005864";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2);

      const signatureImage = canvas.toDataURL("image/png");
      setSavedSignaturePreview(signatureImage);
    }

    setUploadedFile(null);
    setUploadedImagePreview(null);
    setUploadedImageName("");
    setCurrentScreen('agreement');
  };

  const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: "image/png" });
  };

  const handleSubmitSignature = async () => {
    if (!uploadedFile && !savedSignaturePreview) {
      toast.error("Please provide a signature first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      let fileToUpload: File | null = null;

      if (uploadedFile) {
        fileToUpload = uploadedFile;
      } else if (savedSignaturePreview) {
        fileToUpload = await dataUrlToFile(savedSignaturePreview, "signature.png");
      }

      if (!fileToUpload) {
        throw new Error("No signature file found.");
      }

      formData.append("signatureFile", fileToUpload);
      const signatureText = user?.fullName || user?.data?.name || "Partner Signature";
      formData.append("signature", signatureText);

      await uploadSignature(formData);
      toast.success("Agreement signed successfully.");

      await dispatch(getMe());
      setIsAgreementModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit signature.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {children}

      <Dialog
        open={isAgreementModalOpen}
        onOpenChange={(open) => {
          const hasSignature = !!(user?.signature || user?.data?.signature);
          if (hasSignature) {
            setIsAgreementModalOpen(open);
            setCurrentScreen('agreement');
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className={`w-full transition-all duration-300 rounded-[20px] bg-white p-10 z-[100] ${currentScreen === 'agreement' ? 'max-w-[900px] max-h-[95vh] overflow-y-auto' : 'max-w-[620px] max-h-[90vh] overflow-y-auto'
            }`}
        >
          {currentScreen === 'agreement' && (
            <>
              <DialogTitle className="text-[24px] font-[700] leading-[30px] text-black">
                Agreement
              </DialogTitle>
              <DialogDescription className="mt-3 h-[448px] overflow-y-auto pr-4 text-[16px] font-[400] leading-[32px] text-[rgba(24,24,24,0.8)]">
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-black leading-tight">NexaHome Partner Agreement</h1>
                    <h2 className="text-lg font-semibold text-gray-700 mt-2">Referral Partner Terms & Conditions</h2>
                  </div>

                  <p>
                    This NexaHome Partner Agreement (the "Agreement") is entered into as of the date of acceptance
                    below (the "Effective Date") by and between NexaHome, LLC ("Nexa Home," "Company," "we," or "us")
                    and the undersigned partner (the "Partner" or "you"). NexaHome and Partner are referred to
                    individually as a "Party" and collectively as the "Parties."
                  </p>

                  <p>
                    NexaHome operates a software platform through which Users (homeowners, renters, property
                    managers, and other individuals seeking home services) request home-improvement, landscaping,
                    cleaning, handyman, and related services. Vetted service providers ("Experts," also referred to as "Trade
                    Experts") purchase digital credits ("Credits") from NexaHome and redeem those Credits to purchase
                    access to User service requests and leads generated on the Platform. Partner desires to refer Users
                    within Partner's network including, where applicable, members, customers, clients, or borrowers of
                    User associations, title companies, mortgage lenders, and similar referral networks to the Platform in
                    exchange for the commissions described herein, which are earned on Credit revenue generated by
                    Experts accessing leads attributable to Users referred by Partner. The Parties agree as follows.
                  </p>

                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">1. Purpose</h3>
                    <p>
                      This Agreement governs the relationship under which the Partner refers Users to NexaHome in exchange
                      for commission on Qualifying Credit Purchases made by Experts who acquire access to leads generated
                      by Partner's referred Users on the NexaHome platform (the "Platform").
                    </p>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">2. Nature of Relationship</h3>
                    <p className="mb-2">
                      The Partner is an independent contractor. Nothing in this Agreement creates a partnership, joint
                      venture, employment, agency, or franchise relationship between the Parties. Specifically, the Partner:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Has no authority to bind Nexa Home, enter into agreements on its behalf, or make representations or warranties on its behalf;</li>
                      <li>Is not an employee, agent, joint venturer, or legal representative of NexaHome; and</li>
                      <li>Is solely responsible for its own operations, marketing, personnel, taxes, and costs incurred in performing under this Agreement.</li>
                    </ul>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">3. Referral & Attribution Model</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>NexaHome will assign Partner a unique referral code, link, or other tracking identifier (the "Referral Identifier").</li>
                      <li>A User is considered a "Referred Homeowner" of Partner only if the User is properly tracked through NexaHome's system using the Referral Identifier in the manner specified by Nexa Home from time to time, at the time the User first creates a Platform account.</li>
                      <li>Service requests and leads generated by Referred Homeowners that are made available to Experts on the Platform are referred to as "Attributable Leads." Credit Purchases by Experts to access Attributable Leads are the basis on which Partner earns commissions under this Agreement.</li>
                      <li>NexaHome's tracking system shall be the sole and final authority on attribution, including which Users are Referred Homeowners, which leads are Attributable Leads, and which Credit Purchases are attributable to Partner. Determinations made by NexaHome are conclusive absent manifest error.</li>
                      <li>Partner is responsible for ensuring proper use of the Referral Identifier. NexaHome has no obligation to retroactively credit referrals that were not tracked at the time of User sign-up.</li>
                    </ul>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">4. Commission Structure</h3>
                    <p className="mb-3">
                      Subject to the terms of this Agreement, NexaHome will pay Partner a commission equal to fifteen
                      percent (15%) of the Gross Credit Revenue actually received and cleared by NexaHome from Qualifying
                      Credit Purchases attributable to Partner. For the avoidance of doubt, Partner's commission is earned on
                      the sale of Credits to Experts for the purpose of accessing Attributable Leads, and is not contingent on
                      whether any underlying job is booked, completed, or paid for by a User.
                    </p>
                    <p className="mb-3">
                      "Gross Credit Revenue" means the gross amount paid by an Expert to NexaHome for a Credit Purchase,
                      excluding taxes, third-party payment processing fees, promotional credits, refunds, chargebacks, and the
                      value of any free, bonus, or comp Credits issued by NexaHome at no charge, unless NexaHome elects in
                      its discretion to calculate commissions on a different reasonable basis communicated to Partner in writing.
                    </p>
                    <p className="mb-3">
                      A "Credit Purchase" means any purchase of Credits by an Expert from NexaHome, whether single-purchase,
                      bundled, subscription-based, or otherwise. A Credit Purchase is "attributable to Partner" to
                      the extent that the Credits from that purchase are redeemed by the Expert to access Attributable Leads,
                      as determined by NexaHome's tracking system. If only a portion of a Credit Purchase is redeemed against
                      Attributable Leads, commission is calculated on a pro-rata basis tied to that portion. NexaHome may, in
                      its discretion, allocate revenue from bundles, subscriptions, or multi-use Credit packages on a fair and
                      consistent methodology communicated to Partner in writing.
                    </p>
                    <p className="mb-2">A "Qualifying Credit Purchase" means a Credit Purchase that meets all of the following:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>The Credits are redeemed by the Expert to access one or more Attributable Leads (i.e., leads generated by Referred Homeowners);</li>
                      <li>Payment for the Credit Purchase has been successfully received and cleared by NexaHome; and</li>
                      <li>The Credit Purchase is not subject to any dispute, chargeback, refund request, fraud flag, or other hold at the time of commission calculation.</li>
                    </ul>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">5. Payment Terms</h3>
                    <p className="mb-3">
                      Commissions on Qualifying Credit Purchases will be calculated on a quarterly basis (each, a "Commission
                      Cycle"). NexaHome will use commercially reasonable efforts to release earned and undisputed
                      commissions within fifteen (15) days after the close of each Commission Cycle.
                    </p>
                    <p className="mb-2">Notwithstanding the foregoing, NexaHome may, in its sole discretion:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-3">
                      <li>Delay payments for verification, fraud review, identity verification, or tax/regulatory compliance;</li>
                      <li>Offset against any commissions otherwise payable any losses, refunds, chargebacks, disputes, fees, taxes, or amounts owed by Partner to NexaHome; and</li>
                      <li>Suspend payouts to Partner while any account, transaction, or referral activity is under investigation.</li>
                    </ul>
                    <p>
                      Partner is responsible for providing accurate payment and tax information. NexaHome is not liable for
                      delays caused by incorrect, missing, or non-compliant payment or tax information provided by Partner.
                      Commissions below any minimum payout threshold communicated by NexaHome may be carried
                      forward to the next Commission Cycle.
                    </p>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">6. Strict No-Refund / Adjustment Policy</h3>
                    <p className="mb-3">
                      All Credit Purchases and other transactions processed through NexaHome are final. NexaHome
                      maintains a strict no-refund policy with respect to Credits, including unused Credits. Notwithstanding
                      that policy, NexaHome reserves the sole and absolute discretion to issue refunds, account credits, Credit
                      replacements, billing adjustments, or other make-goods in exceptional cases, including without
                      limitation cases involving disputes, fraud, defective leads, regulatory or legal requirements, or Expert or
                      User satisfaction decisions.
                    </p>
                    <p className="mb-2">
                      In any case where NexaHome issues such a refund, account credit, Credit replacement, or adjustment
                      with respect to a Credit Purchase on which Partner was paid or is owed a commission:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>The associated Partner commission will be reversed, withheld, or deducted on a pro-rata basis;</li>
                      <li>NexaHome may offset such amounts against current or future commissions or other amounts owed to Partner; and</li>
                      <li>If recoverable amounts exceed unpaid commissions, Partner agrees to repay NexaHome the difference promptly upon written request.</li>
                    </ul>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">7. Fraud & Abuse Protection</h3>
                    <p className="mb-2">Partner shall NOT, and shall not permit any of its personnel, affiliates, or downstream sub-referrers to:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-3">
                      <li>Generate fake, duplicate, fraudulent, automated, or otherwise misleading leads or accounts;</li>
                      <li>Manipulate the Credit, account-credit, lead-attribution, booking, or job system in any way, including through cookie stuffing, click fraud, fake service requests, lead recycling, or coordinating with Experts to inflate Credit consumption against Attributable Leads;</li>
                      <li>Incentivize Users or Experts in a manner that distorts genuine demand for leads, including by offering kickbacks, rebates, or undisclosed inducements that compromise the integrity of the referral or the Credit marketplace; or</li>
                      <li>Use spam, deceptive marketing, trademark bidding on NexaHome marks, or any other practice that violates applicable law or this Agreement.</li>
                    </ul>
                    <p>
                      NexaHome reserves the right, at its sole discretion and without liability, to: (a) reverse, withhold, or
                      recover any commissions associated with suspected fraud or abuse; (b) suspend or terminate Partner's
                      account and access to the Platform; and (c) pursue any other remedy available at law or in equity,
                      including legal action.
                    </p>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">8. Non-Circumvention</h3>
                    <p className="mb-2">During the term of this Agreement and for twenty-four (24) months thereafter, Partner agrees:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-3">
                      <li>Not to bypass, circumvent, or attempt to bypass NexaHome by directly connecting Referred Homeowners with Experts outside of the Platform, or by facilitating the sale or transfer of leads between Users and Experts outside of the Credit system; and</li>
                      <li>Not to replicate, imitate, reverse engineer, or build a competing product or service (including any competing lead-sale or credit-based marketplace) using NexaHome's confidential information, referred user data, Expert data, or insights derived from the Platform.</li>
                    </ul>
                    <p>
                      Any breach of this Section 8 will result in: (a) immediate termination of this Agreement; (b) forfeiture of
                      all unpaid commissions; and (c) NexaHome's right to pursue injunctive relief and any other legal or
                      equitable remedy, including damages and recovery of reasonable attorneys' fees.
                    </p>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">9. Ownership of Users & Data</h3>
                    <p>
                      As between the Parties, all Users, Experts, users, leads (including all Attributable Leads), Credits,
                      transaction and Credit-redemption history, behavioral data, and any other data generated by, collected
                      through, or associated with the Platform belong exclusively to NexaHome. Partner has no ownership,
                      license, or other right of any kind in or to such users, Credits, leads, or data, except for the limited right
                      to use the Referral Identifier solely as expressly contemplated by this Agreement.
                    </p>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">10. Intellectual Property</h3>
                    <p className="mb-3">
                      All NexaHome branding, names, logos, trademarks, service marks, trade dress, software, designs,
                      content, documentation, systems, and other materials (collectively, the "NexaHome IP") remain the
                      exclusive property of NexaHome and its licensors. NexaHome grants Partner a limited, revocable, non-exclusive,
                      non-transferable, non-sublicensable license to use the NexaHome IP solely as necessary to
                      perform Partner's obligations under this Agreement and only in accordance with NexaHome's brand and
                      usage guidelines as updated from time to time.
                    </p>
                    <p>
                      Partner shall not modify, adapt, translate, sublicense, sell, lease, distribute, or create derivative works of
                      the NexaHome IP, and shall not register or attempt to register any trademark, domain name, social
                      media handle, or other identifier confusingly similar to any NexaHome IP.
                    </p>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">11. Marketing Conduct</h3>
                    <p className="mb-2">In all marketing, communications, and outreach related to NexaHome, Partner shall:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Represent NexaHome and the Platform truthfully and accurately;</li>
                      <li>Avoid false, misleading, deceptive, or unsubstantiated claims, including any guarantees of outcomes, savings, pricing, or service quality not authorized by NexaHome;</li>
                      <li>Comply with all applicable laws and regulations, including without limitation those governing advertising, telemarketing, electronic communications (including the CAN-SPAM Act and TCPA, where applicable), consumer protection, privacy, and data protection; and</li>
                      <li>Promptly comply with any reasonable request from NexaHome to modify, cease, or correct any marketing material, channel, or claim.</li>
                    </ul>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">12. Limitation of Liability</h3>
                    <p className="uppercase text-sm font-semibold tracking-wide">
                      TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL NEXAHOME BE LIABLE
                      TO PARTNER OR ANY THIRD PARTY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                      EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOST PROFITS, LOST REVENUE, LOST BUSINESS, LOST
                      GOODWILL, LOST DATA, OR LOSS OF OPPORTUNITY, ARISING OUT OF OR RELATING TO THIS AGREEMENT
                      OR THE PLATFORM, EVEN IF NEXAHOME HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                      NEXAHOME'S TOTAL CUMULATIVE LIABILITY UNDER THIS AGREEMENT, REGARDLESS OF THE CAUSE OF
                      ACTION, SHALL NOT EXCEED THE TOTAL COMMISSIONS PAID OR PAYABLE TO PARTNER UNDER THIS
                      AGREEMENT IN THE SIX (6) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
                    </p>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">13. Termination</h3>
                    <p className="mb-2">
                      Either Party may terminate this Agreement for convenience upon thirty (30) days' prior written notice to
                      the other Party. NexaHome may terminate this Agreement immediately, without notice and without
                      liability, if:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-3">
                      <li>Fraud or abuse is detected or reasonably suspected;</li>
                      <li>Reputational, brand, or material business damage to NexaHome occurs or is reasonably likely to occur as a result of Partner's acts or omissions;</li>
                      <li>Partner breaches any term of this Agreement; or</li>
                      <li>Continued performance would, in NexaHome's reasonable judgment, violate applicable law or regulatory requirements.</li>
                    </ul>
                    <p>
                      Upon termination for any reason: (a) Partner's access to the Platform, the Referral Identifier, and the
                      NexaHome IP will be revoked immediately; (b) any unpaid commissions tied to fraud, breach,
                      chargebacks, or open investigations may be forfeited; and (c) Sections 6 through 10, 12, 14, 15, and 17
                      will survive termination.
                    </p>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">14. Confidentiality</h3>
                    <p className="mb-3">
                      "Confidential Information" means any non-public business, technical, financial, marketing, operational,
                      customer, or product information disclosed by NexaHome to Partner, whether disclosed orally, in writing,
                      electronically, or by inspection of tangible items, and whether or not marked as "confidential." Partner
                      shall (a) hold all Confidential Information in strict confidence; (b) use it solely to perform under this
                      Agreement; (c) protect it with at least the same degree of care it uses to protect its own similar
                      information, and in no event less than reasonable care; and (d) not disclose it to any third party without
                      NexaHome's prior written consent.
                    </p>
                    <p>
                      Partner's confidentiality obligations apply during the term of this Agreement and survive termination
                      indefinitely with respect to trade secrets, and for a period of five (5) years following termination with
                      respect to all other Confidential Information.
                    </p>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">15. Amendments</h3>
                    <p>
                      NexaHome may update or modify this Agreement at any time by posting the revised Agreement to the
                      Platform or otherwise providing notice to Partner. Material changes will be effective upon notice, and
                      Partner's continued participation in the program after the effective date of any update will constitute
                      acceptance of the updated Agreement. If Partner does not agree to an update, Partner's sole remedy is
                      to terminate this Agreement under Section 13.
                    </p>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">16. Governing Law</h3>
                    <p>
                      This Agreement shall be governed by and construed in accordance with the laws of the State of
                      Louisiana, United States of America, without regard to its conflict of laws principles. The Parties consent
                      to the exclusive jurisdiction and venue of the state and federal courts located in Louisiana for any dispute
                      arising out of or relating to this Agreement, except that NexaHome may seek injunctive or other
                      equitable relief in any court of competent jurisdiction to protect its intellectual property or Confidential
                      Information.
                    </p>
                  </div>


                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">17. Entire Agreement</h3>
                    <p>
                      This Agreement constitutes the entire agreement between the Parties with respect to its subject matter
                      and supersedes all prior or contemporaneous agreements, communications, proposals, and
                      understandings, whether oral or written. If any provision of this Agreement is held to be invalid or
                      unenforceable, that provision shall be modified to the minimum extent necessary to make it
                      enforceable, and the remaining provisions shall remain in full force and effect. No waiver of any
                      provision shall be effective unless in writing and signed by the waiving Party. Partner may not assign this
                      Agreement without NexaHome's prior written consent; NexaHome may assign this Agreement freely.
                    </p>
                  </div>

                  {/* <div className="mt-8 pt-8 border-t border-gray-200">
      <p className="mb-6 font-semibold">IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
        <div className="space-y-4">
          <h4 className="font-bold text-black uppercase">NEXAHOME</h4>
          <div className="border-b border-black w-full pt-4"></div>
          <p className="text-sm">Authorized Signature</p>
          
          <div className="flex items-center gap-2">
            <span className="font-medium w-16">Name:</span>
            <div className="border-b border-gray-400 flex-1 h-6"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium w-16">Title:</span>
            <div className="border-b border-gray-400 flex-1 h-6"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium w-16">Date:</span>
            <span className="flex-1">May 6, 2026</span>
          </div>
        </div>

      
        <div className="space-y-4">
          <h4 className="font-bold text-black uppercase">PARTNER</h4>
          <div className="border-b border-black w-full pt-4"></div>
          <p className="text-sm">Authorized Signature</p>
          
          <div className="flex items-center gap-2">
            <span className="font-medium w-32">Name:</span>
            <div className="border-b border-gray-400 flex-1 h-6"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium w-32">Title:</span>
            <div className="border-b border-gray-400 flex-1 h-6"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium w-32">Entity / Company:</span>
            <div className="border-b border-gray-400 flex-1 h-6"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium w-32">Address:</span>
            <div className="border-b border-gray-400 flex-1 h-6"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium w-32">Email:</span>
            <div className="border-b border-gray-400 flex-1 h-6"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium w-32">Date:</span>
            <div className="border-b border-gray-400 flex-1 h-6"></div>
          </div>
        </div>
      </div>
    </div> */}
                </div>
              </DialogDescription>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Button
                  type="button"
                  onClick={openUploadModal}
                  className="h-12 rounded-2xl bg-[rgba(0,88,100,0.06)] text-[16px] font-[700] text-[#005864] capitalize hover:bg-[rgba(0,88,100,0.12)]"
                >
                  Upload Image
                </Button>
                <Button
                  type="button"
                  onClick={openTypeModal}
                  className="h-12 rounded-2xl bg-[#005864] text-[16px] font-[700] text-white capitalize hover:bg-[#004852]"
                >
                  Type Signature
                </Button>
              </div>

              {(savedSignaturePreview || uploadedImagePreview) && (
                <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#CFE0E0] bg-[#F9FCFC] p-4 h-[120px]">
                  <span className="text-xs font-medium text-gray-500 mb-2">Signature Preview</span>
                  <img
                    src={savedSignaturePreview || uploadedImagePreview || ""}
                    alt="Signature Preview"
                    className="max-h-[70px] max-w-full object-contain"
                  />
                </div>
              )}

              <Button
                type="button"
                onClick={handleSubmitSignature}
                disabled={isSubmitting}
                className="mt-6 h-12 w-full rounded-2xl bg-[#005864] text-[16px] font-[700] text-white capitalize hover:bg-[#004852] flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit & Accept Agreement
              </Button>
            </>
          )}

          {currentScreen === 'upload' && (
            <>
              <DialogTitle className="text-[22px] font-[700] text-[#1A1A1A]">
                Upload Image
              </DialogTitle>
              <DialogDescription className="text-[15px] leading-7 text-[rgba(24,24,24,0.8)]">
                Select an image file, preview it, then click save.
              </DialogDescription>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelection}
              />

              <div className="mt-4 space-y-4">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 w-full rounded-2xl bg-[rgba(0,88,100,0.06)] text-[16px] font-[700] text-[#005864] hover:bg-[rgba(0,88,100,0.12)]"
                >
                  Choose Image
                </Button>
                <p className="text-center text-[13px] text-black/50 mt-1">
                  Allowed formats: JPG, PNG, JPEG
                </p>

                <div className="h-[250px] rounded-2xl border border-dashed border-[#CFE0E0] bg-[#F9FCFC] p-3">
                  {uploadedImagePreview ? (
                    <img
                      src={uploadedImagePreview}
                      alt="Selected upload preview"
                      className="h-full w-full rounded-xl object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      No image selected yet
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    onClick={() => setCurrentScreen('agreement')}
                    className="h-12 w-full rounded-2xl bg-[rgba(0,88,100,0.06)] text-[16px] font-[700] text-[#005864] hover:bg-[rgba(0,88,100,0.12)]"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveImage}
                    disabled={!uploadedImagePreview}
                    className="h-12 w-full rounded-2xl bg-[#005864] text-[16px] font-[700] text-white hover:bg-[#004852] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save Image
                  </Button>
                </div>
              </div>
            </>
          )}

          {currentScreen === 'type' && (
            <>
              <DialogTitle className="text-[22px] font-[700] text-[#1A1A1A]">
                Type Signature
              </DialogTitle>
              <DialogDescription className="text-[15px] leading-7 text-[rgba(24,24,24,0.8)]">
                Type your name below, choose cursive style, then click save.
              </DialogDescription>

              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  placeholder="Type your full name"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-[#CFE0E0] bg-[#F9FCFC] px-4 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#005864]"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    onClick={() => setCurrentScreen('agreement')}
                    className="h-12 w-full rounded-2xl bg-[rgba(0,88,100,0.06)] text-[16px] font-[700] text-[#005864] hover:bg-[rgba(0,88,100,0.12)]"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveTypedSignature}
                    disabled={!typedSignature.trim()}
                    className="h-12 w-full rounded-2xl bg-[#005864] text-[16px] font-[700] text-white hover:bg-[#004852] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save Signature
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
