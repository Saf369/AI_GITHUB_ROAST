"use client";

import { useState } from "react";
import RoastForm from "@/components/RoastForm";
import RoastDisplay from "@/components/RoastDisplay";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [roastData, setRoastData] = useState<{ roast: string; profile: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRoast = async (username: string, language: string) => {
    setIsLoading(true);
    setError(null);
    setRoastData(null);

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setRoastData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetRoast = () => {
    setRoastData(null);
    setError(null);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        {!roastData ? (
          <>
            <RoastForm onSubmit={handleRoast} isLoading={isLoading} />
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 text-destructive border-2 border-destructive rounded-lg yellow-brutal-border-static w-full max-w-md text-center font-bold">
                Error: {error}
              </div>
            )}
          </>
        ) : (
          <RoastDisplay
            roast={roastData.roast}
            profileData={roastData.profile}
            onReset={resetRoast}
          />
        )}
      </div>
    </main>
  );
}
