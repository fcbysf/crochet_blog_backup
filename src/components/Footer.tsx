import { useState, useEffect } from "react";

export const Footer = () => {
  const [year, setYear] = useState<string>("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);
  const footerLinks = {
    Products: [
      "Patterns",
      "Tutorials",
      "Supplies",
      "Magazine",
    ],
    Company: [
      "About Us",
      "Careers",
      "Press",
      "Contact",
    ],
    Resources: [
      "Help Center",
      "Terms of Use",
      "Privacy Policy",
      "Cookies",
    ],
    Social: [
      { label: "Twitter", href: "#" },
      { label: "Pinterest", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-zinc-200/50 my-20 py-20 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-20">
          <div className="col-start-1">
            <span className="text-2xl font-bold tracking-wider text-zinc-900">Crochet ART</span>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-xs leading-relaxed">
              Premium crochet patterns, tutorials, and resources for enthusiasts of all skill levels.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {footerLinks.Products.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {footerLinks.Company.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {footerLinks.Resources.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4">Social</h4>
            <div className="flex space-x-4">
              {footerLinks.Social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-16 border-t border-zinc-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            © {year} Hook & Loop. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};