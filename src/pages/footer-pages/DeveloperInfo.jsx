import React from "react";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import "../../css/DeveloperInfo.css";

const developers = [
  {
    name: "Nikhil Patel",
    title: "Java Full-Stack Developer",
    bio: "A passionate developer focused on building scalable and efficient web applications. I specialize in the Java-based backend systems, delivering seamless user experiences and robust APIs.",
    image: "https://via.placeholder.com/150",
    contact: {
      linkedin: "https://www.linkedin.com/in/nikhil-patel-528932264/",
      github: "https://github.com/nikhil0441",
      email: "mailto:nikhilpatel03022004@gmail.com",
    },
  },
  {
    name: "Vishwas Gour",
    title: "Java Full-Stack Developer",
    bio: "Dedicated to crafting high-performance web solutions using Java, Spring Boot, and modern frontend frameworks. I enjoy solving complex problems and optimizing systems for scalability and maintainability.",
    image: "https://via.placeholder.com/150",
    contact: {
      linkedin: "https://www.linkedin.com/in/vishwasgour",
      github: "https://github.com/vishwasgour",
      email: "mailto:vishwas@example.com",
    },
  },
];

function DeveloperInfo() {
  return (
    <div className="container mt-5 mb-5 developer-info-page">
      <h1 className="text-center mb-4 developer-heading">
        Meet the Developers
      </h1>

      <div className="developer-row">
        {developers.map((dev, index) => (
          <div key={index} className="card shadow-lg p-4 developer-card">
            <div className="row g-4">
              <div className="col-md-4 text-center border-end">
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="img-fluid rounded-circle mb-3 developer-image"
                />
                <h2 className="developer-name">{dev.name}</h2>
                <p className="text-muted developer-title">{dev.title}</p>
                <div className="d-flex justify-content-center gap-4 mt-3 developer-contact">
                  <a
                    href={dev.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="developer-link"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={28} />
                  </a>
                  <a
                    href={dev.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="developer-link"
                    aria-label="GitHub"
                  >
                    <FaGithub size={28} />
                  </a>
                  <a
                    href={dev.contact.email}
                    className="developer-link"
                    aria-label="Email"
                  >
                    <FaEnvelope size={28} />
                  </a>
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-4">
                  <h3 className="section-heading">About Me</h3>
                  <p className="lead text-dark developer-bio">{dev.bio}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-5">
        <p className="text-muted">
          Thank you for visiting our e-commerce store!
        </p>
      </div>
    </div>
  );
}

export default DeveloperInfo;
