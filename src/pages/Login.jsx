// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/image 1.png";
// import {
//   ShoppingBasket,
//   Eye,
//   EyeOff,
//   User,
//   Lock,
//   TrendingUp,
//   Package,
//   Truck,
//   Users,
// } from "lucide-react";

// export default function Login() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 300);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (formData.username && formData.password) {
//       navigate("/dashboard");
//     } else {
//       alert("Please enter credentials");
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleLogin(e);
//     }
//   };

//   const LoginSkeleton = () => (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 animate-pulse">
//       <div className="w-full max-w-5xl bg-white rounded-sm shadow-sm overflow-hidden flex">
//         <div className="w-1/2 p-12 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//           <div className="h-10 w-40 bg-gray-200 rounded mb-8"></div>
//           <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
//           <div className="h-12 bg-gray-200 rounded mb-4"></div>
//           <div className="h-12 bg-gray-200 rounded mb-4"></div>
//           <div className="h-12 bg-gray-200 rounded"></div>
//         </div>
//         <div className="w-1/2 bg-orange-500 p-12"></div>
//       </div>
//     </div>
//   );

//   if (loading) return <LoginSkeleton />;

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
//       <div className="w-full max-w-5xl bg-white rounded-sm shadow-sm overflow-hidden flex">
//         {/* Left Side - Login Form */}
//         <div className="w-1/2 p-12 bg-gradient-to-br from-orange-50 via-white to-amber-50">
//           {/* Brand Header */}
//           <div className="mb-8">
//             <div className="flex items-center justify-center mb-8">
//               <img
//                 src={logo}
//                 alt="RushBaskets Logo"
//                 className="h-24 mix-blend-multiply"
//               />
//             </div>

//             <h2 className="text-xl font-bold text-gray-900 mb-2">
//               Admin Login
//             </h2>
//             <p className="text-xs text-gray-600 mb-4">
//               This panel is strictly for authorized administrators. Unauthorized
//               access is prohibited.
//             </p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-5">
//             {/* Username Field */}
//             <div>
//               <label className="block text-sm font-bold text-gray-800 mb-2">
//                 Username
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-3.5 text-black w-5 h-5" />
//                 <input
//                   type="text"
//                   name="username"
//                   placeholder="Enter User Name"
//                   value={formData.username}
//                   onChange={handleChange}
//                   onKeyPress={handleKeyPress}
//                   className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className="block text-sm font-bold text-gray-800 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3.5 text-black w-5 h-5" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Enter Password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   onKeyPress={handleKeyPress}
//                   className="w-full pl-10 pr-10 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-3.5 text-gray-600 hover:text-orange-600 transition"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] mt-12"
//             >
//               Access Dashboard →
//             </button>
//           </form>
//         </div>

//         {/* Right Side - RushBaskets Illustration */}
//         <div className="w-1/2 flex flex-col items-center justify-center p-12 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-center relative overflow-hidden">
//           {/* Animated background elements */}
//           <div className="absolute inset-0 opacity-10">
//             <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
//             <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-200 rounded-full blur-3xl animate-pulse"></div>
//             <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse"></div>
//           </div>

//           <div className="mb-6 relative z-10">
//             <h3 className="text-orange-100 text-sm font-medium mb-3 uppercase tracking-wide">
//               E-Commerce Management System
//             </h3>
//             <h2 className="text-white text-4xl font-bold mb-4">Welcome Back</h2>
//           </div>

//           <div className="relative w-full max-w-md z-10">
//             <svg viewBox="0 0 500 400" className="w-full h-auto">
//               {/* Background decorative circles */}
//               <circle cx="250" cy="200" r="190" fill="#FFFFFF" opacity="0.05" />
//               <circle cx="250" cy="200" r="140" fill="#FFFFFF" opacity="0.08" />

//               {/* Desk/Table */}
//               <ellipse
//                 cx="250"
//                 cy="320"
//                 rx="180"
//                 ry="20"
//                 fill="#FFFFFF"
//                 opacity="0.2"
//               />
//               <rect
//                 x="80"
//                 y="300"
//                 width="340"
//                 height="20"
//                 rx="10"
//                 fill="#FFFFFF"
//                 opacity="0.3"
//               />

