import React from 'react'
import { Features } from './components/Features';
import { Programs } from './components/Programs';
import { Stats } from './components/Stats';
import { HomepageSlider } from './components/slider/HomepageSlider';
import CampusHighlights from './components/CampusHighlights';
import CalenderView from './components/CalenderView';
import { Footer } from './components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HomepageSlider />
      <Features />
      <Programs />
      <CalenderView />
      <CampusHighlights />
      <Stats />
      <Footer />
    </main>
  );
}
