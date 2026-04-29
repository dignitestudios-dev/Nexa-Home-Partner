import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ExpertRow = {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  badgePurchaseDate: string;
  status: "Active" | "Inactive";
  avatar: string;
};

type ExpertTableProps = {
  data: ExpertRow[];
};

export const ExpertTable = ({ data }: ExpertTableProps) => (
  <div className="rounded-3xl overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="font-light">
          <TableHead className="rounded-l-3xl">Expert Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Join Date</TableHead>
          <TableHead>Badge Purchased Date</TableHead>
          <TableHead className="rounded-r-3xl">Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((expert, index) => (
          <TableRow key={index} className="font-normal">
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={expert.name} />
                  <AvatarFallback className="bg-[#212121] text-white font-medium text-[12px]">
                    {expert.avatar}
                  </AvatarFallback>
                </Avatar>
                <span>{expert.name}</span>
              </div>
            </TableCell>
            <TableCell>{expert.email}</TableCell>
            <TableCell>{expert.joinDate}</TableCell>
            <TableCell>{expert.badgePurchaseDate}</TableCell>
            <TableCell className="">
              <span
                className={` ${
                  expert.status === "Active"
                    ? "text-[#16BC4E]"
                    : "text-[#FF0000]"
                }`}
              >
                {expert.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
