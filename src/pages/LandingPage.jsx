// pages/LandingPage.js
import React from 'react';
import Header from '../Components/Header/Header';
import Home from '../Components/Home/Home';
import About from '../Components/About/About';
import Features from '../Components/Features/Features';
import Timeline from '../Components/Timeline/Timeline';

const LandingPage = () => {
  return (
    <>
      <Header />
      <section id="home">
        <Home />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="timeline">
        <Timeline />
      </section>
    </>
  );
};

export default LandingPage;

