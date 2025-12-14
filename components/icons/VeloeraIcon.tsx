import veloeraLogo from "~/assets/veloera-logo.png"

type VeloeraIconSize = "sm" | "md" | "lg"

const SIZE_MAP: Record<VeloeraIconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
}

interface VeloeraIconProps {
  size?: VeloeraIconSize
}

/**
 * VeloeraIcon renders the Veloera brand mark at a chosen size.
 */
export function VeloeraIcon({ size = "sm" }: VeloeraIconProps) {
  const dimension = SIZE_MAP[size]

  return (
    <img
      src={veloeraLogo}
      alt="Veloera logo"
      width={dimension}
      height={dimension}
      loading="lazy"
      decoding="async"
    />
  )
}
