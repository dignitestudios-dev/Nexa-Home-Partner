"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Filter,
  Search,
  Upload,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CsvUser = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  category: string;
  avatar: string;
  createdAt: string;
};

const categories = ["Category A", "Category B", "Category C", "Category D", "Category E", "Category F"];
const ITEMS_PER_PAGE = 10;

const csvRows: CsvUser[] = Array.from({ length: 12 }, (_, index) => {
  const category = categories[index % categories.length];
  const day = String(10 + index).padStart(2, "0");
  return {
    id: String(index + 1).padStart(2, "0"),
    name: `Jack Martian ${index + 1}`,
    email: `jack${index + 1}.martian@gmail.com`,
    phoneNumber: `+1 987 9809 ${String(9800 + index).slice(-4)}`,
    category,
    avatar: `https://i.pravatar.cc/86?img=${10 + index}`,
    createdAt: `2025-12-${day}`,
  };
});

export default function CsvUploadPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingCategories, setPendingCategories] = useState<string[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isUploadSuccessOpen, setIsUploadSuccessOpen] = useState(false);
  const [pendingCsvFile, setPendingCsvFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const openFilterDrawer = () => {
    setPendingCategories(appliedCategories);
    setIsFilterOpen(true);
  };

  const filteredRows = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return csvRows.filter((row) => {
      const matchesSearch =
        query.length === 0 ||
        row.name.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query) ||
        row.phoneNumber.toLowerCase().includes(query);

      if (!matchesSearch) return false;
      if (selectedDate && row.createdAt !== selectedDate) return false;
      if (appliedCategories.length > 0 && !appliedCategories.includes(row.category)) return false;
      return true;
    });
  }, [searchValue, selectedDate, appliedCategories]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = filteredRows.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, selectedDate, appliedCategories]);

  return (
    <div className="relative min-h-screen overflow-hidden rounded-[50px] bg-[#EAFCFF] p-6">
      
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[30px] leading-[45px] font-[600] text-[#1A1A1A] mb-6">CSV Upload</h1>

        <button
          type="button"
          onClick={() => setIsCsvModalOpen(true)}
          className="inline-flex h-[38px] items-center gap-2 rounded-[12px] bg-[#005864] px-4 text-[14px] font-semibold text-white"
        >
          <Upload size={16} />
          CSV Upload
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
        <div className="flex h-11 w-[322px] items-center justify-between rounded-[22px] bg-white px-4 shadow-[0px_4px_45.9px_6px_rgba(0,88,100,0.08)]">
          <input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search here"
            className="w-full bg-transparent text-[14px] text-black/80 placeholder:text-black/60 focus:outline-none"
          />
          <Search size={20} className="text-black/80" />
        </div>

        <label className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[10px] bg-[#005864] text-white shadow-[0px_4px_45.9px_6px_rgba(0,88,100,0.08)]">
          <Calendar size={20} />
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>

        <button
          type="button"
          onClick={openFilterDrawer}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#005864] text-white shadow-[0px_4px_45.9px_6px_rgba(0,88,100,0.08)]"
        >
          <Filter size={20} />
        </button>
      </div>

      {uploadedFileName ? (
        <p className="mt-3 text-[13px] text-[#005864]">Uploaded: {uploadedFileName}</p>
      ) : null}

      <section className="mt-4 rounded-[24px] bg-white">
        <div className="grid h-[57px] grid-cols-[1.3fr_1.4fr_1fr] items-center rounded-t-[24px] bg-[#005864]/[0.06] px-8 text-[14px] font-medium text-black">
          <span>Name</span>
          <span>Email</span>
          <span>Phone Number</span>
        </div>

        <div className="px-8 py-4">
          {paginatedRows.map((row, index) => (
            <div
              key={row.id}
              className={`grid grid-cols-[1.3fr_1.4fr_1fr] items-center py-4 ${
                index !== paginatedRows.length - 1 ? "border-b border-[rgba(238,238,238,0.93)]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={row.avatar} alt={row.name} className="h-[43px] w-[43px] rounded-full object-cover" />
                <span className="text-[16px] text-black">{row.name}</span>
              </div>
              <span className="text-[16px] text-black">{row.email}</span>
              <span className="text-[16px] text-black">{row.phoneNumber}</span>
            </div>
          ))}

          {filteredRows.length === 0 ? (
            <p className="py-14 text-center text-[15px] text-black/60">No records found for the selected filters.</p>
          ) : null}
        </div>
      </section>

      <div className="mt-6 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={safePage === 1}
          className="h-12 w-12 rounded-full bg-[#005864]/[0.06] text-[#005864] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="mx-auto" size={20} />
        </button>
        <div className="rounded-full bg-[#F9FAFA] px-8 py-3 text-[16px] leading-5 font-medium text-black">
          {String(safePage).padStart(2, "0")}
        </div>
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={safePage === totalPages}
          className="h-12 w-12 rounded-full bg-[#005864] text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="mx-auto" size={20} />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          isFilterOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsFilterOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-[390px] bg-white shadow-2xl transition-transform duration-300 ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#EEEEEE] px-5 py-4">
          <h3 className="text-[22px] font-semibold text-[#1C1C1C]">Filters</h3>
          <button
            type="button"
            onClick={() => setIsFilterOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#005864] text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-[calc(100%-158px)] overflow-y-auto px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[20px] font-semibold text-black">Category</span>
            <button
              type="button"
              onClick={() => setPendingCategories([])}
              className="text-[14px] font-medium text-[#005864] underline"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-3">
            {categories.map((category) => {
              const isChecked = pendingCategories.includes(category);
              return (
                <label key={category} className="flex cursor-pointer items-center gap-3 text-[15px] text-black">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(event) => {
                      setPendingCategories((current) => {
                        if (event.target.checked) return [...current, category];
                        return current.filter((item) => item !== category);
                      });
                    }}
                    className="h-5 w-5 rounded-[4px] border border-[#181818CC] accent-[#005864]"
                  />
                  {category}
                </label>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-[#EEEEEE] p-5">
          <button
            type="button"
            onClick={() => {
              setPendingCategories([]);
              setAppliedCategories([]);
              setIsFilterOpen(false);
            }}
            className="h-11 rounded-[12px] bg-[#005864]/[0.06] text-[14px] font-medium text-[#005864]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setAppliedCategories(pendingCategories);
              setIsFilterOpen(false);
            }}
            className="h-11 rounded-[12px] bg-[#005864] text-[14px] font-medium text-white"
          >
            Apply
          </button>
        </div>
      </aside>

      <Dialog
        open={isCsvModalOpen}
        onOpenChange={(open) => {
          setIsCsvModalOpen(open);
          if (!open) setPendingCsvFile(null);
        }}
      >
        <DialogContent showCloseButton={false} className="max-w-[525px] rounded-[12px] p-0">
          <DialogHeader className="px-10 pb-4 pt-8">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-[24px] font-bold tracking-[-0.018em] text-[#181818]">
                Upload CSV
              </DialogTitle>
              <DialogClose asChild>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#181818]/20 text-[#181818]/80"
                >
                  <X size={18} />
                </button>
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="px-10">
            <label className="flex h-[151px] cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-[#005864] bg-[#F8F8F8]">
              <Upload size={30} className="text-[#181818]/80" />
              <span className="mt-3 text-[15px] font-medium text-[#1C1C1C]">Upload CSV</span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(event) => setPendingCsvFile(event.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <div className="px-10 pb-5 pt-4">
            {pendingCsvFile ? (
              <div className="relative h-[103px] w-[100px] rounded-[12px] bg-[#F8F8F8]">
                <button
                  type="button"
                  onClick={() => setPendingCsvFile(null)}
                  className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
                >
                  <X size={14} />
                </button>
                <div className="flex h-full flex-col items-center justify-center gap-2 px-2 text-center">
                  <FileSpreadsheet size={38} className="text-black" />
                  <p className="line-clamp-2 text-[10px] font-medium text-[#1C1C1C]">
                    {pendingCsvFile.name}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="px-10 pb-10">
            <button
              type="button"
              disabled={!pendingCsvFile}
              onClick={() => {
                if (!pendingCsvFile) return;
                setUploadedFileName(pendingCsvFile.name);
                setIsCsvModalOpen(false);
                setPendingCsvFile(null);
                setIsUploadSuccessOpen(true);
              }}
              className="h-12 w-full rounded-[12px] bg-[#005864] text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Upload
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isUploadSuccessOpen} onOpenChange={setIsUploadSuccessOpen}>
        <DialogContent showCloseButton={false} className="max-w-[515px] rounded-[24px] p-0">
          <div className="relative px-8 pb-10 pt-6">
            <DialogClose asChild>
              <button
                type="button"
                className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#181818]/20 text-[#181818]"
              >
                <X size={18} />
              </button>
            </DialogClose>

            <div className="mt-7 flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(136.41deg,#005864_39.74%,#D7DF23_307.09%)]">
                <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" fill="none" aria-hidden="true">
                  <path d="M5 13L10 18L19 7" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h3 className="mt-8 text-center text-[32px] font-semibold leading-10 tracking-[-0.008em] text-[#1C1C1C]">
                CSV Uploaded
              </h3>
              <p className="mt-4 text-center text-[18px] leading-[23px] text-[#181818]/80">
                File has been uploaded successfully.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

