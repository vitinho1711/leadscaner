import React, { useEffect } from 'react';
import './LandingPage.css';

// Componentes da Landing Page
import Hero from './components/Hero';
import FeaturesTicker from './components/FeaturesTicker';
import PainPoints from './components/PainPoints';
import HowItWorks from './components/HowItWorks';
import SoftwareShowcase from './components/SoftwareShowcase';
import Stats from './components/Stats';
import Comparison from './components/Comparison';
import Pricing from './components/Pricing';
import Faq from './components/Faq';
import CtaFinal from './components/CtaFinal';

function LandingPage() {
  useEffect(() => {
    document.title = "Lead Scanner | Prospecção B2B com Inteligência Artificial";
  }, []);

  return (
    <div className="lp-container">
      {/* O background e os gradientes base estão definidos no lp-container no CSS */}
      <Hero />
      <FeaturesTicker />
      <PainPoints />
      <SoftwareShowcase />
      <HowItWorks />
      <Stats />
      <Comparison />
      <Pricing />
      <Faq />
      <CtaFinal />
      
      {/* Footer simples */}
      <footer className="py-8 border-t border-purple-500/20 text-center relative z-10">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Lead Scanner. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
