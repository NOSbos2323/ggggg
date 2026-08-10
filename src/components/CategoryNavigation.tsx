import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Briefcase,
  Hammer,
  Wrench,
  Cpu,
  Stethoscope,
  GraduationCap,
  Paintbrush,
  Utensils,
  Car,
  Truck,
} from "lucide-react";

import { defaultCategories } from "../data/categories";

interface CategoryProps {
  categories?: Array<{
    id: string;
    name: string;
    icon: React.ReactNode;
    count?: number;
  }>;
  onCategorySelect?: (categoryId: string) => void;
}

function getIconForCategory(categoryId: string) {
  switch (categoryId) {
    case "construction":
      return <Hammer size={24} />;
    case "electrical":
      return <Wrench size={24} />;
    case "plumbing":
      return <Wrench size={24} />;
    case "technology":
      return <Cpu size={24} />;
    case "healthcare":
      return <Stethoscope size={24} />;
    case "education":
      return <GraduationCap size={24} />;
    case "art":
      return <Paintbrush size={24} />;
    case "food":
      return <Utensils size={24} />;
    case "automotive":
      return <Car size={24} />;
    case "logistics":
      return <Truck size={24} />;
    default:
      return <Briefcase size={24} />;
  }
}

const CategoryNavigation = ({
  categories = defaultCategories.map((cat) => ({
    ...cat,
    icon: getIconForCategory(cat.id),
  })),
  onCategorySelect = () => {},
}: CategoryProps) => {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 md:gap-6 lg:gap-4 xl:gap-3">
          {categories.map((category, index) => (
            <TooltipProvider key={category.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{
                      y: -8,
                      scale: 1.05,
                      rotateY: 5,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCategorySelect(category.id)}
                    className="perspective-1000"
                  >
                    <Card className="cursor-pointer h-full group relative overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40 border-3 border-transparent hover:border-gradient-to-r hover:from-blue-300 hover:to-indigo-300 shadow-xl hover:shadow-3xl transition-all duration-700 rounded-2xl sm:rounded-3xl min-h-[140px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[160px] xl:min-h-[140px] 2xl:min-h-[120px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/8 to-indigo-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <CardContent className="flex flex-col items-center justify-center p-4 sm:p-5 md:p-6 h-full relative z-10">
                        <motion.div
                          className="bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-indigo-200 p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl mb-3 sm:mb-4 md:mb-6 transition-all duration-700 shadow-lg group-hover:shadow-2xl border border-white/50"
                          whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
                          transition={{
                            duration: 0.7,
                            type: "spring",
                            stiffness: 200,
                          }}
                        >
                          <div className="text-blue-600 group-hover:text-indigo-600 group-hover:scale-130 transition-all duration-700 drop-shadow-md [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 md:[&>svg]:w-6 md:[&>svg]:h-6">
                            {category.icon}
                          </div>
                        </motion.div>
                        <h3 className="font-black text-center group-hover:text-blue-600 transition-colors duration-500 text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-3 leading-tight">
                          {category.name}
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-2 sm:mt-3 md:mt-4 group-hover:text-blue-600 transition-colors duration-500 font-semibold text-center">
                          {category.count} وظيفة متاحة
                        </p>
                        <motion.div
                          className="mt-2 sm:mt-3 md:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500"
                          initial={{ scale: 0, y: 10 }}
                          whileHover={{ scale: 1, y: 0 }}
                          transition={{ duration: 0.3, type: "spring" }}
                        >
                          <span className="text-xs sm:text-sm bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full shadow-lg font-bold tracking-wide">
                            اضغط للعرض
                          </span>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-xl">
                  <p className="font-medium">
                    تصفح {category.count} وظيفة في {category.name}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;