//               {/* Left Person - Warehouse Worker with Box */}
//               <rect
//                 x="155"
//                 y="265"
//                 width="12"
//                 height="40"
//                 rx="6"
//                 fill="#6366F1"
//               />
//               <rect
//                 x="173"
//                 y="265"
//                 width="12"
//                 height="40"
//                 rx="6"
//                 fill="#6366F1"
//               />
//               <ellipse cx="170" cy="235" rx="25" ry="35" fill="#8B5CF6" />
//               <circle cx="170" cy="195" r="22" fill="#FCD34D" />
//               <ellipse cx="170" cy="185" rx="24" ry="18" fill="#7C3AED" />
//               <ellipse
//                 cx="145"
//                 cy="240"
//                 rx="10"
//                 ry="28"
//                 fill="#FCD34D"
//                 transform="rotate(-25 145 240)"
//               />
//               <ellipse
//                 cx="195"
//                 cy="235"
//                 rx="10"
//                 ry="28"
//                 fill="#FCD34D"
//                 transform="rotate(25 195 235)"
//               />
//               {/* Box */}
//               <rect
//                 x="135"
//                 y="220"
//                 width="30"
//                 height="30"
//                 rx="2"
//                 fill="#A78BFA"
//                 opacity="0.9"
//               />
//               <line
//                 x1="135"
//                 y1="235"
//                 x2="165"
//                 y2="235"
//                 stroke="#7C3AED"
//                 strokeWidth="2"
//               />
//               <line
//                 x1="150"
//                 y1="220"
//                 x2="150"
//                 y2="250"
//                 stroke="#7C3AED"
//                 strokeWidth="2"
//               />

//               {/* Center Person - Admin with Tablet */}
//               <rect
//                 x="240"
//                 y="260"
//                 width="12"
//                 height="45"
//                 rx="6"
//                 fill="#7C3AED"
//               />
//               <rect
//                 x="258"
//                 y="260"
//                 width="12"
//                 height="45"
//                 rx="6"
//                 fill="#7C3AED"
//               />
//               <ellipse cx="255" cy="225" rx="28" ry="35" fill="#A78BFA" />
//               <circle cx="255" cy="185" r="24" fill="#FDE68A" />
//               <path
//                 d="M 235 180 Q 245 165 255 165 Q 265 165 275 180 L 275 185 Q 265 173 255 173 Q 245 173 235 185 Z"
//                 fill="#6366F1"
//               />
//               <ellipse
//                 cx="230"
//                 cy="230"
//                 rx="10"
//                 ry="28"
//                 fill="#FDE68A"
//                 transform="rotate(-30 230 230)"
//               />
//               <ellipse
//                 cx="280"
//                 cy="230"
//                 rx="10"
//                 ry="28"
//                 fill="#FDE68A"
//                 transform="rotate(30 280 230)"
//               />
//               {/* Tablet */}
//               <rect
//                 x="225"
//                 y="240"
//                 width="60"
//                 height="40"
//                 rx="3"
//                 fill="#1F2937"
//                 opacity="0.95"
//               />
//               <rect
//                 x="230"
//                 y="245"
//                 width="50"
//                 height="30"
//                 rx="2"
//                 fill="#3B82F6"
//               />
//               <rect
//                 x="238"
//                 y="252"
//                 width="15"
//                 height="3"
//                 fill="#FFFFFF"
//                 rx="1"
//               />
//               <rect
//                 x="238"
//                 y="258"
//                 width="20"
//                 height="3"
//                 fill="#FFFFFF"
//                 rx="1"
//               />
//               <rect
//                 x="238"
//                 y="264"
//                 width="12"
//                 height="3"
//                 fill="#FFFFFF"
//                 rx="1"
//               />

//               {/* Right Person - Delivery Driver */}
//               <rect
//                 x="330"
//                 y="270"
//                 width="12"
//                 height="35"
//                 rx="6"
//                 fill="#8B5CF6"
//               />
//               <rect
//                 x="348"
//                 y="270"
//                 width="12"
//                 height="35"
//                 rx="6"
//                 fill="#8B5CF6"
//               />
//               <ellipse cx="345" cy="240" rx="24" ry="32" fill="#C4B5FD" />
//               <circle cx="345" cy="205" r="20" fill="#FCD34D" />
//               <ellipse cx="345" cy="195" rx="22" ry="16" fill="#A78BFA" />
//               <ellipse
//                 cx="323"
//                 cy="245"
//                 rx="9"
//                 ry="26"
//                 fill="#FCD34D"
//                 transform="rotate(-20 323 245)"
//               />
//               <ellipse
//                 cx="367"
//                 cy="245"
//                 rx="9"
//                 ry="26"
//                 fill="#FCD34D"
//                 transform="rotate(20 367 245)"
//               />
//               {/* Cap */}
//               <ellipse cx="345" cy="193" rx="24" ry="8" fill="#EF4444" />
//               <rect x="335" y="188" width="20" height="5" fill="#EF4444" />

