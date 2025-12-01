export enum Platform {
  LINKEDIN = 'LinkedIn',
  TWITTER = 'Twitter',
  FACEBOOK = 'Facebook'
}

export enum Tone {
  PROFESSIONAL = 'Professional',
  CASUAL = 'Casual',
  VIRAL = 'Viral/Hype',
  EMPATHETIC = 'Empathetic',
  SALES = 'Promotional',
  WITTY = 'Witty'
}

export interface GeneratedPost {
  content: string;
  hashtags: string[];
  imageSuggestion: string;
  estimatedReach: string;
}

export interface PostRequest {
  topic: string;
  platform: Platform;
  tone: Tone;
  audience: string;
}
