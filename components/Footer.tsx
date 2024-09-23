import { Box, HStack, Link } from "@chakra-ui/react";
import { FaDiscord, FaEnvelope, FaGithub, FaTwitter } from "react-icons/fa";

const socialLinks = [
  {
    label: "Twitter",
    icon: FaTwitter,
    href: "https://twitter.com/dotcodeschool",
  },
  {
    label: "GitHub",
    icon: FaGithub,
    href: "https://github.com/dotcodeschool",
  },
  {
    label: "Discord",
    icon: FaDiscord,
    href: "https://discord.gg/Z6QBZ886Bq",
  },
  {
    label: "Email",
    icon: FaEnvelope,
    href: "mailto:batman@dotcodeschool.com",
  },
];

/**
 * Footer component that displays social media links.
 *
 * This component renders a footer with centered social media icons.
 * Each icon is a clickable link to the corresponding social media platform.
 *
 * @returns A footer element with social media links
 * @example
 * ```tsx
 * <Footer />
 * ```
 */

// eslint-disable-next-line max-lines-per-function
export const Footer = () => (
  <Box as="footer" mt={20} py={12} textAlign="center">
    <HStack justify="center" spacing={8}>
      {socialLinks.map((link) => (
        <Link href={link.href} isExternal key={link.label}>
          <link.icon size={24} />
        </Link>
      ))}
    </HStack>
  </Box>
);
