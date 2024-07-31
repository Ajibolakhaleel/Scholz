import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Countdown from 'react-countdown-now';
import winSound from './../../assets/win.mp3';
import zaamaSound from './../../assets/zaama.mp3';
import mahmaSong from './../../assets/mahma.mp3';
import azabaSong from './../../assets/azaba.mp3';
import wrongSound from './../../assets/wrong-answer.mp3';
import correctSound from './../../assets/coorect1.mp3';
import slideSound from './../../assets/button-click-sound.wav';
import Confetti from 'react-dom-confetti';
import './LandingBar.css';
import PointsDisplay from './PointsDisplay';

const QuizGame = ({ onGameEnd, isMuted }) => {


  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(20);
  const [playSorrySound, setPlaySorrySound] = useState(false);
  const [playCheersSound, setPlayCheersSound] = useState(false);
  const [isGameInProgress, setIsGameInProgress] = useState(true);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [playSlideSound, setPlaySlideSound] = useState(false);
  const [playWinSound, setPlayWinSound] = useState(false);
  const [playZaamaSound, setPlayZaamaSound] = useState(false);
  const [playMahmaSound, setPlayMahmaSound] = useState(false);
  const [playAzabaSound, setPlayAzabaSound] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiConfig, setConfettiConfig] = useState({
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 6000,
    stagger: 3,
    width: '20px',
    height: '20px',
    colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
  });
  const [startCelebration, setStartCelebration] = useState(false);
  const questions = localStorage.getItem('questions') ? JSON.parse(localStorage.getItem('questions')) : [];
  const [count, setCount] = useState(0);


  const winAudio = new Audio(winSound);
  const zaamaAudio = new Audio(zaamaSound);
  const mahmaAudio = new Audio(mahmaSong);
  const azabaAudio = new Audio(azabaSong);
  const wrongAudio = new Audio(wrongSound);
  const correctAudio = new Audio(correctSound);
  const slideAudio = new Audio(slideSound);

  const sounds = [() => setPlaySorrySound(true), () => setPlayZaamaSound(true), () => setPlayAzabaSound(true)];

  useEffect(() => {
    if (playSlideSound && !isMuted) {
      slideAudio.play();
      setTimeout(() => {
        setPlaySlideSound(false);
      }, 1000);
    }
  }, [playSlideSound]);

  
  useEffect(() => {
    // Play win sound when start celebration
    if (startCelebration && playWinSound && !isMuted) {
      winAudio.play();
    }
  }, [startCelebration, playWinSound]);

  useEffect(() => {
    // Play mahma sound
    if (playMahmaSound && !isMuted) {
      mahmaAudio.play();
      setTimeout(() => {
        setPlayMahmaSound(false);
      }, 15000);
    }
  }, [playMahmaSound]);

  useEffect(() => {
    // Play other sounds based on conditions
    if (playCheersSound && !isMuted) {
      correctAudio.play();
      setTimeout(() => {
        setPlayCheersSound(false);
      }, 6000);
    } else if (playSorrySound && !isMuted) {
      wrongAudio.play();
      setTimeout(() => {
        setPlaySorrySound(false);
      }, 3000);
      // Add code to play the sorry sound
    } else if (playAzabaSound && !isMuted) {
      // Add code to play the azaba sound
      azabaAudio.play();
      setTimeout(() => {
        setPlayAzabaSound(false);
      }, 3000);
    } else if (playZaamaSound && !isMuted) {
      // Add code to play the zaama sound
      zaamaAudio.play();
      setTimeout(() => {
        setPlayZaamaSound(false);
      }, 3000);
    }
  }, [playCheersSound, playSorrySound, playAzabaSound, playZaamaSound]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime((prevTime) => prevTime - 1);
      } else {
        moveToNextQuestion();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  useEffect(() => {
    if (!isGameInProgress) {
      const storedScore = localStorage.getItem('quizScore');
      localStorage.setItem('quizScore', storedScore + score );
      setConfettiConfig({
        ...confettiConfig,
        colors: ['#00ff00'],
      });
      if (score > 60) {
        setPlayWinSound(true);
        setStartCelebration(true);
      } else if (score >= 40 && score <= 60) {
        setPlayMahmaSound(true);
        setTimeout(() => {
          setPlayMahmaSound(false);
        }, 15000);
      } else {
        setPlayMahmaSound(true);
        setTimeout(() => {
          setPlayMahmaSound(false);
        }, 15000);
      }
    }
  }, [isGameInProgress, score]);

  useEffect(() => {
    if (startCelebration && !isMuted) {
      setShowConfetti(true);
      setPlayCheersSound(true);
    } else if (startCelebration && isMuted) {
      setShowConfetti(true);
    }
  }, [startCelebration]);

  const handleAnswer = (selectedOption, isCorrect) => {
    if (!selectedAnswer) {
      if (isCorrect) {
        setScore((prevScore) => prevScore + remainingTime);
        setPlayCheersSound(true);
        toast.success('Correct Answer! 🎉', { autoClose: 2000 });
      } else {
        const randomSound = sounds[count % sounds.length];
        randomSound();
        setCount((prevCount) => prevCount + 1);
        toast.error('Wrong Answer! 😞', { autoClose: 3000 });
      }
  
      setTimeout(() => {
        setSelectedAnswer(null);
        setPlayCheersSound(false);
        setPlaySorrySound(false);
        setPlayAzabaSound(false);
        setPlayZaamaSound(false);
        moveToNextQuestion();
      }, 6000);
  
      setSelectedAnswer(selectedOption);
    }
  };
  

  const moveToNextQuestion = () => {
    if (currentQuestionIndex + 1 === 5) {
      setIsGameInProgress(false);
    } else {
      if (selectedAnswer === null) {
        setPlaySlideSound(true);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setRemainingTime(20);
        setTimeout(() => {
          
          setPlaySlideSound(false);
        }, 5000);
      }
    }
  };
  

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const confirmExitGame = (confirmed) => {
    if (confirmed) {
      endGame();
    } else {
      closeConfirmationModal();
    }
  };

  const play = () => {
    setCurrentQuestionIndex(0);
    setIsGameInProgress(true);
    setPlayWinSound(false);
    setPlayMahmaSound(false);
    setPlayAzabaSound(false);
    setPlayZaamaSound(false);
    setPlayCheersSound(false);
    setPlaySorrySound(false);
    // Reset other state variables
  
  };
  
  const endGame = () => {
    localStorage.removeItem('questions');
    localStorage.setItem('isPlay', 'false');
    onGameEnd(score);
    // Reset other state variables
    window.location.reload();

   
  };
  const renderer = ({ seconds }) => (
    <div className="timer text-xl">Remaining time: {seconds}s</div>
  );

  return (
    <div className="pt-32  bg-opacity-70 p-2 relative quizz">
      <ToastContainer />
      <div className="absolute top-1 left-1 mb-10">
        <PointsDisplay points={score} />
      </div>

      {questions.length > 0 && currentQuestionIndex < questions.length && isGameInProgress && (
        <div className={`border rounded-lg question p-2 mt-20 bg-red-200 bg-opacity-10 ${selectedAnswer !== null ? 'slide-out' : 'slide-in'}`}>
          <h2 className="text-2xl text-white font-bold mb-5 quest">{questions[currentQuestionIndex].question}</h2>
          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestionIndex].answers &&
              Object.entries(questions[currentQuestionIndex].answers).map(([option, isCorrect]) => (
                <button
                  key={option}
                  className={`p-3 rounded ${
                    selectedAnswer === option
                      ? isCorrect
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'bg-blue-500 text-white'
                  } transition-colors duration-500 ease-in-out answer`}
                  onClick={() => handleAnswer(option, isCorrect)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              ))}
          </div>
          <div className="mt-4 text-red-900">
            <Countdown date={Date.now() + remainingTime * 1000} renderer={renderer} onComplete={moveToNextQuestion} />
          </div>
          <button className="mt-4 p-2 bg-yellow-500 text-white rounded" onClick={openConfirmationModal}>
            To end
          </button>
        </div>
      )}

      {!isGameInProgress && (
        <div className={`slide-in`}>
          <Confetti active={showConfetti} config={confettiConfig} />
          <h2 className="text-2xl font-bold mb-4">Quiz completed !</h2>
          <p className="text-xl">Your Score: {score}</p>
          <button className="mt-4 p-3 bg-yellow-500 text-white rounded" onClick={endGame}>
          To end
          </button>
          <button className="mt-4 p-3 bg-green-500 text-white rounded ml-4" onClick={play}>
          Replay
          </button>
          <div className="mt-4">
            <p className="text-xl">We hope you enjoyed the game !</p>
            <p className="text-xl">Please share your feedback with us.</p>        
            <p className="text-xl">We would love to hear from you!</p>

            <div className="flex justify-center mt-4">
              <a href="https://80r1ekn4sl4.typeform.com/to/PIrCscKl" target="_blank" rel="noopener noreferrer">
                <button className="p-3 bg-blue-500 text-white rounded">Feedback Form</button>
              </a>
            </div>
          </div>
        </div>
      )}

      {isConfirmationModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-xl mb-4 text-black">Are you sure you want to quit the game?</p>
            <div className="flex justify-end">
              <button className="p-2 bg-red-500 text-white rounded mr-2" onClick={() => confirmExitGame(true)}>
                Yes
              </button>
              <button className="p-2 bg-green-500 text-white rounded" onClick={() => confirmExitGame(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGame;
