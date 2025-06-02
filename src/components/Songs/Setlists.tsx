import Image from "next/image";

const setlists = [
  {
    id: 1,
    title: "à apprendre - LIONEL",
    songs: "660 songs",
    image: "https://i.ytimg.com/vi/OkJbGgR__Ow/default.jpg",
  },
  {
    id: 2,
    title: "LES MIEUX JOUÉES (À MON AVIS) - ANONYMOUS",
    songs: "579 songs",
    image: "https://i.ytimg.com/vi/AX9hrrcPjWc/default.jpg",
  },
  {
    id: 3,
    title: "à corriger - LIONEL",
    songs: "378 songs",
    image: "https://i.ytimg.com/vi/KOOhPfMbuIQ/default.jpg",
  },
];

const SetlistsSection = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-4">Setlists</h2>

      {/* Grid Layout for Setlists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {setlists.map((setlist) => (
          <div
            key={setlist.id}
            className="flex flex-col items-start rounded-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            {/* 2x2 Grid of 4 Images */}
            <div className="relative w-full h-40 grid grid-cols-2 grid-rows-2 gap-1">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className="relative w-full h-full cursor-pointer"
                >
                  <Image
                    src={setlist.image}
                    alt={`${setlist.title} - Image ${num}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-sm"
                  />
                </div>
              ))}
            </div>

            {/* Text Content */}
            <div className="p-2">
              <h3 className="text-sm font-semibold truncate">
                {setlist.title}
              </h3>
              <p className="text-xs text-gray-500">{setlist.songs}</p>
            </div>
          </div>
        ))}
      </div>

      {/* See More Button (ShadCN UI Button) */}
      <div className="flex justify-center mt-6">
        <p className="text-center cursor-pointer hover:underline">See more</p>
      </div>
    </div>
  );
};

export default SetlistsSection;
