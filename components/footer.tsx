import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">
              Africa On Go
            </h3>
            <p className="text-sm opacity-90">
              Understanding our complicated African world, so that we can all help shape it.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/news" className="hover:underline">News</Link></li>
              <li><Link href="/category/business" className="hover:underline">Business</Link></li>
              <li><Link href="/category/technology" className="hover:underline">Technology</Link></li>
              <li><Link href="/category/sports" className="hover:underline">Sports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">More</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/entertainment" className="hover:underline">Entertainment</Link></li>
              <li><Link href="/category/agriculture" className="hover:underline">Agriculture</Link></li>
              <li><Link href="/category/human-interest" className="hover:underline">Human Interest</Link></li>
              <li><Link href="https://www.africaongo.com" target="_blank" className="hover:underline">Main Site</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="text-sm text-center opacity-90">
            © {currentYear} Africa On Go Media. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
