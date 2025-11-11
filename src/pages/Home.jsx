import React from 'react';
import Navbar from '../components/shared/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import Projects from '../components/Projects.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';

export default function Home(){
  return (
    <div>
      <Navbar/>
      <Hero/>
      <About/>
      <Projects/>
      <Testimonials/>
      <Contact/>
      <Footer smiles={99}/>
    </div>
  );
}
