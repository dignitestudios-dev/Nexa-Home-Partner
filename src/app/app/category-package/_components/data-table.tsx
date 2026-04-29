"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DataTable() {
    return (
        <div>
          <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Package</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Package</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
          </div>
        </div>
    );
}