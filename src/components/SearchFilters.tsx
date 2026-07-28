import React, { useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Award,
  Building2,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface SearchFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  keyword: string;
  location: string;
  jobType: string;
  salaryRange: [number, number];
  experienceLevel: string;
  industry: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFilterChange = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    location: "",
    jobType: "",
    salaryRange: [30000, 150000],
    experienceLevel: "",
    industry: "",
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      keyword: "",
      location: "",
      jobType: "",
      salaryRange: [30000, 150000],
      experienceLevel: "",
      industry: "",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
  ];
  const experienceLevels = [
    "Entry Level",
    "Mid Level",
    "Senior Level",
    "Manager",
    "Executive",
  ];
  const industries = [
    "Technology",
    "Healthcare",
    "Education",
    "Construction",
    "Finance",
    "Retail",
    "Manufacturing",
  ];

  return (
    <div className="w-full bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40 rounded-3xl shadow-2xl p-8 mb-10 border-2 border-blue-100/50">
      {/* Main search bar */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative flex-grow">
          <Search
            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-500"
            size={24}
          />
          <Input
            placeholder="ابحث عن الوظائف بالعنوان أو الكلمات المفتاحية أو الشركة"
            className="pl-14 h-16 rounded-2xl border-3 border-gray-200/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl text-right font-medium text-lg"
            value={filters.keyword}
            onChange={(e) => handleFilterChange("keyword", e.target.value)}
            dir="rtl"
          />
        </div>
        <div className="relative md:w-1/3">
          <MapPin
            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-500"
            size={24}
          />
          <Input
            placeholder="الموقع"
            className="pl-14 h-16 rounded-2xl border-3 border-gray-200/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl text-right font-medium text-lg"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            dir="rtl"
          />
        </div>
        <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 h-16 px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 font-bold text-lg">
          بحث
        </Button>
      </div>

      {/* Advanced filters toggle */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 flex-wrap">
            {filters.jobType && (
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200 text-blue-700 px-3 py-1.5 rounded-full font-medium"
              >
                {filters.jobType}
              </Badge>
            )}
            {filters.experienceLevel && (
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-200 text-purple-700 px-3 py-1.5 rounded-full font-medium"
              >
                {filters.experienceLevel}
              </Badge>
            )}
            {filters.industry && (
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-green-100 to-blue-100 border-green-200 text-green-700 px-3 py-1.5 rounded-full font-medium"
              >
                {filters.industry}
              </Badge>
            )}
            {(filters.salaryRange[0] !== 30000 ||
              filters.salaryRange[1] !== 150000) && (
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-200 text-orange-700 px-3 py-1.5 rounded-full font-medium"
              >
                ${filters.salaryRange[0].toLocaleString()} - $
                {filters.salaryRange[1].toLocaleString()}
              </Badge>
            )}
          </div>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl px-4 py-2 font-medium"
            >
              {isOpen ? "إخفاء الفلاتر" : "فلاتر متقدمة"}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Job Type */}
            <div>
              <div className="flex items-center mb-2">
                <Briefcase className="mr-2 text-primary" size={16} />
                <span className="font-medium">Job Type</span>
              </div>
              <Select
                value={filters.jobType}
                onValueChange={(value) => handleFilterChange("jobType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Experience Level */}
            <div>
              <div className="flex items-center mb-2">
                <Award className="mr-2 text-primary" size={16} />
                <span className="font-medium">Experience Level</span>
              </div>
              <Select
                value={filters.experienceLevel}
                onValueChange={(value) =>
                  handleFilterChange("experienceLevel", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Industry */}
            <div>
              <div className="flex items-center mb-2">
                <Building2 className="mr-2 text-primary" size={16} />
                <span className="font-medium">Industry</span>
              </div>
              <Select
                value={filters.industry}
                onValueChange={(value) => handleFilterChange("industry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary Range */}
          <div className="mt-6">
            <div className="flex items-center mb-2">
              <DollarSign className="mr-2 text-primary" size={16} />
              <span className="font-medium">Salary Range</span>
            </div>
            <div className="px-2">
              <Slider
                defaultValue={[30000, 150000]}
                min={0}
                max={300000}
                step={5000}
                value={filters.salaryRange}
                onValueChange={(value) =>
                  handleFilterChange("salaryRange", value)
                }
                className="my-6"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${filters.salaryRange[0].toLocaleString()}</span>
                <span>${filters.salaryRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex justify-end">
            <Button variant="outline" onClick={clearFilters} className="mr-2">
              Clear Filters
            </Button>
            <Button>Apply Filters</Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SearchFilters;
