"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const NotFound = () => {
  const router = useRouter();
  return (
    <Card className="h-screen">
      <div className="flex flex-col items-center justify-center gap-4 h-full">
        <p className="text-4xl font-semibold text-gray-900">404</p>
        <Image
          src="https://chordify.net/img/chordifrog.png"
          alt="404"
          width={200}
          height={200}
          className="object-contain"
        />
        <p>Ribbit! Nothing here but me!</p>
        <p>
          Please try one of the following links to continue your tour on our
          site:
        </p>
        <Button
          onClick={() => router.push("/")}
          size="lg"
          className="cursor-pointer"
        >
          Home
        </Button>
      </div>
    </Card>
  );
};

export default NotFound;
