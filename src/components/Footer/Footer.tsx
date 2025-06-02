import Image from "next/image";
import Link from "next/link";
import { IconType } from "react-icons";
import {
  FaFacebookF,
  FaInstagram,
  FaQuestion,
  FaTwitter,
} from "react-icons/fa";

// Define the type for a footer link
interface FooterLink {
  label: string;
  href: string;
  icon?: IconType;
}

// Define the type for a footer section
interface FooterSection {
  title: string;
  links: FooterLink[];
}

// Define the props interface for the component
interface FooterProps {
  logoText: string;
  tagline: string;
  socialLinks: FooterLink[];
  appStoreLinks: { src: string; alt: string; href: string }[];
  paymentMethods: { src: string; alt: string }[];
  sections: FooterSection[];
}

const Footer = ({
  logoText,
  tagline,
  socialLinks,
  appStoreLinks,
  paymentMethods,
  sections,
}: FooterProps) => {
  // Map social media labels to their respective react-icons
  const getSocialIcon = (label: string): IconType => {
    const icons = {
      instagram: FaInstagram,
      facebook: FaFacebookF,
      twitter: FaTwitter,
    };
    return icons[label.toLowerCase() as keyof typeof icons] || FaQuestion;
  };

  return (
    <footer className="w-full bg-white py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Logo and Social/App Links Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">
              {logoText}
            </h2>
            <p className="text-gray-600 text-sm">{tagline}</p>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => {
                const Icon = link.icon || getSocialIcon(link.label);
                return (
                  <Link
                    prefetch={false}
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Icon className="w-6 h-6" />
                  </Link>
                );
              })}
            </div>

            {/* App Store Links */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              {appStoreLinks.map((app, index) => (
                <Link
                  prefetch={false}
                  key={index}
                  href={app.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={app.src}
                    alt={app.alt}
                    width={120}
                    height={40}
                    className="object-contain"
                  />
                </Link>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex space-x-2 flex-wrap gap-y-2">
              {paymentMethods.map((method, index) => (
                <Image
                  key={index}
                  src={method.src}
                  alt={method.alt}
                  width={40}
                  height={25}
                  className="object-contain"
                />
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 sm:text-2xl">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
