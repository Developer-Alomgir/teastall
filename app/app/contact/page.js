"use client";
import Link from 'next/link';
import '../../styles/globals.css';

export default function Page() {
  return (
    <main style={ minHeight: '100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#050510' }>
      <div style={ color: '#fff', textAlign:'center' }>
        <h1 style={ marginBottom: 8 }>Contact page</h1>
        <p style={ opacity: 0.8 }>This is a placeholder contact page. Replace content as needed.</p>
        <p style={ marginTop: 12 }>
          <Link href='/' style={ color:'#00ffa3' }>Back to Home</Link>
        </p>
      </div>
    </main>
  );
}
