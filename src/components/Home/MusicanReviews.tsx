import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Define the type for a review item
interface Review {
  rating: number;
  title: string;
  description: string;
  author: string;
  country: string;
  avatar?: string;
}

// Define the props interface for the component
interface MusicianReviewsProps {
  title: string;
  reviewCount: number;
  reviews: Review[];
  trustpilotLink: string;
}

const MusicianReviews = ({
  title,
  reviewCount,
  reviews,
  trustpilotLink,
}: MusicianReviewsProps) => {
  return (
    <section className="w-full container mx-auto px-4 py-8 bg-gray-50">
      <div className="flex flex-col items-center gap-8">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <Link
          href={trustpilotLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
          prefetch={false}
        >
          See our <span className="font-semibold mx-2">{reviewCount}</span>
          reviews on Trustpilot
          <Star className="w-4 h-4 ml-1 text-[#0A8282] fill-current" />
        </Link>
      </div>

      {/* Scrollable Review Cards */}
      <div className="flex overflow-x-auto space-x-6 py-2 scrollbar-hide">
        {reviews.map((review, index) => (
          <Card
            key={index}
            className="min-w-[300px] max-w-[300px] py-2 bg-white shadow-md rounded-lg overflow-hidden flex-shrink-0"
          >
            <CardContent className="p-6 flex flex-col space-y-4">
              {/* Rating Stars */}
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? "text-gray-800 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Review Title and Description */}
              <h3 className="text-lg font-semibold text-gray-800">
                {review.title}
              </h3>
              <p className="text-gray-800 text-sm">{review.description}</p>

              {/* Author Info */}
              <div className="flex items-center space-x-2">
                {review.avatar && (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={review.avatar}
                      alt={review.author}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-gray-800 font-medium">{review.author}</p>
                  <p className="text-gray-500 text-xs">{review.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default MusicianReviews;
