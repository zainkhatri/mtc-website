import React from 'react';
import './Home.css';
import mtcLogo from './images/mtc-logo.png';

// Sample Instagram posts data - replace with actual Instagram API integration
const INSTAGRAM_POSTS = [
  {
    image: '/api/placeholder/400/400',
    caption: 'MTC Launch Party',
    link: 'https://instagram.com/mtcucsd'
  },
  {
    image: '/api/placeholder/400/400',
    caption: 'Machine Learning Workshop',
    link: 'https://instagram.com/mtcucsd'
  },
  {
    image: '/api/placeholder/400/400',
    caption: 'Study Jam with MENA & ASA',
    link: 'https://instagram.com/mtcucsd'
  }
];

// Sample projects data
const PROJECTS = [
  {
    title: 'MTC Website',
    description: 'Our organization\'s website built with React',
    image: '/api/placeholder/600/400',
    tech: ['React', 'JavaScript', 'CSS']
  },
  {
    title: 'Machine Learning Workshop Series',
    description: 'Workshop materials and resources for ML fundamentals',
    image: '/api/placeholder/600/400',
    tech: ['Python', 'TensorFlow', 'Jupyter']
  },
  {
    title: 'Community App',
    description: 'Mobile app for connecting Muslim students in tech',
    image: '/api/placeholder/600/400',
    tech: ['React Native', 'Firebase']
  }
];

const InstagramPost = ({ post }) => (
  <a href={post.link} target="_blank" rel="noopener noreferrer" className="instagram-post">
    <img src={post.image} alt={post.caption} />
    <div className="instagram-overlay">
      <p>{post.caption}</p>
    </div>
  </a>
);

const ProjectCard = ({ project }) => (
  <div className="project-card">
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

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <div className="logo-container">
            <img src={mtcLogo} alt="MTC Logo" className="logo" />
          </div>
          <h1>muslim tech collaborative</h1>
          <p>@mtcucsd</p>
        </div>
      </div>

      {/* Instagram Feed Section */}
      <section className="instagram-section">
        <div className="container">
          <h2>Latest Updates</h2>
          <div className="instagram-grid">
            {INSTAGRAM_POSTS.map((post, index) => (
              <InstagramPost key={index} post={post} />
            ))}
          </div>
          <a href="https://instagram.com/mtcucsd" target="_blank" rel="noopener noreferrer" className="follow-button">
            Follow us @mtcucsd
          </a>
        </div>
      </section>

      {/* Projects Section */}
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

      {/* Join Section */}
      <section className="join-section">
        <div className="container">
          <h2>Join MTC</h2>
          <p>Get involved with projects, workshops, internship opportunities, and more!</p>
          <button className="join-button">Join Our Discord</button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>© 2025 Muslim Tech Collaborative at UCSD</p>
          <div className="footer-links">
            <a href="https://instagram.com/mtcucsd">Instagram</a>
            <a href="#">Discord</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;