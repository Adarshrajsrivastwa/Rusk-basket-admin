import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Bell,
  Search,
  User,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Revenue",
      value: "$45,231",
      change: "+12.5%",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      label: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      label: "Products",
      value: "89",
      change: "+3",
      icon: Package,
      color: "bg-purple-500",
    },
    {
      label: "Growth",
      value: "23.5%",
      change: "+4.3%",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      product: "Wireless Headphones",
      amount: "$129.99",
      status: "Completed",
      date: "2026-01-07",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      product: "Smart Watch",
      amount: "$299.99",
      status: "Processing",
      date: "2026-01-07",
    },
    {
      id: "#ORD-003",
      customer: "Bob Johnson",
      product: "Laptop Stand",
      amount: "$49.99",
      status: "Pending",
      date: "2026-01-06",
    },
    {
      id: "#ORD-004",
      customer: "Alice Brown",
      product: "USB-C Cable",
      amount: "$19.99",
      status: "Completed",
      date: "2026-01-06",
    },
    {
      id: "#ORD-005",
      customer: "Charlie Wilson",
      product: "Keyboard",
      amount: "$79.99",
      status: "Shipped",
      date: "2026-01-05",
    },
  ];

  const lowStockProducts = [
    { name: "Wireless Mouse", stock: 5, sku: "SKU-001" },
    { name: "Phone Case", stock: 3, sku: "SKU-002" },
    { name: "Screen Protector", stock: 8, sku: "SKU-003" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen ">
        {/* Dashboard Content */}
        <main className="p-0 ml-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Orders
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                        Customer
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                        Product
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                        Amount
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2 text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {order.customer}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {order.product}
                        </td>
                        <td className="py-3 px-2 text-sm font-medium text-gray-900">
                          {order.amount}
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Low Stock Alert
                </h3>
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-4">
                {lowStockProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">{product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">
                        {product.stock}
                      </p>
                      <p className="text-xs text-gray-600">in stock</p>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                  View All Inventory
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
