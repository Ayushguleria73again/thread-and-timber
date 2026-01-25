"use client";

type SectionHeadingProps = {
  label: string;
  title: string;
  subtitle: string;
};

export default function SectionHeading({
  label,
  title,
  subtitle
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs uppercase tracking-[0.3em] text-moss">
        {label}
      </span>
      <h2 className="text-3xl font-serif italic font-medium text-black sm:text-4xl">{title}</h2>
      <p className="max-w-2xl text-base text-black/70 sm:text-lg">{subtitle}</p>
    </div>
  );
}

