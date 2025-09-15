import React, { useState } from 'react';
import '../../css/faq.css';
import { faqs } from '../../data/homeData';
import banner from "../../assets/images/banner.jpg";

function FAQ() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
    setActiveQuestion(null); // close any open question when changing category
  };

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <>
        <div className="banner" style={{ backgroundImage: `url(${banner})` }}>
          <div className="banner-overlay"></div>
          <div className="banner-text">
            <h1>Frequently Asked Questions</h1>
            <p>Find answers to common queries about our Chanderi sarees, orders, and services</p>
          </div>
        </div>
      <div className="faq-page">

        <h1>Frequently Asked Questions</h1>
        <div className="faq-container">
          {Object.entries(faqs).map(([category, questions], catIndex) => (
            <div key={catIndex} className="faq-category">
              <div
                className="faq-category-title"
                onClick={() => toggleCategory(category)}
              >
                {category}
                <span className="faq-icon">{activeCategory === category ? '-' : '+'}</span>
              </div>

              {activeCategory === category &&
                questions.map((faq, qIndex) => (
                  <div key={qIndex} className="faq-item">
                    <div
                      className="faq-question"
                      onClick={() => toggleQuestion(qIndex)}
                    >
                      {faq.question}
                      <span className="faq-icon">{activeQuestion === qIndex ? '-' : '+'}</span>
                    </div>
                    {activeQuestion === qIndex && (
                      <div className={`faq-answer ${activeQuestion === qIndex ? 'open' : ''}`}>
                        {faq.answer}
                      </div>

                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FAQ;
