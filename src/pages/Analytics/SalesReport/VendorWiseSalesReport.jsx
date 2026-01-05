import React, { useState, useMemo } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import VendorFilters from "../../../pages/Analytics/SalesReport/VendorFilters";
import VendorSummaryCards from "../../../pages/Analytics/SalesReport/VendorSummaryCards";
import PaymentBreakdown from "../../../pages/Analytics/SalesReport/PaymentBreakdown";
import TopSellingProducts from "../../../pages/Analytics/SalesReport/TopSellingProducts";
import CategoryWiseAnalysis from "../../../pages/Analytics/SalesReport/CategoryWiseAnalysis";
import VendorComparisonTable from "../../../pages/Analytics/SalesReport/VendorComparisonTable";
import {
  vendors,
  categories,
  subCategories,
  products,
  vendorWiseData,
  categoryWiseData,
  subCategoryWiseData,
} from "../../../pages/Analytics/SalesReport/sampleData";

const VendorWiseSalesReport = () => {
  // Filter States
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [paymentType, setPaymentType] = useState("all");

  // Apply filters to data
  const filteredVendorData = useMemo(() => {
    return vendorWiseData.filter((vendor) => {
      if (selectedVendor !== "all" && vendor.id !== selectedVendor)
        return false;

      // Check if vendor has products matching the filters
      const vendorProducts = products.filter((p) => p.vendorId === vendor.id);

      if (selectedCategory !== "all") {
        if (!vendorProducts.some((p) => p.categoryId === selectedCategory))
          return false;
      }

      if (selectedSubCategory !== "all") {
        if (
          !vendorProducts.some((p) => p.subCategoryId === selectedSubCategory)
        )
          return false;
      }

      if (selectedProduct !== "all") {
        if (!vendorProducts.some((p) => p.id === selectedProduct)) return false;
      }

      return true;
    });
  }, [selectedVendor, selectedCategory, selectedSubCategory, selectedProduct]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedVendor !== "all" && product.vendorId !== selectedVendor)
        return false;
      if (selectedCategory !== "all" && product.categoryId !== selectedCategory)
        return false;
      if (
        selectedSubCategory !== "all" &&
        product.subCategoryId !== selectedSubCategory
      )
        return false;
      if (selectedProduct !== "all" && product.id !== selectedProduct)
        return false;
      return true;
    });
  }, [selectedVendor, selectedCategory, selectedSubCategory, selectedProduct]);

  const filteredCategoryData = useMemo(() => {
    return categoryWiseData.filter((category) => {
      if (selectedCategory !== "all" && category.id !== selectedCategory)
        return false;
      if (selectedVendor !== "all") {
        const vendorProducts = products.filter(
          (p) => p.vendorId === selectedVendor && p.categoryId === category.id
        );
        if (vendorProducts.length === 0) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedVendor]);

  const filteredSubCategoryData = useMemo(() => {
    return subCategoryWiseData.filter((subCat) => {
      if (selectedCategory !== "all" && subCat.categoryId !== selectedCategory)
        return false;
      if (selectedSubCategory !== "all" && subCat.id !== selectedSubCategory)
        return false;
      if (selectedVendor !== "all") {
        const vendorProducts = products.filter(
          (p) => p.vendorId === selectedVendor && p.subCategoryId === subCat.id
        );
        if (vendorProducts.length === 0) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedSubCategory, selectedVendor]);

  return (
    <DashboardLayout>
      <div className="min-h-screen ml-6 bg-gray-0 p-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sales Report
          </h1>
          <p className="text-gray-600">
            Comprehensive analysis of vendor performance with detailed
            breakdowns
          </p>
        </div>

        {/* Filters */}
        <VendorFilters
          selectedVendor={selectedVendor}
          setSelectedVendor={setSelectedVendor}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          paymentType={paymentType}
          setPaymentType={setPaymentType}
          vendors={vendors}
          categories={categories}
          subCategories={subCategories}
          products={products}
        />

        {/* Summary Cards */}
        <VendorSummaryCards filteredData={filteredVendorData} />

        {/* Payment Breakdown */}
        {filteredVendorData.length > 0 && (
          <PaymentBreakdown vendorData={filteredVendorData} />
        )}

        {/* Top Selling Products */}
        {filteredProducts.length > 0 && (
          <TopSellingProducts
            products={filteredProducts}
            paymentType={paymentType}
          />
        )}

        {/* Category-wise Analysis */}
        {filteredCategoryData.length > 0 && (
          <CategoryWiseAnalysis
            categoryData={filteredCategoryData}
            subCategoryData={filteredSubCategoryData}
          />
        )}

        {/* Vendor Comparison Table */}
        {filteredVendorData.length > 0 && (
          <VendorComparisonTable vendorData={filteredVendorData} />
        )}

        {/* No Data Message */}
        {filteredVendorData.length === 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-sm shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-24 h-24 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-600">
              No vendors match the selected filters. Try adjusting your filter
              criteria.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VendorWiseSalesReport;
