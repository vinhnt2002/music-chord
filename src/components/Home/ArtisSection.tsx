import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Define the type for an artist information object
interface ArtistInfo {
  avatar: string;
  name: string;
}

// Define the props interface for the component
interface ArtistsSectionProps {
  infos: ArtistInfo[];
}

const ArtistsSection = ({ infos }: ArtistsSectionProps) => {
  return (
    <section className="w-full container mx-auto p-2 sm:p-3 md:p-4">
      <Card className="shadow-lg rounded-lg py-2">
        <CardContent className="p-2 sm:p-4 md:p-6">
          <div className="w-full flex items-start flex-col gap-2 sm:gap-3 md:gap-4">
            <p className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 hover:underline cursor-pointer">
              Artists
            </p>
            <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {infos.map((info, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col items-center gap-1 sm:gap-2"
                >
                  <div className="relative aspect-square w-full max-w-16 sm:max-w-20 md:max-w-24">
                    <Image
                      src={info.avatar}
                      alt={info.name}
                      fill
                      sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 150px"
                      className="rounded-full object-cover"
                    />
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm text-center truncate w-full">
                    {info.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 sm:mt-4 md:mt-6 text-center">
            <Button
              variant="link"
              className="text-gray-600 hover:text-gray-800 uppercase text-xs sm:text-sm font-medium"
            >
              Show more artists
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ArtistsSection;
