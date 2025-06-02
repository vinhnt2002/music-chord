import SetlistsSection from "@/components/Songs/Setlists";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

interface songs {
  title: string;
  sessions: string;
  chords: string;
  image: string;
}

const SearchPage = () => {
  const songsData: songs[] = [
    {
      title: "THE LOGICAL SONG",
      sessions: "15K jam sessions",
      chords: "C Am F",
      image: "https://i.ytimg.com/vi/-2RAq5o5pwc/default.jpg",
    },
    {
      title:
        "The WHITE STRIPES - SEVEN NATION ARMY (OFFICIAL MUSIC VIDEO)",
      sessions: "107K jam sessions",
      chords: "E G C B",
      image: "https://i.ytimg.com/vi/zgaCZOQCpp8/default.jpg",
    },
    {
      title: "HARRY STYLES - AS IT WAS (OFFICIAL VIDEO)",
      sessions: "106K jam sessions",
      chords: "Bm E A D",
      image: "https://i.ytimg.com/vi/V9PVRfjEBTI/default.jpg",
    },
    {
      title: "ROBBIE WILLIAMS - ANGELS",
      sessions: "110K jam sessions",
      chords: "F#m D A E",
      image: "https://i.ytimg.com/vi/TeQ_TTyLGMs/default.jpg",
    },
    {
      title: "LINKIN PARK - NUMB",
      sessions: "110K jam sessions",
      chords: "F#m D A E",
      image: "https://i.ytimg.com/vi/TeQ_TTyLGMs/default.jpg",
    },
  ];

  return (
    <main className="bg-gray-100 min-h-screen">
      <section className="container mx-auto p-4 max-w-7xl">
        <Card className="w-full">
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button>All</Button>
              <Button>Songs</Button>
              <Button>Artits</Button>
              <Button>Setlists</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 mb-4 w-full">
          <CardTitle className="px-6 py-4 text-2xl font-semibold">
            Songs
          </CardTitle>
          <CardContent className="px-4 md:px-6">
            {songsData.map((song, index) => (
              <div
                className="flex items-center gap-4 py-2 hover:bg-[#CEE6E6] duration-300 rounded-lg cursor-pointer"
                key={index}
              >
                <picture className="">
                  <Image
                    src={song.image}
                    alt="Image"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-xs"
                  />
                </picture>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base line-clamp-1">
                    {song.title}
                  </p>
                  <p className="text-gray-500 font-semibold text-xs md:text-sm">
                    <span>{song.sessions}</span> -{" "}
                    <span>{song.chords}</span>
                  </p>
                </div>
              </div>
            ))}
            <p className="text-center cursor-pointer hover:underline pt-4">
              See more
            </p>
          </CardContent>
        </Card>

        <SetlistsSection />
      </section>
    </main>
  );
};

export default SearchPage;
