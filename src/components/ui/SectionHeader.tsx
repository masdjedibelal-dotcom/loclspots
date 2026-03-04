import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  href: string;
  linkText?: string;
  titleClassName?: string;
  className?: string;
}

export function SectionHeader({
  title,
  href,
  linkText = "Alle anzeigen →",
  titleClassName,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex items-center justify-between", className)}>
      <h2 className={cn("text-lg font-semibold", titleClassName)}>{title}</h2>
      <Link href={href} className="text-sm font-medium text-forest">
        {linkText}
      </Link>
    </div>
  );
}