//               {/* Shopping Cart - Top Left */}
//               <g transform="translate(50, 80)">
//                 <rect
//                   x="0"
//                   y="0"
//                   width="60"
//                   height="45"
//                   rx="4"
//                   fill="#FFFFFF"
//                   opacity="0.95"
//                 />
//                 <circle cx="15" cy="35" r="4" fill="#6366F1" />
//                 <circle cx="45" cy="35" r="4" fill="#6366F1" />
//                 <path
//                   d="M 10 10 L 15 10 L 20 25 L 50 25 L 53 15 L 20 15"
//                   fill="none"
//                   stroke="#8B5CF6"
//                   strokeWidth="2"
//                 />
//                 <rect x="22" y="18" width="8" height="6" fill="#F59E0B" />
//                 <rect x="33" y="18" width="8" height="6" fill="#10B981" />
//                 <rect x="44" y="18" width="6" height="6" fill="#EF4444" />
//               </g>

//               {/* Sales Graph - Top Right */}
//               <g transform="translate(395, 70)">
//                 <rect
//                   x="0"
//                   y="0"
//                   width="65"
//                   height="55"
//                   rx="4"
//                   fill="#FFFFFF"
//                   opacity="0.95"
//                 />
//                 <rect x="10" y="38" width="9" height="12" fill="#EF4444" />
//                 <rect x="23" y="30" width="9" height="20" fill="#F59E0B" />
//                 <rect x="36" y="22" width="9" height="28" fill="#10B981" />
//                 <rect x="49" y="15" width="9" height="35" fill="#3B82F6" />
//                 <path
//                   d="M 14 38 L 27 30 L 40 22 L 53 15"
//                   fill="none"
//                   stroke="#8B5CF6"
//                   strokeWidth="2"
//                 />
//                 <circle cx="14" cy="38" r="2" fill="#8B5CF6" />
//                 <circle cx="27" cy="30" r="2" fill="#8B5CF6" />
//                 <circle cx="40" cy="22" r="2" fill="#8B5CF6" />
//                 <circle cx="53" cy="15" r="2" fill="#8B5CF6" />
//               </g>

//               {/* Order Status - Left Middle */}
//               <g transform="translate(55, 200)">
//                 <rect
//                   x="0"
//                   y="0"
//                   width="70"
//                   height="55"
//                   rx="4"
//                   fill="#FFFFFF"
//                   opacity="0.95"
//                 />
//                 <circle cx="15" cy="15" r="8" fill="#10B981" />
//                 <text
//                   x="12"
//                   y="19"
//                   fill="#FFFFFF"
//                   fontSize="10"
//                   fontWeight="bold"
//                 >
//                   ✓
//                 </text>
//                 <rect
//                   x="27"
//                   y="10"
//                   width="35"
//                   height="3"
//                   rx="1"
//                   fill="#9CA3AF"
//                 />
//                 <rect
//                   x="27"
//                   y="16"
//                   width="28"
//                   height="3"
//                   rx="1"
//                   fill="#9CA3AF"
//                 />

//                 <circle cx="15" cy="35" r="8" fill="#3B82F6" />
//                 <rect
//                   x="18"
//                   y="32"
//                   width="3"
//                   height="6"
//                   rx="1"
//                   fill="#FFFFFF"
//                 />
//                 <rect
//                   x="27"
//                   y="30"
//                   width="35"
//                   height="3"
//                   rx="1"
//                   fill="#9CA3AF"
//                 />
//                 <rect
//                   x="27"
//                   y="36"
//                   width="25"
//                   height="3"
//                   rx="1"
//                   fill="#9CA3AF"
//                 />
//               </g>

