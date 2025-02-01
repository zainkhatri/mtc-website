// Home.jsx
import React from 'react';
import './Home.css';
import mtcLogo from './images/mtc-logo.png';
import image1 from './images/image1.jpg';
import image2 from './images/image2.JPG';
import image3 from './images/image3.JPG';

// Projects data remains the same
const PROJECTS = [
  {
    title: 'Workshop Series',
    description: 'Comprehensive workshop materials and hands-on projects covering machine learning, web development, and software engineering fundamentals. Access our extensive collection of resources including code samples, tutorials, and interactive learning materials.',
    image: image1,
    tech: ['Python', 'TensorFlow', 'React', 'Node.js'],
    link: 'https://drive.google.com/drive/u/1/folders/1CNWkzl_znJvKjW31b6ubw_RxEbAvh7rF'
  },
  {
    title: 'Islamic GenAI Guild',
    description: 'Pioneering project evaluating AI models on Islamic knowledge, creating comprehensive datasets for Fiqh and Aqeedah, and developing standardized grading systems. Features automated testing frameworks and detailed performance analytics.',
    image: image2,
    tech: ['Python', 'LangChain', 'Evaluation Framework', 'Dataset Creation'],
    link: 'https://halalai.org/'
  },
  {
    title: 'MTC Website',
    description: 'Modern, responsive website featuring a dynamic hero section and community engagement tools. Built with custom dark theme, Space Grotesk typography, and smooth animations. Includes Discord integration and mobile-first design.',
    image: image3,
    tech: ['React', 'Space Grotesk', 'CSS Grid', 'Discord Integration'],
    link: 'https://github.com/zainkhatri/mtc-website'
  }
];

// ProjectCard Component remains the same
const ProjectCard = ({ project }) => {
  const handleClick = () => {
    if (project.link) {
      window.open(project.link, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <div className="project-card" onClick={handleClick} style={{ cursor: project.link ? 'pointer' : 'default' }}>
      <div className="project-image">
        <img src={project.image} alt={project.title} />
      </div>
      <div className="project-content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-tech">
          {project.tech.map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Hero Section remains the same
const Hero = () => (
  <div className="hero">
    <div className="hero-content">
      <div className="logo-container">
        <img src={mtcLogo} alt="MTC Logo" className="logo" />
      </div>
      <h1>muslim tech collaborative</h1>
      <p>@mtcucsd</p>
    </div>
  </div>
);

// Updated JoinSection with correct Discord link
const JoinSection = () => {
  const handleJoinClick = () => {
    window.open('https://discord.gg/CJYPHGb8nS', '_blank', 'noopener noreferrer');
  };

  return (
    <section className="join-section">
      <div className="container">
        <h2>Join MTC</h2>
        <p>Get involved with projects, workshops, internship opportunities, and more!</p>
        <button className="join-button" onClick={handleJoinClick}>
          Join Our Discord
        </button>
      </div>
    </section>
  );
};

// Updated Footer with correct social links
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/mtcucsd' },
    { name: 'Discord', url: 'https://discord.gg/CJYPHGb8nS' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/mtcucsd/' }
  ];

  return (
    <footer>
      <div className="container">
        <p>© {currentYear} Muslim Tech Collaborative at UCSD</p>
        <div className="footer-links">
          {socialLinks.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

// Main Home Component remains the same
function Home() {
  return (
    <div className="home">
      <Hero />
      <section className="projects-section">
        <div className="container">
          <h2>Our Projects</h2>
          <div className="projects-grid">
            {PROJECTS.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      </section>
      <JoinSection />
      <Footer />
    </div>
  );
}

export default Home;