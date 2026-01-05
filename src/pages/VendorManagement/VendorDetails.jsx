import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import AddVendorModal from "../../components/AddVendorModal";

import {
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const VendorDashboard = () => {
  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock vendor data
  const vendor = {
    id: id,
    name: "Manish Kumar",
    performance: 99,
    storeId: "STO101",
    contact: "6203689042",
    city: "Noida",
    pincode: "201301",
    status: "Approved",
  };

  // Pie chart data (order overview)
  const chartData = [
    { name: "Completed", value: 40, color: "#222f5cff" },
    { name: "In Progress", value: 25, color: "#16A34A" },
    { name: "Pending", value: 20, color: "#FACC15" },
    { name: "Cancelled", value: 15, color: "#DC2626" },
  ];

  const stats = [
    {
      title: "Category Use",
      value: "1007",
      icon: ChartBarIcon,
      color: "text-red-500",
    },
    {
      title: "Sub Category Use",
      value: "1007",
      icon: ArrowUpIcon,
      color: "text-black",
    },
    {
      title: "Product Refund",
      value: "1007",
      icon: ArrowDownIcon,
      color: "text-green-500",
    },
    {
      title: "Product in Review",
      value: "1007",
      icon: ChartBarIcon,
      color: "text-red-500",
    },
    {
      title: "Total Order",
      value: "1007",
      icon: ArrowUpIcon,
      color: "text-black",
    },
    {
      title: "Total Delivered",
      value: "1007",
      icon: ArrowDownIcon,
      color: "text-green-500",
    },
    {
      title: "Total Cancelled Order",
      value: "1007",
      icon: ChartBarIcon,
      color: "text-red-500",
    },
    {
      title: "Total Riders",
      value: "1007",
      icon: ArrowUpIcon,
      color: "text-black",
    },
    {
      title: "Pricing",
      value: "1007",
      icon: ArrowDownIcon,
      color: "text-green-500",
    },
    {
      title: "Inventory",
      value: "1007",
      icon: ChartBarIcon,
      color: "text-red-500",
    },
    { title: "Account", value: "1007", icon: ArrowUpIcon, color: "text-black" },
    {
      title: "Ticket",
      value: "1007",
      icon: ArrowDownIcon,
      color: "text-green-500",
    },
  ];

  const invoices = [
    {
      title: "Redesign Website",
      id: "#INV-00024",
      payment: "$5600",
      status: "Paid",
    },
    {
      title: "Module Completion",
      id: "#INV-00023",
      payment: "$4175",
      status: "Paid",
    },
    {
      title: "Change CRM Module",
      id: "#INV-00022",
      payment: "$3500",
      status: "Unpaid",
    },
    {
      title: "Charges on live Board",
      id: "#INV-00021",
      payment: "$1457",
      status: "Paid",
    },
    {
      title: "Hospital Management",
      id: "#INV-00020",
      payment: "$6545",
      status: "Unpaid",
    },
  ];

  const partners = [
    {
      id: 1,
      name: "Anthony Lewis",
      role: "Finance",
      date: "28 September 2025",
      status: "Running",
      statusColor: "bg-green-100 text-green-600",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Brian Villalobos",
      role: "PHP Developer",
      date: "",
      status: "In Active",
      statusColor: "bg-red-100 text-red-500",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      id: 3,
      name: "Stephan Peralt",
      role: "Executive",
      date: "",
      status: "Online",
      statusColor: "bg-blue-100 text-blue-500",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: 4,
      name: "Doglas Martini",
      role: "Project Manager",
      date: "",
      status: "Online",
      statusColor: "bg-pink-100 text-pink-500",
      avatar: "https://randomuser.me/api/portraits/women/60.jpg",
    },
    {
      id: 5,
      name: "Anthony Lewis",
      role: "UI/UX Designer",
      date: "",
      status: "In Active",
      statusColor: "bg-red-100 text-red-500",
      avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    },
  ];

  const vendorInvoices = [
    {
      id: "#INV002",
      title: "Redesign Website",
      company: "Logistics",
      payment: "$3560",
      status: "Unpaid",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "#INV005",
      title: "Module Completion",
      company: "Vip Corp",
      payment: "$4175",
      status: "Unpaid",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: "#INV003",
      title: "Change on Emp Module",
      company: "Ignis LLP",
      payment: "$6985",
      status: "Unpaid",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    },
    {
      id: "#INV004",
      title: "Changes on the Board",
      company: "Ignis LLP",
      payment: "$1457",
      status: "Unpaid",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: "#INV006",
      title: "Hospital Management",
      company: "HCL Corp",
      payment: "$6458",
      status: "Paid",
      avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    },
  ];

  return (
    <DashboardLayout>
      <div>
        {/* Add Vendor Button */}
        <div className="w-full md:w-auto flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white w-48 sm:w-56 px-4 sm:px-5 py-2 rounded-sm shadow hover:bg-orange-600 text-xs sm:text-sm flex items-center justify-center whitespace-nowrap"
          >
            + Add Vendor
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <AddVendorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
      {/* Main Grid for Three Columns */}
      <div className="max-w-[100%] mx-auto mt-4 grid pl-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {/* Column 1 - Vendor & Store Info */}
        <div className="space-y-1 w-full">
          {/* Vendor Info */}
          <div>
            <div className="border border-orange-500 rounded-lg shadow p-4 bg-[#FEF0E9] min-h-[140px] relative">
              {/* Orange Badge Icon */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-5 sm:w-6 h-5 sm:h-6 bg-orange-500 rounded-full flex items-center justify-center text-white z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-3 h-3"
                >
                  <path d="M12 2L2 7v7c0 5 5 10 10 10s10-5 10-10V7l-10-5zm0 2.18l7 3.5v5.32c0 4-3.2 8-7 8s-7-4-7-8V7.68l7-3.5zM12 8l-2 4h4l-2-4zm0 6.5l-1.5 3h3L12 14.5z" />
                </svg>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start w-full">
                {/* Left Section */}
                <div className="flex items-center sm:ml-12 ml-8 w-full sm:w-auto gap-3 relative z-0">
                  {/* Vendor Image */}
                  <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm flex-shrink-0">
                    IMG
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">Store ID</p>
                    <p className="text-gray-400">RUSH905</p>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-start sm:items-end mt-3 sm:mt-0 w-full sm:w-auto">
                  <p className="text-gray-500 font-semibold text-xs sm:text-sm">
                    Performance
                  </p>
                  <p className="text-lg font-bold text-orange-500">99%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Store Image */}
          <div className="mb-4">
            <h2 className="font-semibold text-gray-700 mb-2">Store Image</h2>
            <div className="border rounded-sm shadow p-4 bg-gray-100 text-center min-h-[150px] sm:min-h-[120px] flex items-center justify-center"></div>
          </div>

          {/* Store Location */}
          <div className="mb-4">
            <h2 className="font-semibold text-gray-700 mb-2">Store Location</h2>
            <div className="border rounded-sm shadow p-4 bg-gray-100 text-center min-h-[200px] sm:min-h-[180px] flex items-center justify-center">
              MAP
            </div>
          </div>

          {/* Store Details */}
          <div>
            <h2 className="font-semibold text-gray-700 mb-2">Store Details</h2>
            <div className="border border-orange-500 rounded-lg shadow p-4 bg-[#FEF0E9] text-sm space-y-1">
              <p>
                <strong>Lat :</strong> 878947.7876 &nbsp;{" "}
                <strong>Long :</strong> 878947.7876
              </p>
              <p>
                <strong>Authorized Person :</strong> Manish Kumar
              </p>
              <p>
                <strong>Contact :</strong> +91 6203689042
              </p>
              <p>
                <strong>Alt Contact :</strong> +91 6203689042
              </p>
              <p>
                <strong>Email :</strong> sritam@gmail.com
              </p>
              <p>
                <strong>DOB :</strong> 26 Sept 2025
              </p>
              <p>
                <strong>Gender :</strong> Male
              </p>
            </div>
          </div>

          {/* Store Address */}
          <div>
            <h2 className="font-semibold text-gray-700 mb-2">Store Address</h2>
            <div className="border rounded-lg shadow p-4 bg-[#9797FD] text-sm space-y-1">
              <p>
                <strong>Address 1 :</strong>
              </p>
              <p>
                <strong>Address 2 :</strong>
              </p>
              <p>
                <strong>City :</strong>
              </p>
              <p>
                <strong>State :</strong>
              </p>
              <p>
                <strong>PIN :</strong>
              </p>
            </div>
          </div>

          {/* Store Login Credentials */}
          <div>
            <h2 className="font-bold mt-4 mb-3 inline-block border-b-4 border-black pb-1 text-orange-500">
              Store Login Credentials
            </h2>

            <div className="rounded-lg p-4 bg-white text-sm space-y-1">
              <p>
                <strong>Username :</strong> rushbaskets8040
              </p>
              <p>
                <strong>Password :</strong> dkfhfsdh@dkcnkjnd8
              </p>
              <p>
                <strong>Secret KEY :</strong> 74658
              </p>

              {/* Centered Large Button */}
              <div className="mt-8 flex justify-center">
                <button className="text-black border mt-4 border-black px-8 py-2 rounded-full w-72 hover:bg-orange-500 transition">
                  Change Credential
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 - Main Info & Charts */}
        <div className="space-y-4">
          {/* Vendor Info Card (Duplicate, consider removing one) */}
          <div className="flex border-2 border-orange-300 rounded-md p-2.5 bg-[#FEF0E9] h-20 relative items-center justify-between">
            {/* Orange Badge Icon */}
            <div className="absolute top-2 left-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-3 h-3"
              >
                <path d="M12 2L2 7v7c0 5 5 10 10 10s10-5 10-10V7l-10-5zm0 2.18l7 3.5v5.32c0 4-3.2 8-7 8s-7-4-7-8V7.68l7-3.5zM12 8l-2 4h4l-2-4zm0 6.5l-1.5 3h3L12 14.5z" />
              </svg>
            </div>

            {/* Left: Vendor Info */}
            <div className="flex items-center gap-2 ml-6">
              <img
                src="https://i.pravatar.cc/50"
                alt="Vendor"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Daniel Esbella
                </h3>
                <p className="text-xs text-gray-600">iOS Developer</p>
              </div>
            </div>

            {/* Right: Performance */}
            <div className="text-right mr-2">
              <p className="text-xs text-gray-500 font-semibold">Performance</p>
              <p className="text-lg font-bold text-orange-600">99%</p>
            </div>
          </div>

          {/* Order Overview */}
          <div className="bg-white shadow rounded p-4 h-[490px] relative">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Order Overview</h3>
              <button className="text-xs border rounded px-2 py-0 flex items-center gap-2">
                📅 Today
              </button>
            </div>
            <hr></hr>
            {/* Pie Chart */}
            <div className="mt-4">
              {" "}
              {/* added margin-top to move pie chart down */}
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-gray-500 text-sm">Total Attendance</p>
              <p className="text-2xl font-bold">120</p>
            </div>

            <div className="mt-4 space-y-2">
              {chartData.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></span>
                    <span>{entry.name}</span>
                  </div>
                  <span className="font-medium">{entry.value}%</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t mt-4 pt-2">
              {/* Left: Order List */}
              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-gray-700">
                  Order List
                </p>

                {/* Avatars */}
                <div className="flex items-center gap-1">
                  <img
                    src="https://i.pravatar.cc/20?img=1"
                    alt="user1"
                    className="w-6 h-6 rounded-full border"
                  />
                  <img
                    src="https://i.pravatar.cc/20?img=2"
                    alt="user2"
                    className="w-6 h-6 rounded-full border"
                  />
                  <img
                    src="https://i.pravatar.cc/20?img=3"
                    alt="user3"
                    className="w-6 h-6 rounded-full border"
                  />
                  <span className="text-xs bg-orange-500 text-white rounded-full px-2">
                    +1
                  </span>
                </div>
              </div>

              {/* Right: View Details Button */}
              <button className="text-orange-600 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>

          {/* Announcement */}
          <div className="bg-white shadow rounded p-3 min-h-[375px]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">Announcement</h3>
              <button className="text-xs bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium px-3 py-1 transition">
                View All
              </button>
            </div>

            <hr className="border-gray-200 mb-2" />

            <div className="flex flex-col">
              <button className="bg-[#3B7080] text-white text-xs px-3 py-1 rounded mb-2 w-max">
                Invitation
              </button>

              <p className="text-sm text-gray-700 mb-1 font-medium">
                We are now open new shop...
              </p>
              <p className="text-xs text-gray-500 mb-2">
                📅 24 Sept 2025 | 🕒 10:30 AM
              </p>
              <p className="text-sm text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                eget ultricies mauris. Pellentesque habitant morbi tristique
                senectus et netus et malesuada fames ac turpis egestas.
                Curabitur vitae lectus non sapien bibendum commodo. Integer ut
                augue at metus convallis malesuada. Fusce sed enim eu nunc
                lacinia facilisis.lorem ipsum dolor sit amet, consecteturlorem
                ipsum dolor sit amet, consectetur adipiscing elit. Sed
              </p>
            </div>
          </div>
        </div>

        {/* Column 3 - Stat Cards */}
        <div className="space-y-4">
          {/* Vendor Info Card (Duplicate, consider removing one) */}
          <div className="flex border-2 border-orange-300 rounded-md p-2.5 bg-[#FEF0E9] h-20 relative items-center justify-between">
            {/* Orange Badge Icon */}
            <div className="absolute top-2 left-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-3 h-3"
              >
                <path d="M12 2L2 7v7c0 5 5 10 10 10s10-5 10-10V7l-10-5zm0 2.18l7 3.5v5.32c0 4-3.2 8-7 8s-7-4-7-8V7.68l7-3.5zM12 8l-2 4h4l-2-4zm0 6.5l-1.5 3h3L12 14.5z" />
              </svg>
            </div>

            {/* Left: Vendor Info */}
            <div className="flex items-center gap-2 ml-6">
              <img
                src="https://i.pravatar.cc/50"
                alt="Vendor"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Daniel Esbella
                </h3>
                <p className="text-xs text-gray-600">iOS Developer</p>
              </div>
            </div>

            {/* Right: Performance */}
            <div className="text-right mr-2">
              <p className="text-xs text-gray-500 font-semibold">Performance</p>
              <p className="text-lg font-bold text-orange-600">99%</p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                title: "Category Use",
                value: "1007",
                iconColor: "bg-black",
                iconType: "svgHuman",
                percentage: "+19.01%",
                percentageColor: "bg-purple-200 text-purple-700",
              },
              {
                title: "Sub Category Use",
                value: "1007",
                iconColor: "bg-green-700",
                iconType: "lawm",
                percentage: "+19.01%",
                percentageColor: "bg-orange-100 text-orange-600",
              },
              {
                title: "Product Published",
                value: "1007",
                iconColor: "bg-red-500",
                iconType: "redIcon",
                percentage: "+19.01%",
                percentageColor: "bg-gray-200 text-gray-700",
              },
              {
                title: "Product In Review",
                value: "1007",
                iconColor: "bg-red-500",
                iconType: "redIcon",
                percentage: "+19.01%",
                percentageColor: "bg-gray-200 text-gray-700",
              },
              {
                title: "Total Order",
                value: "1007",
                iconColor: "bg-black",
                iconType: "svgHuman",
                percentage: "+19.01%",
                percentageColor: "bg-purple-200 text-purple-700",
              },
              {
                title: "Total Delivered Order",
                value: "1007",
                iconColor: "bg-green-500",
                iconType: "lawm",
                percentage: "+19.01%",
                percentageColor: "bg-orange-100 text-orange-600",
              },
              {
                title: "Total Canceled Order",
                value: "1007",
                iconColor: "bg-red-500",
                iconType: "redIcon",
                percentage: "+19.01%",
                percentageColor: "bg-gray-200 text-gray-700",
              },
              {
                title: "Total Riders",
                value: "1007",
                iconColor: "bg-red-500",
                iconType: "redIcon",
                percentage: "+19.01%",
                percentageColor: "bg-gray-200 text-gray-700",
              },
              {
                title: "Ratings",
                value: "1007",
                iconColor: "bg-black",
                iconType: "svgHuman",
                percentage: "+19.01%",
                percentageColor: "bg-purple-200 text-purple-700",
              },
              {
                title: "Inventory",
                value: "1007",
                iconColor: "bg-green-500",
                iconType: "lawm",
                percentage: "+19.01%",
                percentageColor: "bg-orange-100 text-orange-600",
              },
              {
                title: "Amount",
                value: "1007",
                iconColor: "bg-red-500",
                iconType: "redIcon",
                percentage: "+19.01%",
                percentageColor: "bg-gray-200 text-gray-700",
              },
              {
                title: "Ticket",
                value: "1007",
                iconColor: "bg-green-500",
                iconType: "lawm",
                percentage: "+19.01%",
                percentageColor: "bg-gray-200 text-gray-700",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between bg-white p-2 rounded-lg shadow h-[80px]"
              >
                {/* Top section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Colored ball with icon inside */}
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full ${card.iconColor}`}
                    >
                      {card.iconType === "svgHuman" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-white"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      ) : card.iconType === "lawm" ? (
                        <span className="text-white text-xs font-bold">律</span>
                      ) : card.iconType === "redIcon" ? (
                        <span className="text-white text-xs font-bold">輪</span>
                      ) : null}
                    </div>
                    <span className="text-gray-500 text-xs">{card.title}</span>
                  </div>
                  <div
                    className={`px-2 py-0.5 rounded ${card.percentageColor} text-xs`}
                  >
                    {card.percentage}
                  </div>
                </div>

                {/* Bottom-left value */}
                <div className="text-sm font-bold text-gray-800 flex justify-start">
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border rounded shadow-sm w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b px-4 py-2">
              <h2 className="font-semibold text-gray-800 text-sm">
                Delivery Partner
              </h2>
              <button className="text-xs bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium px-3 py-1 transition">
                View All
              </button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-3 bg-gray-50 text-gray-600 text-xs font-semibold px-4 py-2 border-b">
              <span>Name</span>
              <span className="text-center">Status</span>
              <span className="text-right">Status</span>
            </div>

            {/* Table Rows */}
            <div>
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="grid grid-cols-3 items-center px-4 py-2 border-b last:border-0"
                >
                  {/* Left: Profile */}
                  <div className="flex items-center gap-2">
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {partner.name}
                    </p>
                  </div>

                  {/* Center: Date */}
                  <div className="text-center text-xs text-gray-700">
                    {partner.date}
                  </div>

                  {/* Right: Status */}
                  <div className="flex justify-end">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${partner.statusColor}`}
                    >
                      {partner.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-md border border-blue-300 max-w-7xl w-[98%] mx-auto p-3 mt-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-3 relative">
          {/* Left: Heading */}
          <h2 className="text-lg font-semibold text-gray-700">Invoices</h2>

          {/* Center: Select + Button */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
            <select className="border rounded px-2 py-1 text-sm w-full sm:w-auto">
              <option>Invoices</option>
              <option>Payments</option>
            </select>
            <button className="bg-gray-200 text-sm px-3 py-1 rounded flex items-center gap-1 w-full sm:w-auto">
              This Week
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-3 bg-gray-50 text-gray-600 text-sm font-semibold px-2 py-2 rounded-t">
          <span>Name</span>
          <span className="text-center">Payment</span>
          <span className="text-right">Status</span>
        </div>

        {/* Invoice List */}
        <div>
          {vendorInvoices.map((inv) => (
            <div
              key={inv.id}
              className="grid grid-cols-3 items-center px-2 py-2 border-b last:border-0 hover:bg-gray-50"
            >
              {/* Name */}
              <div className="flex items-center gap-3">
                <img
                  src={inv.avatar}
                  alt="avatar"
                  className="w-9 h-9 rounded-full"
                />
                <div className="text-sm">
                  <p className="font-medium">{inv.title}</p>
                  <p className="text-gray-500">
                    {inv.id} • {inv.company}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div className="text-center text-gray-700 font-semibold">
                {inv.payment}
              </div>

              {/* Status */}
              <div className="flex justify-end">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    inv.status === "Paid"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-3">
          <button className="text-gray-500 text-sm hover:underline">
            View All
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;
