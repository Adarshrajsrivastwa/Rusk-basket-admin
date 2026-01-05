import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Eye,
  Printer,
  Calendar,
  ChevronDown,
  Search,
  Filter,
  X,
  FileText,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const InvoicePage = () => {
  const navigate = useNavigate();
  const highlightRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const [selectedVendor, setSelectedVendor] = useState("all");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setInvoices([
        {
          id: "INV001",
          invoiceNumber: "RUSH-INV-2025-001",
          date: "2025-08-23",
          vendor: "Abnish Kumar",
          user: "NK Yadav",
          orderId: "RUSH8038403",
          amount: 5222,
          payment: "COD",
          status: "Paid",
        },
        {
          id: "INV002",
          invoiceNumber: "RUSH-INV-2025-002",
          date: "2025-09-27",
          vendor: "Mathura",
          user: "Anish Kumar",
          orderId: "RUSH09401",
          amount: 124,
          payment: "COD",
          status: "Pending",
        },
        {
          id: "INV003",
          invoiceNumber: "RUSH-INV-2025-003",
          date: "2025-09-28",
          vendor: "Mathura",
          user: "Anish Kumar",
          orderId: "RUSH09402",
          amount: 230,
          payment: "Prepaid",
          status: "Paid",
        },
        {
          id: "INV004",
          invoiceNumber: "RUSH-INV-2025-004",
          date: "2025-09-29",
          vendor: "Mathura",
          user: "Anish Kumar",
          orderId: "RUSH09403",
          amount: 450,
          payment: "COD",
          status: "Paid",
        },
        {
          id: "INV005",
          invoiceNumber: "RUSH-INV-2025-005",
          date: "2025-09-30",
          vendor: "Mathura",
          user: "Anish Kumar",
          orderId: "RUSH09404",
          amount: 350,
          payment: "Prepaid",
          status: "Cancelled",
        },
        {
          id: "INV006",
          invoiceNumber: "RUSH-INV-2025-006",
          date: "2025-10-01",
          vendor: "Abnish Kumar",
          user: "Anish Kumar",
          orderId: "RUSH09405",
          amount: 400,
          payment: "COD",
          status: "Pending",
        },
        {
          id: "INV007",
          invoiceNumber: "RUSH-INV-2025-007",
          date: "2025-10-02",
          vendor: "Mathura",
          user: "Anish Kumar",
          orderId: "RUSH09406",
          amount: 280,
          payment: "Prepaid",
          status: "Paid",
        },
        {
          id: "INV008",
          invoiceNumber: "RUSH-INV-2025-008",
          date: "2025-10-03",
          vendor: "Mathura",
          user: "Anish Kumar",
          orderId: "RUSH09407",
          amount: 500,
          payment: "COD",
          status: "Paid",
        },
        {
          id: "INV009",
          invoiceNumber: "RUSH-INV-2025-009",
          date: "2025-10-04",
          vendor: "Abnish Kumar",
          user: "Anish Kumar",
          orderId: "RUSH09408",
          amount: 320,
          payment: "Prepaid",
          status: "Cancelled",
        },
        {
          id: "INV010",
          invoiceNumber: "RUSH-INV-2025-010",
          date: "2025-10-05",
          vendor: "Mathura",
          user: "Anish Kumar",
          orderId: "RUSH09409",
          amount: 150,
          payment: "COD",
          status: "Pending",
        },
        {
          id: "INV011",
          invoiceNumber: "RUSH-INV-2025-011",
          date: "2025-10-06",
          vendor: "Mathura",
          user: "Anish Kumar",
          orderId: "RUSH09410",
          amount: 270,
          payment: "Prepaid",
          status: "Paid",
        },
        {
          id: "INV012",
          invoiceNumber: "RUSH-INV-2025-012",
          date: "2025-10-07",
          vendor: "Abnish Kumar",
          user: "Anish Kumar",
          orderId: "RUSH09411",
          amount: 480,
          payment: "COD",
          status: "Paid",
        },
        {
          id: "INV013",
          invoiceNumber: "RUSH-INV-2025-013",
          date: "2025-10-08",
          vendor: "Mathura",
          user: "Raj Kumar",
          orderId: "RUSH09412",
          amount: 650,
          payment: "Prepaid",
          status: "Paid",
        },
        {
          id: "INV014",
          invoiceNumber: "RUSH-INV-2025-014",
          date: "2025-10-09",
          vendor: "Abnish Kumar",
          user: "Priya Singh",
          orderId: "RUSH09413",
          amount: 890,
          payment: "COD",
          status: "Pending",
        },
      ]);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const vendors = ["all", ...new Set(invoices.map((inv) => inv.vendor))];

  const statusColors = {
    Paid: "bg-green-50 text-green-700 border-green-300",
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-300",
    Cancelled: "bg-red-50 text-red-700 border-red-300",
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesVendor =
      selectedVendor === "all" || invoice.vendor === selectedVendor;
    const matchesPayment =
      selectedPaymentMode === "all" || invoice.payment === selectedPaymentMode;
    const invoiceDate = new Date(invoice.date);
    const matchesStartDate = !startDate || invoiceDate >= new Date(startDate);
    const matchesEndDate = !endDate || invoiceDate <= new Date(endDate);
    const matchesSearch =
      !searchQuery ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    return (
      matchesVendor &&
      matchesPayment &&
      matchesStartDate &&
      matchesEndDate &&
      matchesSearch
    );
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedVendor, selectedPaymentMode, startDate, endDate, searchQuery]);

  const handleClearFilters = () => {
    setSelectedVendor("all");
    setSelectedPaymentMode("all");
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleViewInvoice = (invoiceId) => {
    const invoiceData = invoices.find((inv) => inv.id === invoiceId);
    if (invoiceData) {
      navigate("/invoice/view", {
        state: { invoice: invoiceData },
        replace: false,
      });
    }
  };

  // Calculate stats
  const totalAmount = filteredInvoices.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );
  const paidInvoices = filteredInvoices.filter(
    (inv) => inv.status === "Paid"
  ).length;
  const pendingInvoices = filteredInvoices.filter(
    (inv) => inv.status === "Pending"
  ).length;

  const activeFiltersCount = [
    selectedVendor !== "all",
    selectedPaymentMode !== "all",
    startDate,
    endDate,
    searchQuery,
  ].filter(Boolean).length;

  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: itemsPerPage }).map((_, idx) => (
        <tr key={idx} className="animate-pulse border-b border-gray-100">
          {Array.from({ length: 10 }).map((__, j) => (
            <td key={j} className="p-4">
              <div className="h-4 bg-gray-200 rounded w-[80%]" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  const EmptyState = () => (
    <tbody>
      <tr>
        <td colSpan="10" className="text-center py-16">
          <div className="flex flex-col items-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              No invoices found
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your filters
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white p-0 ml-6">
        <div className="max-w-[100%] mx-auto">
          <div className="mb-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-sm p-6 shadow-md border-2 border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                      Total Invoices
                    </p>
                    <p className="text-3xl font-bold text-black mt-2">
                      {filteredInvoices.length}
                    </p>
                  </div>
                  <div className="bg-[#FF7B1D] p-4 rounded-sm shadow-md">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-sm p-6 shadow-md border-2 border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                      Total Amount
                    </p>
                    <p className="text-3xl font-bold text-black mt-2">
                      ₹{totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-[#FF7B1D] p-4 rounded-sm shadow-md">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-sm p-6 shadow-md border-2 border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                      Paid / Pending
                    </p>
                    <p className="text-3xl font-bold text-black mt-2">
                      {paidInvoices} / {pendingInvoices}
                    </p>
                  </div>
                  <div className="bg-[#FF7B1D] p-4 rounded-sm shadow-md">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="bg-white rounded-sm shadow-md p-6 mb-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="bg-[#FF7B1D] p-2 rounded-lg">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-xl text-black">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#FF7B1D] text-white text-xs px-3 py-1.5 rounded-sm font-bold shadow-md">
                    {activeFiltersCount} active
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-red-600 hover:text-white hover:bg-red-600 text-sm font-bold flex items-center gap-2 transition-all px-4 py-2 rounded-sm border-2 border-red-600"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 transition-all bg-white text-black"
                  />
                  <Calendar className="absolute right-3 top-3 w-4 h-4 text-[#FF7B1D] pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 transition-all bg-white text-black"
                  />
                  <Calendar className="absolute right-3 top-3 w-4 h-4 text-[#FF7B1D] pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                  Vendor
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-sm text-sm text-left focus:outline-none focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 bg-white flex items-center justify-between transition-all hover:border-[#FF7B1D]"
                  >
                    <span className="truncate font-semibold text-black">
                      {selectedVendor === "all"
                        ? "All Vendors"
                        : selectedVendor}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#FF7B1D] transition-transform ${
                        showVendorDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showVendorDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-sm shadow-2xl max-h-48 overflow-y-auto">
                      {vendors.map((vendor) => (
                        <button
                          key={vendor}
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setShowVendorDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-orange-50 transition font-semibold text-black hover:text-[#FF7B1D]"
                        >
                          {vendor === "all" ? "All Vendors" : vendor}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                  Payment Mode
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-sm text-sm text-left focus:outline-none focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 bg-white flex items-center justify-between transition-all hover:border-[#FF7B1D]"
                  >
                    <span className="truncate font-semibold text-black">
                      {selectedPaymentMode === "all"
                        ? "All Modes"
                        : selectedPaymentMode}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#FF7B1D] transition-transform ${
                        showPaymentDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showPaymentDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-sm shadow-2xl">
                      {["all", "COD", "Prepaid"].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => {
                            setSelectedPaymentMode(mode);
                            setShowPaymentDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-orange-50 transition font-semibold text-black hover:text-[#FF7B1D]"
                        >
                          {mode === "all" ? "All Modes" : mode}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Invoice Number, Order ID, User, or Vendor..."
                  className="w-full pr-11 pl-4 py-3 border-2 border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 transition-all bg-white text-black placeholder-gray-400"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF7B1D] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-sm shadow-xl overflow-hidden border-2 border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#FF7B1D] text-white">
                    <th className="p-4 text-left font-bold">S.N</th>
                    <th className="p-4 text-left font-bold">Invoice Number</th>
                    <th className="p-4 text-left font-bold">Date</th>
                    <th className="p-4 text-left font-bold">Order ID</th>
                    <th className="p-4 text-left font-bold">Vendor</th>
                    <th className="p-4 text-left font-bold">User Name</th>
                    <th className="p-4 text-left font-bold">Amount</th>
                    <th className="p-4 text-left font-bold">Payment</th>
                    <th className="p-4 text-left font-bold">Status</th>
                    <th className="p-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>

                {loading ? (
                  <TableSkeleton />
                ) : filteredInvoices.length === 0 ? (
                  <EmptyState />
                ) : (
                  <tbody>
                    {currentInvoices.map((invoice, idx) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-gray-50 transition-all border-b border-gray-200 group"
                      >
                        <td className="p-4 text-black font-semibold">
                          {indexOfFirst + idx + 1}
                        </td>
                        <td className="p-4 font-bold text-[#FF7B1D]">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="p-4 text-black font-medium">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="p-4">
                          <span className="text-[#FF7B1D] font-bold  cursor-pointer">
                            {invoice.orderId}
                          </span>
                        </td>
                        <td className="p-4 text-black font-semibold">
                          {invoice.vendor}
                        </td>
                        <td className="p-4 text-black font-medium">
                          {invoice.user}
                        </td>
                        <td className="p-4 font-bold text-black">
                          ₹{invoice.amount.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1.5 rounded-sm text-xs font-bold shadow-sm ${
                              invoice.payment === "COD"
                                ? "bg-[#FF7B1D] text-white"
                                : "bg-green-500 text-white"
                            }`}
                          >
                            {invoice.payment}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1.5 rounded-sm text-xs font-bold border-2 ${
                              statusColors[invoice.status]
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-end">
                            <button
                              title="Download"
                              className="p-2.5 text-[#FF7B1D] hover:bg-gray-100 rounded-sm transition-all hover:scale-110 border-2 border-transparent "
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              title="View"
                              onClick={() => handleViewInvoice(invoice.id)}
                              className="p-2.5 text-[#FF7B1D] hover:bg-orange-100 rounded-sm transition-all hover:scale-110 border-2 border-transparent "
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              title="Print"
                              className="p-2.5 text-[#FF7B1D] hover:bg-orange-100 rounded-sm transition-all hover:scale-110 border-2 border-transparent "
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>

          {/* Pagination */}
          {!loading && filteredInvoices.length > 0 && (
            <div className="flex justify-between items-center mt-6 bg-white rounded-sm shadow-md p-5 border-2 border-gray-200">
              <div className="text-sm text-black font-medium">
                Showing{" "}
                <span className="font-bold text-[#FF7B1D]">
                  {indexOfFirst + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-[#FF7B1D]">
                  {Math.min(indexOfLast, filteredInvoices.length)}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#FF7B1D]">
                  {filteredInvoices.length}
                </span>{" "}
                invoices
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-[#FF7B1D] hover:bg-[#E66A0D]  disabled:cursor-not-allowed text-white px-6 py-2.5 text-sm font-bold rounded-sm transition-all hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  Back
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-sm text-sm font-bold transition-all ${
                          currentPage === page
                            ? " text-black shadow-lg scale-110"
                            : "text-black bg-white hover:bg-orange-50 border-2 border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="bg-[#247606]  disabled:cursor-not-allowed text-white px-6 py-2.5 text-sm font-bold rounded-sm transition-all hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvoicePage;
