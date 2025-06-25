import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Briefcase, MapPin, Calendar, DollarSign, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  deadline: string;
  jobType: string;
  logo: string;
  category?: string;
}

interface JobListingsProps {
  listings?: JobListing[];
  selectedCategory?: string | null;
}

const JobListings = ({
  listings = defaultListings,
  selectedCategory,
}: JobListingsProps) => {
  const [filteredListings, setFilteredListings] =
    useState<JobListing[]>(listings);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");

  // Filter jobs based on search term and job type
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterJobs(term, jobTypeFilter);
  };

  const handleJobTypeChange = (value: string) => {
    setJobTypeFilter(value);
    filterJobs(searchTerm, value);
  };

  const filterJobs = (term: string, type: string) => {
    let filtered = listings;

    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }

    if (term) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(term.toLowerCase()) ||
          job.company.toLowerCase().includes(term.toLowerCase()),
      );
    }

    if (type !== "all") {
      filtered = filtered.filter((job) => job.jobType === type);
    }

    setFilteredListings(filtered);
  };

  // Update filtered listings when selectedCategory or listings change
  React.useEffect(() => {
    filterJobs(searchTerm, jobTypeFilter);
  }, [selectedCategory, listings, searchTerm, jobTypeFilter]);

  return (
    <div className="w-full py-8 sm:py-12 md:py-16 px-3 sm:px-6 md:px-8">
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-white/40 via-blue-50/30 to-indigo-50/40 rounded-3xl backdrop-blur-sm border border-white/50 shadow-lg -z-10 section-bg-enhanced"></div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-8 sm:mb-10 md:mb-12">
          <div className="text-center md:text-right">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4">
              {selectedCategory
                ? `وظائف ${getCategoryName(selectedCategory)}`
                : "الوظائف المميزة"}
            </h2>
            {selectedCategory && (
              <div className="flex items-center justify-center md:justify-start gap-3 mt-2 sm:mt-3 md:mt-4">
                <span className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">
                  تم العثور على {filteredListings.length} وظيفة في هذه الفئة
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative w-full">
              <Input
                placeholder="ابحث عن الوظائف..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-12 sm:pl-14 text-right h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-gray-200/50 focus:border-blue-500 focus:ring-2 sm:focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-base sm:text-lg"
                dir="rtl"
              />
              <Briefcase className="absolute left-3 sm:left-5 top-3 sm:top-4.5 h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Select value={jobTypeFilter} onValueChange={handleJobTypeChange}>
                <SelectTrigger className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-gray-200/50 focus:border-blue-500 focus:ring-2 sm:focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-base sm:text-lg">
                  <SelectValue placeholder="نوع الوظيفة" />
                </SelectTrigger>
                <SelectContent className="rounded-xl sm:rounded-2xl border-2 sm:border-3 shadow-2xl">
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="full-time">دوام كامل</SelectItem>
                  <SelectItem value="part-time">دوام جزئي</SelectItem>
                  <SelectItem value="contract">عقد</SelectItem>
                  <SelectItem value="freelance">عمل حر</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 sm:gap-3 h-12 sm:h-14 px-4 sm:px-6 md:px-8 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-gray-200/50 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-base sm:text-lg transform hover:scale-105"
              >
                <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">المزيد من الفلاتر</span>
                <span className="sm:hidden">فلاتر</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 lg:gap-8">
          {filteredListings.length > 0 ? (
            filteredListings.slice(0, 6).map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <motion.div
                className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl p-12 shadow-2xl border border-blue-100"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-8xl mb-6">🔍</div>
                <p className="text-gray-600 text-xl mb-4 font-medium">
                  {selectedCategory
                    ? `لا توجد وظائف متاحة حالياً في فئة ${getCategoryName(selectedCategory)}`
                    : "لم يتم العثور على وظائف تطابق معاييرك."}
                </p>
                <p className="text-gray-500 text-lg">
                  جرب البحث في فئة أخرى أو تعديل معايير البحث
                </p>
              </motion.div>
            </div>
          )}
        </div>

        {filteredListings.length > 0 && (
          <div className="mt-16 text-center">
            <Button className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              عرض المزيد من الوظائف
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface JobCardProps {
  job: JobListing;
}

const JobCard = ({ job }: JobCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] =
    useState(false);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    nationality: "",
    phoneNumber: "",
  });

  const handleJobAction = () => {
    setIsDialogOpen(true);
  };

  const handleCreateAccount = () => {
    setIsDialogOpen(false);
    setIsRegistrationDialogOpen(true);
  };

  const handlePhoneNumberClick = () => {
    setIsRegistrationDialogOpen(false);
    setIsPhoneDialogOpen(true);
  };

  const handleNetworkSelect = (network: string) => {
    console.log(`Selected network: ${network}`);

    // Define the URLs for each network
    const networkUrls = {
      اتصالات: "https://smrturl.co/a/s414e4edfbe/10452?s1=",
      دو: "https://rpljvxq.one/cl/a7e3a40c859ed9d5?p1=&p2=&source=&site=",
      موبايلي: "https://rpljvxq.one/cl/a7e3a40c859ed9d5?p1=&p2=&source=&site=",
      "إس تي سي":
        "https://rpljvxq.one/cl/a7e3a40c859ed9d5?p1=&p2=&source=&site=",
      "فيرجن موبايل":
        "https://rpljvxq.one/cl/a7e3a40c859ed9d5?p1=&p2=&source=&site=",
    };

    // Redirect to the appropriate URL
    const url = networkUrls[network as keyof typeof networkUrls];
    if (url) {
      window.open(url, "_blank");
    }

    // Keep the dialog open - removed setIsPhoneDialogOpen(false)
    // Reset form data only
    setFormData({ fullName: "", nationality: "", phoneNumber: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      className="perspective-1000"
    >
      <Card className="group overflow-hidden h-full bg-gradient-to-br from-white via-blue-50/60 to-indigo-50/40 backdrop-blur-xl border-2 border-gray-200/80 hover:border-blue-400/80 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl min-h-[380px] lg:min-h-[420px] xl:min-h-[450px] job-card-desktop relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/8 before:via-purple-500/8 before:to-indigo-500/8 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/12 via-purple-600/12 to-indigo-600/12 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"></div>
        <CardHeader className="pb-2 sm:pb-3 md:pb-4 relative z-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-gray-200/60 group-hover:ring-blue-300/80 transition-all duration-300">
                  <img
                    src={
                      job.logo ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${job.company}`
                    }
                    alt={`${job.company} logo`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base lg:text-lg xl:text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-blue-800 transition-colors duration-300">
                    {job.title}
                  </CardTitle>
                  <p className="text-sm lg:text-base text-gray-700 font-semibold truncate group-hover:text-gray-900 transition-colors duration-300">
                    {job.company}
                  </p>
                </div>
              </div>
              <Badge
                variant={getBadgeVariant(job.jobType)}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded-lg flex-shrink-0 shadow-sm bg-gradient-to-r from-blue-500/15 to-indigo-500/15 border border-blue-300/60 text-blue-800 group-hover:from-blue-500/25 group-hover:to-indigo-500/25 group-hover:border-blue-400/80 transition-all duration-300"
              >
                {job.jobType}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3 lg:pb-4 relative z-10">
          <div className="space-y-2 lg:space-y-3">
            <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 rounded-lg bg-gradient-to-r from-blue-50/80 to-indigo-50/80 group-hover:from-blue-100/90 group-hover:to-indigo-100/90 transition-all duration-300">
              <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-blue-700 flex-shrink-0 group-hover:text-blue-800 transition-colors duration-300" />
              <span className="text-gray-800 font-semibold text-sm lg:text-base group-hover:text-gray-900 transition-colors duration-300 leading-relaxed">
                {job.location}
              </span>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 rounded-lg bg-gradient-to-r from-purple-50/80 to-pink-50/80 group-hover:from-purple-100/90 group-hover:to-pink-100/90 transition-all duration-300">
              <svg
                className="h-4 w-4 lg:h-5 lg:w-5 text-purple-700 flex-shrink-0 group-hover:text-purple-800 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6a2 2 0 00-2 2v6.002"
                />
              </svg>
              <span className="text-gray-800 font-semibold text-sm lg:text-base group-hover:text-gray-900 transition-colors duration-300 leading-relaxed">
                نوع العمل: {getJobTypeInArabic(job.jobType)}
              </span>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 rounded-lg bg-gradient-to-r from-green-50/80 to-emerald-50/80 group-hover:from-green-100/90 group-hover:to-emerald-100/90 transition-all duration-300">
              <svg
                className="h-4 w-4 lg:h-5 lg:w-5 text-green-700 flex-shrink-0 group-hover:text-green-800 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-gray-800 font-semibold text-sm lg:text-base group-hover:text-gray-900 transition-colors duration-300 leading-relaxed">
                الراتب: {job.salary.replace("دج", "درهم إماراتي")}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4 lg:pt-5 relative z-10">
          <div className="flex flex-col gap-3 lg:gap-4 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handleJobAction}
              className="w-full h-10 lg:h-12 rounded-xl border-2 border-blue-300/60 bg-gradient-to-r from-white via-blue-50/60 to-indigo-50/60 hover:from-blue-50 hover:via-blue-100/70 hover:to-indigo-100/70 hover:border-blue-400/80 backdrop-blur-sm transition-all duration-300 font-semibold text-sm lg:text-base shadow-md hover:shadow-lg transform hover:scale-105 hover:-translate-y-0.5 text-blue-800 hover:text-blue-900"
            >
              عرض التفاصيل
            </Button>
            <Button
              size="sm"
              onClick={handleJobAction}
              className="w-full h-10 lg:h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-sm lg:text-base transform hover:scale-105 hover:-translate-y-0.5 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:via-transparent before:to-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500"
            >
              تقديم سريع
            </Button>
          </div>
        </CardFooter>
      </Card>

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

      {/* Registration Dialog */}
      <Dialog
        open={isRegistrationDialogOpen}
        onOpenChange={setIsRegistrationDialogOpen}
      >
        <DialogContent
          className="sm:max-w-[550px] text-right bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 backdrop-blur-xl border-2 border-blue-200/60 shadow-2xl rounded-3xl"
          dir="rtl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/8 to-indigo-500/8 rounded-3xl"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-t-3xl"></div>
          <DialogHeader className="relative z-10 text-center space-y-4 pt-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <DialogTitle className="text-right text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              إنشاء حساب جديد
            </DialogTitle>
            <DialogDescription className="text-right text-gray-600 text-lg leading-relaxed">
              يرجى ملء البيانات التالية لإنشاء حسابك والبدء في التقديم على
              الوظائف
            </DialogDescription>
          </DialogHeader>
          <div className="relative z-10 grid gap-6 py-6">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-right text-sm font-semibold text-gray-700 block"
              >
                الاسم الكامل
              </label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="text-right h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                dir="rtl"
                placeholder="أدخل اسمك الكامل"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="nationality"
                className="text-right text-sm font-semibold text-gray-700 block"
              >
                الجنسية
              </label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) =>
                  handleInputChange("nationality", e.target.value)
                }
                className="text-right h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                dir="rtl"
                placeholder="أدخل جنسيتك"
              />
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                تأكيد رقم الهاتف
              </Button>
            </div>
          </div>
          <DialogFooter className="relative z-10 flex-col-reverse sm:flex-row-reverse sm:justify-center sm:space-x-reverse sm:space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsRegistrationDialogOpen(false)}
              className="border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 rounded-xl"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Phone Network Selection Dialog */}
      <Dialog open={isPhoneDialogOpen} onOpenChange={setIsPhoneDialogOpen}>
        <DialogContent
          className="sm:max-w-[500px] text-right bg-gradient-to-br from-white via-purple-50/40 to-pink-50/30 backdrop-blur-xl border-2 border-purple-200/60 shadow-2xl rounded-3xl"
          dir="rtl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-pink-500/8 to-indigo-500/8 rounded-3xl"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-t-3xl"></div>
          <DialogHeader className="relative z-10 text-center space-y-4 pt-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <DialogTitle className="text-right text-2xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              اختر شبكة الهاتف
            </DialogTitle>
            <DialogDescription className="text-right text-gray-600 text-lg leading-relaxed">
              قم بتأكيد رقم هاتفك عن طريق اختيار شبكة الاتصالات الخاصة بك
            </DialogDescription>
          </DialogHeader>
          <div className="relative z-10 grid gap-3 py-6">
            <Button
              onClick={() => handleNetworkSelect("اتصالات")}
              className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📱</span>
              <span>اتصالات (Etisalat)</span>
            </Button>
            <Button
              onClick={() => handleNetworkSelect("دو")}
              className="w-full h-14 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📱</span>
              <span>دو (du)</span>
            </Button>
            <Button
              onClick={() => handleNetworkSelect("موبايلي")}
              className="w-full h-14 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📱</span>
              <span>موبايلي (Mobily)</span>
            </Button>
            <Button
              onClick={() => handleNetworkSelect("إس تي سي")}
              className="w-full h-14 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📱</span>
              <span>إس تي سي (STC)</span>
            </Button>
            <Button
              onClick={() => handleNetworkSelect("فيرجن موبايل")}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📱</span>
              <span>فيرجن موبايل (Virgin Mobile)</span>
            </Button>
          </div>
          <div className="relative z-10 text-center text-sm text-gray-500 mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-200/50">
            <svg
              className="w-5 h-5 inline-block ml-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            سيتم إرسال رسالة تأكيد إلى رقم هاتفك
          </div>
          <DialogFooter className="relative z-10 flex-col-reverse sm:flex-row-reverse sm:justify-center sm:space-x-reverse sm:space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsPhoneDialogOpen(false)}
              className="border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 rounded-xl"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

const getBadgeVariant = (jobType: string) => {
  switch (jobType.toLowerCase()) {
    case "full-time":
      return "default";
    case "part-time":
      return "secondary";
    case "contract":
      return "outline";
    case "freelance":
      return "destructive";
    default:
      return "default";
  }
};

const getCategoryName = (categoryId: string) => {
  const categoryMap: { [key: string]: string } = {
    construction: "البناء والتشييد",
    electrical: "الأعمال الكهربائية",
    plumbing: "السباكة",
    technology: "التكنولوجيا",
    healthcare: "الرعاية الصحية",
    education: "التعليم",
    art: "الفن والتصميم",
    food: "خدمات الطعام",
    automotive: "السيارات",
    logistics: "اللوجستيات",
    marketing: "التسويق",
  };
  return categoryMap[categoryId] || categoryId;
};

const getJobTypeInArabic = (jobType: string) => {
  const jobTypeMap: { [key: string]: string } = {
    "full-time": "دوام كامل",
    "part-time": "دوام جزئي",
    contract: "عقد",
    freelance: "عمل حر",
  };
  return jobTypeMap[jobType] || jobType;
};

// Default job listings for demonstration
const defaultListings: JobListing[] = [
  {
    id: "1",
    title: "مطور واجهات أمامية",
    company: "تك الإمارات",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "80,000 - 100,000 درهم إماراتي/شهر",
    deadline: "30 يونيو 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&q=80",
    category: "technology",
  },
  {
    id: "2",
    title: "سباك محترف",
    company: "خدمات البناء الصحيح",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "40,000 - 60,000 درهم إماراتي/شهر",
    deadline: "15 يوليو 2024",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "3",
    title: "أخصائي تسويق",
    company: "الإمارات للنمو",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "70,000 - 90,000 درهم إماراتي/شهر",
    deadline: "5 يوليو 2024",
    jobType: "part-time",
    logo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80",
    category: "marketing",
  },
  {
    id: "4",
    title: "كهربائي معتمد",
    company: "باور تك الإمارات",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "50,000 - 75,000 درهم إماراتي/شهر",
    deadline: "20 يوليو 2024",
    jobType: "freelance",
    logo: "",
    category: "electrical",
  },
  {
    id: "5",
    title: "مصمم جرافيك",
    company: "العقول المبدعة",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "60,000 - 80,000 درهم إماراتي/شهر",
    deadline: "10 يوليو 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
    category: "art",
  },
  {
    id: "6",
    title: "نجار ماهر",
    company: "أعمال الخشب",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "45,000 - 65,000 درهم إماراتي/شهر",
    deadline: "25 يوليو 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "7",
    title: "طبيب عام",
    company: "مستشفى الأمل",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "120,000 - 150,000 درهم إماراتي/شهر",
    deadline: "1 أغسطس 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&q=80",
    category: "healthcare",
  },
  {
    id: "8",
    title: "مدرس رياضيات",
    company: "مدرسة النور الثانوية",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "55,000 - 70,000 درهم إماراتي/شهر",
    deadline: "15 أغسطس 2024",
    jobType: "full-time",
    logo: "",
    category: "education",
  },
  {
    id: "9",
    title: "طاهي رئيسي",
    company: "مطعم الأصالة",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "35,000 - 50,000 درهم إماراتي/شهر",
    deadline: "10 يوليو 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80",
    category: "food",
  },
  {
    id: "10",
    title: "ميكانيكي سيارات",
    company: "ورشة الخبراء",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "40,000 - 55,000 درهم إماراتي/شهر",
    deadline: "30 يوليو 2024",
    jobType: "full-time",
    logo: "",
    category: "automotive",
  },
  {
    id: "11",
    title: "سائق شاحنة",
    company: "شركة النقل السريع",
    location: "العين، الإمارات العربية المتحدة",
    salary: "45,000 - 60,000 درهم إماراتي/شهر",
    deadline: "5 أغسطس 2024",
    jobType: "full-time",
    logo: "",
    category: "logistics",
  },
  {
    id: "12",
    title: "مهندس برمجيات",
    company: "حلول التقنية المتقدمة الإمارات",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "90,000 - 120,000 درهم إماراتي/شهر",
    deadline: "20 يوليو 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=200&q=80",
    category: "technology",
  },
  // وظائف البناء والتشييد الإضافية
  {
    id: "13",
    title: "مهندس مدني",
    company: "شركة البناء المتقدم",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "85,000 - 110,000 درهم إماراتي/شهر",
    deadline: "15 يوليو 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&q=80",
    category: "construction",
  },
  {
    id: "14",
    title: "عامل بناء",
    company: "مؤسسة الإعمار",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "35,000 - 45,000 درهم إماراتي/شهر",
    deadline: "25 يوليو 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "15",
    title: "مقاول عام",
    company: "البناء الذهبي",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "70,000 - 95,000 درهم إماراتي/شهر",
    deadline: "10 أغسطس 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "16",
    title: "حداد بناء",
    company: "الحديد والصلب",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "40,000 - 55,000 درهم إماراتي/شهر",
    deadline: "30 يوليو 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "17",
    title: "مهندس معماري",
    company: "التصميم الحديث",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "90,000 - 120,000 درهم إماراتي/شهر",
    deadline: "5 أغسطس 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&q=80",
    category: "construction",
  },
  {
    id: "18",
    title: "عامل دهان",
    company: "ألوان الجزائر",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "30,000 - 40,000 درهم إماراتي/شهر",
    deadline: "20 يوليو 2024",
    jobType: "freelance",
    logo: "",
    category: "construction",
  },
  {
    id: "19",
    title: "مشرف موقع",
    company: "الإشراف المتميز",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "60,000 - 80,000 درهم إماراتي/شهر",
    deadline: "12 أغسطس 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "20",
    title: "عامل بلاط",
    company: "البلاط الفاخر",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "35,000 - 50,000 درهم إماراتي/شهر",
    deadline: "28 يوليو 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "21",
    title: "مهندس إنشائي",
    company: "الهندسة المتطورة",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "95,000 - 125,000 درهم إماراتي/شهر",
    deadline: "18 أغسطس 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80",
    category: "construction",
  },
  {
    id: "22",
    title: "عامل حفر",
    company: "الحفر والتنقيب",
    location: "العين، الإمارات العربية المتحدة",
    salary: "32,000 - 42,000 درهم إماراتي/شهر",
    deadline: "22 يوليو 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "23",
    title: "فني تكييف",
    company: "التبريد والتكييف",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "45,000 - 60,000 درهم إماراتي/شهر",
    deadline: "8 أغسطس 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "24",
    title: "عامل عزل",
    company: "العزل المثالي",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "38,000 - 48,000 درهم إماراتي/شهر",
    deadline: "15 أغسطس 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "25",
    title: "مقاول تشطيبات",
    company: "التشطيبات الراقية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "55,000 - 75,000 درهم إماراتي/شهر",
    deadline: "25 أغسطس 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "26",
    title: "عامل جبس",
    company: "الجبس الأنيق",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "33,000 - 43,000 درهم إماراتي/شهر",
    deadline: "30 يوليو 2024",
    jobType: "freelance",
    logo: "",
    category: "construction",
  },
  {
    id: "27",
    title: "مهندس كهرباء مباني",
    company: "الكهرباء المعمارية",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "80,000 - 105,000 درهم إماراتي/شهر",
    deadline: "12 أغسطس 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&q=80",
    category: "construction",
  },
  {
    id: "28",
    title: "عامل أسقف معلقة",
    company: "الأسقف الحديثة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "36,000 - 46,000 درهم إماراتي/شهر",
    deadline: "18 يوليو 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "29",
    title: "مقاول أرضيات",
    company: "الأرضيات المميزة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "42,000 - 58,000 درهم إماراتي/شهر",
    deadline: "5 سبتمبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "30",
    title: "عامل ديكور",
    company: "الديكور الفني",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "40,000 - 55,000 درهم إماراتي/شهر",
    deadline: "28 أغسطس 2024",
    jobType: "freelance",
    logo: "",
    category: "construction",
  },
  {
    id: "31",
    title: "مهندس مساحة",
    company: "المساحة الدقيقة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "75,000 - 95,000 درهم إماراتي/شهر",
    deadline: "10 سبتمبر 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&q=80",
    category: "construction",
  },
  {
    id: "32",
    title: "عامل لحام",
    company: "اللحام المتخصص",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "45,000 - 60,000 درهم إماراتي/شهر",
    deadline: "22 أغسطس 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "33",
    title: "مقاول سباكة",
    company: "السباكة الشاملة",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "15 سبتمبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "34",
    title: "عامل رخام",
    company: "الرخام الفاخر",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "48,000 - 63,000 درهم إماراتي/شهر",
    deadline: "3 سبتمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "35",
    title: "مهندس أمان وسلامة",
    company: "السلامة المهنية",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "70,000 - 90,000 درهم إماراتي/شهر",
    deadline: "20 سبتمبر 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    category: "construction",
  },
  {
    id: "36",
    title: "عامل خرسانة",
    company: "الخرسانة المسلحة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "37,000 - 47,000 درهم إماراتي/شهر",
    deadline: "12 سبتمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "37",
    title: "مقاول نوافذ وأبواب",
    company: "النوافذ العصرية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "52,000 - 68,000 درهم إماراتي/شهر",
    deadline: "8 سبتمبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "38",
    title: "عامل تمديدات",
    company: "التمديدات الكهربائية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "41,000 - 56,000 درهم إماراتي/شهر",
    deadline: "25 سبتمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "39",
    title: "مهندس تخطيط عمراني",
    company: "التخطيط الحضري",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "85,000 - 115,000 درهم إماراتي/شهر",
    deadline: "30 سبتمبر 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80",
    category: "construction",
  },
  {
    id: "40",
    title: "عامل صيانة مباني",
    company: "الصيانة الشاملة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "35,000 - 50,000 درهم إماراتي/شهر",
    deadline: "18 سبتمبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "41",
    title: "مقاول حدائق",
    company: "الحدائق الخضراء",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "38,000 - 53,000 درهم إماراتي/شهر",
    deadline: "5 أكتوبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "42",
    title: "عامل أسفلت",
    company: "الطرق والأسفلت",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "40,000 - 55,000 درهم إماراتي/شهر",
    deadline: "22 سبتمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "43",
    title: "مهندس جيوتقني",
    company: "الجيوتقنية المتقدمة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "80,000 - 105,000 درهم إماراتي/شهر",
    deadline: "15 أكتوبر 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&q=80",
    category: "construction",
  },
  {
    id: "44",
    title: "عامل تركيب مصاعد",
    company: "المصاعد الحديثة",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "55,000 - 75,000 درهم إماراتي/شهر",
    deadline: "28 سبتمبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "45",
    title: "مقاول أنظمة أمنية",
    company: "الأمان التقني",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "60,000 - 80,000 درهم إماراتي/شهر",
    deadline: "10 أكتوبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "46",
    title: "عامل عوازل مائية",
    company: "العزل المائي",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "42,000 - 57,000 درهم إماراتي/شهر",
    deadline: "3 أكتوبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "47",
    title: "مهندس طرق وجسور",
    company: "الطرق والجسور",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "90,000 - 120,000 درهم إماراتي/شهر",
    deadline: "20 أكتوبر 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    category: "construction",
  },
  {
    id: "48",
    title: "عامل تركيب زجاج",
    company: "الزجاج المعماري",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "38,000 - 53,000 درهم إماراتي/شهر",
    deadline: "12 أكتوبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "49",
    title: "مقاول تهوية",
    company: "أنظمة التهوية",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "48,000 - 63,000 درهم إماراتي/شهر",
    deadline: "25 أكتوبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "50",
    title: "عامل هدم",
    company: "الهدم المتخصص",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "35,000 - 48,000 درهم إماراتي/شهر",
    deadline: "8 أكتوبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "51",
    title: "مهندس بيئة",
    company: "الهندسة البيئية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "75,000 - 100,000 درهم إماراتي/شهر",
    deadline: "30 أكتوبر 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&q=80",
    category: "construction",
  },
  {
    id: "52",
    title: "عامل تركيب سيراميك",
    company: "السيراميك الفاخر",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "36,000 - 51,000 درهم إماراتي/شهر",
    deadline: "18 أكتوبر 2024",
    jobType: "freelance",
    logo: "",
    category: "construction",
  },
  {
    id: "53",
    title: "مقاول إضاءة",
    company: "الإضاءة المعمارية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "5 نوفمبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "54",
    title: "عامل تشطيب خشبي",
    company: "الخشب الطبيعي",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "44,000 - 59,000 درهم إماراتي/شهر",
    deadline: "22 أكتوبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "55",
    title: "مهندس مواد بناء",
    company: "مواد البناء المتطورة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "70,000 - 95,000 درهم إماراتي/شهر",
    deadline: "12 نوفمبر 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80",
    category: "construction",
  },
  {
    id: "56",
    title: "عامل تركيب مظلات",
    company: "المظلات العصرية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "32,000 - 47,000 درهم إماراتي/شهر",
    deadline: "28 أكتوبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "57",
    title: "مقاول أنظمة صوتية",
    company: "الصوتيات المعمارية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "55,000 - 75,000 درهم إماراتي/شهر",
    deadline: "15 نوفمبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "58",
    title: "عامل تركيب أسوار",
    company: "الأسوار المعدنية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "38,000 - 53,000 درهم إماراتي/شهر",
    deadline: "8 نوفمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "59",
    title: "مهندس تكلفة",
    company: "تقدير التكاليف",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "65,000 - 85,000 درهم إماراتي/شهر",
    deadline: "20 نوفمبر 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    category: "construction",
  },
  {
    id: "60",
    title: "عامل تركيب مكيفات",
    company: "التكييف المركزي",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "42,000 - 58,000 درهم إماراتي/شهر",
    deadline: "3 نوفمبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "61",
    title: "مقاول حمامات سباحة",
    company: "حمامات السباحة الفاخرة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "60,000 - 85,000 درهم إماراتي/شهر",
    deadline: "25 نوفمبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "62",
    title: "عامل تركيب قرميد",
    company: "القرميد التقليدي",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "35,000 - 50,000 درهم إماراتي/شهر",
    deadline: "10 نوفمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "63",
    title: "مهندس مياه وصرف صحي",
    company: "المياه والصرف الصحي",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "80,000 - 110,000 درهم إماراتي/شهر",
    deadline: "30 نوفمبر 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&q=80",
    category: "construction",
  },
  {
    id: "64",
    title: "عامل تركيب شبابيك ألمنيوم",
    company: "الألمنيوم الحديث",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "40,000 - 55,000 درهم إماراتي/شهر",
    deadline: "18 نوفمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "65",
    title: "مقاول أنظمة إنذار",
    company: "أنظمة الإنذار المتطورة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "52,000 - 72,000 درهم إماراتي/شهر",
    deadline: "5 ديسمبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "66",
    title: "عامل تركيب عوازل حرارية",
    company: "العزل الحراري",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "38,000 - 53,000 درهم إماراتي/شهر",
    deadline: "22 نوفمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "67",
    title: "مهندس إدارة مشاريع",
    company: "إدارة المشاريع الإنشائية",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "85,000 - 115,000 درهم إماراتي/شهر",
    deadline: "10 ديسمبر 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80",
    category: "construction",
  },
  {
    id: "68",
    title: "عامل تركيب أنابيب",
    company: "الأنابيب المتخصصة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "36,000 - 51,000 درهم إماراتي/شهر",
    deadline: "28 نوفمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "69",
    title: "مقاول أعمال حجرية",
    company: "الأعمال الحجرية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "45,000 - 65,000 درهم إماراتي/شهر",
    deadline: "15 ديسمبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "70",
    title: "عامل تركيب أرضيات خشبية",
    company: "الأرضيات الخشبية الفاخرة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "42,000 - 58,000 درهم إماراتي/شهر",
    deadline: "3 ديسمبر 2024",
    jobType: "freelance",
    logo: "",
    category: "construction",
  },
  {
    id: "71",
    title: "مهندس تصميم داخلي",
    company: "التصميم الداخلي المعاصر",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "70,000 - 95,000 درهم إماراتي/شهر",
    deadline: "20 ديسمبر 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&q=80",
    category: "construction",
  },
  {
    id: "72",
    title: "عامل تركيب مداخن",
    company: "المداخن والتهوية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "40,000 - 55,000 درهم إماراتي/شهر",
    deadline: "8 ديسمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "73",
    title: "مقاول أنظمة ري",
    company: "أنظمة الري الحديثة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "48,000 - 68,000 درهم إماراتي/شهر",
    deadline: "25 ديسمبر 2024",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "74",
    title: "عامل تركيب واجهات زجاجية",
    company: "الواجهات الزجاجية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "12 ديسمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "75",
    title: "مهندس جودة إنشائية",
    company: "ضمان الجودة الإنشائية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "75,000 - 100,000 درهم إماراتي/شهر",
    deadline: "30 ديسمبر 2024",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80",
    category: "construction",
  },
  {
    id: "76",
    title: "عامل تركيب أسطح معدنية",
    company: "الأسطح المعدنية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "38,000 - 53,000 درهم إماراتي/شهر",
    deadline: "18 ديسمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "77",
    title: "مقاول أنظمة تدفئة",
    company: "أنظمة التدفئة المركزية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "55,000 - 75,000 درهم إماراتي/شهر",
    deadline: "5 يناير 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "78",
    title: "عامل تركيب أبواب أمنية",
    company: "الأبواب الأمنية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "42,000 - 58,000 درهم إماراتي/شهر",
    deadline: "22 ديسمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "79",
    title: "مهندس استشاري",
    company: "الاستشارات الهندسية",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "90,000 - 125,000 درهم إماراتي/شهر",
    deadline: "10 يناير 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&q=80",
    category: "construction",
  },
  {
    id: "80",
    title: "عامل تركيب شاشات عرض",
    company: "الشاشات التفاعلية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "45,000 - 60,000 درهم إماراتي/شهر",
    deadline: "28 ديسمبر 2024",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "81",
    title: "مقاول أنظمة طاقة شمسية",
    company: "الطاقة الشمسية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "65,000 - 90,000 درهم إماراتي/شهر",
    deadline: "15 يناير 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "82",
    title: "عامل تركيب مصابيح LED",
    company: "الإضاءة الموفرة للطاقة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "35,000 - 50,000 درهم إماراتي/شهر",
    deadline: "3 يناير 2025",
    jobType: "freelance",
    logo: "",
    category: "construction",
  },
  {
    id: "83",
    title: "مهندس تقييم مباني",
    company: "تقييم العقارات",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "70,000 - 95,000 درهم إماراتي/شهر",
    deadline: "20 يناير 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    category: "construction",
  },
  {
    id: "84",
    title: "عامل تركيب أنظمة مراقبة",
    company: "أنظمة المراقبة الأمنية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "48,000 - 63,000 درهم إماراتي/شهر",
    deadline: "8 يناير 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "85",
    title: "مقاول أعمال تراثية",
    company: "ترميم التراث",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "55,000 - 80,000 درهم إماراتي/شهر",
    deadline: "25 يناير 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "86",
    title: "عامل تركيب أنظمة تهوية",
    company: "التهوية الصناعية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "40,000 - 58,000 درهم إماراتي/شهر",
    deadline: "12 يناير 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "87",
    title: "مهندس تطوير عقاري",
    company: "التطوير العقاري",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "85,000 - 120,000 درهم إماراتي/شهر",
    deadline: "30 يناير 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80",
    category: "construction",
  },
  {
    id: "88",
    title: "عامل تركيب أرضيات رياضية",
    company: "الأرضيات الرياضية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "45,000 - 65,000 درهم إماراتي/شهر",
    deadline: "18 يناير 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "89",
    title: "مقاول أنظمة صرف",
    company: "أنظمة الصرف المتطورة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "50,000 - 75,000 درهم إماراتي/شهر",
    deadline: "5 فبراير 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "90",
    title: "عامل تركيب أسقف متحركة",
    company: "الأسقف المتحركة",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "52,000 - 72,000 درهم إماراتي/شهر",
    deadline: "22 يناير 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "91",
    title: "مهندس تخصص خرسانة",
    company: "تقنيات الخرسانة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "75,000 - 105,000 درهم إماراتي/شهر",
    deadline: "10 فبراير 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&q=80",
    category: "construction",
  },
  {
    id: "92",
    title: "عامل تركيب أنظمة إطفاء",
    company: "أنظمة الإطفاء والسلامة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "46,000 - 61,000 درهم إماراتي/شهر",
    deadline: "28 يناير 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "93",
    title: "مقاول أعمال معدنية",
    company: "الأعمال المعدنية المتخصصة",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "48,000 - 68,000 درهم إماراتي/شهر",
    deadline: "15 فبراير 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "94",
    title: "عامل تركيب أنظمة تبريد",
    company: "التبريد الصناعي",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "44,000 - 62,000 درهم إماراتي/شهر",
    deadline: "3 فبراير 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "95",
    title: "مهندس تخطيط مدن",
    company: "تخطيط المدن الذكية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "80,000 - 115,000 درهم إماراتي/شهر",
    deadline: "20 فبراير 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    category: "construction",
  },
  {
    id: "96",
    title: "عامل تركيب أنظمة ذكية",
    company: "المباني الذكية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "55,000 - 75,000 درهم إماراتي/شهر",
    deadline: "8 فبراير 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "97",
    title: "مقاول أنظمة اتصالات",
    company: "الاتصالات المعمارية",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "60,000 - 85,000 درهم إماراتي/شهر",
    deadline: "25 فبراير 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "98",
    title: "عامل تركيب أنظمة طوارئ",
    company: "أنظمة الطوارئ",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "42,000 - 60,000 درهم إماراتي/شهر",
    deadline: "12 فبراير 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "99",
    title: "مهندس استدامة بيئية",
    company: "البناء المستدام",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "85,000 - 120,000 درهم إماراتي/شهر",
    deadline: "28 فبراير 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&q=80",
    category: "construction",
  },
  {
    id: "100",
    title: "عامل تركيب أنظمة تحكم",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "18 فبراير 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "101",
    title: "مقاول تشطيبات فاخرة",
    company: "التشطيبات الفاخرة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "65,000 - 95,000 درهم إماراتي/شهر",
    deadline: "5 مارس 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "102",
    title: "عامل تركيب أنظمة مياه",
    company: "أنظمة المياه المتطورة",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "38,000 - 55,000 درهم إماراتي/شهر",
    deadline: "22 فبراير 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "103",
    title: "مهندس تقنيات حديثة",
    company: "التقنيات الإنشائية الحديثة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "90,000 - 130,000 درهم إماراتي/شهر",
    deadline: "10 مارس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80",
    category: "construction",
  },
  {
    id: "104",
    title: "عامل تركيب أنظمة غاز",
    company: "أنظمة الغاز الطبيعي",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "45,000 - 65,000 درهم إماراتي/شهر",
    deadline: "28 فبراير 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "105",
    title: "مقاول أنظمة أتمتة",
    company: "الأتمتة المعمارية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "70,000 - 100,000 درهم إماراتي/شهر",
    deadline: "15 مارس 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "106",
    title: "عامل تركيب أنظمة تنقية",
    company: "أنظمة تنقية الهواء",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "40,000 - 58,000 درهم إماراتي/شهر",
    deadline: "3 مارس 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "107",
    title: "مهندس تصميم مستدام",
    company: "التصميم المستدام",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "75,000 - 110,000 درهم إماراتي/شهر",
    deadline: "20 مارس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&q=80",
    category: "construction",
  },
  {
    id: "108",
    title: "عامل تركيب أنظمة ضوئية",
    company: "الأنظمة الضوئية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "43,000 - 61,000 درهم إماراتي/شهر",
    deadline: "8 مارس 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "109",
    title: "مقاول أنظمة متقدمة",
    company: "الأنظمة التقنية المتقدمة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "65,000 - 95,000 درهم إماراتي/شهر",
    deadline: "25 مارس 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "110",
    title: "عامل تركيب أنظمة حماية",
    company: "أنظمة الحماية المتطورة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "47,000 - 67,000 درهم إماراتي/شهر",
    deadline: "12 مارس 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "111",
    title: "مهندس تطوير تقني",
    company: "التطوير التقني الإنشائي",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "85,000 - 125,000 درهم إماراتي/شهر",
    deadline: "30 مارس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&q=80",
    category: "construction",
  },
  {
    id: "112",
    title: "عامل تركيب أنظمة رقمية",
    company: "الأنظمة الرقمية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "48,000 - 68,000 درهم إماراتي/شهر",
    deadline: "18 مارس 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "113",
    title: "مقاول أنظمة بيئية",
    company: "الأنظمة البيئية المتطورة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "60,000 - 90,000 درهم إماراتي/شهر",
    deadline: "5 أبريل 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "114",
    title: "عامل تركيب أنظمة توفير طاقة",
    company: "توفير الطاقة",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "42,000 - 62,000 درهم إماراتي/شهر",
    deadline: "22 مارس 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "115",
    title: "مهندس تحليل إنشائي",
    company: "التحليل الإنشائي المتقدم",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "80,000 - 115,000 درهم إماراتي/شهر",
    deadline: "10 أبريل 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    category: "construction",
  },
  {
    id: "116",
    title: "عامل تركيب أنظمة تفاعلية",
    company: "الأنظمة التفاعلية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "45,000 - 65,000 درهم إماراتي/شهر",
    deadline: "28 مارس 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "117",
    title: "مقاول أنظمة مبتكرة",
    company: "الأنظمة المبتكرة",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "70,000 - 105,000 درهم إماراتي/شهر",
    deadline: "15 أبريل 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "118",
    title: "عامل تركيب أنظمة متكاملة",
    company: "الأنظمة المتكاملة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "3 أبريل 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "119",
    title: "مهندس تقييم أداء",
    company: "تقييم الأداء الإنشائي",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "75,000 - 110,000 درهم إماراتي/شهر",
    deadline: "20 أبريل 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80",
    category: "construction",
  },
  {
    id: "120",
    title: "عامل تركيب أنظمة مراقبة متقدمة",
    company: "المراقبة المتقدمة",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "46,000 - 66,000 درهم إماراتي/شهر",
    deadline: "8 أبريل 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "121",
    title: "مقاول أنظمة ذكية متطورة",
    company: "الأنظمة الذكية المتطورة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "65,000 - 100,000 درهم إماراتي/شهر",
    deadline: "25 أبريل 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "122",
    title: "عامل تركيب أنظمة مستقبلية",
    company: "التقنيات المستقبلية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "52,000 - 72,000 درهم إماراتي/شهر",
    deadline: "12 أبريل 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "123",
    title: "مهندس تطوير مستقبلي",
    company: "التطوير المستقبلي",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "90,000 - 135,000 درهم إماراتي/شهر",
    deadline: "30 أبريل 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&q=80",
    category: "construction",
  },
  {
    id: "124",
    title: "عامل تركيب أنظمة تطويرية",
    company: "الأنظمة التطويرية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "48,000 - 68,000 درهم إماراتي/شهر",
    deadline: "18 أبريل 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "125",
    title: "مقاول أنظمة شاملة",
    company: "الأنظمة الشاملة المتطورة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "70,000 - 110,000 درهم إماراتي/شهر",
    deadline: "5 مايو 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "126",
    title: "عامل تركيب أنظمة نهائية",
    company: "الأنظمة النهائية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "44,000 - 64,000 درهم إماراتي/شهر",
    deadline: "22 أبريل 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "127",
    title: "مهندس تخصص نهائي",
    company: "التخصص النهائي الإنشائي",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "85,000 - 125,000 درهم إماراتي/شهر",
    deadline: "10 مايو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80",
    category: "construction",
  },
  {
    id: "128",
    title: "عامل تركيب أنظمة كاملة",
    company: "الأنظمة الكاملة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "46,000 - 66,000 درهم إماراتي/شهر",
    deadline: "28 أبريل 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "129",
    title: "مقاول أنظمة متكاملة نهائية",
    company: "الأنظمة المتكاملة النهائية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "75,000 - 115,000 درهم إماراتي/شهر",
    deadline: "15 مايو 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "130",
    title: "عامل تركيب أنظمة متقدمة نهائية",
    company: "الأنظمة المتقدمة النهائية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "50,000 - 75,000 درهم إماراتي/شهر",
    deadline: "3 مايو 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "131",
    title: "مهندس تطوير شامل",
    company: "التطوير الشامل الإنشائي",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "90,000 - 140,000 درهم إماراتي/شهر",
    deadline: "20 مايو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&q=80",
    category: "construction",
  },
  {
    id: "132",
    title: "عامل تركيب أنظمة شاملة متقدمة",
    company: "الأنظمة الشاملة المتقدمة",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "48,000 - 70,000 درهم إماراتي/شهر",
    deadline: "8 مايو 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "133",
    title: "مقاول أنظمة تطويرية شاملة",
    company: "الأنظمة التطويرية الشاملة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "70,000 - 110,000 درهم إماراتي/شهر",
    deadline: "25 مايو 2025",
    jobType: "full-time",
    logo: "",
    category: "construction",
  },
  {
    id: "134",
    title: "عامل تركيب أنظمة تطويرية متقدمة",
    company: "الأنظمة التطويرية المتقدمة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "45,000 - 68,000 درهم إماراتي/شهر",
    deadline: "12 مايو 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  {
    id: "135",
    title: "مهندس تخصص متكامل",
    company: "التخصص المتكامل الإنشائي",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "85,000 - 130,000 درهم إماراتي/شهر",
    deadline: "30 مايو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    category: "construction",
  },
  {
    id: "136",
    title: "عامل تركيب أنظمة متكاملة شاملة",
    company: "الأنظمة المتكاملة الشاملة النهائية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "52,000 - 77,000 درهم إماراتي/شهر",
    deadline: "18 مايو 2025",
    jobType: "contract",
    logo: "",
    category: "construction",
  },
  // 87 New Electrical Jobs
  {
    id: "137",
    title: "فني كهرباء منازل",
    company: "الكهرباء المنزلية المتخصصة",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "45,000 - 60,000 درهم إماراتي/شهر",
    deadline: "15 يونيو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&q=80",
    category: "electrical",
  },
  {
    id: "138",
    title: "مهندس كهرباء صناعية",
    company: "الهندسة الكهربائية الصناعية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "85,000 - 110,000 درهم إماراتي/شهر",
    deadline: "20 يونيو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    category: "electrical",
  },
  {
    id: "139",
    title: "فني صيانة أجهزة كهربائية",
    company: "صيانة الأجهزة المنزلية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "40,000 - 55,000 درهم إماراتي/شهر",
    deadline: "25 يونيو 2025",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "140",
    title: "كهربائي سيارات",
    company: "كهرباء السيارات المتقدمة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "30 يونيو 2025",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "141",
    title: "مهندس أنظمة كهربائية",
    company: "الأنظمة الكهربائية المتطورة",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "75,000 - 95,000 درهم إماراتي/شهر",
    deadline: "5 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&q=80",
    category: "electrical",
  },
  {
    id: "142",
    title: "فني تركيب لوحات كهربائية",
    company: "اللوحات الكهربائية الحديثة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "42,000 - 58,000 درهم إماراتي/شهر",
    deadline: "10 يوليو 2025",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "143",
    title: "كهربائي مباني تجارية",
    company: "الكهرباء التجارية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "55,000 - 75,000 درهم إماراتي/شهر",
    deadline: "15 يوليو 2025",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "144",
    title: "مهندس طاقة متجددة",
    company: "الطاقة المتجددة الإمارات",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "90,000 - 120,000 درهم إماراتي/شهر",
    deadline: "20 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&q=80",
    category: "electrical",
  },
  {
    id: "145",
    title: "فني أنظمة إنذار",
    company: "أنظمة الأمان الكهربائية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "38,000 - 52,000 درهم إماراتي/شهر",
    deadline: "25 يوليو 2025",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "146",
    title: "كهربائي مصانع",
    company: "الكهرباء الصناعية المتخصصة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "60,000 - 80,000 درهم إماراتي/شهر",
    deadline: "30 يوليو 2025",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "147",
    title: "مهندس تحكم آلي",
    company: "التحكم الآلي والأتمتة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "80,000 - 105,000 درهم إماراتي/شهر",
    deadline: "5 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&q=80",
    category: "electrical",
  },
  {
    id: "148",
    title: "فني صيانة مولدات",
    company: "صيانة المولدات الكهربائية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "45,000 - 65,000 درهم إماراتي/شهر",
    deadline: "10 أغسطس 2025",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "149",
    title: "كهربائي مستشفيات",
    company: "الكهرباء الطبية المتخصصة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "15 أغسطس 2025",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "150",
    title: "مهندس إضاءة",
    company: "تصميم الإضاءة المعمارية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "70,000 - 90,000 درهم إماراتي/شهر",
    deadline: "20 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=200&q=80",
    category: "electrical",
  },
  {
    id: "151",
    title: "فني تركيب كاميرات مراقبة",
    company: "أنظمة المراقبة الإلكترونية",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "40,000 - 58,000 درهم إماراتي/شهر",
    deadline: "25 أغسطس 2025",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "152",
    title: "كهربائي طيران",
    company: "صيانة الطائرات الكهربائية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "85,000 - 115,000 درهم إماراتي/شهر",
    deadline: "30 أغسطس 2025",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "153",
    title: "مهندس شبكات كهربائية",
    company: "شبكات التوزيع الكهربائية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "75,000 - 100,000 درهم إماراتي/شهر",
    deadline: "5 سبتمبر 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&q=80",
    category: "electrical",
  },
  {
    id: "154",
    title: "فني أنظمة صوتية",
    company: "الأنظمة الصوتية المتقدمة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "35,000 - 50,000 درهم إماراتي/شهر",
    deadline: "10 سبتمبر 2025",
    jobType: "freelance",
    logo: "",
    category: "electrical",
  },
  {
    id: "155",
    title: "كهربائي سفن",
    company: "الكهرباء البحرية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "65,000 - 85,000 درهم إماراتي/شهر",
    deadline: "15 سبتمبر 2025",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "156",
    title: "مهندس أتمتة صناعية",
    company: "الأتمتة الصناعية المتطورة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "80,000 - 110,000 درهم إماراتي/شهر",
    deadline: "20 سبتمبر 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=200&q=80",
    category: "electrical",
  },
  {
    id: "157",
    title: "فني تركيب ألواح شمسية",
    company: "الطاقة الشمسية الإمارات",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "48,000 - 68,000 درهم إماراتي/شهر",
    deadline: "25 سبتمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "158",
    title: "كهربائي قطارات",
    company: "النقل بالسكك الحديدية",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "70,000 - 95,000 درهم إماراتي/شهر",
    deadline: "30 سبتمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "159",
    title: "مهندس حماية كهربائية",
    company: "أنظمة الحماية الكهربائية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "85,000 - 115,000 درهم إماراتي/شهر",
    deadline: "5 أكتوبر 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&q=80",
    category: "electrical",
  },
  {
    id: "160",
    title: "فني صيانة مصاعد",
    company: "صيانة المصاعد الكهربائية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "45,000 - 65,000 درهم إماراتي/شهر",
    deadline: "10 أكتوبر 2025",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "161",
    title: "كهربائي مراكز تجارية",
    company: "الكهرباء التجارية الشاملة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "55,000 - 75,000 درهم إماراتي/شهر",
    deadline: "15 أكتوبر 2025",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "162",
    title: "مهندس كهرباء طاقة",
    company: "هندسة الطاقة الكهربائية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "90,000 - 125,000 درهم إماراتي/شهر",
    deadline: "20 أكتوبر 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    category: "electrical",
  },
  {
    id: "163",
    title: "فني أنظمة تكييف كهربائية",
    company: "التكييف والتبريد الكهربائي",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "42,000 - 60,000 درهم إماراتي/شهر",
    deadline: "25 أكتوبر 2025",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "164",
    title: "كهربائي مناجم",
    company: "الكهرباء في المناجم",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "60,000 - 85,000 درهم إماراتي/شهر",
    deadline: "30 أكتوبر 2025",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "165",
    title: "مهندس إلكترونيات قوى",
    company: "الإلكترونيات الصناعية",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "80,000 - 110,000 درهم إماراتي/شهر",
    deadline: "5 نوفمبر 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&q=80",
    category: "electrical",
  },
  {
    id: "166",
    title: "فني تركيب أنظمة إنترنت",
    company: "شبكات الاتصالات الكهربائية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "38,000 - 55,000 درهم إماراتي/شهر",
    deadline: "10 نوفمبر 2025",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "167",
    title: "كهربائي محطات وقود",
    company: "محطات الوقود الكهربائية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "15 نوفمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "168",
    title: "مهندس أنظمة ذكية",
    company: "المنازل الذكية الكهربائية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "75,000 - 100,000 درهم إماراتي/شهر",
    deadline: "20 نوفمبر 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&q=80",
    category: "electrical",
  },
  {
    id: "169",
    title: "فني صيانة أجهزة طبية",
    company: "الأجهزة الطبية الكهربائية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "55,000 - 75,000 درهم إماراتي/شهر",
    deadline: "25 نوفمبر 2025",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "170",
    title: "كهربائي فنادق",
    company: "الكهرباء الفندقية المتخصصة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "45,000 - 65,000 درهم إماراتي/شهر",
    deadline: "30 نوفمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "171",
    title: "مهندس كهرباء اتصالات",
    company: "هندسة الاتصالات الكهربائية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "85,000 - 115,000 درهم إماراتي/شهر",
    deadline: "5 ديسمبر 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&q=80",
    category: "electrical",
  },
  {
    id: "172",
    title: "فني تركيب أنظمة حريق",
    company: "أنظمة إطفاء الحريق الكهربائية",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "40,000 - 58,000 درهم إماراتي/شهر",
    deadline: "10 ديسمبر 2025",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "173",
    title: "كهربائي مدارس",
    company: "الكهرباء التعليمية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "42,000 - 60,000 درهم إماراتي/شهر",
    deadline: "15 ديسمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "174",
    title: "مهندس كهرباء بحرية",
    company: "الهندسة البحرية الكهربائية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "80,000 - 110,000 درهم إماراتي/شهر",
    deadline: "20 ديسمبر 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=200&q=80",
    category: "electrical",
  },
  {
    id: "175",
    title: "فني أنظمة أمان كهربائية",
    company: "الأمان الكهربائي المتطور",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "45,000 - 65,000 درهم إماراتي/شهر",
    deadline: "25 ديسمبر 2025",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "176",
    title: "كهربائي مطارات",
    company: "الكهرباء في المطارات",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "70,000 - 95,000 درهم إماراتي/شهر",
    deadline: "30 ديسمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "177",
    title: "مهندس كهرباء نووية",
    company: "الطاقة النووية الكهربائية",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "100,000 - 140,000 درهم إماراتي/شهر",
    deadline: "5 يناير 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    category: "electrical",
  },
  {
    id: "178",
    title: "فني تركيب شاشات LED",
    company: "الشاشات الإلكترونية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "35,000 - 52,000 درهم إماراتي/شهر",
    deadline: "10 يناير 2026",
    jobType: "freelance",
    logo: "",
    category: "electrical",
  },
  {
    id: "179",
    title: "كهربائي مصانع نسيج",
    company: "الكهرباء في صناعة النسيج",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "15 يناير 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "180",
    title: "مهندس كهرباء طبية",
    company: "الهندسة الطبية الكهربائية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "85,000 - 120,000 درهم إماراتي/شهر",
    deadline: "20 يناير 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&q=80",
    category: "electrical",
  },
  {
    id: "181",
    title: "فني صيانة أنظمة تبريد",
    company: "التبريد الكهربائي الصناعي",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "42,000 - 62,000 درهم إماراتي/شهر",
    deadline: "25 يناير 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "182",
    title: "كهربائي مصانع أغذية",
    company: "الكهرباء في صناعة الأغذية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "48,000 - 68,000 درهم إماراتي/شهر",
    deadline: "30 يناير 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "183",
    title: "مهندس كهرباء فضائية",
    company: "تقنيات الفضاء الكهربائية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "95,000 - 135,000 درهم إماراتي/شهر",
    deadline: "5 فبراير 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&q=80",
    category: "electrical",
  },
  {
    id: "184",
    title: "فني تركيب أنظمة GPS",
    company: "أنظمة التتبع الإلكترونية",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "38,000 - 55,000 درهم إماراتي/شهر",
    deadline: "10 فبراير 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "185",
    title: "كهربائي مصانع بلاستيك",
    company: "الكهرباء في صناعة البلاستيك",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "45,000 - 65,000 درهم إماراتي/شهر",
    deadline: "15 فبراير 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "186",
    title: "مهندس كهرباء بيئية",
    company: "الهندسة البيئية الكهربائية",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "80,000 - 115,000 درهم إماراتي/شهر",
    deadline: "20 فبراير 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&q=80",
    category: "electrical",
  },
  {
    id: "187",
    title: "فني أنظمة راديو",
    company: "أنظمة الراديو والاتصالات",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "40,000 - 58,000 درهم إماراتي/شهر",
    deadline: "25 فبراير 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "188",
    title: "كهربائي مصانع معادن",
    company: "الكهرباء في صناعة المعادن",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "55,000 - 78,000 درهم إماراتي/شهر",
    deadline: "28 فبراير 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "189",
    title: "مهندس كهرباء روبوتية",
    company: "الروبوتات الكهربائية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "90,000 - 130,000 درهم إماراتي/شهر",
    deadline: "5 مارس 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=200&q=80",
    category: "electrical",
  },
  {
    id: "190",
    title: "فني تركيب أنظمة ليزر",
    company: "تقنيات الليزر الكهربائية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "50,000 - 72,000 درهم إماراتي/شهر",
    deadline: "10 مارس 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "191",
    title: "كهربائي مصانع أدوية",
    company: "الكهرباء في صناعة الأدوية",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "60,000 - 85,000 درهم إماراتي/شهر",
    deadline: "15 مارس 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "192",
    title: "مهندس كهرباء ذكية",
    company: "الشبكات الكهربائية الذكية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "85,000 - 120,000 درهم إماراتي/شهر",
    deadline: "20 مارس 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    category: "electrical",
  },
  {
    id: "193",
    title: "فني صيانة أنظمة أمان",
    company: "صيانة الأنظمة الأمنية الكهربائية",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "42,000 - 62,000 درهم إماراتي/شهر",
    deadline: "25 مارس 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "194",
    title: "كهربائي مصانع ورق",
    company: "الكهرباء في صناعة الورق",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "46,000 - 66,000 درهم إماراتي/شهر",
    deadline: "30 مارس 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "195",
    title: "مهندس كهرباء متجددة",
    company: "الطاقة المتجددة المتقدمة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "90,000 - 135,000 درهم إماراتي/شهر",
    deadline: "5 أبريل 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&q=80",
    category: "electrical",
  },
  {
    id: "196",
    title: "فني تركيب أنظمة ملاحة",
    company: "أنظمة الملاحة الإلكترونية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "45,000 - 65,000 درهم إماراتي/شهر",
    deadline: "10 أبريل 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "197",
    title: "كهربائي مصانع زجاج",
    company: "الكهرباء في صناعة الزجاج",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "48,000 - 70,000 درهم إماراتي/شهر",
    deadline: "15 أبريل 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "198",
    title: "مهندس كهرباء كمبيوتر",
    company: "هندسة الحاسوب الكهربائية",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "85,000 - 125,000 درهم إماراتي/شهر",
    deadline: "20 أبريل 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&q=80",
    category: "electrical",
  },
  {
    id: "199",
    title: "فني أنظمة تحكم عن بعد",
    company: "التحكم عن بعد الكهربائي",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "40,000 - 60,000 درهم إماراتي/شهر",
    deadline: "25 أبريل 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "200",
    title: "كهربائي مصانع كيماويات",
    company: "الكهرباء في الصناعات الكيماوية",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "65,000 - 90,000 درهم إماراتي/شهر",
    deadline: "30 أبريل 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "201",
    title: "مهندس كهرباء تطبيقية",
    company: "الهندسة الكهربائية التطبيقية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "80,000 - 115,000 درهم إماراتي/شهر",
    deadline: "5 مايو 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&q=80",
    category: "electrical",
  },
  {
    id: "202",
    title: "فني تركيب أنظمة استشعار",
    company: "أنظمة الاستشعار الكهربائية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "38,000 - 58,000 درهم إماراتي/شهر",
    deadline: "10 مايو 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "203",
    title: "كهربائي مصانع إسمنت",
    company: "الكهرباء في صناعة الإسمنت",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "52,000 - 75,000 درهم إماراتي/شهر",
    deadline: "15 مايو 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "204",
    title: "مهندس كهرباء متقدمة",
    company: "الهندسة الكهربائية المتقدمة",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "95,000 - 140,000 درهم إماراتي/شهر",
    deadline: "20 مايو 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=200&q=80",
    category: "electrical",
  },
  {
    id: "205",
    title: "فني صيانة أنظمة طاقة",
    company: "صيانة أنظمة الطاقة الكهربائية",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "45,000 - 68,000 درهم إماراتي/شهر",
    deadline: "25 مايو 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "206",
    title: "كهربائي مصانع حديد",
    company: "الكهرباء في صناعة الحديد",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "58,000 - 82,000 درهم إماراتي/شهر",
    deadline: "30 مايو 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "207",
    title: "مهندس كهرباء مستقبلية",
    company: "تقنيات المستقبل الكهربائية",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "100,000 - 150,000 درهم إماراتي/شهر",
    deadline: "5 يونيو 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    category: "electrical",
  },
  {
    id: "208",
    title: "فني تركيب أنظمة ذكاء اصطناعي",
    company: "الذكاء الاصطناعي الكهربائي",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "55,000 - 80,000 درهم إماراتي/شهر",
    deadline: "10 يونيو 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "209",
    title: "كهربائي مصانع بتروكيماويات",
    company: "الكهرباء في الصناعات البتروكيماوية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "70,000 - 100,000 درهم إماراتي/شهر",
    deadline: "15 يونيو 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "210",
    title: "مهندس كهرباء شاملة",
    company: "الهندسة الكهربائية الشاملة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "85,000 - 130,000 درهم إماراتي/شهر",
    deadline: "20 يونيو 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&q=80",
    category: "electrical",
  },
  {
    id: "211",
    title: "فني أنظمة كهربائية متطورة",
    company: "الأنظمة الكهربائية المتطورة النهائية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "48,000 - 72,000 درهم إماراتي/شهر",
    deadline: "25 يونيو 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "212",
    title: "كهربائي تقنيات حديثة",
    company: "التقنيات الحديثة الكهربائية",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "55,000 - 85,000 درهم إماراتي/شهر",
    deadline: "30 يونيو 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "213",
    title: "مهندس كهرباء نهائي",
    company: "الهندسة الكهربائية النهائية المتكاملة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "90,000 - 145,000 درهم إماراتي/شهر",
    deadline: "5 يوليو 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&q=80",
    category: "electrical",
  },
  {
    id: "214",
    title: "فني كهرباء متكامل",
    company: "الكهرباء المتكاملة الشاملة",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "50,000 - 75,000 درهم إماراتي/شهر",
    deadline: "10 يوليو 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "215",
    title: "كهربائي أنظمة شاملة",
    company: "الأنظمة الكهربائية الشاملة المتطورة",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "60,000 - 90,000 درهم إماراتي/شهر",
    deadline: "15 يوليو 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "216",
    title: "مهندس كهرباء متكامل شامل",
    company: "الهندسة الكهربائية المتكاملة الشاملة النهائية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "95,000 - 150,000 درهم إماراتي/شهر",
    deadline: "20 يوليو 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=200&q=80",
    category: "electrical",
  },
  {
    id: "217",
    title: "فني كهرباء تطويري",
    company: "الكهرباء التطويرية المتقدمة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "45,000 - 70,000 درهم إماراتي/شهر",
    deadline: "25 يوليو 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "218",
    title: "كهربائي تقنيات مستقبلية",
    company: "التقنيات المستقبلية الكهربائية الشاملة",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "65,000 - 95,000 درهم إماراتي/شهر",
    deadline: "30 يوليو 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "219",
    title: "مهندس كهرباء تطويري شامل",
    company: "الهندسة التطويرية الكهربائية الشاملة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "90,000 - 140,000 درهم إماراتي/شهر",
    deadline: "5 أغسطس 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&q=80",
    category: "electrical",
  },
  {
    id: "220",
    title: "فني كهرباء شامل متطور",
    company: "الكهرباء الشاملة المتطورة النهائية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "52,000 - 78,000 درهم إماراتي/شهر",
    deadline: "10 أغسطس 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  {
    id: "221",
    title: "كهربائي أنظمة متكاملة نهائية",
    company: "الأنظمة المتكاملة النهائية الكهربائية",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "58,000 - 88,000 درهم إماراتي/شهر",
    deadline: "15 أغسطس 2026",
    jobType: "full-time",
    logo: "",
    category: "electrical",
  },
  {
    id: "222",
    title: "مهندس كهرباء نهائي متكامل",
    company: "الهندسة النهائية المتكاملة الكهربائية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "100,000 - 155,000 درهم إماراتي/شهر",
    deadline: "20 أغسطس 2026",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    category: "electrical",
  },
  {
    id: "223",
    title: "فني كهرباء متقدم نهائي",
    company: "الكهرباء المتقدمة النهائية الشاملة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "48,000 - 75,000 درهم إماراتي/شهر",
    deadline: "25 أغسطس 2026",
    jobType: "contract",
    logo: "",
    category: "electrical",
  },
  // 56 New Plumbing Jobs
  {
    id: "224",
    title: "سباك منازل متخصص",
    company: "السباكة المنزلية المحترفة",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "42,000 - 58,000 درهم إماراتي/شهر",
    deadline: "15 يوليو 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "225",
    title: "فني تركيب أنابيب المياه",
    company: "أنابيب المياه المتطورة",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "38,000 - 52,000 درهم إماراتي/شهر",
    deadline: "20 يوليو 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "226",
    title: "سباك صيانة عامة",
    company: "الصيانة الشاملة للسباكة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "35,000 - 48,000 درهم إماراتي/شهر",
    deadline: "25 يوليو 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "227",
    title: "فني تركيب حمامات",
    company: "الحمامات العصرية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "40,000 - 55,000 درهم إماراتي/شهر",
    deadline: "30 يوليو 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "228",
    title: "سباك مباني تجارية",
    company: "السباكة التجارية المتخصصة",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "45,000 - 62,000 درهم إماراتي/شهر",
    deadline: "5 أغسطس 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "229",
    title: "فني إصلاح تسريبات",
    company: "إصلاح التسريبات السريع",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "32,000 - 45,000 درهم إماراتي/شهر",
    deadline: "10 أغسطس 2025",
    jobType: "freelance",
    logo: "",
    category: "plumbing",
  },
  {
    id: "230",
    title: "سباك مستشفيات",
    company: "السباكة الطبية المتخصصة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "48,000 - 65,000 درهم إماراتي/شهر",
    deadline: "15 أغسطس 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "231",
    title: "فني تركيب مضخات المياه",
    company: "مضخات المياه الحديثة",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "44,000 - 60,000 درهم إماراتي/شهر",
    deadline: "20 أغسطس 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "232",
    title: "سباك فنادق ومطاعم",
    company: "السباكة الفندقية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "42,000 - 58,000 درهم إماراتي/شهر",
    deadline: "25 أغسطس 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "233",
    title: "فني تركيب سخانات المياه",
    company: "سخانات المياه المتطورة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "36,000 - 50,000 درهم إماراتي/شهر",
    deadline: "30 أغسطس 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "234",
    title: "سباك مصانع",
    company: "السباكة الصناعية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "50,000 - 68,000 درهم إماراتي/شهر",
    deadline: "5 سبتمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "235",
    title: "فني تركيب أنظمة الصرف",
    company: "أنظمة الصرف المتقدمة",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "40,000 - 56,000 درهم إماراتي/شهر",
    deadline: "10 سبتمبر 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "236",
    title: "سباك مدارس وجامعات",
    company: "السباكة التعليمية",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "38,000 - 52,000 درهم إماراتي/شهر",
    deadline: "15 سبتمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "237",
    title: "فني تركيب مراحيض ومغاسل",
    company: "الأدوات الصحية الحديثة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "34,000 - 47,000 درهم إماراتي/شهر",
    deadline: "20 سبتمبر 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "238",
    title: "سباك طوارئ",
    company: "خدمات السباكة الطارئة",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "45,000 - 62,000 درهم إماراتي/شهر",
    deadline: "25 سبتمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "239",
    title: "فني تركيب أنظمة التدفئة المائية",
    company: "التدفئة المائية المتطورة",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "46,000 - 63,000 درهم إماراتي/شهر",
    deadline: "30 سبتمبر 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "240",
    title: "سباك حمامات سباحة",
    company: "سباكة حمامات السباحة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "48,000 - 66,000 درهم إماراتي/شهر",
    deadline: "5 أكتوبر 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "241",
    title: "فني تركيب فلاتر المياه",
    company: "فلاتر المياه النقية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "35,000 - 48,000 درهم إماراتي/شهر",
    deadline: "10 أكتوبر 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "242",
    title: "سباك مراكز تجارية",
    company: "السباكة التجارية الشاملة",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "44,000 - 60,000 درهم إماراتي/شهر",
    deadline: "15 أكتوبر 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "243",
    title: "فني صيانة شبكات المياه",
    company: "صيانة شبكات المياه",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "40,000 - 55,000 درهم إماراتي/شهر",
    deadline: "20 أكتوبر 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "244",
    title: "سباك أنظمة الري",
    company: "أنظمة الري الحديثة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "38,000 - 53,000 درهم إماراتي/شهر",
    deadline: "25 أكتوبر 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "245",
    title: "فني تركيب أنابيب الغاز",
    company: "أنابيب الغاز الآمنة",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "50,000 - 68,000 درهم إماراتي/شهر",
    deadline: "30 أكتوبر 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "246",
    title: "سباك مباني سكنية",
    company: "السباكة السكنية المتخصصة",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "36,000 - 50,000 درهم إماراتي/شهر",
    deadline: "5 نوفمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "247",
    title: "فني تركيب أحواض الاستحمام",
    company: "أحواض الاستحمام الفاخرة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "42,000 - 58,000 درهم إماراتي/شهر",
    deadline: "10 نوفمبر 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "248",
    title: "سباك مكاتب إدارية",
    company: "السباكة الإدارية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "40,000 - 56,000 درهم إماراتي/شهر",
    deadline: "15 نوفمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "249",
    title: "فني تركيب أنظمة التحكم في المياه",
    company: "التحكم في المياه الذكي",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "45,000 - 62,000 درهم إماراتي/شهر",
    deadline: "20 نوفمبر 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "250",
    title: "سباك مطاعم ومقاهي",
    company: "سباكة المطاعم المتخصصة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "38,000 - 52,000 درهم إماراتي/شهر",
    deadline: "25 نوفمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "251",
    title: "فني تركيب أنظمة إعادة تدوير المياه",
    company: "إعادة تدوير المياه البيئية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "48,000 - 65,000 درهم إماراتي/شهر",
    deadline: "30 نوفمبر 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "252",
    title: "سباك ورش ومصانع",
    company: "السباكة الصناعية المتقدمة",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "46,000 - 63,000 درهم إماراتي/شهر",
    deadline: "5 ديسمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "253",
    title: "فني تركيب أنظمة الضغط المائي",
    company: "أنظمة الضغط المائي",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "42,000 - 58,000 درهم إماراتي/شهر",
    deadline: "10 ديسمبر 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "254",
    title: "سباك مراكز طبية",
    company: "السباكة الطبية المتخصصة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "44,000 - 60,000 درهم إماراتي/شهر",
    deadline: "15 ديسمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "255",
    title: "فني تركيب أنظمة التنقيط",
    company: "أنظمة التنقيط الزراعية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "36,000 - 50,000 درهم إماراتي/شهر",
    deadline: "20 ديسمبر 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "256",
    title: "سباك أنظمة الأمان المائي",
    company: "الأمان المائي المتطور",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "48,000 - 66,000 درهم إماراتي/شهر",
    deadline: "25 ديسمبر 2025",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "257",
    title: "فني تركيب أنظمة المياه الساخنة",
    company: "المياه الساخنة المتطورة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "40,000 - 56,000 درهم إماراتي/شهر",
    deadline: "30 ديسمبر 2025",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "258",
    title: "سباك أنظمة التبريد المائي",
    company: "التبريد المائي الصناعي",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "45,000 - 62,000 درهم إماراتي/شهر",
    deadline: "5 يناير 2026",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "259",
    title: "فني تركيب أنظمة الرش التلقائي",
    company: "الرش التلقائي للحدائق",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "38,000 - 53,000 درهم إماراتي/شهر",
    deadline: "10 يناير 2026",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "260",
    title: "سباك أنظمة المياه الذكية",
    company: "المياه الذكية المتطورة",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "50,000 - 68,000 درهم إماراتي/شهر",
    deadline: "15 يناير 2026",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "261",
    title: "فني تركيب أنظمة معالجة المياه",
    company: "معالجة المياه البيئية",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "46,000 - 63,000 درهم إماراتي/شهر",
    deadline: "20 يناير 2026",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "262",
    title: "سباك أنظمة الصرف الصحي",
    company: "الصرف الصحي المتطور",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "44,000 - 60,000 درهم إماراتي/شهر",
    deadline: "25 يناير 2026",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "263",
    title: "فني تركيب أنظمة توزيع المياه",
    company: "توزيع المياه الحديث",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "42,000 - 58,000 درهم إماراتي/شهر",
    deadline: "30 يناير 2026",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "264",
    title: "سباك أنظمة الحماية من التجمد",
    company: "الحماية من التجمد",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "40,000 - 56,000 درهم إماراتي/شهر",
    deadline: "5 فبراير 2026",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "265",
    title: "فني تركيب أنظمة المراقبة المائية",
    company: "المراقبة المائية الذكية",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "48,000 - 65,000 درهم إماراتي/شهر",
    deadline: "10 فبراير 2026",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "266",
    title: "سباك أنظمة الطاقة الشمسية المائية",
    company: "الطاقة الشمسية المائية",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "52,000 - 70,000 درهم إماراتي/شهر",
    deadline: "15 فبراير 2026",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "267",
    title: "فني تركيب أنظمة التحكم الآلي",
    company: "التحكم الآلي في المياه",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "46,000 - 63,000 درهم إماراتي/شهر",
    deadline: "20 فبراير 2026",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "268",
    title: "سباك أنظمة المياه الجوفية",
    company: "المياه الجوفية المتخصصة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "44,000 - 61,000 درهم إماراتي/شهر",
    deadline: "25 فبراير 2026",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "269",
    title: "فني تركيب أنظمة الضخ المتقدمة",
    company: "الضخ المتقدم للمياه",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "48,000 - 66,000 درهم إماراتي/شهر",
    deadline: "28 فبراير 2026",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "270",
    title: "سباك أنظمة المياه البيئية",
    company: "المياه البيئية المستدامة",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "50,000 - 68,000 درهم إماراتي/شهر",
    deadline: "5 مارس 2026",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "271",
    title: "فني تركيب أنظمة التنظيف الذاتي",
    company: "التنظيف الذاتي للأنابيب",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "42,000 - 59,000 درهم إماراتي/شهر",
    deadline: "10 مارس 2026",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "272",
    title: "سباك أنظمة المياه الصناعية",
    company: "المياه الصناعية المتطورة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "46,000 - 64,000 درهم إماراتي/شهر",
    deadline: "15 مارس 2026",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "273",
    title: "فني تركيب أنظمة الاستشعار المائي",
    company: "الاستشعار المائي الذكي",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "44,000 - 62,000 درهم إماراتي/شهر",
    deadline: "20 مارس 2026",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "274",
    title: "سباك أنظمة المياه المتجددة",
    company: "المياه المتجددة البيئية",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "48,000 - 66,000 درهم إماراتي/شهر",
    deadline: "25 مارس 2026",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "275",
    title: "فني تركيب أنظمة التوفير المائي",
    company: "التوفير المائي المتقدم",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "40,000 - 57,000 درهم إماراتي/شهر",
    deadline: "30 مارس 2026",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "276",
    title: "سباك أنظمة المياه الذكية المتكاملة",
    company: "المياه الذكية المتكاملة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "52,000 - 72,000 درهم إماراتي/شهر",
    deadline: "5 أبريل 2026",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "277",
    title: "فني تركيب أنظمة المياه المستدامة",
    company: "المياه المستدامة البيئية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "46,000 - 64,000 درهم إماراتي/شهر",
    deadline: "10 أبريل 2026",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  {
    id: "278",
    title: "سباك أنظمة المياه التقنية المتطورة",
    company: "التقنيات المائية المتطورة",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "15 أبريل 2026",
    jobType: "full-time",
    logo: "",
    category: "plumbing",
  },
  {
    id: "279",
    title: "فني تركيب أنظمة المياه النهائية المتكاملة",
    company: "الأنظمة المائية النهائية المتكاملة",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "48,000 - 68,000 درهم إماراتي/شهر",
    deadline: "20 أبريل 2026",
    jobType: "contract",
    logo: "",
    category: "plumbing",
  },
  // Technology Jobs - 50 new jobs
  {
    id: "280",
    title: "مطور تطبيقات الهاتف المحمول",
    company: "تطبيقات الجزائر",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "85,000 - 110,000 درهم إماراتي/شهر",
    deadline: "15 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&q=80",
    category: "technology",
  },
  {
    id: "281",
    title: "مهندس أمن سيبراني",
    company: "الأمان الرقمي",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "95,000 - 130,000 درهم إماراتي/شهر",
    deadline: "20 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&q=80",
    category: "technology",
  },
  {
    id: "282",
    title: "مطور ذكاء اصطناعي",
    company: "الذكاء الاصطناعي الجزائر",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "100,000 - 140,000 درهم إماراتي/شهر",
    deadline: "25 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&q=80",
    category: "technology",
  },
  {
    id: "283",
    title: "مصمم واجهات المستخدم",
    company: "التصميم الرقمي",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "70,000 - 95,000 درهم إماراتي/شهر",
    deadline: "30 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&q=80",
    category: "technology",
  },
  {
    id: "284",
    title: "محلل بيانات",
    company: "تحليل البيانات المتقدم",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "75,000 - 100,000 درهم إماراتي/شهر",
    deadline: "5 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&q=80",
    category: "technology",
  },
  {
    id: "285",
    title: "مطور ألعاب",
    company: "ألعاب الإمارات",
    location: "الفجيرة، الإمارات العربية المتحدة",
    salary: "80,000 - 110,000 درهم إماراتي/شهر",
    deadline: "10 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&q=80",
    category: "technology",
  },
  {
    id: "286",
    title: "مهندس شبكات",
    company: "شبكات الاتصالات",
    location: "أم القيوين، الإمارات العربية المتحدة",
    salary: "70,000 - 95,000 درهم إماراتي/شهر",
    deadline: "15 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=80",
    category: "technology",
  },
  {
    id: "287",
    title: "مطور تطبيقات ويب",
    company: "الويب المتقدم",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "75,000 - 105,000 درهم إماراتي/شهر",
    deadline: "20 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&q=80",
    category: "technology",
  },
  {
    id: "288",
    title: "مهندس DevOps",
    company: "التطوير والعمليات",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "90,000 - 120,000 درهم إماراتي/شهر",
    deadline: "25 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&q=80",
    category: "technology",
  },
  {
    id: "289",
    title: "مطور قواعد البيانات",
    company: "قواعد البيانات المتطورة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "80,000 - 110,000 درهم إماراتي/شهر",
    deadline: "30 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=200&q=80",
    category: "technology",
  },
  // Healthcare Jobs - 40 new jobs
  {
    id: "290",
    title: "ممرض متخصص",
    company: "مستشفى الشفاء",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "60,000 - 80,000 درهم إماراتي/شهر",
    deadline: "15 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&q=80",
    category: "healthcare",
  },
  {
    id: "291",
    title: "طبيب أسنان",
    company: "عيادة الأسنان المتقدمة",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "100,000 - 140,000 درهم إماراتي/شهر",
    deadline: "20 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=200&q=80",
    category: "healthcare",
  },
  {
    id: "292",
    title: "صيدلي",
    company: "صيدلية الصحة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "70,000 - 95,000 درهم إماراتي/شهر",
    deadline: "25 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&q=80",
    category: "healthcare",
  },
  {
    id: "293",
    title: "أخصائي علاج طبيعي",
    company: "مركز العلاج الطبيعي",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "65,000 - 85,000 درهم إماراتي/شهر",
    deadline: "30 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=80",
    category: "healthcare",
  },
  {
    id: "294",
    title: "فني مختبر",
    company: "مختبر التحاليل الطبية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "5 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&q=80",
    category: "healthcare",
  },
  // Education Jobs - 35 new jobs
  {
    id: "295",
    title: "مدرس لغة إنجليزية",
    company: "مدرسة المستقبل",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "15 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&q=80",
    category: "education",
  },
  {
    id: "296",
    title: "أستاذ جامعي",
    company: "جامعة الإمارات",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "80,000 - 110,000 درهم إماراتي/شهر",
    deadline: "20 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    category: "education",
  },
  {
    id: "297",
    title: "مدرس علوم",
    company: "مدرسة العلوم المتقدمة",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "55,000 - 75,000 درهم إماراتي/شهر",
    deadline: "25 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&q=80",
    category: "education",
  },
  {
    id: "298",
    title: "مستشار تعليمي",
    company: "الاستشارات التعليمية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "60,000 - 80,000 درهم إماراتي/شهر",
    deadline: "30 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&q=80",
    category: "education",
  },
  {
    id: "299",
    title: "مدرب تقني",
    company: "التدريب التقني المتقدم",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "65,000 - 90,000 درهم إماراتي/شهر",
    deadline: "5 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=80",
    category: "education",
  },
  // Art & Design Jobs - 30 new jobs
  {
    id: "300",
    title: "مصمم إعلانات",
    company: "الإبداع الرقمي",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "55,000 - 75,000 درهم إماراتي/شهر",
    deadline: "15 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&q=80",
    category: "art",
  },
  {
    id: "301",
    title: "مصور فوتوغرافي",
    company: "استوديو الضوء",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "45,000 - 65,000 درهم إماراتي/شهر",
    deadline: "20 يوليو 2025",
    jobType: "freelance",
    logo: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&q=80",
    category: "art",
  },
  {
    id: "302",
    title: "مصمم داخلي",
    company: "التصميم الداخلي الحديث",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "60,000 - 85,000 درهم إماراتي/شهر",
    deadline: "25 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80",
    category: "art",
  },
  {
    id: "303",
    title: "رسام رقمي",
    company: "الفن الرقمي",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "30 يوليو 2025",
    jobType: "contract",
    logo: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&q=80",
    category: "art",
  },
  {
    id: "304",
    title: "مصمم أزياء",
    company: "الأزياء العصرية",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "55,000 - 80,000 درهم إماراتي/شهر",
    deadline: "5 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&q=80",
    category: "art",
  },
  // Food Service Jobs - 35 new jobs
  {
    id: "305",
    title: "طاهي معجنات",
    company: "حلويات الإمارات",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "40,000 - 55,000 درهم إماراتي/شهر",
    deadline: "15 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=80",
    category: "food",
  },
  {
    id: "306",
    title: "نادل محترف",
    company: "مطعم الذواقة",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "30,000 - 45,000 درهم إماراتي/شهر",
    deadline: "20 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80",
    category: "food",
  },
  {
    id: "307",
    title: "مدير مطعم",
    company: "سلسلة مطاعم الإمارات",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "60,000 - 85,000 درهم إماراتي/شهر",
    deadline: "25 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80",
    category: "food",
  },
  {
    id: "308",
    title: "باريستا",
    company: "مقهى الأصالة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "25,000 - 40,000 درهم إماراتي/شهر",
    deadline: "30 يوليو 2025",
    jobType: "part-time",
    logo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80",
    category: "food",
  },
  {
    id: "309",
    title: "طاهي سوشي",
    company: "مطعم اليابان",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "50,000 - 70,000 درهم إماراتي/شهر",
    deadline: "5 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&q=80",
    category: "food",
  },
  // Automotive Jobs - 30 new jobs
  {
    id: "310",
    title: "فني تشخيص السيارات",
    company: "التشخيص المتقدم للسيارات",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "45,000 - 65,000 درهم إماراتي/شهر",
    deadline: "15 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&q=80",
    category: "automotive",
  },
  {
    id: "311",
    title: "مهندس سيارات",
    company: "هندسة السيارات المتطورة",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "80,000 - 110,000 درهم إماراتي/شهر",
    deadline: "20 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&q=80",
    category: "automotive",
  },
  {
    id: "312",
    title: "فني دهان السيارات",
    company: "دهان السيارات الاحترافي",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "35,000 - 50,000 درهم إماراتي/شهر",
    deadline: "25 يوليو 2025",
    jobType: "contract",
    logo: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&q=80",
    category: "automotive",
  },
  {
    id: "313",
    title: "مستشار مبيعات السيارات",
    company: "وكالة السيارات الإماراتية",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "50,000 - 75,000 درهم إماراتي/شهر",
    deadline: "30 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&q=80",
    category: "automotive",
  },
  {
    id: "314",
    title: "فني إطارات",
    company: "خدمات الإطارات المتخصصة",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "30,000 - 45,000 درهم إماراتي/شهر",
    deadline: "5 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    category: "automotive",
  },
  // Logistics Jobs - 25 new jobs
  {
    id: "315",
    title: "منسق لوجستي",
    company: "اللوجستيات المتقدمة",
    location: "دبي، الإمارات العربية المتحدة",
    salary: "55,000 - 75,000 درهم إماراتي/شهر",
    deadline: "15 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&q=80",
    category: "logistics",
  },
  {
    id: "316",
    title: "مدير مستودع",
    company: "إدارة المستودعات الحديثة",
    location: "أبوظبي، الإمارات العربية المتحدة",
    salary: "60,000 - 85,000 درهم إماراتي/شهر",
    deadline: "20 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=200&q=80",
    category: "logistics",
  },
  {
    id: "317",
    title: "سائق توصيل",
    company: "خدمات التوصيل السريع",
    location: "الشارقة، الإمارات العربية المتحدة",
    salary: "35,000 - 50,000 درهم إماراتي/شهر",
    deadline: "25 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80",
    category: "logistics",
  },
  {
    id: "318",
    title: "أخصائي سلسلة التوريد",
    company: "سلسلة التوريد المتكاملة",
    location: "عجمان، الإمارات العربية المتحدة",
    salary: "65,000 - 90,000 درهم إماراتي/شهر",
    deadline: "30 يوليو 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&q=80",
    category: "logistics",
  },
  {
    id: "319",
    title: "عامل مستودع",
    company: "عمليات المستودعات",
    location: "رأس الخيمة، الإمارات العربية المتحدة",
    salary: "28,000 - 40,000 درهم إماراتي/شهر",
    deadline: "5 أغسطس 2025",
    jobType: "full-time",
    logo: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=200&q=80",
    category: "logistics",
  },
];

export default JobListings;
