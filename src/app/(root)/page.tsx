import React from 'react'
import { Features } from './components/Features';
import { Programs } from './components/Programs';
import { Stats } from './components/Stats';
import { Footer } from './components/Footer';
import { HomepageSlider } from './components/slider/HomepageSlider';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HomepageSlider />
      <Features />
      <Programs />
      <Stats />
      <Footer />
    </main>
  );
}
