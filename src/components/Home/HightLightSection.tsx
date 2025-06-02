import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

// Define the type for a toolkit item
interface ToolkitItem {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
}

// Define the props interface for the component
interface HighlightTracksProps {
  title: string;
  description: string;
  backgroundImageSrc: string;
  backgroundImageAlt?: string;
  toolkitItems: ToolkitItem[];
}

const HighlightSection = ({
  title,
  description,
  backgroundImageSrc,
  backgroundImageAlt = "Background Image",
  toolkitItems,
}: HighlightTracksProps) => {
  return (
    <section className="w-full container mx-auto p-4">
      <Card className="shadow-lg rounded-lg py-2 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Section: Title, Description, and Background Image */}
          <div className="flex flex-col justify-start space-y-4">
            <h2 className="text-4xl font-bold text-orange-500 underline cursor-pointer">
              {title}
            </h2>
            <p className="text-gray-700 text-base">{description}</p>
            <div>
              <Button
                variant="link"
                className="text-orange-500 p-0 h-auto font-semibold hover:text-orange-600 cursor-pointer"
              >
                &gt; read article
              </Button>
            </div>
          </div>
          <div className="relative w-full h-64 md:h-80">
            <Image
              src={backgroundImageSrc}
              alt={backgroundImageAlt}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Bottom Section: Toolkit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {toolkitItems.map((item, index) => (
            <div className="relative w-full h-40" key={index}>
              <Image
                src={item.imageSrc}
                alt={item.imageAlt || item.title}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};

export default HighlightSection;
