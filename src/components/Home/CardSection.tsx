import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MenuIcon } from "lucide-react";
import Image from "next/image";

// Define the type for a song object
interface Song {
  title: string;
  sessions: string;
  chords: string;
}

// Define the props interface for the component
interface Props {
  title: string;
  songs: Song[];
  description: string;
  imageSrc: string;
  imageAlt?: string;
}

const CardSection = ({
  title,
  songs,
  description,
  imageSrc,
  imageAlt,
}: Props) => {
  return (
    <section className="w-full container mx-auto p-4">
      <Card className="shadow-lg rounded-lg py-2">
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Image and Text Section */}
          <div className="flex flex-col items-start gap-4">
            <p className="text-xl font-semibold hover:underline cursor-pointer">
              {title}
            </p>
            {/* Image Section */}
            <div className="w-full">
              <Image
                src={imageSrc}
                alt={imageAlt || "Image"}
                width={1000}
                height={1000}
                className="w-full h-auto object-cover rounded-lg max-h-64 md:max-h-full"
              />
            </div>
            {/* Description Section */}
            <div className="flex-1">
              <p className="text-xs md:text-sm">{description}</p>
            </div>
          </div>

          {/* Song List */}
          <div className="mt-6 space-y-4 md:col-span-2">
            <div>
              {songs.map((song, index) => (
                <div
                  key={index}
                  className="w-full flex items-center justify-between p-2 hover:bg-[#CEE6E6] duration-300 rounded-lg cursor-pointer"
                >
                  {/* Song Info */}
                  <div className="w-full flex items-center justify-between space-x-3">
                    <div className="w-full flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-500 line-clamp-1">
                        {song.title}
                      </p>
                      <p className="text-xs font-semibold text-gray-500 line-clamp-1">
                        {song.sessions} • chords: {song.chords}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                    >
                      <MenuIcon className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Action Button */}
                </div>
              ))}
            </div>
            {/* See More Button */}
            <div className="mt-4 text-center">
              <Button
                variant="link"
                className="text-gray-600 hover:text-gray-800"
              >
                SEE MORE
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CardSection;
