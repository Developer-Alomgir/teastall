export const metadata = {
  title: 'Coffee Mama',
  description: '3D Coffee Shop Scene — Coffee Mama'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <footer style={{
          position: 'fixed', bottom: 8, right: 12, color: 'rgba(255,255,255,0.6)',
          fontSize: 12, zIndex: 9999, pointerEvents: 'none'
        }}>
          Developed by Alomgir Hossen
        </footer>
      </body>
    </html>
  );
}
