"use client";

type SectionHeadingProps = {
  label: string;
  title: string;
  subtitle: string;
  center?: boolean;
};

export default function SectionHeading({
  label,
  title,
  subtitle,
  center = false
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-3 ${center ? 'items-center text-center' : ''}`}>
      <span className="text-xs uppercase tracking-[0.3em] text-moss">
        {label}
      </span>
      <h2 className="text-3xl font-serif italic font-medium text-black sm:text-4xl">{title}</h2>
      <p className={`max-w-2xl text-base text-black/70 sm:text-lg ${center ? 'mx-auto' : ''}`}>{subtitle}</p>
    </div>
  );
}