//               {/* Delivery Truck - Right Top */}
//               <g transform="translate(385, 180)">
//                 <rect
//                   x="0"
//                   y="0"
//                   width="70"
//                   height="50"
//                   rx="4"
//                   fill="#FFFFFF"
//                   opacity="0.95"
//                 />
//                 <rect
//                   x="15"
//                   y="15"
//                   width="30"
//                   height="18"
//                   rx="2"
//                   fill="#3B82F6"
//                 />
//                 <rect
//                   x="45"
//                   y="20"
//                   width="15"
//                   height="13"
//                   rx="2"
//                   fill="#6366F1"
//                 />
//                 <circle cx="23" cy="37" r="5" fill="#1F2937" />
//                 <circle cx="52" cy="37" r="5" fill="#1F2937" />
//                 <path d="M 50 25 L 55 25 L 55 30 L 50 30" fill="#8B5CF6" />
//               </g>

//               {/* Product Cards - Bottom Left */}
//               <g transform="translate(70, 110)">
//                 <rect
//                   x="0"
//                   y="0"
//                   width="75"
//                   height="50"
//                   rx="4"
//                   fill="#FFFFFF"
//                   opacity="0.95"
//                 />
//                 <rect
//                   x="5"
//                   y="5"
//                   width="20"
//                   height="20"
//                   rx="2"
//                   fill="#C4B5FD"
//                 />
//                 <rect
//                   x="5"
//                   y="10"
//                   width="20"
//                   height="10"
//                   fill="#8B5CF6"
//                   opacity="0.5"
//                 />
//                 <rect
//                   x="29"
//                   y="7"
//                   width="40"
//                   height="3"
//                   rx="1"
//                   fill="#9CA3AF"
//                 />
//                 <rect
//                   x="29"
//                   y="13"
//                   width="30"
//                   height="3"
//                   rx="1"
//                   fill="#9CA3AF"
//                 />
//                 <rect
//                   x="29"
//                   y="19"
//                   width="35"
//                   height="3"
//                   rx="1"
//                   fill="#10B981"
//                 />

//                 <rect
//                   x="5"
//                   y="30"
//                   width="20"
//                   height="15"
//                   rx="2"
//                   fill="#FCD34D"
//                 />
//                 <rect
//                   x="29"
//                   y="32"
//                   width="40"
//                   height="3"
//                   rx="1"
//                   fill="#9CA3AF"
//                 />
//                 <rect
//                   x="29"
//                   y="38"
//                   width="25"
//                   height="3"
//                   rx="1"
//                   fill="#9CA3AF"
//                 />
//               </g>

//               {/* Inventory Dashboard - Top Center */}
//               <g transform="translate(205, 50)">
//                 <rect
//                   x="0"
//                   y="0"
//                   width="90"
//                   height="60"
//                   rx="4"
//                   fill="#FFFFFF"
//                   opacity="0.95"
//                 />
//                 <rect x="8" y="8" width="74" height="4" rx="2" fill="#10B981" />
//                 <rect
//                   x="8"
//                   y="16"
//                   width="60"
//                   height="4"
//                   rx="2"
//                   fill="#3B82F6"
//                 />
//                 <rect
//                   x="8"
//                   y="24"
//                   width="50"
//                   height="4"
//                   rx="2"
//                   fill="#F59E0B"
//                 />
//                 <rect
//                   x="8"
//                   y="32"
//                   width="68"
//                   height="4"
//                   rx="2"
//                   fill="#8B5CF6"
//                 />

//                 <text
//                   x="10"
//                   y="48"
//                   fill="#6366F1"
//                   fontSize="11"
//                   fontWeight="bold"
//                 >
//                   STOCK
//                 </text>
//                 <text
//                   x="50"
//                   y="48"
//                   fill="#10B981"
//                   fontSize="11"
//                   fontWeight="bold"
//                 >
//                   1,247
//                 </text>
//               </g>

