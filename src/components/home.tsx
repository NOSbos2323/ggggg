import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import JobListings from "./JobListings";
import SearchFilters from "./SearchFilters";
import TradesShowcase from "./TradesShowcase";
import CategoryNavigation from "./CategoryNavigation";
import { defaultCategories } from "../data/categories";

// Helper function to get category name in Arabic
const getCategoryName = (categoryId: string) => {
  const category = defaultCategories.find((cat) => cat.id === categoryId);
  return category ? category.name : categoryId;
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryResults, setShowCategoryResults] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmployerDialogOpen, setIsEmployerDialogOpen] = useState(false);
  const [isNetworkSelectionOpen, setIsNetworkSelectionOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    nationality: "",
    phoneNumber: "",
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryResults(true);
    // Smooth scroll to job listings section
    setTimeout(() => {
      const jobSection = document.getElementById("job-listings-section");
      if (jobSection) {
        jobSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
    setShowCategoryResults(false);
  };

  const handleJobSeekerClick = () => {
    // Scroll to category selection section
    const categorySection = document.querySelector("[data-category-section]");
    if (categorySection) {
      categorySection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleEmployerClick = () => {
    setIsDialogOpen(true);
  };

  const handleCreateAccount = () => {
    setIsDialogOpen(false);
    setIsEmployerDialogOpen(true);
  };

  const handlePhoneNumberClick = () => {
    setIsEmployerDialogOpen(false);
    setIsNetworkSelectionOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNetworkSelect = (network: string) => {
    console.log(`Selected network: ${network}`);

    const networkUrls = {
      etisalat: "https://smrturl.co/a/s414e4edfbe/10452?s1=",
      du: "https://rpljvxq.one/cl/a7e3a40c859ed9d5?p1=&p2=&source=&site=",
      Mobily: "https://rpljvxq.one/cl/a7e3a40c859ed9d5?p1=&p2=&source=&site=",
      STC: "https://rpljvxq.one/cl/a7e3a40c859ed9d5?p1=&p2=&source=&site=",
      "Virgin Mobile":
        "https://rpljvxq.one/cl/a7e3a40c859ed9d5?p1=&p2=&source=&site=",
    };

    const url = networkUrls[network as keyof typeof networkUrls];
    if (url) {
      window.open(url, "_blank");
    }

    // Close both dialogs and reset form
    setIsNetworkSelectionOpen(false);
    setIsEmployerDialogOpen(false);
    setFormData({ fullName: "", nationality: "", phoneNumber: "" });
  };

  const handleContinueToNetworks = () => {
    // Validate required fields
    if (
      !formData.fullName.trim() ||
      !formData.nationality.trim() ||
      !formData.phoneNumber.trim()
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setIsNetworkSelectionOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-3xl border-b border-gradient-to-r from-blue-200/40 via-purple-200/40 to-indigo-200/40 shadow-2xl sticky top-0 z-50 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/30 to-indigo-50/30"></div>
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-5 flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
              Trabaja UAE
            </div>
            <div className="ml-2 sm:ml-3 flex items-center gap-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="outline"
              onClick={handleJobSeekerClick}
              className="hidden sm:inline-flex text-blue-800 border-2 border-blue-600 hover:border-blue-700 hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-xl px-4 sm:px-6 md:px-10 py-2 sm:py-3 md:py-4 font-bold text-sm sm:text-base md:text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 backdrop-blur-sm bg-white/90"
            >
              طلب عمل
            </Button>
            <Button
              onClick={handleEmployerClick}
              className="hidden sm:inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl px-4 sm:px-6 md:px-10 py-2 sm:py-3 md:py-4 font-bold text-sm sm:text-base md:text-xl transform hover:scale-105"
            >
              صاحب عمل
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 transform hover:scale-110 p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-16 sm:py-20 md:py-24 lg:py-20 xl:py-24 2xl:py-32 overflow-hidden min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh] xl:min-h-[95vh] flex items-center hero-desktop">
        {/* Workers Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 sm:opacity-75"
          style={{
            backgroundImage: "url('/workers-bg.jpg')",
            backgroundBlendMode: "overlay",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-purple-600/40 to-indigo-700/40"></div>
        <div className="absolute inset-0">
          <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-emerald-300/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-300/25 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-indigo-300/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-36 sm:w-54 md:w-72 h-36 sm:h-54 md:h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1500"></div>
          <div className="absolute top-1/4 right-1/4 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-yellow-300/15 rounded-full blur-2xl animate-pulse delay-3000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-28 sm:w-42 md:w-56 h-28 sm:h-42 md:h-56 bg-cyan-300/15 rounded-full blur-2xl animate-pulse delay-2500"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl font-black mb-8 sm:mb-10 md:mb-12 lg:mb-8 xl:mb-10 2xl:mb-12 text-white drop-shadow-2xl animate-fade-in-up leading-tight">
              اعثر على وظيفة في الإمارات
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl mb-6 sm:mb-8 md:mb-10 lg:mb-8 xl:mb-10 2xl:mb-12 text-white/95 leading-relaxed drop-shadow-xl font-semibold animate-fade-in-up delay-300 px-2 max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
              تواصل مع أفضل أصحاب العمل والحرفيين المهرة في جميع أنحاء الإمارات
            </p>

            {/* Direct Contact Banner */}
            <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-10 xl:mb-12 2xl:mb-16 animate-fade-in-up delay-400">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border-2 border-blue-400/30 rounded-full px-6 sm:px-8 md:px-10 py-3 sm:py-4 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 cursor-pointer group">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl drop-shadow-lg group-hover:text-blue-100 transition-colors duration-300">
                  تواصل مباشر
                </span>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg delay-500"></div>
              </div>
            </div>

            {/* Action Buttons for All Screens */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 md:gap-10 mt-8 sm:mt-10 animate-fade-in-up delay-500 px-4">
              <Button
                variant="outline"
                onClick={handleJobSeekerClick}
                className="border-3 border-white text-white hover:bg-white hover:text-blue-700 text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl px-8 sm:px-12 md:px-16 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-5 md:py-6 lg:py-5 xl:py-6 2xl:py-8 rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-bold w-full sm:min-w-[280px] md:min-w-[320px] lg:min-w-[300px] xl:min-w-[350px] bg-white/20 min-h-[60px] sm:min-h-[70px] lg:min-h-[65px] xl:min-h-[75px]"
              >
                طلب عمل
              </Button>
              <Button
                onClick={handleEmployerClick}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl px-8 sm:px-12 md:px-16 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-5 md:py-6 lg:py-5 xl:py-6 2xl:py-8 rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 font-bold w-full sm:min-w-[280px] md:min-w-[320px] lg:min-w-[300px] xl:min-w-[350px] min-h-[60px] sm:min-h-[70px] lg:min-h-[65px] xl:min-h-[75px]"
              >
                صاحب عمل
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section id="job-listings-section" className="py-20 relative">
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-white/50 via-blue-50/40 to-indigo-50/50 rounded-3xl backdrop-blur-sm border border-white/60 shadow-xl mx-8 my-8 section-bg-enhanced"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 md:mb-0 bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {selectedCategory
                  ? "الوظائف المتاحة في الفئة المختارة"
                  : "الفرص الوظيفية المميزة"}
              </h2>
              {selectedCategory && (
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-lg text-gray-600 font-medium">
                    الفئة:
                  </span>
                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200/50 text-blue-800 px-6 py-3 rounded-full text-sm font-semibold shadow-sm">
                    {getCategoryName(selectedCategory)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCategoryFilter}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 rounded-full transition-all duration-300"
                  >
                    إلغاء الفلتر ✕
                  </Button>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              onClick={clearCategoryFilter}
              className="border-gray-300 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              عرض جميع الوظائف
            </Button>
          </div>

          <div className="mt-12">
            <JobListings selectedCategory={selectedCategory} />
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section data-category-section className="py-20 relative">
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-white/50 via-purple-50/40 to-indigo-50/50 rounded-3xl backdrop-blur-sm border border-white/60 shadow-xl mx-8 my-8 section-bg-enhanced"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              تصفح حسب الفئة
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
          <CategoryNavigation onCategorySelect={handleCategorySelect} />
        </div>
      </section>

      {/* Craftsmen Showcase */}
      <section className="py-20 relative">
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-white/50 via-pink-50/40 to-purple-50/50 rounded-3xl backdrop-blur-sm border border-white/60 shadow-xl mx-8 my-8 section-bg-enhanced"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div className="text-center md:text-right">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 md:mb-0 bg-gradient-to-r from-gray-800 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                الحرفيون المهرة
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto md:mx-0 rounded-full"></div>
            </div>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              عرض جميع الحرفيين
            </Button>
          </div>

          <TradesShowcase />
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white drop-shadow-2xl">
            هل أنت مستعد للعثور على فرصتك القادمة؟
          </h2>
          <p className="text-xl md:text-2xl mb-16 max-w-4xl mx-auto text-white/90 leading-relaxed drop-shadow-lg">
            انضم إلى آلاف الباحثين عن العمل وأصحاب العمل الذين يتواصلون يومياً
            في سوق العمل الرائد في الإمارات
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              انشر وظيفة
            </Button>
            <Button
              variant="outline"
              className="border-3 border-white text-white hover:bg-white hover:text-blue-600 text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              أنشئ ملفك الشخصي
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Trabaja UAE
              </h3>
              <p className="text-gray-300">
                سوق العمل الرائد الذي يربط المواهب الإماراتية بالفرص
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">للباحثين عن العمل</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    تصفح الوظائف
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    إنشاء السيرة الذاتية
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    تنبيهات الوظائف
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    نصائح مهنية
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">لأصحاب العمل</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    انشر وظيفة
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    تصفح المرشحين
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    خطط الأسعار
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    حلول التوظيف
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">اتصل بنا</h4>
              <ul className="space-y-3">
                <li className="text-gray-300">
                  البريد الإلكتروني: info@trabajauae.com
                </li>
                <li className="text-gray-300">الهاتف: +971 XX XX XX XX</li>
                <li className="flex space-x-4 mt-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="5"
                        ry="5"
                      ></rect>
                      <path d="M16 11.37A4 4 0 11-8 0 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Trabaja UAE. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>

      {/* Initial Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="sm:max-w-[500px] text-right bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 backdrop-blur-xl border-2 border-blue-200/50 shadow-2xl rounded-3xl"
          dir="rtl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-t-3xl"></div>
          <DialogHeader className="relative z-10 text-center space-y-4 pt-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <DialogTitle className="text-right text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              إنشاء حساب مطلوب
            </DialogTitle>
            <DialogDescription className="text-right text-gray-600 text-lg leading-relaxed">
              يجب عليك إنشاء حساب كي تتواصل مع صاحب العمل وتتمكن من التقديم على
              الوظائف.
            </DialogDescription>
          </DialogHeader>
          <div className="relative z-10 flex justify-center mt-6">
            <Button
              onClick={handleCreateAccount}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              إنشاء حساب الآن
            </Button>
          </div>
          <DialogFooter className="relative z-10 flex-col-reverse sm:flex-row-reverse sm:justify-center sm:space-x-reverse sm:space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 rounded-xl"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employer Registration Dialog */}
      <Dialog
        open={isEmployerDialogOpen}
        onOpenChange={setIsEmployerDialogOpen}
      >
        <DialogContent
          className="sm:max-w-[500px] text-right bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-2xl"
          dir="rtl"
        >
          <DialogHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z"
                />
              </svg>
            </div>
            <DialogTitle className="text-right text-2xl font-bold text-gray-800">
              إنشاء حساب صاحب عمل
            </DialogTitle>
            <DialogDescription className="text-right text-gray-600 text-lg">
              انضم إلى منصة Trabaja UAE كصاحب عمل واعثر على أفضل المواهب
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-right block text-sm font-semibold text-gray-700"
              >
                الاسم الكامل *
              </label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="text-right border-2 border-gray-200 focus:border-blue-500 rounded-lg py-3 px-4 text-lg"
                dir="rtl"
                placeholder="أدخل اسمك الكامل"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="nationality"
                className="text-right block text-sm font-semibold text-gray-700"
              >
                الجنسية *
              </label>
              <Select
                value={formData.nationality}
                onValueChange={(value) =>
                  handleInputChange("nationality", value)
                }
                dir="rtl"
              >
                <SelectTrigger className="text-right border-2 border-gray-200 focus:border-blue-500 rounded-lg py-3 px-4 text-lg h-auto">
                  <SelectValue placeholder="اختر جنسيتك" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uae">🇦🇪 إماراتي</SelectItem>
                  <SelectItem value="saudi">🇸🇦 سعودي</SelectItem>
                  <SelectItem value="egyptian">🇪🇬 مصري</SelectItem>
                  <SelectItem value="indian">🇮🇳 هندي</SelectItem>
                  <SelectItem value="pakistani">🇵🇰 باكستاني</SelectItem>
                  <SelectItem value="bangladeshi">🇧🇩 بنغلاديشي</SelectItem>
                  <SelectItem value="filipino">🇵🇭 فلبيني</SelectItem>
                  <SelectItem value="sri_lankan">🇱🇰 سريلانكي</SelectItem>
                  <SelectItem value="nepali">🇳🇵 نيبالي</SelectItem>
                  <SelectItem value="jordanian">🇯🇴 أردني</SelectItem>
                  <SelectItem value="lebanese">🇱🇧 لبناني</SelectItem>
                  <SelectItem value="syrian">🇸🇾 سوري</SelectItem>
                  <SelectItem value="yemeni">🇾🇪 يمني</SelectItem>
                  <SelectItem value="sudanese">🇸🇩 سوداني</SelectItem>
                  <SelectItem value="moroccan">🇲🇦 مغربي</SelectItem>
                  <SelectItem value="tunisian">🇹🇳 تونسي</SelectItem>
                  <SelectItem value="algerian">🇩🇿 جزائري</SelectItem>
                  <SelectItem value="other">🌍 أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Button
                onClick={handlePhoneNumberClick}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                  />
                </svg>
                تأكيد رقم الهاتف
              </Button>
            </div>
          </div>
          <DialogFooter className="relative z-10 flex-col-reverse sm:flex-row-reverse sm:justify-center sm:space-x-reverse sm:space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsEmployerDialogOpen(false)}
              className="border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 rounded-xl"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Network Selection Dialog */}
      <Dialog
        open={isNetworkSelectionOpen}
        onOpenChange={setIsNetworkSelectionOpen}
      >
        <DialogContent
          className="sm:max-w-[600px] text-right bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-2 border-blue-200 shadow-2xl"
          dir="rtl"
        >
          <DialogHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <DialogTitle className="text-right text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              اختر شبكة الهاتف للتواصل
            </DialogTitle>
            <DialogDescription className="text-right text-gray-600 text-lg mt-4">
              مرحباً {formData.fullName}، سنرسل رمز التحقق إلى رقم{" "}
              {formData.phoneNumber}. اختر شبكة الهاتف المناسبة لإكمال التسجيل
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-3">
              <Button
                onClick={() => handleNetworkSelect("etisalat")}
                className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <span>اتصالات (Etisalat)</span>
              </Button>
              <Button
                onClick={() => handleNetworkSelect("du")}
                className="w-full h-14 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <span>دو (du)</span>
              </Button>
              <Button
                onClick={() => handleNetworkSelect("Mobily")}
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <span>موبايلي (Mobily)</span>
              </Button>
              <Button
                onClick={() => handleNetworkSelect("STC")}
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <span>إس تي سي (STC)</span>
              </Button>
              <Button
                onClick={() => handleNetworkSelect("Virgin Mobile")}
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <span>فيرجن موبايل (Virgin Mobile)</span>
              </Button>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 mt-4">
              <p className="text-sm text-gray-600 text-center font-medium">
                سيتم إرسال رمز التحقق عبر رسالة نصية إلى رقمك
              </p>
              <p className="text-xs text-gray-500 text-center mt-2">
                تأكد من أن رقم الهاتف صحيح: {formData.phoneNumber}
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => setIsNetworkSelectionOpen(false)}
              className="px-8 py-3 text-lg font-semibold border-2 border-gray-300 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              العودة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
