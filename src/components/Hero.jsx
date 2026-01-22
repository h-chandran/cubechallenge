import './Hero.css'

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Build Amazing Things with
            <span className="gradient-text"> React</span>
          </h1>
          <p className="hero-description">
            A modern, fast, and scalable template to kickstart your next web project.
            Built with React, Vite, and best practices.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large">Get Started</button>
            <button className="btn btn-secondary btn-large">Learn More</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="card-header">
              <div className="card-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="card-content">
              <div className="code-block">
                <div className="code-line">
                  <span className="code-keyword">import</span>
                  <span className="code-string"> React </span>
                  <span className="code-keyword">from</span>
                  <span className="code-string"> 'react'</span>
                </div>
                <div className="code-line">
                  <span className="code-keyword">function</span>
                  <span className="code-function"> App</span>
                  <span className="code-punctuation">()</span>
                  <span className="code-punctuation"> {'{'}</span>
                </div>
                <div className="code-line indent">
                  <span className="code-keyword">return</span>
                  <span className="code-jsx"> &lt;div&gt;</span>
                </div>
                <div className="code-line indent-2">
                  <span className="code-jsx">Hello World</span>
                </div>
                <div className="code-line indent">
                  <span className="code-jsx"> &lt;/div&gt;</span>
                </div>
                <div className="code-line">
                  <span className="code-punctuation">{'}'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