//               {/* Customer Reviews - Right Bottom */}
//               <g transform="translate(380, 280)">
//                 <rect
//                   x="0"
//                   y="0"
//                   width="70"
//                   height="50"
//                   rx="4"
//                   fill="#FFFFFF"
//                   opacity="0.95"
//                 />
//                 <path
//                   d="M 12 15 L 14 21 L 20 21 L 15 25 L 17 31 L 12 27 L 7 31 L 9 25 L 4 21 L 10 21 Z"
//                   fill="#FBBF24"
//                 />
//                 <path
//                   d="M 27 15 L 29 21 L 35 21 L 30 25 L 32 31 L 27 27 L 22 31 L 24 25 L 19 21 L 25 21 Z"
//                   fill="#FBBF24"
//                 />
//                 <path
//                   d="M 42 15 L 44 21 L 50 21 L 45 25 L 47 31 L 42 27 L 37 31 L 39 25 L 34 21 L 40 21 Z"
//                   fill="#FBBF24"
//                 />
//                 <path
//                   d="M 57 15 L 59 21 L 65 21 L 60 25 L 62 31 L 57 27 L 52 31 L 54 25 L 49 21 L 55 21 Z"
//                   fill="#FBBF24"
//                 />
//                 <text
//                   x="25"
//                   y="44"
//                   fill="#10B981"
//                   fontSize="12"
//                   fontWeight="bold"
//                 >
//                   4.8/5
//                 </text>
//               </g>

//               {/* Package Icon - Left Bottom */}
//               <g transform="translate(90, 340)">
//                 <rect
//                   x="0"
//                   y="0"
//                   width="55"
//                   height="45"
//                   rx="3"
//                   fill="#FFFFFF"
//                   opacity="0.95"
//                 />
//                 <rect
//                   x="10"
//                   y="10"
//                   width="35"
//                   height="25"
//                   rx="2"
//                   fill="#8B5CF6"
//                   opacity="0.7"
//                 />
//                 <line
//                   x1="10"
//                   y1="22"
//                   x2="45"
//                   y2="22"
//                   stroke="#6366F1"
//                   strokeWidth="2"
//                 />
//                 <line
//                   x1="27"
//                   y1="10"
//                   x2="27"
//                   y2="35"
//                   stroke="#6366F1"
//                   strokeWidth="2"
//                 />
//                 <rect
//                   x="20"
//                   y="28"
//                   width="14"
//                   height="3"
//                   rx="1"
//                   fill="#FFFFFF"
//                 />
//               </g>

//               {/* Notification Badge - Bottom Right */}
//               <g transform="translate(380, 340)">
//                 <rect
//                   x="0"
//                   y="0"
//                   width="50"
//                   height="45"
//                   rx="3"
//                   fill="#FFFFFF"
//                   opacity="0.95"
//                 />
//                 <circle cx="25" cy="18" r="10" fill="#EF4444" />
//                 <text
//                   x="20"
//                   y="23"
//                   fill="#FFFFFF"
//                   fontSize="12"
//                   fontWeight="bold"
//                 >
//                   12
//                 </text>
//                 <rect
//                   x="8"
//                   y="30"
//                   width="34"
//                   height="3"
//                   rx="1"
//                   fill="#9CA3AF"
//                 />
//                 <rect
//                   x="8"
//                   y="36"
//                   width="28"
//                   height="3"
//                   rx="1"
//                   fill="#9CA3AF"
//                 />
//               </g>

//               {/* Decorative elements */}
//               <circle cx="120" cy="120" r="5" fill="#FCD34D" opacity="0.6" />
//               <circle cx="380" cy="150" r="6" fill="#C4B5FD" opacity="0.7" />
//               <circle cx="430" cy="250" r="4" fill="#FCD34D" opacity="0.5" />
//               <circle cx="70" cy="270" r="5" fill="#A78BFA" opacity="0.6" />

//               {/* Stars */}
//               <path
//                 d="M 450 230 L 453 238 L 461 238 L 455 243 L 457 251 L 450 246 L 443 251 L 445 243 L 439 238 L 447 238 Z"
//                 fill="#FCD34D"
//                 opacity="0.7"
//               />
//               <path
//                 d="M 60 140 L 62 146 L 68 146 L 63 150 L 65 156 L 60 152 L 55 156 L 57 150 L 52 146 L 58 146 Z"
//                 fill="#A78BFA"
//                 opacity="0.7"
//               />
//               <path
//                 d="M 430 100 L 432 105 L 437 105 L 433 108 L 435 113 L 430 110 L 425 113 L 427 108 L 423 105 L 428 105 Z"
//                 fill="#FCD34D"
//                 opacity="0.6"
//               />

//               {/* Connection lines */}
//               <line
//                 x1="170"
//                 y1="235"
//                 x2="255"
//                 y2="225"
//                 stroke="#FFFFFF"
//                 strokeWidth="2"
//                 opacity="0.2"
//                 strokeDasharray="5,5"
//               />
//               <line
//                 x1="255"
//                 y1="225"
//                 x2="345"
//                 y2="240"
//                 stroke="#FFFFFF"
//                 strokeWidth="2"
//                 opacity="0.2"
//                 strokeDasharray="5,5"
//               />
//             </svg>
//           </div>

