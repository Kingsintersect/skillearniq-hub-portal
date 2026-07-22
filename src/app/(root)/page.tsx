import React from 'react';
import { Hero } from './components/Hero';
import { ExamStrip } from './components/ExamStrip';
import { Stats } from './components/Stats';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Gamification } from './components/Gamification';
import { Parents } from './components/Parents';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen font-outfit">
      <Hero />
      <ExamStrip />
      <Stats />
      <Features />
      <HowItWorks />
      <Gamification />
      <Parents />
      <Testimonials />
      <Footer />
    </main>
  );
}
