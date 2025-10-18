import React, { useEffect, useState , useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import Loader from "../Loader";import { Clock, Trophy, CheckCircle, XCircle, Zap, Award, ChevronRight } from 'lucide-react';

const Authentication = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();
  const [showRules, setShowRules] = useState(false);
  
  const port = "http://localhost:5000";

  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    // define hexagons, particles, etc. here..
    let hexagons = [];
  let time = 0;
  const hexSize = 40; // you can tweak this for density
  const hexHeight = Math.sqrt(3) * hexSize;
  
  
  class Hexagon {
    constructor(x, y, col, row) {
      this.x = x;
      this.y = y;
      this.col = col;
      this.row = row;
      this.size = hexSize;
      this.opacity = 0;
      this.pulseSpeed = 0.02 + Math.random() * 0.02;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.glowIntensity = 0;
    }
  
    draw() {
      // Calculate pulse based on distance from center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const distance = Math.sqrt(
        Math.pow(this.x - centerX, 2) +
        Math.pow(this.y - centerY, 2)
      );
  
      // Pulsing effect radiating from center
      const pulse = Math.sin(time * 2 - distance * 0.01 + this.pulseOffset);
      this.opacity = (pulse + 1) * 0.15;
      this.glowIntensity = Math.max(0, pulse * 0.3);
  
      // Draw hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = this.x + this.size * Math.cos(angle);
        const y = this.y + this.size * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
  
      // Fill with gradient
      if (this.glowIntensity > 0) {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 1.5
        );
        gradient.addColorStop(0, `rgba(147, 51, 234, ${this.glowIntensity})`);
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
  
      // Stroke hexagon
      ctx.strokeStyle = `rgba(147, 51, 234, ${this.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
  
      // Draw center dot if glowing
      if (this.glowIntensity > 0.1) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 132, 252, ${this.glowIntensity * 2})`;
        ctx.fill();
      }
    }
  }
  
  function createHexGrid() {
    hexagons.length = 0;
    const cols = Math.ceil(canvas.width / (hexSize * 1.5)) + 2;
    const rows = Math.ceil(canvas.height / hexHeight) + 2;
  
    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const x = col * hexSize * 1.5;
        const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);
        hexagons.push(new Hexagon(x, y, col, row));
      }
    }
  }
  
  createHexGrid();
  
  // Floating particles for extra effect
  const particles = [];
  const particleCount = 40;
  
  class Particle {
    constructor() {
      this.reset();
    }
  
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
  
    update() {
      this.x += this.vx;
      this.y += this.vy;
  
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
  
    draw() {
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 3
      );
      gradient.addColorStop(0, `rgba(192, 132, 252, ${this.opacity})`);
      gradient.addColorStop(1, 'rgba(192, 132, 252, 0)');
  
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  
    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      time += 0.02;
      hexagons.forEach(hex => hex.draw());
      particles.forEach(particle => { particle.update(); particle.draw(); });
      requestAnimationFrame(animate);
    }
  
    animate();
  
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createHexGrid();
    });
  
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createHexGrid();
    };
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  
    // return () => {
    //   window.removeEventListener('resize', () => {});
    // };
  }, []);
  

  const storeUserInfo = async () => {
    try {
      const response = await axios.post(`${port}/Userinfo`, {
        UserEmail: user.email
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error storing user info:', error);
      toast.error('Failed to store user information');
    }
  };

  const HandleStart = () => {
    if (!isAuthenticated) {
      toast.warning("Please Login to Start");
    } else {
      setShowRules(true);
    }
  };

  const handleProceed = () => {
    setShowRules(false);
    navigate("/page-one");
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      storeUserInfo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
    {/* 🔹 Animated background */}
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    ></canvas>

    <div className="flex items-center justify-center min-h-screen px-4 py-12 animate-fade-in">
      <div className="card max-w-2xl w-full text-center animate-scale-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-6">
          Welcome Adventurer!
        </h1>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8">
          "Your journey into the enigmatic world of SignalCipher begins here. Decode, solve, and conquer!"
        </p>
        <button
          className="btn-primary w-full sm:w-auto"
          onClick={HandleStart}
        >
          Start Quiz
        </button>
      </div>

      {/* This is the Rules modal you provided */}
      {showRules && (
        <div className="fixed top-16 bottom-16 inset-x-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface rounded-2xl shadow-xl max-w-2xl w-full max-h-full overflow-y-auto animate-scale-in">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gradient mb-6 text-center">
                Rules
              </h2>
              
              <ul className="space-y-4 text-left text-text-secondary">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                  <span>
                    The competition is open to all registered participants. To participate, kindly complete the registration by filling out the provided{" "}
                    <a href="https://docs.google.com/forms/d/1LUU6kGp05fOAlpSdTG3MMdgD3HdodRTxCVrASvsIe2w/viewform?edit_requested=true" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-primary hover:underline font-medium">
                      Google form
                    </a>.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                  <span>Participants may enter the competition either individually or as part of a team, with team sizes ranging from 1 to 2 members.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                  <span>
                    All flags in the competition must follow the format: <code className="px-2 py-1 bg-surface-hover rounded font-mono text-sm">eesa{'{'}flag{'}'}</code>, (note that flag means answer)
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">4</span>
                  <span>Sharing solutions, flags, or hints with other participants or teams is strictly prohibited.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">5</span>
                  <span>Participants are free to use internet sources or any AI tool during the competition.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">6</span>
                  <span>The competition will run from 13/12/2024 to 3/1/2025. Ensure that all submissions are made within this time frame.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">7</span>
                  <span>Participants are required to solve the questions at the earliest. Teams that submit solutions earlier will receive higher rankings.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">8</span>
                  <span>In case of any queries, participants are encouraged to reach out through EESA's official Instagram page or via Gmail.</span>
                </li>
                <li className="flex items-start space-x-3 text-warning font-medium">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warning/10 text-warning flex items-center justify-center text-sm font-bold mt-0.5">!</span>
                  <span>In case of any issues Please Refresh The Page</span>
                </li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  className="btn-secondary flex-1"
                  onClick={() => setShowRules(false)}
                >
                  Back
                </button>
                <button
                  className="btn-primary flex-1"
                  onClick={handleProceed}
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Authentication;