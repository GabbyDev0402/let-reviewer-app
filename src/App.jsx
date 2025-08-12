import React, { useState, useEffect } from 'react';
import { BookOpen, RotateCcw, CheckCircle, XCircle, Brain, Target, Trophy } from 'lucide-react';
import './App.css';
import allCards from './cards.json'; // Import the cards from the JSON file

const App = () => {
  const [cards, setCards] = useState([]);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'study', 'complete'
  const [selectedSubject, setSelectedSubject] = useState('');
  const [studyCards, setStudyCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [againCards, setAgainCards] = useState([]);
  const [studyingAgain, setStudyingAgain] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    easy: 0,
    good: 0,
    again: 0
  });

  // Load cards from the imported JSON file when the component mounts
  useEffect(() => {
    setCards(allCards);
  }, []);

  // Get unique subjects and their card counts
  const subjects = cards.reduce((acc, card) => {
    if (!acc[card.subject]) {
      acc[card.subject] = 0;
    }
    acc[card.subject]++;
    return acc;
  }, {});

  const startStudySession = (subject) => {
    const subjectCards = cards.filter(card => card.subject === subject);
    setSelectedSubject(subject);
    setStudyCards(subjectCards);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setAgainCards([]);
    setStudyingAgain(false);
    setSessionStats({
      total: subjectCards.length,
      easy: 0,
      good: 0,
      again: 0
    });
    setCurrentView('study');
  };

  const handleCardResponse = (response) => {
    const currentCard = studyCards[currentCardIndex];
    
    if (response === 'again') {
      if (!againCards.find(card => card.id === currentCard.id)) {
        setAgainCards([...againCards, currentCard]);
      }
      setSessionStats(prev => ({ ...prev, again: prev.again + 1 }));
    } else if (response === 'good') {
      setSessionStats(prev => ({ ...prev, good: prev.good + 1 }));
    } else if (response === 'easy') {
      setSessionStats(prev => ({ ...prev, easy: prev.easy + 1 }));
    }

    // Move to next card
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      // Session complete
      setCurrentView('complete');
    }
  };

  const studyAgainCards = () => {
    if (againCards.length > 0) {
      setStudyCards(againCards);
      setCurrentCardIndex(0);
      setShowAnswer(false);
      setStudyingAgain(true);
      setAgainCards([]);
      setSessionStats(prev => ({
        ...prev,
        total: againCards.length,
        easy: 0,
        good: 0,
        again: 0
      }));
      setCurrentView('study');
    }
  };

  const resetToHome = () => {
    setCurrentView('home');
    setSelectedSubject('');
    setStudyCards([]);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setAgainCards([]);
    setStudyingAgain(false);
  };

  const renderSVG = (svgString) => {
    if (!svgString) return null;
    return <div dangerouslySetInnerHTML={{ __html: svgString }} />;
  };

  if (currentView === 'home') {
    return (
      <div className="app-container">
        <div className="content-wrapper">
          {/* Header */}
          <div className="header">
            <div className="header-title">
              <BookOpen className="header-icon" />
              <h1>LET Reviewer Flashcards</h1>
            </div>
            <p className="header-subtitle">Master your LET exam preparation with interactive flashcards</p>
          </div>

          {/* Subject Cards */}
          <div className="subjects-grid">
            {Object.entries(subjects).map(([subject, count]) => (
              <div
                key={subject}
                className="subject-card"
                onClick={() => startStudySession(subject)}
              >
                <div className="subject-card-content">
                  <div className="subject-card-header">
                    <div className="subject-icon">
                      <Brain />
                    </div>
                    <span className="card-count">
                      {count} cards
                    </span>
                  </div>
                  <h3 className="subject-title">
                    {subject}
                  </h3>
                  <p className="subject-description">
                    Study {count} carefully selected questions for your LET exam
                  </p>
                  <div className="start-button">
                    <span>Start Studying</span>
                    <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="instructions">
            <h2 className="instructions-title">
              <Target className="instructions-icon" />
              How to Use
            </h2>
            <div className="instructions-grid">
              <div className="instruction-item">
                <div className="instruction-number green">1</div>
                <div>
                  <p className="instruction-title">Choose Subject</p>
                  <p className="instruction-desc">Select a subject to start your study session</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-number blue">2</div>
                <div>
                  <p className="instruction-title">Study Cards</p>
                  <p className="instruction-desc">Read questions and reveal answers to test yourself</p>
                </div>
              </div>
              <div className="instruction-item">
                <div className="instruction-number purple">3</div>
                <div>
                  <p className="instruction-title">Rate Difficulty</p>
                  <p className="instruction-desc">Mark cards as Easy, Good, or Again for review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'study') {
    const currentCard = studyCards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / studyCards.length) * 100;

    return (
      <div className="app-container">
        <div className="study-wrapper">
          {/* Header */}
          <div className="study-header">
            <button onClick={resetToHome} className="back-button">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
            <div className="study-info">
              <p className="subject-name">{selectedSubject}</p>
              <p className="card-progress">
                {currentCardIndex + 1} of {studyCards.length}
                {studyingAgain && <span className="review-badge">(Review)</span>}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Flashcard */}
          <div className="flashcard">
            {/* SVG Icon */}
            {currentCard.svg && (
              <div className="card-icon">
                {renderSVG(currentCard.svg)}
              </div>
            )}

            {/* Question */}
            <div className="question-section">
              <h2 className="question-text">{currentCard.question}</h2>
              
              {/* Multiple Choice Options */}
              <div className="choices-container">
                {currentCard.choices?.map((choice, index) => (
                  <div key={index} className="choice-item">
                    <span>{choice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Show Answer Button or Answer */}
            {!showAnswer ? (
              <div className="show-answer-container">
                <button
                  onClick={() => setShowAnswer(true)}
                  className="show-answer-btn"
                >
                  Show Answer
                </button>
              </div>
            ) : (
              <div className="answer-section">
                <div className="correct-answer">
                  <p className="answer-label">Correct Answer:</p>
                  <p className="answer-text">{currentCard.answer}</p>
                </div>

                {/* Response Buttons */}
                <div className="response-buttons">
                  <button
                    onClick={() => handleCardResponse('again')}
                    className="response-btn again"
                  >
                    <XCircle />
                    Again
                  </button>
                  <button
                    onClick={() => handleCardResponse('good')}
                    className="response-btn good"
                  >
                    <RotateCcw />
                    Good
                  </button>
                  <button
                    onClick={() => handleCardResponse('easy')}
                    className="response-btn easy"
                  >
                    <CheckCircle />
                    Easy
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="session-stats">
            <div className="stats-content">
              <div className="stats-left">
                <span className="stat-easy">Easy: {sessionStats.easy}</span>
                <span className="stat-good">Good: {sessionStats.good}</span>
                <span className="stat-again">Again: {sessionStats.again}</span>
              </div>
              <span className="stat-total">Total: {sessionStats.total}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'complete') {
    return (
      <div className="app-container">
        <div className="complete-wrapper">
          <div className="complete-content">
            {/* Success Icon */}
            <div className="success-icon">
              <div className="trophy-container">
                <Trophy />
              </div>
            </div>

            <h1 className="complete-title">
              {studyingAgain ? 'Review Complete!' : 'Study Session Complete!'}
            </h1>
            <p className="complete-subtitle">
              {studyingAgain 
                ? 'Great job reviewing those challenging cards!' 
                : `You've completed all ${sessionStats.total} cards in ${selectedSubject}`}
            </p>

            {/* Session Stats */}
            <div className="final-stats">
              <div className="stat-card easy-stat">
                <div className="stat-number">{sessionStats.easy}</div>
                <div className="stat-label">Easy</div>
              </div>
              <div className="stat-card good-stat">
                <div className="stat-number">{sessionStats.good}</div>
                <div className="stat-label">Good</div>
              </div>
              <div className="stat-card again-stat">
                <div className="stat-number">{sessionStats.again}</div>
                <div className="stat-label">Again</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              {againCards.length > 0 && !studyingAgain && (
                <button
                  onClick={studyAgainCards}
                  className="action-btn review-again"
                >
                  <RotateCcw />
                  Study {againCards.length} Again Cards
                </button>
              )}
              <button
                onClick={() => startStudySession(selectedSubject)}
                className="action-btn restart"
              >
                <RotateCcw />
                Restart Session
              </button>
              <button
                onClick={resetToHome}
                className="action-btn home"
              >
                <BookOpen />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default App;