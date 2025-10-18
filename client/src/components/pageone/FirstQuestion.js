import React, { useState, useEffect ,useRef} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from 'react-toastify';
import Loader from "../Loader";import { Clock, Trophy, CheckCircle, XCircle, Zap, Award, ChevronRight } from 'lucide-react';

const port = "http://localhost:5000";

function FirstQuestion() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please log in to access the quiz.");
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const fetchQuestions = async (userEmail, Q_Num) => {
    try {
      const response = await fetch(
        `${port}/Fetch_Question?userEmail=${userEmail}&Q_Num=${Q_Num}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setQuestion(data);
    } catch (err) {
      console.error("Error fetching question:", err);
      toast.error("Failed to load question");
    }
  };

  const handleVerify = async () => {
    if (!selectedOption.trim()) {
      toast.warning("Please enter an answer");
      return;
    }

    if (!isAuthenticated || !user?.email) {
      toast.error("User authentication failed. Please log in.");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch(`${port}/validateAnswer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Qno: "1",
          submittedAns: selectedOption,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (data.isCorrect) {
        setIsCorrect(true);
        setIsVerified(true);
        setIsSolved(true);
        toast.success("✅ Correct Answer!");
      } else {
        setIsCorrect(false);
        toast.error("Incorrect answer! Please try again.");
      }
    } catch (err) {
      toast.error("There was an error. Please try again.");
      console.error("Error checking answer:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const LoadUser = async () => {
    if (isAuthenticated && user?.email) {
      try {
        const response = await axios.get(`${port}/getUserInfo`, {
          params: { email: user.email },
        });

        setUserInfo(response.data);
        setIsSolved(response.data.Qns_Solved.includes(1));
      } catch (err) {
        console.error("Error loading user info:", err);
      }
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.email) {
      fetchQuestions(user.email, "1");
      LoadUser();
    }
  }, [isLoading, isAuthenticated, user]);

  const handleNext = async () => {
    await LoadUser();
    if (!userInfo) {
      toast.error("Loading user data...");
      return;
    }

    const solved = userInfo.Qns_Solved.includes(1);
    if (solved) {
      navigate("/page-two");
    } else {
      toast.warning("Please verify your answer first.");
    }
  };

  if (isLoading || !question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader label="Loading question..." />
      </div>
    );
  }

 

}

export default FirstQuestion;