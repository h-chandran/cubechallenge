import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedCard from '../../components/common/AnimatedCard'
import AnimatedButton from '../../components/common/AnimatedButton'
import './SurveyWizard.css'

const SurveyWizard = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    ageBracket: '',
    gender: '',
    pregnant: false,
    ethnicity: '',
    skinType: '',
    skinConcerns: [],
    effortLevel: '',
    desiredBenefits: []
  })

  const steps = [
    {
      id: 'age',
      title: 'Age Bracket',
      question: 'What is your age range?',
      type: 'select',
      options: ['18-24', '25-34', '35-44', '45-54', '55+', 'Prefer not to say']
    },
    {
      id: 'gender',
      title: 'Gender',
      question: 'What is your gender? (Optional)',
      type: 'select',
      options: ['Female', 'Male', 'Non-binary', 'Prefer not to say'],
      optional: true
    },
    {
      id: 'pregnant',
      title: 'Pregnancy Status',
      question: 'Are you currently pregnant or nursing? (Optional)',
      type: 'select',
      options: ['No', 'Yes', 'Prefer not to say'],
      optional: true,
      warning: 'Some ingredients may not be recommended during pregnancy'
    },
    {
      id: 'ethnicity',
      title: 'Ethnicity',
      question: 'What is your ethnicity? (Optional)',
      type: 'select',
      options: ['Asian', 'Black', 'Hispanic/Latino', 'Middle Eastern', 'White', 'Mixed', 'Other', 'Prefer not to say'],
      optional: true
    },
    {
      id: 'skinType',
      title: 'Skin Type',
      question: 'What is your skin type?',
      type: 'select',
      options: ['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive', 'Not sure']
    },
    {
      id: 'skinConcerns',
      title: 'Skin Concerns',
      question: 'What are your main skin concerns? (Select all that apply)',
      type: 'multiselect',
      options: ['Acne', 'Dryness', 'Oiliness', 'Irritation', 'Redness', 'Fine lines', 'Wrinkles', 'Dark spots', 'Uneven tone', 'Pores', 'Not sure']
    },
    {
      id: 'effortLevel',
      title: 'Effort Level',
      question: 'How many steps are you willing to do in your routine?',
      type: 'select',
      options: ['1-3 steps (minimal)', '3-5 steps (moderate)', '5+ steps (comprehensive)', 'Not sure']
    },
    {
      id: 'desiredBenefits',
      title: 'Desired Benefits',
      question: 'What benefits are you looking for? (Select all that apply)',
      type: 'multiselect',
      options: ['Hydration', 'Anti-aging', 'Acne control', 'Brightening', 'Barrier repair', 'Soothing', 'Oil control', 'Exfoliation']
    }
  ]

  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
    const currentStepData = steps[currentStep]
    
    // Validate required fields
    if (!currentStepData.optional) {
      if (currentStepData.type === 'multiselect') {
        if (formData[currentStepData.id].length === 0) {
          alert('Please select at least one option')
          return
        }
      } else {
        if (!formData[currentStepData.id]) {
          alert('Please select an option')
          return
        }
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSelect = (value) => {
    const currentStepData = steps[currentStep]
    if (currentStepData.type === 'multiselect') {
      const currentValues = formData[currentStepData.id] || []
      if (currentValues.includes(value)) {
        setFormData({
          ...formData,
          [currentStepData.id]: currentValues.filter(v => v !== value)
        })
      } else {
        setFormData({
          ...formData,
          [currentStepData.id]: [...currentValues, value]
        })
      }
    } else {
      setFormData({
        ...formData,
        [currentStepData.id]: value
      })
    }
  }

  const handleSubmit = () => {
    // Save survey data
    localStorage.setItem('survey_data', JSON.stringify(formData))
    navigate('/onboarding/products')
  }

  const currentStepData = steps[currentStep]
  const currentValue = formData[currentStepData.id]

  return (
    <div className="survey-wizard">
      <div className="survey-wizard-container">
        <div className="survey-wizard-progress">
          <div className="survey-wizard-progress-bar">
            <div 
              className="survey-wizard-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="survey-wizard-progress-text">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>

        <AnimatedCard className="survey-wizard-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="survey-wizard-title">{currentStepData.title}</h2>
              <p className="survey-wizard-question">{currentStepData.question}</p>

              {currentStepData.warning && (
                <div className="survey-wizard-warning">
                  ⚠️ {currentStepData.warning}
                </div>
              )}

              <div className="survey-wizard-options">
                {currentStepData.options.map((option) => {
                  const isSelected = currentStepData.type === 'multiselect'
                    ? (currentValue || []).includes(option)
                    : currentValue === option

                  return (
                    <button
                      key={option}
                      type="button"
                      className={`survey-wizard-option ${isSelected ? 'survey-wizard-option--selected' : ''}`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                      {isSelected && <span className="survey-wizard-option-check">✓</span>}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="survey-wizard-actions">
            {currentStep > 0 && (
              <AnimatedButton
                variant="outline"
                onClick={handleBack}
                className="survey-wizard-back"
              >
                Back
              </AnimatedButton>
            )}
            <AnimatedButton
              variant="primary"
              onClick={handleNext}
              className="survey-wizard-next"
            >
              {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
            </AnimatedButton>
          </div>
        </AnimatedCard>
      </div>
    </div>
  )
}

export default SurveyWizard

