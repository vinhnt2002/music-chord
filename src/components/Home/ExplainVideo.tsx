import { Card } from "@/components/ui/card";
import Image from "next/image";
import { IconType } from "react-icons";

// Define the type for a help item
interface HelpItem {
  icon: IconType; // Path to icon or class name
  title: string;
  description: string;
}

// Define the props interface for the component
interface ExplainerVideoHelpProps {
  title: string;
  videoImageSrc: string;
  videoImageAlt?: string;
  videoLink: string;
  helpItems: HelpItem[];
}

const ExplainerVideoHelp = ({
  title,
  videoImageSrc,
  videoImageAlt = "Explainer Video",
  //   videoLink,
  helpItems,
}: ExplainerVideoHelpProps) => {
  return (
    <section className="w-full container mx-auto p-4">
      <Card className="shadow-lg rounded-lg p-2">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video Thumbnail Section */}
          <Image
            src={videoImageSrc}
            alt={videoImageAlt}
            width={600}
            height={400}
            className="w-full h-full object-cover rounded-lg"
          />
          {/* <div className="absolute inset-0 flex items-center justify-center z-50 ">
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-gray-800 hover:bg-gray-100 border-2 border-white rounded-full"
              asChild
            >
              <a href={videoLink} target="_blank" rel="noopener noreferrer">
                WATCH EXPLAINER VIDEO <span className="ml-2">▶</span>
              </a>
            </Button>
          </div> */}

          {/* Help Topics Section */}
          <div className="space-y-1">
            {helpItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm  hover:bg-[#CEE6E6] duration-300 cursor-pointer"
              >
                <div className="w-8 h-8 flex-shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
};

export default ExplainerVideoHelp;
