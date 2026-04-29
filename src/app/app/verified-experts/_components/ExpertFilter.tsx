import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export const ExpertFilter = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className="bg-[#005864] hover:bg-[#004750] text-white w-10 h-10 p-0 rounded-lg shadow-sm focus-visible:ring-0 transition-colors">
        <Filter size={18} />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="w-48 rounded-xl border-none shadow-lg"
    >
      <DropdownMenuItem className="cursor-pointer">
        All Experts
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer">
        Active Only
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer">
        Inactive Only
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
