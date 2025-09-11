import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../homepage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to MedManageX</h1>
        <p>Your comprehensive medical management solution</p>
      </header>

      <section className="homepage-content">
        <div className="image-gallery">
          {/* Publicly available images */}
          <img 
            src="https://images.unsplash.com/photo-1588776814546-df1fed9261e0?auto=format&fit=crop&w=400&q=80" 
            alt="Clinic" 
          />
          <img 
            src="https://images.unsplash.com/photo-1576765607921-f7d6c2457462?auto=format&fit=crop&w=400&q=80" 
            alt="Doctor" 
          />
          <img 
            src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80" 
            alt="Medical Care" 
          />
        </div>

        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/register')}>
            Register
          </button>
        </div>
      </section>

      <footer className="homepage-footer">
        <p>© 2025 MedManageX. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
