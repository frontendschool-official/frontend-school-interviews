import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaHeart } from "react-icons/fa";
import { useThemeContext } from "../hooks/useTheme";

const Footer = () => {
  const { theme } = useThemeContext();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { href: "/problems", label: "Problems" },
      { href: "/practice", label: "Practice" },
      { href: "/mock-interviews", label: "Mock Interviews" },
      { href: "/interview-simulation", label: "Interview Simulation" },
    ],
    resources: [
      { href: "/api-docs", label: "API Documentation" },
      { href: "/about", label: "About Us" },
      { href: "/premium", label: "Premium Features" },
    ],
    support: [
      { href: "mailto:support@frontendschool.com", label: "Contact Support" },
      { href: "/about", label: "Help Center" },
    ],
  };

  const socialLinks = [
    { href: "https://github.com", icon: FaGithub, label: "GitHub" },
    { href: "https://twitter.com", icon: FaTwitter, label: "Twitter" },
    { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
    { href: "mailto:contact@frontendschool.com", icon: FaEnvelope, label: "Email" },
  ];

  return (
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FS</span>
              </div>
              <span className="text-text font-semibold text-lg">Frontend School</span>
            </div>
            <p className="text-neutral text-sm leading-relaxed mb-4">
              Master frontend development with real-world interview problems, 
              practice sessions, and comprehensive learning resources.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral hover:text-primary transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-text font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-text font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-text font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-neutral hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-neutral text-sm">
              <span>© {currentYear} Frontend School. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <Link
                href="/privacy"
                className="text-neutral hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-neutral hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <p className="text-neutral text-xs flex items-center space-x-1">
              <span>Made with</span>
              <FaHeart className="text-red-500 w-3 h-3" />
              <span>for developers</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 