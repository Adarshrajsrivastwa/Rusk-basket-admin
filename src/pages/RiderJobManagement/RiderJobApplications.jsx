import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { BASE_URL } from "../../api/api";

const API_BASE_URL = `${BASE_URL}/api`;

const RiderJobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState(null); // Track which application is being processed
  const itemsPerPage = 10;

  // Get token from localStorage
  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch applications for the job
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/rider-job-application/job/${jobId}`,
        {
          method: "GET",
          credentials: "include",
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();
      if (result.success) {
        setApplications(result.data || []);
        // Extract job details from first application
        if (result.data && result.data.length > 0) {
          setJobDetails(result.data[0].jobPost);
        }
      } else {
        alert(result.message || "Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  // Handle application review (approve/reject)
  const handleReview = async (applicationId, status) => {
    const action = status === "approved" ? "approve" : "reject";
    if (
      !window.confirm(`Are you sure you want to ${action} this application?`)
    ) {
      return;
    }

    setProcessingId(applicationId);

    try {
      const headers = {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      };

      const requestBody = { status };
      const url = `${API_BASE_URL}/rider-job-application/${applicationId}/review`;

      console.log("=== API Request Debug ===");
      console.log("URL:", url);
      console.log("Method: PUT");
      console.log("Headers:", headers);
      console.log("Body:", requestBody);
      console.log("Body JSON:", JSON.stringify(requestBody));

      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      console.log("Response Status:", response.status);
      console.log("Response OK:", response.ok);

      const result = await response.json();
      console.log("Response Data:", result);

      if (result.success) {
        alert(result.message);
        await fetchApplications();
      } else {
        alert(result.message || `Failed to ${action} application`);
      }
    } catch (error) {
      console.error("Error reviewing application:", error);
      alert(`Failed to ${action} application. Please try again.`);
    } finally {
      setProcessingId(null);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: Clock,
        label: "Pending",
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
        label: "Approved",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: XCircle,
        label: "Rejected",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentApplications = applications.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  return (
    <DashboardLayout>
      <div className="min-h-screen p-0 mt-2 ml-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Jobs
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Job Applications
                </h1>
                {jobDetails && (
                  <div className="mt-2 space-y-1">
                    <p className="text-lg text-gray-700 font-medium">
                      {jobDetails.jobTitle}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <DollarSign size={16} className="text-green-600" />
                        Joining Bonus: ₹{jobDetails.joiningBonus}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={16} className="text-blue-600" />
                        Onboarding Fee: ₹{jobDetails.onboardingFee}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center bg-orange-50 px-6 py-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-orange-600">
                  {applications.length}
                </p>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 text-lg">
                No applications found for this job
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                {currentApplications.map((application) => (
                  <div
                    key={application._id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      {/* Rider Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="bg-orange-100 p-3 rounded-lg">
                            <User className="text-orange-600" size={24} />
                          </div>

                          <div className="flex-1">
                            {application.rider ? (
                              <>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {application.rider.fullName}
                                  </h3>
                                  {getStatusBadge(application.status)}
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Phone
                                      size={16}
                                      className="text-blue-600"
                                    />
                                    <span>
                                      {application.rider.mobileNumber}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Briefcase
                                      size={16}
                                      className="text-purple-600"
                                    />
                                    <span>
                                      Approval Status:{" "}
                                      <span
                                        className={`font-medium ${
                                          application.rider.approvalStatus ===
                                          "approved"
                                            ? "text-green-600"
                                            : application.rider
                                                  .approvalStatus === "pending"
                                              ? "text-yellow-600"
                                              : "text-red-600"
                                        }`}
                                      >
                                        {application.rider.approvalStatus}
                                      </span>
                                    </span>
                                  </div>

                                  {application.rider.currentAddress && (
                                    <div className="flex items-start gap-2 text-sm text-gray-700">
                                      <MapPin
                                        size={16}
                                        className="text-orange-600 flex-shrink-0 mt-1"
                                      />
                                      <div>
                                        <p>
                                          {
                                            application.rider.currentAddress
                                              .line1
                                          }
                                        </p>
                                        {application.rider.currentAddress
                                          .line2 && (
                                          <p>
                                            {
                                              application.rider.currentAddress
                                                .line2
                                            }
                                          </p>
                                        )}
                                        <p>
                                          {
                                            application.rider.currentAddress
                                              .city
                                          }
                                          ,{" "}
                                          {
                                            application.rider.currentAddress
                                              .state
                                          }{" "}
                                          -{" "}
                                          {
                                            application.rider.currentAddress
                                              .pinCode
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>
                                      Applied:{" "}
                                      {formatDate(application.appliedAt)}
                                    </span>
                                    {application.reviewedAt && (
                                      <>
                                        <span>•</span>
                                        <span>
                                          Reviewed:{" "}
                                          {formatDate(application.reviewedAt)}
                                        </span>
                                      </>
                                    )}
                                    <span>•</span>
                                    <span>
                                      Confirmed:{" "}
                                      {application.confirmed
                                        ? "✅ Yes"
                                        : "❌ No"}
                                    </span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-red-600">
                                <p className="font-medium">
                                  Rider data not available
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Application ID: {application._id}
                                </p>
                                <div className="mt-2">
                                  {getStatusBadge(application.status)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {application.rider &&
                        application.status === "pending" && (
                          <div className="flex lg:flex-col gap-2">
                            <button
                              onClick={() =>
                                handleReview(application._id, "approved")
                              }
                              disabled={processingId === application._id}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                            >
                              {processingId === application._id ? (
                                <>
                                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={18} />
                                  Approve
                                </>
                              )}
                            </button>
                            <button
                              onClick={() =>
                                handleReview(application._id, "rejected")
                              }
                              disabled={processingId === application._id}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                            >
                              {processingId === application._id ? (
                                <>
                                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <XCircle size={18} />
                                  Reject
                                </>
                              )}
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RiderJobApplications;
