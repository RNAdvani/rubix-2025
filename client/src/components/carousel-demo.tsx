import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { Plane, Users, Smartphone } from "lucide-react";

const features = [
  {
    title: "Scheduled Unlocking",
    description:
      "Set a specific future date to reveal your time capsule, creating a surprise for yourself or your recipients.",
    cta: "Start Planning",
    icon: Plane,
    image: "https://example.com/images/scheduled-unlocking.jpg", // Replace with actual image URL
  },
  {
    title: "Media Upload & Collaboration",
    description:
      "Store messages, photos, videos, and audio. Collaborate with friends or family to create shared time capsules.",
    cta: "Upload Memories",
    icon: Users,
    image: "https://example.com/images/media-collaboration.jpg", // Replace with actual image URL
  },
  {
    title: "Personalized Themes & Notifications",
    description:
      "Customize with themes like 'Graduation' or 'Anniversary' and enjoy countdowns and reminders as the unlock date approaches.",
    cta: "Customize Now",
    icon: Smartphone,
    image: "https://example.com/images/personalized-themes.jpg", // Replace with actual image URL
  },
];

export function OnboardingCarousel() {
  return (
    <Carousel className="w-full h-screen">
      <CarouselContent>
        {features.map((feature, index) => (
          <CarouselItem key={index} className="h-screen">
            <Card className="relative h-full border-none rounded-none overflow-hidden">
              {/* Background Image with Gradient Overlay */}
              <div className="absolute inset-0">
                <img
                  src={feature.image || "/placeholder.svg"}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/80" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-between p-6 text-white md:p-10 lg:p-16">
                {/* Top Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex justify-center pt-10 md:pt-16"
                >
                  <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mb-4" />
                </motion.div>

                {/* Middle Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center space-y-3 max-w-xs sm:max-w-md md:space-y-4"
                >
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-white/90 sm:text-base lg:text-lg">
                    {feature.description}
                  </p>
                </motion.div>

                {/* Bottom Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="w-full max-w-xs sm:max-w-md mt-6 mb-10 md:mt-10 space-y-4"
                >
                  <Button className="w-full h-12 text-sm sm:text-base lg:text-lg bg-white text-primary hover:bg-white/90">
                    {feature.cta}
                  </Button>
                  {index === 0 && (
                    <Button
                      variant="ghost"
                      className="w-full h-12 text-sm sm:text-base lg:text-lg text-white hover:bg-white/10"
                    >
                      Sign in
                    </Button>
                  )}
                </motion.div>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
