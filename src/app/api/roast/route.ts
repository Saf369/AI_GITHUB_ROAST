import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured on server" }, { status: 500 });
    }

    const { username, language = "English" } = await req.json();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Setup GitHub Headers to use token if provided
    const githubToken = process.env.GITHUB_TOKEN;
    const githubHeaders: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
    };
    if (githubToken) {
      githubHeaders["Authorization"] = `Bearer ${githubToken}`;
    }

    // 1. Fetch GitHub Profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers: githubHeaders });
    if (!userRes.ok) {
      if (userRes.status === 404) {
        return NextResponse.json({ error: "GitHub user not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Failed to fetch GitHub profile" }, { status: 500 });
    }
    const userData = await userRes.json();

    // 2. Fetch Top Repositories
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, { headers: githubHeaders });
    let reposData = [];
    if (reposRes.ok) {
      reposData = await reposRes.json();
    }

    // 3. Process Languages & Repo Info
    const languages = new Map<string, number>();
    let totalStars = 0;
    
    const repoNames = reposData.map((repo: any) => {
      if (repo.language) {
        languages.set(repo.language, (languages.get(repo.language) || 0) + 1);
      }
      totalStars += repo.stargazers_count;
      return repo.name;
    });

    const topLanguages = Array.from(languages.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 5);

    const profileData = {
      login: userData.login,
      avatar_url: userData.avatar_url,
      name: userData.name || userData.login,
      public_repos: userData.public_repos,
      followers: userData.followers,
      bio: userData.bio,
      top_languages: topLanguages,
    };

    // 4. Generate Roast with Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Fast and cheap model

    let languagePrompt = "";
    if (language.toLowerCase() === "malayalam") {
      languagePrompt = "Based on all our past chats, interactions, and my personality that you've observed so far, I want you to give me a brutal, funny, and sarcastic roast. Roast my habits, the way I wrote on my resume, or anything else you've noticed about me. However, you must write the entire roast in Malayalam (using Malayalam script) but keep the humor sharp. Don't hold back, make it hilarious use emojis too.";
    } else {
      languagePrompt = "Write the roast in English.";
    }

    const prompt = `
      You are a brutally honest, extremely sarcastic, but ultimately funny AI coding critic. 
      Your task is to review a developer's GitHub profile and provide a savage "roast" of their coding habits, 
      based strictly on the data provided below. Do not be polite. Use formatting (bolding, lists) to make the roast readable.

      ${languagePrompt}

      GitHub User Data:
      - Username: ${profileData.login}
      - Name: ${profileData.name}
      - Bio: ${profileData.bio || "No bio. Probably too busy writing spaghetti code."}
      - Followers: ${profileData.followers} (Tell them if this is a pathetic number)
      - Public Repositories: ${profileData.public_repos}
      - Top Languages Used: ${profileData.top_languages.join(", ") || "None. Do they even code?"}
      - Recent Repos: ${repoNames.slice(0, 5).join(", ") || "Nothing recently."}

      Write a highly entertaining, slightly painful, multi-paragraph roast. Focus on their languages, lack of followers, or weird repo names. 
      End with a slightly backhanded compliment. 
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const roastText = response.text();

    return NextResponse.json({
      profile: profileData,
      roast: roastText
    });

  } catch (error: any) {
    console.error("Roast API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
