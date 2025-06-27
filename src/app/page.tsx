"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  MessageCircle,
  CheckCircle,
  Clock,
  Star,
  Filter,
  Eye,
  Send,
  Home,
} from "lucide-react";

// Mock data (dummy data for demo)
const mockStartups = [
  {
    id: "techflow-id-example",
    name: "TechFlow",
    industry: "SaaS",
    size: "10-50",
    location: "San Francisco",
    description: "AI-powered workflow automation platform",
    positions: ["Frontend Developer", "Data Analyst", "Fullstack Engineer"],
    requirements: "React, Python, 3+ months experience",
    budget: "$800/month",
    logo: "🚀",
  },
  {
    id: "greentech-id-example",
    name: "GreenTech Solutions",
    industry: "CleanTech",
    size: "5-25",
    location: "Austin",
    description: "Sustainable energy management systems",
    positions: ["Mobile Developer", "Marketing Intern", "Operations Analyst"],
    requirements: "Flutter, Digital Marketing, 2+ months",
    budget: "$600/month",
    logo: "🌱",
  },
  {
    id: "financeai-id-example",
    name: "FinanceAI",
    industry: "FinTech",
    size: "20-100",
    location: "New York",
    description: "Automated financial advisory platform",
    positions: ["Backend Developer", "UI/UX Designer", "Financial Analyst"],
    requirements: "Node.js, Figma, 4+ months experience",
    budget: "$1000/month",
    logo: "💰",
  },
];

const mockInterns = [
  {
    id: "sarah-chen-id-example",
    name: "Sarah Chen",
    university: "Stanford University",
    major: "Computer Science",
    year: "Junior",
    skills: ["React", "Python", "SQL", "Machine Learning"],
    experience: "3 months",
    portfolio: "https://github.com/sarahchen",
    gpa: "3.8",
    avatar: "👩‍💻",
  },
  {
    id: "marcus-johnson-id-example",
    name: "Marcus Johnson",
    university: "MIT",
    major: "Business Administration",
    year: "Sophomore",
    skills: ["Marketing", "Analytics", "Social Media", "Content Creation"],
    experience: "2 months",
    portfolio: "https://linkedin.com/in/marcusj",
    gpa: "3.7",
    avatar: "👨‍💼",
  },
  {
    id: "emma-rodriguez-id-example",
    name: "Emma Rodriguez",
    university: "UC Berkeley",
    major: "Design",
    year: "Senior",
    skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
    experience: "6 months",
    portfolio: "https://emmarodriguez.design",
    gpa: "3.9",
    avatar: "🎨",
  },
  {
    id: "david-lee-id-example",
    name: "David Lee",
    university: "Carnegie Mellon",
    major: "Electrical Engineering",
    year: "Junior",
    skills: ["Embedded Systems", "C++", "Robotics"],
    experience: "4 months",
    portfolio: "https://davidlee-robotics.dev",
    gpa: "3.6",
    avatar: "👨‍🔬",
  },
];

const initialApplications = [
  {
    id: 1,
    internId: "sarah-chen-id-example", // Sarah applied
    startupId: "techflow-id-example", // To TechFlow
    position: "Frontend Developer",
    status: "pending",
    appliedDate: "2024-06-20",
    feedback: null,
    message: "I am very excited about this opportunity!",
  },
  {
    id: 2,
    internId: "sarah-chen-id-example",
    startupId: "greentech-id-example",
    position: "Mobile Developer",
    status: "accepted",
    appliedDate: "2024-06-18",
    feedback: "Great portfolio! Looking forward to working with you.",
    message: "I can contribute immediately to your mobile efforts.",
  },
  {
    id: 3,
    internId: "marcus-johnson-id-example", // Marcus applied
    startupId: "financeai-id-example", // To FinanceAI
    position: "Marketing Intern",
    status: "rejected",
    appliedDate: "2024-06-15",
    feedback:
      "Thank you for applying. We're looking for someone with more digital marketing experience.",
    message: "I am passionate about fintech marketing.",
  },
  {
    id: 4,
    internId: "emma-rodriguez-id-example", // Emma received interview request from TechFlow
    startupId: "techflow-id-example",
    position: "UI/UX Designer", // Position they are being considered for
    status: "interview_requested",
    appliedDate: "2024-06-25",
    feedback: null,
    message:
      "TechFlow is interested in interviewing you for a UI/UX Designer role!",
  },
];

