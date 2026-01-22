import './Features.css'

const Features = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Built with Vite for instant hot module replacement and optimized builds.'
    },
    {
      icon: '🎨',
      title: 'Modern UI',
      description: 'Beautiful, responsive design that works seamlessly across all devices.'
    },
    {
      icon: '🔧',
      title: 'Easy to Customize',
      description: 'Clean, well-structured codebase that makes customization a breeze.'
    },
    {
      icon: '📦',
      title: 'Production Ready',
      description: 'Includes all the tools and configurations needed for production deployment.'
    },
    {
      icon: '🚀',
      title: 'Best Practices',
      description: 'Follows React best practices and modern development standards.'
    },
    {
      icon: '💡',
      title: 'Developer Friendly',
      description: 'Comprehensive setup with ESLint and developer-friendly tooling.'
    }
  ]

  return (
    <section id="features" className="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Why Choose This Template?</h2>
          <p className="features-subtitle">
            Everything you need to build modern web applications
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features

