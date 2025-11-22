export const metadata = {
  title: 'কফি মামা — Coffee Mama',
  description: 'Coffee Mama — Winter 3D Coffee Shop'
}

import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className="bg-[#071028] text-white min-h-screen">
        <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between">
          <nav className="flex items-center gap-4">
            <a href="/" className="text-2xl font-extrabold text-[#00ffa3]">কফি মামা</a>
            <a href="/portfolio" className="text-sm text-white/80 hover:text-white">Portfolio</a>
            <a href="/projects" className="text-sm text-white/80 hover:text-white">Projects</a>
            <a href="/info" className="text-sm text-white/80 hover:text-white">Info</a>
            <a href="/contact" className="text-sm text-white/80 hover:text-white">Contact</a>
          </nav>
          <div className="text-sm text-white/60">Developed by Alomgir Hossen</div>
        </header>
        <main className="pt-20">{children}</main>
        <footer className="fixed bottom-4 left-4 right-4 text-center text-white/40 text-sm z-40">
          © {new Date().getFullYear()} কফি মামা — All rights reserved
        </footer>
      </body>
    </html>
  )
}