//           <p className="text-orange-50 text-sm mt-6 max-w-sm relative z-10">
//             Streamline your e-commerce operations with{" "}
//             <span className="font-semibold text-white">RushBaskets</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/image 1.png";
import api from "../api/api";
import axios from "axios";
import { BASE_URL } from "../api/api";
import {
  Eye,
  EyeOff,
  Phone,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ── Grocery SVG Illustration ──────────────────────────────────────────────────
const GroceryIllustration = () => (
  <svg
    viewBox="0 0 420 340"
    className="w-full h-auto max-h-64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background circles */}
    <circle cx="210" cy="170" r="155" fill="white" fillOpacity="0.07" />
    <circle cx="210" cy="170" r="110" fill="white" fillOpacity="0.07" />

    {/* Shopping basket */}
    <path
      d="M120 210 L140 270 L280 270 L300 210 Z"
      fill="white"
      fillOpacity="0.9"
    />
    <path
      d="M115 210 H305"
      stroke="white"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M155 210 L140 170"
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M265 210 L280 170"
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
    />
    {/* Basket weave lines */}
    <line
      x1="155"
      y1="230"
      x2="165"
      y2="265"
      stroke="#f97316"
      strokeWidth="2"
      strokeOpacity="0.4"
    />
    <line
      x1="175"
      y1="215"
      x2="178"
      y2="265"
      stroke="#f97316"
      strokeWidth="2"
      strokeOpacity="0.4"
    />
    <line
      x1="195"
      y1="212"
      x2="195"
      y2="265"
      stroke="#f97316"
      strokeWidth="2"
      strokeOpacity="0.4"
    />
    <line
      x1="215"
      y1="212"
      x2="213"
      y2="265"
      stroke="#f97316"
      strokeWidth="2"
      strokeOpacity="0.4"
    />
    <line
      x1="235"
      y1="213"
      x2="230"
      y2="265"
      stroke="#f97316"
      strokeWidth="2"
      strokeOpacity="0.4"
    />
    <line
      x1="255"
      y1="218"
      x2="247"
      y2="265"
      stroke="#f97316"
      strokeWidth="2"
      strokeOpacity="0.4"
    />

    {/* Handle */}
    <path
      d="M165 170 Q210 120 255 170"
      stroke="white"
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
    />

    {/* Carrot */}
    <ellipse
      cx="110"
      cy="175"
      rx="10"
      ry="30"
      fill="#fb923c"
      transform="rotate(-20 110 175)"
    />
    <path
      d="M110 148 Q100 130 90 128"
      stroke="#4ade80"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M110 148 Q112 128 108 122"
      stroke="#4ade80"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M110 148 Q122 132 124 126"
      stroke="#4ade80"
      strokeWidth="4"
      strokeLinecap="round"
    />

    {/* Apple */}
    <ellipse cx="175" cy="188" rx="22" ry="24" fill="#ef4444" />
    <ellipse
      cx="167"
      cy="186"
      rx="10"
      ry="13"
      fill="#f87171"
      fillOpacity="0.5"
    />
    <path
      d="M175 167 Q178 158 185 155"
      stroke="#4ade80"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M175 167 Q173 158 176 152"
      stroke="#4ade80"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />

    {/* Milk carton */}
    <rect
      x="196"
      y="168"
      width="28"
      height="38"
      rx="3"
      fill="white"
      fillOpacity="0.9"
    />
    <polygon points="196,168 210,152 224,168" fill="white" fillOpacity="0.7" />
    <rect
      x="200"
      y="178"
      width="20"
      height="14"
      rx="2"
      fill="#3b82f6"
      fillOpacity="0.8"
    />
    <text
      x="210"
      y="188"
      textAnchor="middle"
      fontSize="6"
      fill="white"
      fontWeight="bold"
    >
      MILK
    </text>

    {/* Broccoli */}
    <rect x="234" y="195" width="8" height="18" rx="4" fill="#4ade80" />
    <circle cx="238" cy="188" r="12" fill="#22c55e" />
    <circle cx="228" cy="192" r="9" fill="#16a34a" />
    <circle cx="248" cy="192" r="9" fill="#16a34a" />
    <circle cx="232" cy="183" r="7" fill="#22c55e" />
    <circle cx="244" cy="183" r="7" fill="#22c55e" />

    {/* Banana */}
    <path
      d="M290 160 Q320 140 330 165 Q325 185 300 190 Q280 188 290 160Z"
      fill="#fbbf24"
    />
    <path
      d="M290 160 Q315 148 326 167"
      stroke="#f59e0b"
      strokeWidth="2"
      fill="none"
    />

    {/* Tomato */}
    <circle cx="310" cy="215" r="20" fill="#ef4444" />
    <ellipse cx="303" cy="213" rx="7" ry="9" fill="#f87171" fillOpacity="0.4" />
    <path
      d="M310 197 Q308 188 304 185"
      stroke="#4ade80"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M310 197 Q313 187 318 185"
      stroke="#4ade80"
      strokeWidth="3"
      strokeLinecap="round"
    />

    {/* Floating sparkles */}
    <circle cx="80" cy="230" r="4" fill="white" fillOpacity="0.6" />
    <circle cx="345" cy="175" r="3" fill="white" fillOpacity="0.5" />
    <circle cx="95" cy="135" r="5" fill="white" fillOpacity="0.4" />
    <circle cx="360" cy="240" r="4" fill="white" fillOpacity="0.5" />
    <circle cx="70" cy="280" r="3" fill="white" fillOpacity="0.3" />

    {/* Ground shadow */}
    <ellipse
      cx="210"
      cy="295"
      rx="130"
      ry="10"
      fill="white"
      fillOpacity="0.15"
    />
  </svg>
);

// ── OTP Input Boxes ───────────────────────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
  const inputsRef = useRef([]);
  const digits = (value + "    ").slice(0, 4).split("");

  const handleInput = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    const newDigits = [...digits];
    newDigits[idx] = val[val.length - 1];
    const newOtp = newDigits.join("").trim();
    onChange(newOtp);
    if (idx < 3) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      const newDigits = [...digits];
      if (newDigits[idx].trim()) {
        newDigits[idx] = " ";
      } else if (idx > 0) {
        newDigits[idx - 1] = " ";
        inputsRef.current[idx - 1]?.focus();
      }
      onChange(newDigits.join("").trim());
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 3) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 3);
    inputsRef.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-3 justify-start">
      {[0, 1, 2, 3].map((idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[idx].trim()}
          onChange={(e) => handleInput(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all bg-white caret-transparent"
        />
      ))}
    </div>
  );
};

