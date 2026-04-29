"use client";

import { useState, useEffect, useRef } from "react";
import { Car, Brain, Database, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: Car,
    title: "Enter Vehicle & Trip Details",
    description: "You provide speed, vehicle type, fuel type, cargo weight, age, road type, and distance.",
    color: "from-green-500 to-emerald-500",
    detailedDescription:
      "These inputs describe how your vehicle behaves on the road and form the basis of the emission estimate. Our system captures comprehensive data to ensure accurate predictions.",
  },
  {
    icon: Brain,
    title: "ML Model Prediction",
    description: "Your data is sent to the trained LightGBM model.",
    color: "from-blue-500 to-cyan-500",
    detailedDescription:
      "The model predicts CO₂ emitted per kilometer based on patterns learned from real-world data. Our AI analyzes thousands of data points to provide precise estimates.",
  },
  {
    icon: Database,
    title: "Store Prediction",
    description: "Results are saved in your database backend.",
    color: "from-purple-500 to-pink-500",
    detailedDescription:
      "Each prediction is securely stored so you can access your complete emission history anytime. All data is encrypted and protected.",
  },
  {
    icon: History,
    title: "View History",
    description: "Access past predictions and analyze trends.",
    color: "from-orange-500 to-red-500",
    detailedDescription:
      "Users can analyze trends, compare trips, and understand their carbon footprint over time. Track your progress toward a more sustainable lifestyle.",
  },
];

function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function FadeIn({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, visible] = useFadeIn();

  const transforms = {
    up:    visible ? "translateY(0)"  : "translateY(32px)",
    down:  visible ? "translateY(0)"  : "translateY(-32px)",
    left:  visible ? "translateX(0)"  : "translateX(-32px)",
    right: visible ? "translateX(0)"  : "translateX(32px)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: transforms[direction],
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setHeaderVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 py-8 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-5xl mx-auto relative">

        {/* Header — mount-based */}
        <div
          className="text-center mb-12"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <h1 className="text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
            How It Works
          </h1>
          <p className="text-gray-600">
            Discover the technology behind emission predictions
          </p>
        </div>

        {/* Steps — alternate left/right on scroll */}
        <div className="space-y-12">
          {steps.map((step, idx) => (
            <FadeIn
              key={idx}
              direction={idx % 2 === 0 ? "left" : "right"}
              delay={0}
            >
              <div
                className="relative"
                onClick={() => setActiveStep(activeStep === idx ? null : idx)}
              >
                <div className={`flex items-start gap-8 ${idx % 2 === 0 ? "" : "flex-row-reverse"}`}>
                  {/* Icon Circle */}
                  <div className="flex-shrink-0 relative group cursor-pointer">
                    <div
                      className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl transition-all duration-300 ${
                        activeStep === idx ? "scale-110 rotate-12" : "hover:scale-105 hover:rotate-6"
                      }`}
                    >
                      <step.icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>

                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100">
                      <span className="text-sm font-bold text-gray-700">{idx + 1}</span>
                    </div>

                    {/* Connecting Line */}
                    {idx < steps.length - 1 && (
                      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-gray-300 to-gray-200" />
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 ${idx % 2 === 0 ? "" : "text-right"}`}>
                    <div
                      className={`inline-block w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 border-2 transition-all duration-300 cursor-pointer
                        ${activeStep === idx
                          ? "border-green-400 shadow-2xl shadow-green-200/50 scale-105"
                          : "border-gray-200 hover:border-green-300 hover:shadow-2xl"
                        }`}
                    >
                      <h3 className={`text-xl font-bold text-gray-800 mb-3 ${idx % 2 === 0 ? "text-left" : "text-right"}`}>
                        {step.title}
                      </h3>
                      <p className={`text-gray-600 leading-relaxed ${idx % 2 === 0 ? "text-left" : "text-right"}`}>
                        {step.description}
                      </p>

                      {/* Expandable Details */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          activeStep === idx ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className={`pt-6 border-t-2 border-gray-100 ${idx % 2 === 0 ? "text-left" : "text-right"}`}>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {step.detailedDescription}
                          </p>
                        </div>
                      </div>

                      {/* Click Indicator */}
                      <div className={`mt-4 flex items-center gap-2 text-sm text-gray-400 ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}>
                        <span>{activeStep === idx ? "Click to collapse" : "Click to learn more"}</span>
                        <span className={`transition-transform duration-300 ${activeStep === idx ? "rotate-180" : ""}`}>
                          ↓
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Bottom CTA */}
        <FadeIn direction="up" delay={100}>
          <div className="mt-20 text-center">
            <div className="inline-block bg-white rounded-3xl shadow-xl p-8 border-2 border-green-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to Track Your Carbon Footprint?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl">
                Join thousands of users making data-driven decisions for a sustainable future
              </p>
              <button
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-green-400/50 transition-all duration-300 hover:scale-105"
                onClick={() => navigate("/predict")}
              >
                Start Predicting Now →
              </button>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}