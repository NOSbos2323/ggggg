import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, MessageCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TradesPerson {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  location: string;
  image: string;
  workSamples: string[];
  contactNumber: string;
}

const TradesShowcase = ({
  tradespeople = defaultTradespeople,
}: {
  tradespeople?: TradesPerson[];
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="w-full py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            الحرفيون المهرة
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            اكتشف الحرفيين الموهوبين والمتخصصين المستعدين لمساعدتك في مشاريعك.
            تصفح أعمالهم وتواصل معهم مباشرة.
          </p>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {tradespeople.map((person) => (
              <CarouselItem
                key={person.id}
                className="md:basis-1/2 lg:basis-1/3 pl-4"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02, rotateY: 3 }}
                  onMouseEnter={() => setHoveredCard(person.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  className="perspective-1000"
                >
                  <Card className="h-full overflow-hidden bg-gradient-to-br from-white via-purple-50/40 to-indigo-50/40 border-3 border-transparent hover:border-gradient-to-r hover:from-purple-300 hover:to-indigo-300 shadow-xl hover:shadow-3xl transition-all duration-700 rounded-2xl sm:rounded-3xl min-h-[400px] sm:min-h-[420px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-blue-500/8 to-indigo-500/8 opacity-0 hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="pb-4 sm:pb-5 relative z-10">
                      <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                        <Avatar className="h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 border-3 sm:border-4 border-gradient-to-r from-purple-400 to-indigo-400 shadow-xl flex-shrink-0">
                          <AvatarImage src={person.image} alt={person.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 text-purple-700 font-black text-lg sm:text-xl">
                            {person.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-black text-gray-800 hover:text-purple-600 transition-colors duration-500 mb-2 sm:mb-3 leading-tight">
                            {person.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                            <Badge
                              variant="secondary"
                              className="bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100 text-purple-700 font-bold px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base shadow-md"
                            >
                              {person.specialty}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={
                              i < person.rating
                                ? "fill-amber-400 text-amber-400 drop-shadow-lg sm:w-5 sm:h-5 md:w-6 md:h-6"
                                : "text-slate-300 sm:w-5 sm:h-5 md:w-6 md:h-6"
                            }
                          />
                        ))}
                        <span className="text-base sm:text-lg text-gray-700 ml-2 sm:ml-3 font-bold">
                          {person.rating.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                        <MapPin
                          size={18}
                          className="text-purple-500 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0"
                        />
                        <span className="font-semibold truncate">
                          {person.location}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
                        {person.workSamples.map((sample, index) => (
                          <motion.div
                            key={index}
                            className="aspect-square rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-white/50"
                            whileHover={{ scale: 1.1, rotate: 2 }}
                            transition={{ duration: 0.3, type: "spring" }}
                          >
                            <img
                              src={sample}
                              alt={`Work sample ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 pt-4 sm:pt-6 relative z-10">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center gap-2 sm:gap-3 h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-purple-200/50 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 font-semibold text-sm sm:text-base transform hover:scale-105 w-full sm:flex-1"
                      >
                        <Phone
                          size={16}
                          className="sm:w-4 sm:h-4 md:w-5 md:h-5"
                        />
                        <span>اتصال</span>
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center justify-center gap-2 sm:gap-3 h-10 sm:h-12 px-4 sm:px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold text-sm sm:text-base transform hover:scale-105 w-full sm:flex-1"
                      >
                        <MessageCircle
                          size={16}
                          className="sm:w-4 sm:h-4 md:w-5 md:h-5"
                        />
                        <span>رسالة</span>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6">
            <CarouselPrevious className="relative static mr-2" />
            <CarouselNext className="relative static" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

const defaultTradespeople: TradesPerson[] = [
  {
    id: "1",
    name: "Ahmed Benali",
    specialty: "Electrician",
    rating: 4.8,
    location: "Algiers, Algeria",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    workSamples: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=80",
      "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=300&q=80",
      "https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=300&q=80",
    ],
    contactNumber: "+213 555 123 456",
  },
  {
    id: "2",
    name: "Fatima Zahra",
    specialty: "Interior Designer",
    rating: 4.9,
    location: "Oran, Algeria",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    workSamples: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&q=80",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=300&q=80",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=300&q=80",
    ],
    contactNumber: "+213 555 789 012",
  },
  {
    id: "3",
    name: "Karim Hadj",
    specialty: "Plumber",
    rating: 4.7,
    location: "Constantine, Algeria",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim",
    workSamples: [
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&q=80",
      "https://images.unsplash.com/photo-1542013936693-884638332954?w=300&q=80",
    ],
    contactNumber: "+213 555 345 678",
  },
  {
    id: "4",
    name: "Amina Berber",
    specialty: "Carpenter",
    rating: 4.6,
    location: "Annaba, Algeria",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina",
    workSamples: [
      "https://images.unsplash.com/photo-1611145434336-2b6ad460392e?w=300&q=80",
      "https://images.unsplash.com/photo-1622150162958-6211e5780ce1?w=300&q=80",
      "https://images.unsplash.com/photo-1581016120489-4e8c929955e7?w=300&q=80",
    ],
    contactNumber: "+213 555 901 234",
  },
  {
    id: "5",
    name: "Youcef Mansouri",
    specialty: "Painter",
    rating: 4.5,
    location: "Setif, Algeria",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Youcef",
    workSamples: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&q=80",
      "https://images.unsplash.com/photo-1598547111397-8f2c9830be48?w=300&q=80",
      "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=300&q=80",
    ],
    contactNumber: "+213 555 567 890",
  },
  {
    id: "6",
    name: "Leila Bouaziz",
    specialty: "Tailor",
    rating: 4.9,
    location: "Tlemcen, Algeria",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leila",
    workSamples: [
      "https://images.unsplash.com/photo-1605289355680-75fb41239154?w=300&q=80",
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=300&q=80",
      "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=300&q=80",
    ],
    contactNumber: "+213 555 234 567",
  },
];

export default TradesShowcase;