// ── Main Login Component ──────────────────────────────────────────────────────
export default function Login() {
  const [formData, setFormData] = useState({
    mobile: "",
    role: "admin",
    otp: "",
  });
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((p) => p - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateMobile = (m) => /^[6-9]\d{9}$/.test(m);

  const handleSendOTP = async (e) => {
    e?.preventDefault?.();
    if (!validateMobile(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setSending(true);
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { mobile: formData.mobile, role: formData.role },
        {
          withCredentials: false,
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
        },
      );
      if (response.data.success) {
        setOtpSent(true);
        setSuccess("OTP sent successfully to your mobile number");
        setTimer(60);
      } else {
        setError(
          response.data.message || "Failed to send OTP. Please try again.",
        );
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (status === 401) {
        setError("You are not authorized. Please check your credentials.");
      } else if (status === 403) {
        setError("Access denied. You do not have permission to log in.");
      } else if (status === 404) {
        setError("Account not found. Please check your mobile number.");
      } else if (status === 429) {
        setError("Too many attempts. Please wait a moment and try again.");
      } else if (status >= 500) {
        setError("Server is currently unavailable. Please try again later.");
      } else if (err.request) {
        setError(
          "Network error. Please check your internet connection and try again.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e?.preventDefault?.();
    if (!formData.otp || formData.otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }
    setVerifying(true);
    setError("");
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/verify-otp`,
        { mobile: formData.mobile, otp: formData.otp, role: formData.role },
        {
          withCredentials: false,
          headers: { "Content-Type": "application/json" },
        },
      );
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("authToken", token);
        if (res.data?.data) {
          localStorage.setItem("user", JSON.stringify(res.data.data));
          localStorage.setItem("userData", JSON.stringify(res.data.data));
        }
        const role = res.data?.data?.role || formData.role;
        localStorage.setItem("userRole", role);
        setSuccess("Login successful! Redirecting...");
        setTimeout(
          () =>
            navigate(role === "vendor" ? "/vendor/dashboard" : "/dashboard"),
          1000,
        );
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (status === 401) {
        setError("Incorrect OTP. Please check and try again.");
      } else if (status === 403) {
        setError("Access denied. You are not authorized to access this panel.");
      } else if (status === 404) {
        setError("Account not found. Please check your mobile number.");
      } else if (status === 410) {
        setError("OTP has expired. Please request a new one.");
      } else if (status === 429) {
        setError("Too many failed attempts. Please wait before trying again.");
      } else if (status >= 500) {
        setError("Server is currently unavailable. Please try again later.");
      } else if (err.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") otpSent ? handleVerifyOTP(e) : handleSendOTP(e);
  };

  const handleResendOTP = () => {
    if (timer === 0) handleSendOTP({ preventDefault: () => {} });
  };

  // Dynamic labels
  const roleLabel = formData.role === "admin" ? "Admin" : "Vendor";

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="w-full max-w-5xl h-full max-h-[92vh] bg-white rounded-md shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* ── Left: Form ── */}
        <div className="w-full lg:w-[48%] h-full flex flex-col justify-center px-8 py-6 bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-hidden">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="RushBaskets Logo"
              className="h-18 object-contain mix-blend-multiply"
            />
          </div>

          {/* Title - changes with role */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {roleLabel} Login
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              This panel is strictly for authorized{" "}
              {formData.role === "admin" ? "administrators" : "vendors"}.
              Unauthorized access is prohibited.
            </p>
          </div>

          {/* Error/Success */}
          {error && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-red-700">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-3 p-2.5 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-green-700">{success}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Login As
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={otpSent}
                className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 text-sm transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter 10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  disabled={otpSent}
                  maxLength="10"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* OTP Boxes */}
            {otpSent && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3">
                  Enter OTP
                </label>
                <OtpInput
                  value={formData.otp}
                  onChange={(otp) => {
                    setFormData((prev) => ({ ...prev, otp }));
                    setError("");
                  }}
                />
                {/* Resend */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Didn't receive OTP?</span>
                  {timer > 0 ? (
                    <span className="text-gray-400">Resend in {timer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-orange-600 font-semibold hover:text-orange-700 transition"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={otpSent ? handleVerifyOTP : handleSendOTP}
              disabled={sending || verifying}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {sending || verifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {sending ? "Sending OTP..." : "Verifying..."}
                </>
              ) : otpSent ? (
                <>Verify & Login →</>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send OTP
                </>
              )}
            </button>

            {/* Change mobile */}
            {otpSent && (
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setFormData((prev) => ({ ...prev, otp: "" }));
                  setError("");
                  setSuccess("");
                  setTimer(0);
                }}
                className="w-full text-center text-xs text-gray-500 hover:text-orange-600 transition"
              >
                ← Change Mobile Number
              </button>
            )}
          </div>
        </div>

        {/* ── Right: Grocery Illustration ── */}
        <div className="hidden lg:flex w-[52%] h-full flex-col items-center justify-center px-10 py-8 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-center relative overflow-hidden">
          {/* Blobs */}
          <div className="absolute top-8 left-8 w-40 h-40 bg-white rounded-full opacity-5 blur-3xl" />
          <div className="absolute bottom-16 right-12 w-52 h-52 bg-yellow-200 rounded-full opacity-10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white rounded-full opacity-5 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center gap-4 w-full">
            <span className="text-orange-100 text-xs font-semibold uppercase tracking-widest">
              E-Commerce Management
            </span>
            <h2 className="text-white text-4xl font-bold leading-tight">
              Welcome Back
              <br />
              <span className="text-orange-100 text-2xl font-medium">
                {roleLabel}
              </span>
            </h2>

            {/* Grocery SVG */}
            <div className="w-full max-w-sm">
              <GroceryIllustration />
            </div>

            <p className="text-orange-50 text-sm max-w-xs leading-relaxed">
              Manage your grocery operations with{" "}
              <span className="font-bold text-white">RushBaskets</span> — fast,
              fresh, and reliable.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {["🛒 Orders", "📦 Inventory", "📊 Analytics", "🔔 Alerts"].map(
                (f) => (
                  <span
                    key={f}
                    className="bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {f}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
