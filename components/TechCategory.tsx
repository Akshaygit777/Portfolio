
export function TechCategory({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col transition-all duration-500 rounded-lg gap-1 p-1 text-md font-SpaceGrotesk">
      <p className="text-sm">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-px text-xs font-normal border line-clamp-1 overflow-hidden w-max rounded-lg size-max hover:border-zinc-800/70 dark:hover:border-white/30 transition-all bg-transparent backdrop-blur-xl backdrop-saturate-200"
          >
            <p className="px-2 rounded-md border mx-auto bg-background">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