export default function InterlinkApp() {
  const [userType, setUserType] = useState("landing"); // 'landing', 'startup', 'intern'
  const [currentUser, setCurrentUser] = useState(null); // Full user object (intern or startup)

  // Application data states
  const [startups, setStartups] = useState(mockStartups);
  const [interns, setInterns] = useState(mockInterns);
  const [applications, setApplications] = useState(initialApplications);

  // Modal states
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedPositionForApplication, setSelectedPositionForApplication] =
    useState("");
  const [applyMessage, setApplyMessage] = useState("");
  const [showRequestInterviewModal, setShowRequestInterviewModal] =
    useState(false);
  const [requestInterviewMessage, setRequestInterviewMessage] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [applicationToUpdate, setApplicationToUpdate] = useState(null);

  // Local message box state (instead of alert/confirm)
  const [messageBox, setMessageBox] = useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });

  // Function to apply for a position (Intern's action)
  const handleApply = () => {
    if (
      !currentUser ||
      currentUser.type !== "intern" ||
      !selectedStartup ||
      !selectedPositionForApplication
    ) {
      setMessageBox({
        show: true,
        title: "Application Error",
        message:
          "Unable to apply. Please ensure you are logged in as an intern and have selected a startup and position.",
        type: "error",
      });
      return;
    }

    // Check if intern already applied to this startup for this position
    const existingApplication = applications.find(
      (app) =>
        app.internId === currentUser.id &&
        app.startupId === selectedStartup.id &&
        app.position === selectedPositionForApplication,
    );

    if (existingApplication) {
      setMessageBox({
        show: true,
        title: "Application Already Sent",
        message: `You have already applied for ${selectedPositionForApplication} at ${selectedStartup.name}.`,
        type: "info",
      });
      setShowApplyModal(false);
      setApplyMessage("");
      return;
    }

    const newApplication = {
      id:
        applications.length > 0
          ? Math.max(...applications.map((app) => app.id)) + 1
          : 1, // Unique ID generation
      internId: currentUser.id,
      startupId: selectedStartup.id,
      position: selectedPositionForApplication,
      status: "pending",
      appliedDate: new Date().toISOString().split("T")[0], //YYYY-MM-DD
      feedback: null,
      message: applyMessage,
    };

    setApplications((prevApps) => [...prevApps, newApplication]);
    setMessageBox({
      show: true,
      title: "Application Submitted",
      message: `Successfully applied for ${selectedPositionForApplication} at ${selectedStartup.name}!`,
      type: "success",
    });
    setShowApplyModal(false);
    setApplyMessage("");
  };

  // Function to request an interview (Startup's action)
  const handleRequestInterview = () => {
    if (!currentUser || currentUser.type !== "startup" || !selectedIntern) {
      setMessageBox({
        show: true,
        title: "Interview Request Error",
        message:
          "Unable to request interview. Please ensure you are logged in as a startup and have selected an intern.",
        type: "error",
      });
      return;
    }

    // Check if an interview request already exists from this startup to this intern
    const existingRequest = applications.find(
      (app) =>
        app.internId === selectedIntern.id &&
        app.startupId === currentUser.id &&
        app.position === "Interview Request",
    );

    if (existingRequest) {
      setMessageBox({
        show: true,
        title: "Request Already Sent",
        message: `${selectedIntern.name} has already been requested for an interview by your startup.`,
        type: "info",
      });
      setShowRequestInterviewModal(false);
      setRequestInterviewMessage("");
      return;
    }

    // Find a relevant position from the intern's skills or a general one
    const suggestedPosition =
      mockStartups.find((s) => s.id === currentUser.id)?.positions[0] ||
      "General Internship";

    const newInterviewRequest = {
      id:
        applications.length > 0
          ? Math.max(...applications.map((app) => app.id)) + 1
          : 1, // Unique ID generation
      internId: selectedIntern.id,
      startupId: currentUser.id,
      position: suggestedPosition, // Position the startup is interested in them for
      status: "interview_requested",
      appliedDate: new Date().toISOString().split("T")[0], //YYYY-MM-DD
      feedback: null,
      message: requestInterviewMessage,
    };

    setApplications((prevApps) => [...prevApps, newInterviewRequest]);
    setMessageBox({
      show: true,
      title: "Interview Request Sent",
      message: `Successfully requested an interview with ${selectedIntern.name}!`,
      type: "success",
    });
    setShowRequestInterviewModal(false);
    setRequestInterviewMessage("");
  };

  // Function to handle application status update (Startup's action)
  const handleUpdateApplicationStatus = (appId, newStatus, feedback = null) => {
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === appId
          ? { ...app, status: newStatus, feedback: feedback || app.feedback }
          : app,
      ),
    );
    setMessageBox({
      show: true,
      title: "Application Status Updated",
      message: `Application ${appId} status set to ${newStatus}.`,
      type: "success",
    });
    setShowFeedbackModal(false);
    setFeedbackText("");
    setApplicationToUpdate(null);
  };

  const MessageBox = ({ show, title, message, type, onClose }) => {
    if (!show) return null;

    const bgColor =
      type === "success"
        ? "bg-green-100"
        : type === "error"
          ? "bg-red-100"
          : type === "warning"
            ? "bg-orange-100"
            : "bg-blue-100";
    const textColor =
      type === "success"
        ? "text-green-800"
        : type === "error"
          ? "text-red-800"
          : type === "warning"
            ? "text-orange-800"
            : "text-blue-800";
    const borderColor =
      type === "success"
        ? "border-green-500"
        : type === "error"
          ? "border-red-500"
          : type === "warning"
            ? "border-orange-500"
            : "border-blue-500";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div
          className={`bg-white rounded-lg shadow-xl p-6 max-w-sm w-full border-t-4 ${borderColor}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-semibold"
            >
              &times;
            </button>
          </div>
          <p className="text-gray-700 mb-6">{message}</p>
          <button
            onClick={onClose}
            className={`w-full py-2 px-4 rounded-lg font-semibold ${
              type === "success"
                ? "bg-green-600 hover:bg-green-700"
                : type === "error"
                  ? "bg-red-600 hover:bg-red-700"
                  : type === "warning"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-blue-600 hover:bg-blue-700"
            } text-white transition-colors`}
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">I</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Interlink</span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setUserType("startup");
                setCurrentUser({ type: "startup", ...mockStartups[0] }); // Set default startup
              }}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              For Startups
            </button>
            <button
              onClick={() => {
                setUserType("intern");
                setCurrentUser({ type: "intern", ...mockInterns[0] }); // Set default intern
              }}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              For Interns
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Connect Talented Interns with
          <span className="text-blue-600"> Growing Startups</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Guaranteed feedback, transparent tracking, and pre-vetted talent.
          Reduce hiring costs by 45% while ensuring every application gets a
          response.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setUserType("startup");
              setCurrentUser({ type: "startup", ...mockStartups[0] });
            }}
            className="px-8 py-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            I'm a Startup
          </button>
          <button
            onClick={() => {
              setUserType("intern");
              setCurrentUser({ type: "intern", ...mockInterns[0] });
            }}
            className="px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors"
          >
            I'm an Intern
          </button>
        </div>

        {/* User Selection for Demo */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Demo User Selection
          </h2>
          <p className="text-gray-600 mb-6">
            Choose a mock user to see their dashboard:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Startups
              </h3>
              <div className="space-y-4">
                {mockStartups.map((startup) => (
                  <button
                    key={startup.id}
                    onClick={() => {
                      setUserType("startup");
                      setCurrentUser({ type: "startup", ...startup });
                    }}
                    className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center space-x-3"
                  >
                    <span className="text-2xl">{startup.logo}</span>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {startup.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {startup.industry}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Interns
              </h3>
              <div className="space-y-4">
                {mockInterns.map((intern) => (
                  <button
                    key={intern.id}
                    onClick={() => {
                      setUserType("intern");
                      setCurrentUser({ type: "intern", ...intern });
                    }}
                    className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center space-x-3"
                  >
                    <span className="text-2xl">{intern.avatar}</span>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {intern.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {intern.university}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Guaranteed Feedback</h3>
            <p className="text-gray-600">
              Every application receives detailed feedback within 48 hours
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Pre-vetted Talent</h3>
            <p className="text-gray-600">
              All candidates are screened and verified before joining
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">67% Faster Hiring</h3>
            <p className="text-gray-600">
              Reduce time-to-hire from 6 weeks to 2 weeks average
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  const StartupDashboard = () => {
    // Filter applications relevant to the current startup
    const myApplications = applications.filter(
      (app) => app.startupId === currentUser?.id,
    );

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setUserType("landing")}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">I</span>
                </div>
                <span className="text-xl font-bold">Interlink</span>
              </button>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Startup Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser && currentUser.type === "startup" && (
                <span className="text-sm text-gray-600">
                  {currentUser.name} {currentUser.logo}
                </span>
              )}
              {/* Using a simplified ID for demo as it's in-memory */}
              <span className="text-sm text-gray-500">
                User ID:{" "}
                {currentUser ? currentUser.id.substring(0, 8) + "..." : "N/A"}
              </span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Available Talent Pool
            </h1>
            <p className="text-gray-600">
              Pre-vetted interns ready to contribute to your startup
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Candidates</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {interns.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Applications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      myApplications.filter(
                        (app) =>
                          app.status === "pending" ||
                          app.status === "interview_requested",
                      ).length
                    }
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Successful Placements</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      myApplications.filter((app) => app.status === "accepted")
                        .length
                    }
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Feedback Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(myApplications.filter((app) => app.feedback).length /
                      myApplications.length) *
                      100 || 0}
                    %
                  </p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Applications Received Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Applications Received
            </h2>
            <div className="space-y-4">
              {myApplications.length > 0 ? (
                myApplications.map((app) => {
                  const intern = interns.find((i) => i.id === app.internId);
                  if (!intern) return null; // Skip if intern not found

                  return (
                    <div key={app.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {intern.name} for {app.position}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {app.status === "interview_requested"
                              ? `Requested: ${app.appliedDate}`
                              : `Applied: ${app.appliedDate}`}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            app.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : app.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : app.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800" // for interview_requested
                          }`}
                        >
                          {app.status
                            .replace(/_/g, " ")
                            .charAt(0)
                            .toUpperCase() +
                            app.status.replace(/_/g, " ").slice(1)}
                        </span>
                      </div>
                      {app.message && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Message:</span>{" "}
                            {app.message}
                          </p>
                        </div>
                      )}
                      {app.feedback && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Your Feedback:</span>{" "}
                            {app.feedback}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons for Startups */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {app.status === "pending" ||
                        app.status === "interview_requested" ? (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateApplicationStatus(
                                  app.id,
                                  "accepted",
                                )
                              }
                              className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateApplicationStatus(
                                  app.id,
                                  "rejected",
                                )
                              }
                              className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => {
                                setApplicationToUpdate(app);
                                setShowFeedbackModal(true);
                              }}
                              className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                            >
                              Add Feedback
                            </button>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500 italic">
                            No further actions for {app.status} application.
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-600 italic">
                  No applications received yet.
                </p>
              )}
            </div>
          </div>

          {/* Intern Cards */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Browse Interns
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interns.map((intern) => (
              <div
                key={intern.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{intern.avatar}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {intern.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {intern.university}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedIntern(intern)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Major:</span> {intern.major}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Year:</span> {intern.year}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Experience:</span>{" "}
                    {intern.experience}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">GPA:</span> {intern.gpa}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Skills:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {intern.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {intern.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{intern.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedIntern(intern);
                    setShowRequestInterviewModal(true);
                  }}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Request Interview
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Intern Detail Modal */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4 z-50 ${selectedIntern ? "flex" : "hidden"}`}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{selectedIntern?.avatar}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedIntern?.name}
                    </h2>
                    <p className="text-gray-600">
                      {selectedIntern?.university} • {selectedIntern?.major}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIntern(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Academic Info
                  </h3>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Year:</span>{" "}
                    {selectedIntern?.year}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-medium">GPA:</span>{" "}
                    {selectedIntern?.gpa}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Experience:</span>{" "}
                    {selectedIntern?.experience}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Portfolio
                  </h3>
                  <a
                    href={selectedIntern?.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm break-all"
                  >
                    {selectedIntern?.portfolio}
                  </a>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIntern?.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowRequestInterviewModal(true);
                    setSelectedIntern(selectedIntern);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Request Interview
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Save for Later
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Request Interview Modal */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4 z-50 ${showRequestInterviewModal && selectedIntern ? "flex" : "hidden"}`}
        >
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              Request Interview with {selectedIntern?.name}
            </h2>
            <div className="mb-4">
              <label
                htmlFor="interviewMessage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message to Intern:
              </label>
              <textarea
                key={`request-message-${selectedIntern?.id}`} // Added key for stable focus
                id="interviewMessage"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                value={requestInterviewMessage}
                onChange={(e) => setRequestInterviewMessage(e.target.value)}
                placeholder={`Hi ${selectedIntern?.name}, we are very impressed with your profile...`}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRequestInterviewModal(false);
                  setRequestInterviewMessage("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestInterview}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>

        {/* Provide Feedback Modal */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4 z-50 ${showFeedbackModal && applicationToUpdate ? "flex" : "hidden"}`}
        >
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              Provide Feedback for{" "}
              {
                interns.find((i) => i.id === applicationToUpdate?.internId)
                  ?.name
              }
            </h2>
            <div className="mb-4">
              <label
                htmlFor="feedbackText"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Feedback Message:
              </label>
              <textarea
                key={`feedback-message-${applicationToUpdate?.id}`} // Added key for stable focus
                id="feedbackText"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Enter feedback for the intern..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedbackText("");
                  setApplicationToUpdate(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleUpdateApplicationStatus(
                    applicationToUpdate?.id,
                    applicationToUpdate?.status,
                    feedbackText,
                  )
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InternDashboard = () => {
    // Filter applications relevant to the current intern
    const myApplications = applications.filter(
      (app) => app.internId === currentUser?.id,
    );

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setUserType("landing")}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">I</span>
                </div>
                <span className="text-xl font-bold">Interlink</span>
              </button>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Intern Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser && currentUser.type === "intern" && (
                <span className="text-sm text-gray-600">
                  {currentUser.name} {currentUser.avatar}
                </span>
              )}
              {/* Using a simplified ID for demo as it's in-memory */}
              <span className="text-sm text-gray-500">
                User ID:{" "}
                {currentUser ? currentUser.id.substring(0, 8) + "..." : "N/A"}
              </span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Available Opportunities
              </h1>
              <p className="text-gray-600">
                Discover exciting internship opportunities at growing startups
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          {/* Application Status Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myApplications.length}
                  </p>
                </div>
                <Send className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      myApplications.filter(
                        (app) =>
                          app.status === "pending" ||
                          app.status === "interview_requested",
                      ).length
                    }
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      myApplications.filter((app) => app.status === "accepted")
                        .length
                    }
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Feedback Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(myApplications.filter((app) => app.feedback).length /
                      myApplications.length) *
                      100 || 0}
                    %
                  </p>
                </div>
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* My Applications Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              My Applications
            </h2>
            <div className="space-y-4">
              {myApplications.length > 0 ? (
                myApplications.map((app) => {
                  const startup = startups.find((s) => s.id === app.startupId);
                  return (
                    <div key={app.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {app.position} at{" "}
                            {startup?.name || "Unknown Startup"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Applied: {app.appliedDate}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            app.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : app.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : app.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800" // For interview_requested
                          }`}
                        >
                          {app.status
                            .replace(/_/g, " ")
                            .charAt(0)
                            .toUpperCase() +
                            app.status.replace(/_/g, " ").slice(1)}
                        </span>
                      </div>
                      {app.feedback && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Feedback:</span>{" "}
                            {app.feedback}
                          </p>
                        </div>
                      )}
                      {app.message &&
                        (app.status === "interview_requested" ||
                          app.status === "pending") && (
                          <div className="mt-3 p-3 bg-blue-50 rounded">
                            <p className="text-sm text-blue-700">
                              <span className="font-medium">Your Message:</span>{" "}
                              {app.message}
                            </p>
                          </div>
                        )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-600 italic">
                  You haven't submitted any applications yet.
                </p>
              )}
            </div>
          </div>

          {/* Available Startups */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Available Opportunities
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.map((startup) => (
                <div
                  key={startup.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{startup.logo}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {startup.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {startup.industry} • {startup.size} employees
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStartup(startup)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {startup.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm">
                      <span className="font-medium">Location:</span>{" "}
                      {startup.location}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Budget:</span>{" "}
                      {startup.budget}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Open Positions:
                    </p>
                    <div className="space-y-1">
                      {startup.positions.map((position, index) => (
                        <span
                          key={index}
                          className="block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {position}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedStartup(startup);
                      setShowApplyModal(true);
                      setSelectedPositionForApplication(startup.positions[0]);
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Startup Detail Modal */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4 z-50 ${selectedStartup ? "flex" : "hidden"}`}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{selectedStartup?.logo}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedStartup?.name}
                    </h2>
                    <p className="text-gray-600">
                      {selectedStartup?.industry} • {selectedStartup?.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStartup(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  About the Company
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedStartup?.description}
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Company Size:</span>{" "}
                      {selectedStartup?.size} employees
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Location:</span>{" "}
                      {selectedStartup?.location}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Budget:</span>{" "}
                      {selectedStartup?.budget}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Open Positions
                </h3>
                <div className="space-y-3">
                  {selectedStartup?.positions.map((position, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {position}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Requirements:</span>{" "}
                        {selectedStartup?.requirements}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedPositionForApplication(position);
                          setShowApplyModal(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        Apply for this position
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4 z-50 ${showApplyModal && selectedStartup ? "flex" : "hidden"}`}
        >
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              Apply for {selectedPositionForApplication} at{" "}
              {selectedStartup?.name}
            </h2>
            <div className="mb-4">
              <label
                htmlFor="applyMessage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Message:
              </label>
              <textarea
                key={`apply-message-${selectedStartup?.id}-${selectedPositionForApplication}`} // Added key for stable focus
                id="applyMessage"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder="Tell us why you're a great fit for this role..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setApplyMessage("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans">
      {userType === "landing" && <LandingPage />}
      {userType === "startup" && currentUser?.type === "startup" && (
        <StartupDashboard />
      )}
      {userType === "intern" && currentUser?.type === "intern" && (
        <InternDashboard />
      )}

      {/* Generic Message Box */}
      <MessageBox
        show={messageBox.show}
        title={messageBox.title}
        message={messageBox.message}
        type={messageBox.type}
        onClose={() => setMessageBox({ ...messageBox, show: false })}
      />
    </div>
  );
}
