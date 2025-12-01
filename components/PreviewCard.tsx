import React from 'react';
import { Platform, GeneratedPost } from '../types';
import { MessageCircle, Repeat2, Heart, Share2, ThumbsUp, MessageSquare, Share, Send } from 'lucide-react';

interface PreviewCardProps {
  platform: Platform;
  data: GeneratedPost | null;
  isLoading: boolean;
}

const UserHeader = ({ platform, name, handle, time }: { platform: Platform; name: string; handle: string; time: string }) => (
  <div className="flex items-center gap-3 mb-3">
    <img 
      src="https://picsum.photos/48/48" 
      alt="Profile" 
      className={`w-12 h-12 ${platform === Platform.TWITTER ? 'rounded-full' : 'rounded-full'}`} // Twitter is circle, others mostly circle too nowadays
    />
    <div className="flex-1">
      <div className="flex items-center gap-1">
        <span className="font-bold text-gray-900">{name}</span>
        {platform === Platform.LINKEDIN && <span className="text-gray-500 text-xs">• 1st</span>}
        {platform === Platform.TWITTER && <span className="text-gray-500 text-sm">{handle}</span>}
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-1">
        {platform === Platform.LINKEDIN && (
          <span>Product Architect • {time} • <span className="inline-block align-middle text-lg">🌐</span></span>
        )}
        {platform === Platform.FACEBOOK && (
          <span>{time} • <span className="font-bold">🌎</span></span>
        )}
        {platform === Platform.TWITTER && <span>{time}</span>}
      </div>
    </div>
  </div>
);

export const PreviewCard: React.FC<PreviewCardProps> = ({ platform, data, isLoading }) => {
  const renderSkeleton = () => (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded w-full"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      <div className="h-32 bg-slate-200 rounded-lg mt-4"></div>
    </div>
  );

  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  if (!data && !isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
        <div className="text-center">
          <p className="font-medium mb-2">Ready to Create</p>
          <p className="text-sm">Select your options and generate a preview here.</p>
        </div>
      </div>
    );
  }

  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4">
        {isLoading ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-24 h-3 bg-slate-200 rounded animate-pulse"></div>
                <div className="w-16 h-2 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
            {renderSkeleton()}
          </>
        ) : (
          children
        )}
      </div>
      {/* Fake engagement stats/actions */}
      {!isLoading && data && (
        <div className="border-t border-slate-100 bg-slate-50 p-3">
          {platform === Platform.LINKEDIN && (
            <div className="flex justify-between px-4 text-slate-500 text-sm font-medium">
              <button className="flex items-center gap-2 hover:bg-slate-200 px-2 py-1 rounded"><ThumbsUp size={18} /> Like</button>
              <button className="flex items-center gap-2 hover:bg-slate-200 px-2 py-1 rounded"><MessageSquare size={18} /> Comment</button>
              <button className="flex items-center gap-2 hover:bg-slate-200 px-2 py-1 rounded"><Repeat2 size={18} /> Repost</button>
              <button className="flex items-center gap-2 hover:bg-slate-200 px-2 py-1 rounded"><Send size={18} /> Send</button>
            </div>
          )}
          {platform === Platform.TWITTER && (
            <div className="flex justify-between px-4 text-slate-500">
               <button className="hover:text-sky-500"><MessageCircle size={18} /></button>
               <button className="hover:text-green-500"><Repeat2 size={18} /></button>
               <button className="hover:text-pink-500"><Heart size={18} /></button>
               <button className="hover:text-sky-500"><Share2 size={18} /></button>
            </div>
          )}
          {platform === Platform.FACEBOOK && (
             <div className="flex justify-between px-8 text-slate-500 text-sm font-medium">
             <button className="flex items-center gap-2 hover:bg-slate-200 px-4 py-1 rounded"><ThumbsUp size={18} /> Like</button>
             <button className="flex items-center gap-2 hover:bg-slate-200 px-4 py-1 rounded"><MessageSquare size={18} /> Comment</button>
             <button className="flex items-center gap-2 hover:bg-slate-200 px-4 py-1 rounded"><Share size={18} /> Share</button>
           </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Wrapper>
      {/* Header */}
      <UserHeader 
        platform={platform} 
        name="Alex Designer" 
        handle="@alex_creates" 
        time="Just now" 
      />
      
      {/* Content */}
      <div className={`mb-4 text-gray-900 ${platform === Platform.TWITTER ? 'text-base' : 'text-sm'}`}>
        {data && formatContent(data.content)}
        
        {/* Hashtags display */}
        {data && data.hashtags && data.hashtags.length > 0 && (
          <div className="mt-3 text-blue-600 font-medium">
            {data.hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ')}
          </div>
        )}
      </div>

      {/* Image Suggestion Placeholder */}
      <div className="bg-slate-100 rounded-lg h-64 flex items-center justify-center relative overflow-hidden group">
         <img src="https://picsum.photos/600/400" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Generated placeholder" />
         {data && (
           <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <p className="text-xs font-bold uppercase tracking-wider mb-2">AI Image Suggestion</p>
             <p className="text-sm italic">"{data.imageSuggestion}"</p>
           </div>
         )}
      </div>
    </Wrapper>
  );
};
