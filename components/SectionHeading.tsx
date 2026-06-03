import Reveal from "./Reveal";
import SectionSeam from "./SectionSeam";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: Props) {
  const isCenter = align === "center";
  return (
    <Reveal>
      <SectionSeam align={align} />
      <div className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
        <span className="eyebrow">
          <span className="h-px w-6 bg-gold-400" />
          {eyebrow}
        </span>
        <h2 className="heading-serif mt-5 text-3xl leading-tight sm:text-4xl md:text-[2.75rem]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-base leading-relaxed text-cream/65 md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </Reveal>
  );
}
