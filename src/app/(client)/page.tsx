import AudioUploader from "@/components/AudioUploader";
import ArtisSection from "@/components/Home/ArtisSection";
import CardSection from "@/components/Home/CardSection";
import ExplainerVideoHelp from "@/components/Home/ExplainVideo";
import HeroSection from "@/components/Home/HeroSection";
import HighlightSection from "@/components/Home/HightLightSection";
import MusicianReviews from "@/components/Home/MusicanReviews";
import PopularSongs from "@/components/Home/PopularSongs";
import {
  artisData,
  helpItems,
  reviewsData,
  songs,
  songsData,
  toolkitData,
} from "@/lib/dummyData";

export default function Home() {
  return (
    <main className="w-full min-h-screen mx-auto">
      <HeroSection />

      <div className="space-y-12 md:space-y-16 py-8">
        <CardSection
          title="INTRODUCING LYRICS (BETA)"
          songs={songs}
          description="You wanted it, and now you've got it! Try our exclusive beta of the lyrics feature! Not all your favorite songs have lyrics yet, but these do! Start jamming and singing, share your feedback, and let's grow together!"
          imageSrc={"https://chordify.net/img/channels/lyricss.jpg"}
          imageAlt="Introducing Lyrics Feature"
        />

        <PopularSongs
          title="Popular songs in your country"
          songs={songsData}
        />

        <CardSection
          title="Laydy Gaga"
          songs={songs}
          description="Mayhem has arrived—and it's killah! This beast of an album is here to dominate the charts, so pick up your instrument and jam along now on Chordify!"
          imageSrc={"https://chordify.net/img/channels/lady-gaga.jpg"}
          imageAlt="Introducing Lyrics Feature"
        />

        <CardSection
          title="Top 10 most-played on Chordify"
          songs={songs}
          description="These are the most-played songs on Chordify right now. Get inspired and start playing!"
          imageSrc={
            "https://chordify.net/img/channels/top-10-aug-25.jpg"
          }
          imageAlt="Top 10 most-played on Chordify"
        />

        <CardSection
          title="Bob Dylan"
          songs={songs}
          description="Still buzzing from A Complete Unknown? Keep the Dylan energy alive by jamming to some of his iconic songs!"
          imageSrc={"https://chordify.net/img/channels/bobd.jpg"}
          imageAlt="Bob Dylan"
        />

        <CardSection
          title="Folk pop & country"
          songs={songs}
          description="These songs bring storytelling to life, perfect for playing along. Grab your instrument and dive into the sound that's taking over!"
          imageSrc={"https://chordify.net/img/channels/country.jpg"}
          imageAlt="Folk pop & country"
        />

        <CardSection
          title="Hot tracks on TikTok"
          songs={songs}
          description="The hottest tracks on TikTok right now. Looking for some new inspiration or just want to check out the trending tracks? Then this is the right place. Happy Jamming!"
          imageSrc={
            "https://chordify.net/img/channels/tiktoklogo.jpg"
          }
          imageAlt="Hot tracks on TikTok"
        />

        <CardSection
          title="Top 10 user edits"
          songs={songs}
          description="We've created this setlist to celebrate the great edits that the Chordify community provides. This is the top 10 best edited tracks from the last month. Happy jamming!"
          imageSrc={
            "https://chordify.net/img/channels/setlist-edits1.jpg"
          }
          imageAlt="Top 10 user edits"
        />

        <CardSection
          title="Beginner guitar songs"
          songs={songs}
          description="We've created this setlist to celebrate the great edits that the Chordify community provides. This is the top 10 best edited tracks from the last month. Happy jamming!"
          imageSrc={
            "https://chordify.net/img/channels/guitar-beg.jpg"
          }
          imageAlt="Beginner guitar songs"
        />

        <PopularSongs
          title="Featured Songs - curated by Chordify ★ ★ ★ ★"
          songs={songsData}
        />

        <HighlightSection
          title="Highlighted tracks"
          description="Hey there Chordifiers! Welcome to a new blog series called Highlighted tracks. Here we'll take a look at tracks outside the regular top 10 that are popular on Chordify, and shine a spotlight on them."
          backgroundImageSrc="https://chordify.net/pages/wp-content/uploads/2024/11/resize-17309863961954438143pexelsvishnurnair1105666-624x416.jpg"
          backgroundImageAlt="Concert Crowd"
          toolkitItems={toolkitData}
        />

        <MusicianReviews
          title="What other musicians think of Chordify"
          reviewCount={1561}
          reviews={reviewsData}
          trustpilotLink="https://www.trustpilot.com/review/chordify.net"
        />

        <ExplainerVideoHelp
          title="Explainer video & help"
          videoImageSrc="https://chordify.net/img/backgrounds/pre-video-wallpaper.jpg"
          videoImageAlt="Explainer Video Thumbnail"
          videoLink="https://www.youtube.com/watch?v=example"
          helpItems={helpItems}
        />

        <ArtisSection infos={artisData} />
        <AudioUploader />
      </div>
    </main>
  );
}
