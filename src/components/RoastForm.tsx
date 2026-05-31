"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Flame, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface RoastFormProps {
  onSubmit: (username: string, language: string) => void;
  isLoading: boolean;
}

export default function RoastForm({ onSubmit, isLoading }: RoastFormProps) {
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("English");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim(), language);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="yellow-brutal-border border-2 bg-card text-card-foreground">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary yellow-brutal-border-static">
            <Code size={32} className="text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-black uppercase tracking-tight">Roast My GitHub</CardTitle>
          <CardDescription className="text-base mt-2 font-medium">
            Enter a username and let the AI tear apart their coding habits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div className="relative">
              <Code className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="GitHub Username"
                className="pl-10 h-12 text-lg border-2 border-foreground/20 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary font-medium"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isLoading}
                className="flex w-full appearance-none bg-background pl-10 h-12 text-lg border-2 border-foreground/20 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary font-medium disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="English">English</option>
                <option value="Malayalam">Malayalam</option>
              </select>
            </div>

            <Button 
              type="submit" 
              className="h-12 text-lg font-bold uppercase tracking-wide yellow-brutal-border hover:bg-primary/90 mt-2"
              disabled={isLoading || !username.trim()}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="mr-2"
                >
                  <Code size={20} />
                </motion.div>
              ) : (
                <Flame size={20} className="mr-2" />
              )}
              {isLoading ? "Generating Roast..." : "Roast 'Em"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
