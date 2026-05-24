export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: "Tollywood" | "Bollywood" | "Hollywood" | "OTT" | "Box Office" | "Reviews";
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

const DEFAULT_NEWS: NewsArticle[] = [
  {
    id: "pushpa-2-trailer-release",
    title: "Pushpa 2: The Rule Trailer Sets New Record with 100M+ Views in 24 Hours",
    summary: "Allu Arjun's highly anticipated action-thriller trailer has taken the internet by storm, shattering all previous Indian cinema trailer records.",
    content: `The storm has officially arrived. The trailer for *Pushpa 2: The Rule*, starring Icon Star Allu Arjun and Rashmika Mandanna, has rewritten YouTube history by crossing 100 million views within 24 hours of its release. 

Directed by Sukumar, the sequel promises to be larger-than-life, exploring the high-stakes clash between Pushpa Raj and SP Bhanwar Singh Shekhawat (played by Fahadh Faasil). Production values have seen a massive upgrade with spectacular visual effects, heavy-hitting dialogue, and a gripping score by Devi Sri Prasad.

### What the Trailer Reveals
The trailer showcases Pushpa Raj expanding his red sandalwood empire beyond local borders, venturing into international territory. Bhanwar Singh is back with vengeance, leading to explosive action sequences. Rashmika Mandanna's Srivalli returns with a more mature role, supporting Pushpa in his ultimate rise.

Industry experts predict that *Pushpa 2* is poised to open with a historic ₹200+ crore global box office on Day 1, making it one of the biggest Indian releases of all time. The film is scheduled to hit theatres worldwide on December 5, 2026.`,
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
    category: "Tollywood",
    publishedAt: "2026-05-24T10:00:00Z",
    readTime: "3 min read",
    author: {
      name: "Suresh Rao",
      role: "Senior Cinema Analyst",
      avatar: "🍿"
    }
  },
  {
    id: "ss-rajamouli-mahesh-babu-globetrotter",
    title: "SS Rajamouli & Mahesh Babu's SSMB29 to be a High-Octane Globe-trotting Action Adventure",
    summary: "Writer KV Vijayendra Prasad shares exciting updates on the script, revealing international locations and a Forest Adventure theme inspired by Indiana Jones.",
    content: `The collaboration between mastermind SS Rajamouli and Superstar Mahesh Babu (SSMB29) is easily one of the most talked-about projects in Indian cinema. In a recent press conference, legendary writer KV Vijayendra Prasad confirmed that the script is fully locked and production prep is running at full steam.

The film is styled as a globe-trotting action adventure, taking Mahesh Babu through dense forests, ancient ruins, and international locales. It is heavily inspired by classic adventure films like *Indiana Jones* but deeply rooted in Indian mythology and values.

### Key Highlights:
1. **International Cast**: Casting directors are currently in talks with several prominent Hollywood and international actors for key antagonist roles.
2. **Visual Effects**: A major portion of the pre-production budget is allocated to pre-visualization and advanced CGI design to match global standards.
3. **Training**: Mahesh Babu has undergone rigorous physical training in Germany, preparing for intense stunt sequences.

Principal photography is expected to begin in August 2026, with shooting scheduled across Africa, Europe, and India.`,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    category: "Tollywood",
    publishedAt: "2026-05-23T14:30:00Z",
    readTime: "4 min read",
    author: {
      name: "Karan Johar",
      role: "Industry Insider",
      avatar: "🎬"
    }
  },
  {
    id: "ott-releases-this-week-may",
    title: "Top OTT Releases This Week: Devara, Kalki 2898 AD & More Stream on Netflix, Prime Video, and Hotstar",
    summary: "Your ultimate guide to weekend binge-watching, featuring blockbuster digital premieres, crime thrillers, and indie specials.",
    content: `Looking for what to watch this weekend? We've got you covered with a curated list of blockbuster premieres making their digital debuts this week across major streaming networks.

### 1. Devara: Part 1 (Netflix)
Jr. NTR's high-voltage coastal action drama *Devara* is finally streaming after a blockbuster theatrical run. Co-starring Saif Ali Khan and Janhvi Kapoor, this film offers spectacular underwater battles and a solid mass experience.

### 2. Kalki 2898 AD: Extended Cut (Prime Video)
The futuristic mythological epic starring Prabhas, Amitabh Bachchan, and Kamal Haasan returns with an exclusive director's cut, featuring 10 minutes of unseen footage detailing the lore of Shambhala and Kashi.

### 3. Citadel: Honey Bunny (Amazon Prime Video)
The Indian chapter of the global Citadel universe, directed by Raj & DK and starring Varun Dhawan and Samantha Ruth Prabhu, offers a fast-paced retro spy thriller set in the 90s.

Let us know your reviews in our **Community Feed** after watching!`,
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80",
    category: "OTT",
    publishedAt: "2026-05-22T08:15:00Z",
    readTime: "5 min read",
    author: {
      name: "Radhika Sen",
      role: "OTT Specialist",
      avatar: "🎥"
    }
  },
  {
    id: "avatar-3-fire-and-ash-updates",
    title: "Avatar 3: Fire and Ash - James Cameron Reveals First Look at the 'Ash People' of Pandora",
    summary: "James Cameron unveils concept art for the upcoming sequel, introducing a volcanic tribe of Na'vi who represent the darker side of Pandora.",
    content: `James Cameron has shocked fans at the D23 Expo by sharing the official title and concept art for the third installment in the sci-fi franchise: *Avatar: Fire and Ash*.

Unlike the peaceful Omaticaya and water-dwelling Metkayina tribes, *Fire and Ash* introduces the **Ash People (Varang)**, a volcanic tribe led by Oona Chaplin. Cameron explained that this film will explore the darker side of Na'vi culture. 

"We want to show that Na'vi are not all good. Just like in the human world, there are factions that are driven by anger, power, and destruction," Cameron stated. 

The film has completed primary filming in New Zealand and is currently undergoing its extensive 2-year post-production phase. It is slated for a worldwide release on December 18, 2026.`,
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
    category: "Hollywood",
    publishedAt: "2026-05-21T18:00:00Z",
    readTime: "3 min read",
    author: {
      name: "John Miller",
      role: "Hollywood Correspondent",
      avatar: "🌍"
    }
  }
];

export function getNewsArticles(): NewsArticle[] {
  if (typeof window === "undefined") {
    return DEFAULT_NEWS;
  }
  const stored = localStorage.getItem("chitra_news_articles");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_NEWS;
    }
  }
  return DEFAULT_NEWS;
}

export function saveNewsArticle(article: NewsArticle) {
  if (typeof window === "undefined") return;
  const current = getNewsArticles();
  // check if update or create
  const existsIndex = current.findIndex(a => a.id === article.id);
  if (existsIndex >= 0) {
    current[existsIndex] = article;
  } else {
    current.unshift(article);
  }
  localStorage.setItem("chitra_news_articles", JSON.stringify(current));
}

export function deleteNewsArticle(id: string) {
  if (typeof window === "undefined") return;
  const current = getNewsArticles();
  const filtered = current.filter(a => a.id !== id);
  localStorage.setItem("chitra_news_articles", JSON.stringify(filtered));
}
