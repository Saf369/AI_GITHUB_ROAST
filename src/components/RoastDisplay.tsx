"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileData {
  login: string;
  avatar_url: string;
  name: string;
  public_repos: number;
  followers: number;
  bio: string;
  top_languages: string[];
}

interface RoastDisplayProps {
  roast: string;
  profileData: ProfileData | null;
  onReset: () => void;
}

export default function RoastDisplay({ roast, profileData, onReset }: RoastDisplayProps) {
  if (!profileData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="w-full max-w-4xl"
    >
      <Card className="yellow-brutal-border border-4 bg-card text-card-foreground p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b-4 border-foreground/10">
          <img
            src={profileData.avatar_url}
            alt={profileData.login}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full yellow-brutal-border-static"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-black m-0 tracking-tight">{profileData.name || profileData.login}</h2>
            <a href={`https://github.com/${profileData.login}`} target="_blank" rel="noreferrer" className="text-primary font-bold text-lg hover:underline decoration-4 underline-offset-4">
              @{profileData.login}
            </a>
            {profileData.bio && <p className="text-muted-foreground mt-2 font-medium">{profileData.bio}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="yellow-brutal-border-static border-2 text-center py-6 shadow-none hover:-translate-y-1 transition-transform">
            <div className="text-4xl font-black text-primary">{profileData.public_repos}</div>
            <div className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-wider">Repositories</div>
          </Card>
          <Card className="yellow-brutal-border-static border-2 text-center py-6 shadow-none hover:-translate-y-1 transition-transform">
            <div className="text-4xl font-black text-primary">{profileData.followers}</div>
            <div className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-wider">Followers</div>
          </Card>
          <Card className="yellow-brutal-border-static border-2 text-center py-4 shadow-none flex flex-col justify-center hover:-translate-y-1 transition-transform">
            <div className="text-lg font-bold flex flex-col gap-1 text-foreground">
              {profileData.top_languages.length > 0
                ? profileData.top_languages.slice(0, 3).map(lang => <span key={lang}>{lang}</span>)
                : "None"}
            </div>
            <div className="text-sm font-bold text-muted-foreground mt-2 uppercase tracking-wider">Top Languages</div>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-secondary/30 p-6 sm:p-8 rounded-xl border-l-8 border-primary text-left"
        >
          <div className="markdown-body prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {roast}
            </ReactMarkdown>
          </div>
        </motion.div>

        <div className="mt-10 text-center">
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="h-14 px-8 text-lg font-bold uppercase tracking-wide yellow-brutal-border border-2 hover:bg-muted"
          >
            Roast Another Dev
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
