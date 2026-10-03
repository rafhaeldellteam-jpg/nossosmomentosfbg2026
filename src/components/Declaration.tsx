import { content } from '../config/content';
import { HeartIcon } from './Icons';

export default function Declaration() {
  return (
    <section className="relative rounded-lg bg-panel border border-white/5 p-6 md:p-10">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-spotify flex items-center justify-center shadow-lg">
        <HeartIcon className="w-4.5 h-4.5 text-black" />
      </div>

      <h3 className="font-serif italic text-2xl md:text-3xl text-center text-white mt-2 mb-6">
        {content.declaration.title}
      </h3>

      <div className="max-w-2xl mx-auto space-y-4 text-center">
        {content.declaration.paragraphs.map((paragraph, i) => (
          <p key={i} className="font-serif text-base md:text-lg leading-relaxed text-muted">
            {paragraph}
          </p>
        ))}
        <p className="font-serif italic text-spotify-bright/90 pt-2">{content.declaration.signature}</p>
      </div>
    </section>
  );
}
