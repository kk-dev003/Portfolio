import React from 'react';
import Navbar from '../components/shared/Navbar.jsx';
import LiveDemos from '../components/LiveDemos.jsx';
import Footer from '../components/Footer.jsx';

export default function Live(){
  return (
    <div>
      <Navbar/>
      <LiveDemos/>
      <Footer smiles={42}/>
    </div>
  );
}
