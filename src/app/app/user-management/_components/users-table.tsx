import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

type UserRow = {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  userType: string;
  status: "Active" | "Inactive";
  avatar: string;
};

type UsersTableProps = {
  data: UserRow[];
};

export const UsersTable = ({ data }: UsersTableProps) => {
  const router = useRouter();
  return (
    <div className="rounded-3xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="font-light">
            <TableHead className="rounded-l-3xl">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="rounded-r-3xl">Active / Inactive</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((user, index) => (
            <TableRow
              onClick={() =>
                router.push(`/app/user-management/user-details/${user.id}`)
              }
              key={index}
              className="font-normal cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {/* Name */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-[#212121] text-white font-medium text-[12px]">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <span>{user.name}</span>
                </div>
              </TableCell>

              {/* Email */}
              <TableCell>{user.email}</TableCell>

              {/* Join Date */}
              <TableCell>{user.joinDate}</TableCell>

              {/* User Type */}
              <TableCell>{user.userType}</TableCell>

              {/* Status */}
              <TableCell>
                <span
                  className={`font-medium ${
                    user.status === "Active"
                      ? "text-[#16BC4E]"
                      : "text-[#FF0000]"
                  }`}
                >
                  {user.status}
                </span>
              </TableCell>

              {/* Active / Inactive Toggle Text */}
              <TableCell>
                <span
                  className={`text-sm font-medium ${
                    user.status === "Active"
                      ? "text-[#16BC4E]"
                      : "text-[#FF0000]"
                  }`}
                >
                  {user.status === "Active" ? "Active" : "Inactive"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
