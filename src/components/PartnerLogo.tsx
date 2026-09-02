import Image from "next/image";

export type Partner = {
  readonly id: string;
  readonly name: string;
  readonly label: string;
  readonly logo: string;
  readonly logoDark?: string;
  readonly width: number;
  readonly height: number;
  readonly url?: string;
};

type PartnerLogoProps = {
  partner: Partner;
  /** Light logos for dark sections; dark logos for light sections. */
  variant?: "onDark" | "onLight";
  className?: string;
};

export function PartnerLogo({
  partner,
  variant = "onDark",
  className = "",
}: PartnerLogoProps) {
  const src =
    variant === "onLight" && partner.logoDark ? partner.logoDark : partner.logo;

  const img = (
    <Image
      src={src}
      alt={partner.name}
      width={partner.width}
      height={partner.height}
      className={`otevru-partner-logo ${className}`.trim()}
    />
  );

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex"
      >
        {img}
      </a>
    );
  }

  return img;
}

type PartnerStripProps = {
  partners?: readonly Partner[];
  variant?: "onDark" | "onLight";
  className?: string;
};

/** Partner logos + labels — driven by site config. */
export function PartnerStrip({
  partners,
  variant = "onDark",
  className = "",
}: PartnerStripProps) {
  if (!partners?.length) return null;

  return (
    <ul className={`otevru-partner-strip ${className}`.trim()}>
      {partners.map((partner) => (
        <li key={partner.id} className="otevru-partner-strip-item">
          <PartnerLogo partner={partner} variant={variant} />
          <p className="otevru-partner-strip-label">{partner.label}</p>
        </li>
      ))}
    </ul>
  );
}
