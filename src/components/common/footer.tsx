
import Link from 'next/link';
import { Landmark, Twitter, Facebook, Linkedin } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: '#' },
    { icon: <Facebook className="h-5 w-5" />, href: '#' },
    { icon: <Linkedin className="h-5 w-5" />, href: 'https://www.linkedin.com/in/vishesh-yadav-51227a283/' },
  ];

  return (
    <footer className="bg-muted text-muted-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" prefetch={false}>
              <Landmark className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-foreground">CivicRoute AI</span>
            </Link>
            <p className="text-sm">
              Revolutionizing public service delivery through smart complaint routing.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/complaint" className="hover:text-primary transition-colors">Submit Complaint</Link></li>
              <li><Link href="/track" className="hover:text-primary transition-colors">Track Complaint</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <Link key={index} href={link.href} className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  {link.icon}
                  <span className="sr-only">Social media</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CivicRoute AI. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
