import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Casting = () => {
  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <Header />
      <div style={{ paddingTop: '100px', paddingLeft: '5%', paddingRight: '5%' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#e50914' }}>Casting</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Direct Industry Access.
          <br/>
          Private sessions with filmmakers, actors & mentors.
        </p>
        <div style={{ padding: '2rem', backgroundColor: '#1f1f1f', borderRadius: '8px' }}>
             <h2>Open Casting Calls</h2>
             <p>No open calls at the moment. Check back soon for exclusive founder opportunities.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Casting;
