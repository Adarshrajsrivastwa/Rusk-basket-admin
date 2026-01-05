import React, { useState } from "react";
import {
  XMarkIcon,
  ArrowRightIcon,
  UserIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const VendorLoginModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    reEnterPassword: "",
    secretKey: ["", "", "", "", ""],
  });

  const [errors, setErrors] = useState({});

  // Validation logic
  const validate = () => {
    const newErrors = {};
    const usernameRegex = /^[a-z0-9]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    const secretKey = formData.secretKey.join("");

    if (!formData.username.trim()) newErrors.username = "Username is required.";
    else if (!usernameRegex.test(formData.username))
      newErrors.username = "Use lowercase letters and numbers only.";

    if (!formData.password) newErrors.password = "Password is required.";
    else if (!passwordRegex.test(formData.password))
      newErrors.password =
        "8–16 chars, must include uppercase, number & special character.";

    if (!formData.reEnterPassword)
      newErrors.reEnterPassword = "Please re-enter your password.";
    else if (formData.password !== formData.reEnterPassword)
      newErrors.reEnterPassword = "Passwords do not match.";

    if (!/^\d{5}$/.test(secretKey))
      newErrors.secretKey = "Secret key must be 5 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Login credentials submitted:", formData);
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSecretChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const updated = [...formData.secretKey];
      updated[index] = value;
      setFormData((prev) => ({ ...prev, secretKey: updated }));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-2">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 relative overflow-y-auto max-h-[70vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* Heading */}
        <h2 className="text-lg font-bold mb-2 text-gray-800">
          Create Vendor Login Credentials
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          These credentials will be used by the vendor to log in and access
          their store dashboard.
        </p>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium text-sm mb-1"
            >
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <UserIcon className="h-4 w-4 text-gray-400" />
              </span>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-8 pr-2 py-1.5 text-sm border rounded-md focus:ring-1 outline-none ${
                  errors.username
                    ? "border-red-400 focus:ring-red-400"
                    : "border-orange-400 focus:ring-orange-400"
                }`}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-red-500 mt-0.5">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium text-sm mb-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <LockClosedIcon className="h-4 w-4 text-gray-400" />
              </span>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-8 pr-2 py-1.5 text-sm border rounded-md focus:ring-1 outline-none ${
                  errors.password
                    ? "border-red-400 focus:ring-red-400"
                    : "border-orange-400 focus:ring-orange-400"
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>
            )}
          </div>

          {/* Re-Enter Password */}
          <div>
            <label
              htmlFor="reEnterPassword"
              className="block text-gray-700 font-medium text-sm mb-1"
            >
              Re-Enter Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <LockClosedIcon className="h-4 w-4 text-gray-400" />
              </span>
              <input
                id="reEnterPassword"
                type="password"
                placeholder="Re-Enter Password"
                value={formData.reEnterPassword}
                onChange={handleChange}
                className={`w-full pl-8 pr-2 py-1.5 text-sm border rounded-md focus:ring-1 outline-none ${
                  errors.reEnterPassword
                    ? "border-red-400 focus:ring-red-400"
                    : "border-orange-400 focus:ring-orange-400"
                }`}
              />
            </div>
            {errors.reEnterPassword && (
              <p className="text-xs text-red-500 mt-0.5">
                {errors.reEnterPassword}
              </p>
            )}
          </div>

          {/* Secret Key */}
          <div>
            <label className="block text-gray-700 font-medium text-sm mb-1">
              Secret KEY
            </label>
            <div className="flex space-x-1">
              {formData.secretKey.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleSecretChange(index, e.target.value)}
                  className={`w-8 h-8 text-center text-sm border-2 rounded-md focus:ring-1 outline-none ${
                    errors.secretKey
                      ? "border-red-400 focus:ring-red-400"
                      : "border-orange-400 focus:ring-orange-400"
                  }`}
                />
              ))}
            </div>
            {errors.secretKey && (
              <p className="text-xs text-red-500 mt-0.5">{errors.secretKey}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-green-500 text-white font-semibold text-sm flex items-center gap-1 hover:bg-green-600 transition duration-200"
            >
              Submit <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorLoginModal;
