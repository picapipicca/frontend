import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import './globals.scss';
import Header from './main/_components/Header/Header';
import Footer from './main/_components/Footer/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BoardGo!',
  description: 'LuckyVicky Team project BoardGo!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        <div className="rootContainer">
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </div>
        <Footer />
      </body>
    </html>
  );
}
