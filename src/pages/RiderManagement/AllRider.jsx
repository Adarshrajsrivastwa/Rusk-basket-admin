import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  CheckCircle,
  XCircle,
  Eye,
  User,
  FileText,
  Car,
  CreditCard,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  Clock,
  Shield,
  Download,
  AlertCircle,
  CheckSquare,
} from "lucide-react";

// Mock DashboardLayout

const RiderManagement = () => {
  const [riders, setRiders] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 9876543210",
      dob: "1995-03-15",
      age: 29,
      gender: "Male",
      fatherName: "Ram Kumar",
      motherName: "Sita Devi",
      permanentAddress:
        "Village Mahuli, Post Mahuli, District Patna, Bihar - 804453",
      correspondenceAddress:
        "Flat 201, Krishna Apartments, Boring Road, Patna - 800013",
      aadhaarNumber: "1234-5678-9012",
      panNumber: "ABCDE1234F",
      aadhaarFront:
        "https://placehold.co/600x400/e3f2fd/1976d2?text=Aadhaar+Front",
      aadhaarBack:
        "https://placehold.co/600x400/e3f2fd/1976d2?text=Aadhaar+Back",
      panCard: "https://placehold.co/600x400/fff3e0/f57c00?text=PAN+Card",
      dlNumber: "BR0120230012345",
      dlIssueDate: "2018-03-15",
      dlExpiryDate: "2038-03-14",
      dlImage:
        "https://placehold.co/600x400/e8f5e9/388e3c?text=Driving+License",
      accountNumber: "12345678901234",
      ifscCode: "SBIN0001234",
      bankName: "State Bank of India",
      branchName: "Boring Road Branch",
      accountHolderName: "Rajesh Kumar",
      drivingExperience: "5",
      vehicleName: "Hero Splendor Plus",
      vehicleNumber: "BR01AB1234",
      vehicleModel: "2020",
      vehicleColor: "Black",
      insuranceNumber: "INS123456789",
      insuranceExpiry: "2025-06-30",
      rcNumber: "RC12345678",
      vehicleFront:
        "https://placehold.co/600x400/fce4ec/c2185b?text=Vehicle+Front",
      vehicleBack:
        "https://placehold.co/600x400/fce4ec/c2185b?text=Vehicle+Back",
      vehicleRight:
        "https://placehold.co/600x400/fce4ec/c2185b?text=Vehicle+Right",
      vehicleLeft:
        "https://placehold.co/600x400/fce4ec/c2185b?text=Vehicle+Left",
      rcImage: "https://placehold.co/600x400/f3e5f5/8e24aa?text=RC+Book",
      insuranceImage:
        "https://placehold.co/600x400/e0f2f1/00897b?text=Insurance",
      status: "pending",
      appliedDate: "2024-11-08",
      completedRides: 0,
      rating: 0,
      emergencyContact: "+91 9123456789",
      emergencyContactName: "Ram Kumar",
      emergencyContactRelation: "Father",
    },
    {
      id: 2,
      name: "Amit Singh",
      email: "amit.singh@email.com",
      phone: "+91 9988776655",
      dob: "1992-07-22",
      age: 32,
      gender: "Male",
      fatherName: "Suresh Singh",
      motherName: "Meena Devi",
      permanentAddress: "House No 45, Kankarbagh, Patna - 800020",
      correspondenceAddress: "House No 45, Kankarbagh, Patna - 800020",
      aadhaarNumber: "9876-5432-1098",
      panNumber: "XYZAB5678C",
      aadhaarFront:
        "https://placehold.co/600x400/e3f2fd/1976d2?text=Aadhaar+Front",
      aadhaarBack:
        "https://placehold.co/600x400/e3f2fd/1976d2?text=Aadhaar+Back",
      panCard: "https://placehold.co/600x400/fff3e0/f57c00?text=PAN+Card",
      dlNumber: "BR0120210098765",
      dlIssueDate: "2015-08-10",
      dlExpiryDate: "2035-08-09",
      dlImage:
        "https://placehold.co/600x400/e8f5e9/388e3c?text=Driving+License",
      accountNumber: "98765432109876",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      branchName: "Kankarbagh Branch",
      accountHolderName: "Amit Singh",
      drivingExperience: "8",
      vehicleName: "Honda Activa 6G",
      vehicleNumber: "BR01CD5678",
      vehicleModel: "2021",
      vehicleColor: "Red",
      insuranceNumber: "INS987654321",
      insuranceExpiry: "2025-12-31",
      rcNumber: "RC87654321",
      vehicleFront:
        "https://placehold.co/600x400/fce4ec/c2185b?text=Vehicle+Front",
      vehicleBack:
        "https://placehold.co/600x400/fce4ec/c2185b?text=Vehicle+Back",
      vehicleRight:
        "https://placehold.co/600x400/fce4ec/c2185b?text=Vehicle+Right",
      vehicleLeft:
        "https://placehold.co/600x400/fce4ec/c2185b?text=Vehicle+Left",
      rcImage: "https://placehold.co/600x400/f3e5f5/8e24aa?text=RC+Book",
      insuranceImage:
        "https://placehold.co/600x400/e0f2f1/00897b?text=Insurance",
      status: "approved",
      appliedDate: "2024-11-01",
      actionDate: "2024-11-03",
      completedRides: 156,
      rating: 4.8,
      emergencyContact: "+91 9112233445",
      emergencyContactName: "Suresh Singh",
      emergencyContactRelation: "Father",
    },
  ]);

  const [selectedRider, setSelectedRider] = useState(null);
  const [filter, setFilter] = useState("all");
  const [imageModal, setImageModal] = useState(null);

  const handleAction = (riderId, action) => {
    setRiders(
      riders.map((rider) =>
        rider.id === riderId
          ? {
              ...rider,
              status: action,
              actionDate: new Date().toISOString().split("T")[0],
            }
          : rider
      )
    );
    setSelectedRider(null);
    alert(
      `Rider ${action === "approved" ? "Approved" : "Rejected"} Successfully!`
    );
  };

  const filteredRiders = riders.filter((rider) => {
    if (filter === "all") return true;
    return rider.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "Pending Review";
    }
  };

  const stats = {
    total: riders.length,
    pending: riders.filter((r) => r.status === "pending").length,
    approved: riders.filter((r) => r.status === "approved").length,
    rejected: riders.filter((r) => r.status === "rejected").length,
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen ml-6 p-0">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-sm shadow-lg p-8 mb-6 border-l-4 border-[#FF7B1D]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Rider Management System
                </h1>
                <p className="text-gray-600 text-lg">
                  Review, verify and manage rider applications efficiently
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-gradient-to-br from-[#FF7B1D] to-[#FF9B4D] text-white p-6 rounded-xl shadow-lg">
                  <div className="text-center">
                    <p className="text-sm opacity-90">Total Applications</p>
                    <p className="text-4xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-sm shadow-md p-6 border-t-4 border-[#FF7B1D] hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
                  <User className="text-[#FF7B1D]" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 border-t-4 border-amber-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Pending Review
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.pending}
                  </p>
                </div>
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Clock className="text-amber-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 border-t-4 border-green-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Approved
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.approved}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-md p-6 border-t-4 border-red-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Rejected
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.rejected}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <XCircle className="text-red-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-sm shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  filter === "all"
                    ? "bg-[#FF7B1D] text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Applications ({stats.total})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  filter === "pending"
                    ? "bg-amber-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  filter === "approved"
                    ? "bg-green-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  filter === "rejected"
                    ? "bg-red-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>

          {/* Riders List */}
          <div className="grid gap-4">
            {filteredRiders.map((rider) => (
              <div
                key={rider.id}
                className="bg-white rounded-sm shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-4 border-[#FF7B1D]"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-full">
                          <User className="text-[#FF7B1D]" size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-2xl font-bold text-gray-900">
                              {rider.name}
                            </h3>
                            <span
                              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(
                                rider.status
                              )}`}
                            >
                              {getStatusText(rider.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail size={16} />
                              <span>{rider.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone size={16} />
                              <span>{rider.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1">
                            <Calendar size={14} />
                            Applied Date
                          </p>
                          <p className="text-gray-900 font-medium">
                            {rider.appliedDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1">
                            <Car size={14} />
                            Vehicle
                          </p>
                          <p className="text-gray-900 font-medium">
                            {rider.vehicleName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold mb-1">
                            Vehicle No.
                          </p>
                          <p className="text-gray-900 font-medium">
                            {rider.vehicleNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1">
                            <Award size={14} />
                            Experience
                          </p>
                          <p className="text-gray-900 font-medium">
                            {rider.drivingExperience} Years
                          </p>
                        </div>
                      </div>

                      {rider.status === "approved" && (
                        <div className="mt-4 flex gap-4 text-sm">
                          <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                            <span className="text-green-700 font-semibold">
                              Completed Rides: {rider.completedRides}
                            </span>
                          </div>
                          <div className="bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                            <span className="text-amber-700 font-semibold">
                              Rating: ⭐ {rider.rating}/5.0
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedRider(rider)}
                      className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-[#FF7B1D] to-[#FF9B4D] text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                    >
                      <Eye size={20} />
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRiders.length === 0 && (
            <div className="bg-white rounded-sm shadow-md p-16 text-center">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-500 text-xl font-medium">
                No riders found in this category
              </p>
            </div>
          )}
        </div>

        {/* Detailed View Modal */}
        {selectedRider && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-sm max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#FF7B1D] to-[#FF9B4D] text-white p-6 flex justify-between items-center rounded-t-2xl shadow-lg z-10">
                <div>
                  <h2 className="text-3xl font-bold">
                    Rider Application Details
                  </h2>
                  <p className="text-white text-opacity-90 mt-1">
                    Complete verification and review
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRider(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center text-3xl transition"
                >
                  ×
                </button>
              </div>

              <div className="p-8">
                {/* Personal Information */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#FF7B1D]">
                    <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
                      <User className="text-[#FF7B1D]" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Full Name
                      </p>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedRider.name}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Date of Birth (Age)
                      </p>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedRider.dob} ({selectedRider.age} years)
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Gender
                      </p>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedRider.gender}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
                        <Mail size={16} />
                        Email Address
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.email}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
                        <Phone size={16} />
                        Phone Number
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.phone}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Father's Name
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.fatherName}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Mother's Name
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.motherName}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Emergency Contact
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.emergencyContactName} (
                        {selectedRider.emergencyContactRelation})
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {selectedRider.emergencyContact}
                      </p>
                    </div>
                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
                        <MapPin size={16} />
                        Permanent Address
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.permanentAddress}
                      </p>
                    </div>
                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
                        <MapPin size={16} />
                        Correspondence Address
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.correspondenceAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Identity Documents */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#FF7B1D]">
                    <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
                      <FileText className="text-[#FF7B1D]" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Identity & License Documents
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Aadhaar Number
                      </p>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedRider.aadhaarNumber}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        PAN Number
                      </p>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedRider.panNumber}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Driving License Number
                      </p>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedRider.dlNumber}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        License Validity
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.dlIssueDate} to{" "}
                        {selectedRider.dlExpiryDate}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
                        <Award size={16} />
                        Driving Experience
                      </p>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedRider.drivingExperience} Years
                      </p>
                    </div>
                  </div>

                  {/* Document Images */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <Shield size={16} />
                        Aadhaar Card (Front)
                      </p>
                      <img
                        src={selectedRider.aadhaarFront}
                        alt="Aadhaar Front"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() =>
                          setImageModal(selectedRider.aadhaarFront)
                        }
                      />
                    </div>
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <Shield size={16} />
                        Aadhaar Card (Back)
                      </p>
                      <img
                        src={selectedRider.aadhaarBack}
                        alt="Aadhaar Back"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() => setImageModal(selectedRider.aadhaarBack)}
                      />
                    </div>
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <CreditCard size={16} />
                        PAN Card
                      </p>
                      <img
                        src={selectedRider.panCard}
                        alt="PAN Card"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() => setImageModal(selectedRider.panCard)}
                      />
                    </div>
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <FileText size={16} />
                        Driving License
                      </p>
                      <img
                        src={selectedRider.dlImage}
                        alt="Driving License"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() => setImageModal(selectedRider.dlImage)}
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#FF7B1D]">
                    <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
                      <CreditCard className="text-[#FF7B1D]" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Bank Account Details
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Account Holder Name
                      </p>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedRider.accountHolderName}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Account Number
                      </p>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedRider.accountNumber}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        IFSC Code
                      </p>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedRider.ifscCode}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Bank Name
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.bankName}
                      </p>
                    </div>
                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Branch Name
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.branchName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#FF7B1D]">
                    <div className="bg-[#FF7B1D] bg-opacity-10 p-3 rounded-lg">
                      <Car className="text-[#FF7B1D]" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Vehicle Information & Documents
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Vehicle Name
                      </p>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedRider.vehicleName}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Vehicle Number
                      </p>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedRider.vehicleNumber}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Model Year
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.vehicleModel}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Vehicle Color
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.vehicleColor}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        RC Number
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.rcNumber}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Insurance Number
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.insuranceNumber}
                      </p>
                    </div>
                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-1">
                        <Calendar size={16} />
                        Insurance Expiry Date
                      </p>
                      <p className="text-gray-900 font-medium">
                        {selectedRider.insuranceExpiry}
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Images */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <Car size={16} />
                        Vehicle (Front View)
                      </p>
                      <img
                        src={selectedRider.vehicleFront}
                        alt="Vehicle Front"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() =>
                          setImageModal(selectedRider.vehicleFront)
                        }
                      />
                    </div>
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <Car size={16} />
                        Vehicle (Back View)
                      </p>
                      <img
                        src={selectedRider.vehicleBack}
                        alt="Vehicle Back"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() => setImageModal(selectedRider.vehicleBack)}
                      />
                    </div>
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <Car size={16} />
                        Vehicle (Right Side)
                      </p>
                      <img
                        src={selectedRider.vehicleRight}
                        alt="Vehicle Right"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() =>
                          setImageModal(selectedRider.vehicleRight)
                        }
                      />
                    </div>
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <Car size={16} />
                        Vehicle (Left Side)
                      </p>
                      <img
                        src={selectedRider.vehicleLeft}
                        alt="Vehicle Left"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() => setImageModal(selectedRider.vehicleLeft)}
                      />
                    </div>
                  </div>

                  {/* RC and Insurance Documents */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <FileText size={16} />
                        RC Book
                      </p>
                      <img
                        src={selectedRider.rcImage}
                        alt="RC Book"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() => setImageModal(selectedRider.rcImage)}
                      />
                    </div>
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-[#FF7B1D] transition">
                      <p className="text-sm text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        <Shield size={16} />
                        Insurance Certificate
                      </p>
                      <img
                        src={selectedRider.insuranceImage}
                        alt="Insurance"
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition shadow-md"
                        onClick={() =>
                          setImageModal(selectedRider.insuranceImage)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedRider.status === "pending" && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t-2 border-gray-200">
                    <button
                      onClick={() => handleAction(selectedRider.id, "rejected")}
                      className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg"
                    >
                      <XCircle size={24} />
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleAction(selectedRider.id, "approved")}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg"
                    >
                      <CheckCircle size={24} />
                      Approve Application
                    </button>
                  </div>
                )}

                {selectedRider.status !== "pending" && (
                  <div className="pt-6 border-t-2 border-gray-200">
                    <div
                      className={`text-center py-4 rounded-xl font-semibold text-lg ${getStatusColor(
                        selectedRider.status
                      )}`}
                    >
                      ✓ Application {getStatusText(selectedRider.status)} on{" "}
                      {selectedRider.actionDate}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {imageModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4 z-50"
            onClick={() => setImageModal(null)}
          >
            <div className="relative max-w-6xl w-full">
              <img
                src={imageModal}
                alt="Document"
                className="max-w-full max-h-[90vh] object-contain mx-auto rounded-lg shadow-2xl"
              />
              <button
                onClick={() => setImageModal(null)}
                className="absolute -top-4 -right-4 bg-white text-gray-900 rounded-full w-12 h-12 flex items-center justify-center text-3xl hover:bg-[#FF7B1D] hover:text-white transition shadow-lg"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RiderManagement;
