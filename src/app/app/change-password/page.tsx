"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";

export default function AppChangePasswordPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password must match.");
      return;
    }

    // TODO: Connect with backend update password API.
    setMessage("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-[calc(100vh-180px)] rounded-[32px] bg-[#EAFCFF] p-6">
      <div className="mx-auto w-full max-w-[760px] rounded-[24px] bg-white p-8 shadow-[0px_4px_45.9px_6px_rgba(0,88,100,0.08)]">
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#005864]/10 text-[#005864]">
            <KeyRound size={20} />
          </span>
          <div>
            <h1 className="text-[30px] font-bold text-[#1C1C1C]">Change Password</h1>
            <p className="text-[14px] text-black/70">
              Keep your account secure by using a strong password.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#1C1C1C]">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Enter current password"
                className="h-12 w-full rounded-[12px] bg-[#F8F8F8] px-4 pr-12 text-[15px] text-[#181818] placeholder:text-[#181818]/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#181818]/60"
              >
                {showCurrentPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#1C1C1C]">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter new password"
                className="h-12 w-full rounded-[12px] bg-[#F8F8F8] px-4 pr-12 text-[15px] text-[#181818] placeholder:text-[#181818]/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#181818]/60"
              >
                {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#1C1C1C]">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm new password"
                className="h-12 w-full rounded-[12px] bg-[#F8F8F8] px-4 pr-12 text-[15px] text-[#181818] placeholder:text-[#181818]/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#181818]/60"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {message ? <p className="text-sm text-[#005864]">{message}</p> : null}

          <button
            type="submit"
            className="mt-2 h-12 w-full rounded-[12px] bg-[#005864] text-[15px] font-semibold text-white hover:opacity-95"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

