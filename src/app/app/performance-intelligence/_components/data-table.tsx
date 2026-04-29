"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PerformanceIntelligence() {
  // ✅ dummy loading
  const [loading] = useState(false);

  // ✅ dummy data
  const jobCategories = [
    {
      _id: "1",
      rank: "01",
      name: "Baby Sitting",
      totalRequests: 98,
      revenueGenerated: "$45,897",
    },
    {
      _id: "2",
      rank: "02",
      name: "House Cleaning",
      totalRequests: 76,
      revenueGenerated: "$32,450",
    },
    {
      _id: "3",
      rank: "03",
      name: "Pet Care",
      totalRequests: 65,
      revenueGenerated: "$28,900",
    },
    {
      _id: "4",
      rank: "04",
      name: "Gardening",
      totalRequests: 54,
      revenueGenerated: "$24,100",
    },
    {
      _id: "5",
      rank: "05",
      name: "Cooking",
      totalRequests: 43,
      revenueGenerated: "$19,750",
    },
    {
      _id: "6",
      rank: "06",
      name: "Elderly Care",
      totalRequests: 38,
      revenueGenerated: "$17,200",
    },
    {
      _id: "7",
      rank: "07",
      name: "Tutoring",
      totalRequests: 32,
      revenueGenerated: "$14,500",
    },
    {
      _id: "8",
      rank: "08",
      name: "Personal Training",
      totalRequests: 28,
      revenueGenerated: "$12,800",
    },
    {
      _id: "9",
      rank: "09",
      name: "Event Planning",
      totalRequests: 24,
      revenueGenerated: "$11,200",
    },
    {
      _id: "1",
      rank: "01",
      name: "Baby Sitting",
      totalRequests: 98,
      revenueGenerated: "$45,897",
    },
    {
      _id: "2",
      rank: "02",
      name: "House Cleaning",
      totalRequests: 76,
      revenueGenerated: "$32,450",
    },
    {
      _id: "3",
      rank: "03",
      name: "Pet Care",
      totalRequests: 65,
      revenueGenerated: "$28,900",
    },
    {
      _id: "4",
      rank: "04",
      name: "Gardening",
      totalRequests: 54,
      revenueGenerated: "$24,100",
    },
    {
      _id: "5",
      rank: "05",
      name: "Cooking",
      totalRequests: 43,
      revenueGenerated: "$19,750",
    },
    {
      _id: "6",
      rank: "06",
      name: "Elderly Care",
      totalRequests: 38,
      revenueGenerated: "$17,200",
    },
    {
      _id: "7",
      rank: "07",
      name: "Tutoring",
      totalRequests: 32,
      revenueGenerated: "$14,500",
    },
    {
      _id: "8",
      rank: "08",
      name: "Personal Training",
      totalRequests: 28,
      revenueGenerated: "$12,800",
    },
    {
      _id: "9",
      rank: "09",
      name: "Event Planning",
      totalRequests: 24,
      revenueGenerated: "$11,200",
    },
    {
      _id: "1",
      rank: "01",
      name: "Baby Sitting",
      totalRequests: 98,
      revenueGenerated: "$45,897",
    },
    {
      _id: "2",
      rank: "02",
      name: "House Cleaning",
      totalRequests: 76,
      revenueGenerated: "$32,450",
    },
    {
      _id: "3",
      rank: "03",
      name: "Pet Care",
      totalRequests: 65,
      revenueGenerated: "$28,900",
    },
    {
      _id: "4",
      rank: "04",
      name: "Gardening",
      totalRequests: 54,
      revenueGenerated: "$24,100",
    },
    {
      _id: "5",
      rank: "05",
      name: "Cooking",
      totalRequests: 43,
      revenueGenerated: "$19,750",
    },
    {
      _id: "6",
      rank: "06",
      name: "Elderly Care",
      totalRequests: 38,
      revenueGenerated: "$17,200",
    },
    {
      _id: "7",
      rank: "07",
      name: "Tutoring",
      totalRequests: 32,
      revenueGenerated: "$14,500",
    },
    {
      _id: "8",
      rank: "08",
      name: "Personal Training",
      totalRequests: 28,
      revenueGenerated: "$12,800",
    },
    {
      _id: "9",
      rank: "09",
      name: "Event Planning",
      totalRequests: 24,
      revenueGenerated: "$11,200",
    },
    {
      _id: "1",
      rank: "01",
      name: "Baby Sitting",
      totalRequests: 98,
      revenueGenerated: "$45,897",
    },
    {
      _id: "2",
      rank: "02",
      name: "House Cleaning",
      totalRequests: 76,
      revenueGenerated: "$32,450",
    },
    {
      _id: "3",
      rank: "03",
      name: "Pet Care",
      totalRequests: 65,
      revenueGenerated: "$28,900",
    },
    {
      _id: "4",
      rank: "04",
      name: "Gardening",
      totalRequests: 54,
      revenueGenerated: "$24,100",
    },
    {
      _id: "5",
      rank: "05",
      name: "Cooking",
      totalRequests: 43,
      revenueGenerated: "$19,750",
    },
    {
      _id: "6",
      rank: "06",
      name: "Elderly Care",
      totalRequests: 38,
      revenueGenerated: "$17,200",
    },
    {
      _id: "7",
      rank: "07",
      name: "Tutoring",
      totalRequests: 32,
      revenueGenerated: "$14,500",
    },
    {
      _id: "8",
      rank: "08",
      name: "Personal Training",
      totalRequests: 28,
      revenueGenerated: "$12,800",
    },
    {
      _id: "9",
      rank: "09",
      name: "Event Planning",
      totalRequests: 24,
      revenueGenerated: "$11,200",
    },
  ];

  return (
    <div className="">
      <div className=" rounded-3xl overflow-hidden ">
        <Table className="">
          {/* HEADER */}
          <TableHeader className="  ">
            <TableRow className="">
              <TableHead className=" rounded-l-3xl   ">Rank</TableHead>
              <TableHead className="   ">Job Category</TableHead>
              <TableHead className="  ">Total Requests</TableHead>
              <TableHead className=" rounded-r-3xl ">
                Revenue Generated
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody className="">
            {loading ? (
              <TableRow className="">
                <TableCell className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : jobCategories.length ? (
              jobCategories.map((category) => (
                <TableRow key={category._id} className="">
                  <TableCell className="font-medium  ">
                    {category.rank}
                  </TableCell>

                  <TableCell className="capitalize">{category.name}</TableCell>

                  <TableCell>{category.totalRequests}</TableCell>

                  <TableCell className="font-semibold ">
                    {category.revenueGenerated}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No job categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION (STATIC UI) */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Items per page:</span>

          <select value={10} className="border rounded px-2 py-1 text-sm">
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>

          <span className="text-sm font-medium">Page 1 of 1</span>

          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
