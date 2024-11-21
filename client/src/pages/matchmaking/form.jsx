import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

// Questions for the form
const questions = [
  { id: 1, question: "What is your name?", type: "text" },
  { id: 2, question: "What is your age?", type: "number" },
  { id: 3, question: "What is your field of study?", type: "text" }
];

// Predefined study groups (simulated API response)
const studyGroups = [
  { id: 1, name: "React Enthusiasts" },
  { id: 2, name: "Data Science Learners" },
  { id: 3, name: "AI Researchers" }
];

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [submittedGroups, setSubmittedGroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleInputChange = (value) => {
    setFormData(prev => ({
      ...prev,
      [questions[currentStep].question]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulated API submission
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      const result = await response.json();
      
      // Match study groups based on field of study
      const matchedGroups = studyGroups.filter(group => 
        group.name.toLowerCase().includes(formData["What is your field of study?"].toLowerCase())
      );

      setSubmittedGroups(matchedGroups);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form or results
  if (submittedGroups.length > 0) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Recommended Study Groups</h2>
        {submittedGroups.map(group => (
          <motion.div 
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 p-4 rounded-lg mb-4"
          >
            <h3 className="text-lg font-semibold">{group.name}</h3>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="h-1 bg-gray-200 rounded-full">
          <div 
            className="h-1 bg-blue-500 rounded-full" 
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-2">
          Step {currentStep + 1} of {questions.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">
            {questions[currentStep].question}
          </h2>
          <input
            type={questions[currentStep].type}
            value={formData[questions[currentStep].question] || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your response"
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        {currentStep > 0 && (
          <button 
            onClick={handlePrev}
            className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            <ArrowLeft className="mr-2" /> Previous
          </button>
        )}

        {currentStep < questions.length - 1 ? (
          <button 
            onClick={handleNext}
            className="ml-auto flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            disabled={!formData[questions[currentStep].question]}
          >
            Next <ArrowRight className="ml-2" />
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            className="ml-auto flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'} 
            <Check className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;