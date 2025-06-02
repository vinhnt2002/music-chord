import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MenuIcon } from "lucide-react";
import Image from "next/image";

// Define the type for a song object
interface Song {
  title: string;
  sessions: string;
  chords: string;
  image: string;
}

// Define the props interface for the component
interface PopularSongsProps {
  title: string;
  songs: Song[];
}

const PopularSongs = ({ title, songs }: PopularSongsProps) => {
  return (
    <section className="w-full container mx-auto px-4 py-6">
      <Card className="shadow-lg rounded-lg">
        <CardContent className="p-4 md:p-6">
          {/* Header Section */}
          <p className="text-xl font-semibold mb-4 hover:underline cursor-pointer">
            {title}
          </p>
          {/* Song List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {songs.map((song, index) => (
              <div
                key={index}
                className="w-full h-full p-2 flex flex-col items-start bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-[#CEE6E6] cursor-pointer transition-shadow duration-300"
              >
                {/* Song Image */}
                <picture className="w-full h-1/2 relative">
                  <Image
                    src={song.image}
                    alt={song.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </picture>
                {/* Song Info */}
                <div className="px-2 py-4 text-start flex-1 w-full">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">
                    {song.title}
                  </p>
                  <div className="mt-1 flex items-center justify-between pt-4">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        {song.sessions}
                      </p>
                      <p className="text-xs text-gray-500 font-semibold">
                        chords: {song.chords}
                      </p>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <MenuIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Action Button */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PopularSongs;
