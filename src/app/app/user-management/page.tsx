"use client";

import { UsersTable } from "./_components/users-table";

type UserRow = {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  userType: string;
  status: "Active" | "Inactive";
  avatar: string;
};

const userData: UserRow[] = [
  {
    id: 1,
    name: "Jack Martian",
    email: "jack.martin@gmail.com",
    joinDate: "09/09/2025",
    userType: "Expert",
    status: "Active",
    avatar: "JM",
  },
  {
    id: 2,
    name: "Lila Hudson",
    email: "lila.hudson@yahoo.com",
    joinDate: "01/01/2023",
    userType: "Partner",
    status: "Active",
    avatar: "LH",
  },
  {
    id: 3,
    name: "Marcus Lee",
    email: "marcus.lee@gmail.com",
    joinDate: "02/15/2023",
    userType: "Expert",
    status: "Inactive",
    avatar: "ML",
  },
  {
    id: 4,
    name: "Jack Martian",
    email: "jack.martin@gmail.com",
    joinDate: "09/09/2025",
    userType: "Expert",
    status: "Inactive",
    avatar: "JM",
  },
  {
    id: 5,
    name: "Sophie Turner",
    email: "sophie.turner@outlook.com",
    joinDate: "03/22/2024",
    userType: "Expert",
    status: "Active",
    avatar: "ST",
  },
  {
    id: 6,
    name: "Benny Rodriguez",
    email: "benny.rodriguez@aol.com",
    joinDate: "04/10/2024",
    userType: "Partner",
    status: "Inactive",
    avatar: "BR",
  },
  {
    id: 7,
    name: "Jack Martian",
    email: "jack.martin@gmail.com",
    joinDate: "09/09/2025",
    userType: "Expert",
    status: "Inactive",
    avatar: "JM",
  },
  {
    id: 8,
    name: "Sophie Turner",
    email: "sophie.turner@outlook.com",
    joinDate: "03/22/2024",
    userType: "Expert",
    status: "Active",
    avatar: "ST",
  },
  {
    id: 9,
    name: "Benny Rodriguez",
    email: "benny.rodriguez@aol.com",
    joinDate: "04/10/2024",
    userType: "Partner",
    status: "Inactive",
    avatar: "BR",
  },
];

/* ================= PAGE ================= */

export default function VerifiedExpertsPage() {
  return (
    <div className="min-h-screen bg-[#EAFCFF] px-0 font-sans">
      {/* Background Gradient Effect */}

      {/* Title */}
      <h1 className="heading text-[#1C1C1C] my-4 tracking-tight ">
        User Management
      </h1>

      {/* Table */}
      <div className="relative z-10">
        <UsersTable data={userData} />
      </div>
    </div>
  );
}
