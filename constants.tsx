import React from 'react';
import { 
  Linkedin, 
  Twitter, 
  Facebook, 
  Briefcase, 
  Coffee, 
  Zap, 
  Heart, 
  ShoppingBag, 
  Smile 
} from 'lucide-react';
import { Platform, Tone } from './types';

export const PLATFORM_CONFIG = {
  [Platform.LINKEDIN]: {
    icon: <Linkedin className="w-5 h-5" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    maxLength: 3000,
    placeholder: "Share professional insights, industry news, or company updates..."
  },
  [Platform.TWITTER]: {
    icon: <Twitter className="w-5 h-5" />,
    color: 'text-sky-500',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    maxLength: 280,
    placeholder: "What's happening? Share a quick thought or thread..."
  },
  [Platform.FACEBOOK]: {
    icon: <Facebook className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    maxLength: 63206, 
    placeholder: "What's on your mind? Share with your community..."
  }
};

export const TONE_CONFIG = {
  [Tone.PROFESSIONAL]: { icon: <Briefcase className="w-4 h-4" />, description: "Authoritative, clear, and respectful." },
  [Tone.CASUAL]: { icon: <Coffee className="w-4 h-4" />, description: "Friendly, relaxed, and conversational." },
  [Tone.VIRAL]: { icon: <Zap className="w-4 h-4" />, description: "Punchy, exciting, and designed for shares." },
  [Tone.EMPATHETIC]: { icon: <Heart className="w-4 h-4" />, description: "Understanding, supportive, and emotional." },
  [Tone.SALES]: { icon: <ShoppingBag className="w-4 h-4" />, description: "Persuasive, action-oriented, and direct." },
  [Tone.WITTY]: { icon: <Smile className="w-4 h-4" />, description: "Clever, humorous, and entertaining." },
};
