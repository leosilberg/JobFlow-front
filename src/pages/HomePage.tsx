import React, { useState } from "react";
import videoBg from "../imgs/lampgreenbg.mp4";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaRocket,
  FaPenFancy,
  FaBriefcase,
  FaEnvelope,
  FaPlus,
  FaMinus,
  FaQuestionCircle,
} from "react-icons/fa";
import svg1 from "../imgs/svg1.svg";
import svg2 from "../imgs/svg2.svg";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import people from "../imgs/bgjoin3.jpg";

const HomePage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const cardData = [
    {
      title: "Resume Builder",
      description:
        "Say Goodbye to Dull Resumes, Say Hello to Stunning Designs.",
      icon: <FaFileAlt className="text-orange-700" />,
      bgColor: "bg-orange-100 bg-opacity-50",
    },
    {
      title: "Cover Letter",
      description: "Need a Matching Cover Letter? We Have You Covered 😉",
      icon: <FaPenFancy className="text-orange-700" />,
      bgColor: "bg-orange-100 bg-opacity-50",
    },
    {
      title: "Job Tracker",
      description:
        "Effortlessly Manage and Streamline Your Application Journey.",
      icon: <FaBriefcase className="text-orange-700" />,
      bgColor: "bg-orange-100 bg-opacity-50",
    },
    {
      title: "Personal Website",
      description: "Own a Personal Website with Your Domain in a Snap.",
      icon: <FaRocket className="text-orange-700" />,
      bgColor: "bg-orange-100 bg-opacity-50",
    },
    {
      title: "Email Signature",
      description: "Add a Sleek and Professional Touch to Your Emails.",
      icon: <FaEnvelope className="text-orange-700" />,
      bgColor: "bg-orange-100 bg-opacity-50",
    },
    {
      title: "Interview Prep",
      description: "Get Ready to Ace Your Interviews with Expert Tips.",
      icon: <FaQuestionCircle className="text-orange-700" />,
      bgColor: "bg-orange-100 bg-opacity-50",
    },
  ];

  const faqData = [
    {
      question: "What does JobFlow offer?",
      answer:
        "JobFlow gives you tools to make resumes, cover letters, personal websites, and email signatures. It's made to help job seekers show their best selves.",
    },
    {
      question: "Can I use JobFlow for free?",
      answer:
        "Yes, you can start using JobFlow for free. There are also paid options with more features if you need them.",
    },
    {
      question: "How is JobFlow different from other resume builders?",
      answer:
        "JobFlow has special tools powered by AI, and you have a lot of flexibility to customize the templates to fit what you need.",
    },
    {
      question: "Can I also create cover letters with JobFlow?",
      answer:
        "Yes, you can make cover letters that match your resume using JobFlow.",
    },
    {
      question: "How can I give feedback to JobFlow?",
      answer:
        "You can write your feedback on the JobFlow website in a special section for comments in the footer.",
    },
  ];

  return (
    <div className="relative flex flex-col items-center bg-white">
      {/* Wrapper for video background */}
      <div className="relative w-full">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover z-0"
        >
          <source src={videoBg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Optional Overlay to darken the video */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-10"></div>

        {/* Content that will have the video background */}
        <div className="relative z-20 flex flex-col items-center text-center mt-10">
          <header className="relative w-full">
            <div className="flex text-center lg:px-[9.8em] px-2 justify-start gap-6">
              <img src={svg1} alt="SVG 1" className="w-[130px] text-gray-300" />
              <img src={svg2} alt="SVG 2" className="w-[130px] text-gray-300" />
            </div>

            <h1 className="text-4xl font-bold text-gray-200 lg:mt-[2.5em] mt-8">
              Unleash your Full Potential
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Take Your Career to New Heights with our AI-Boosted All-in-One
              Platform.
            </p>
            <button className="my-[3em] px-[2em] py-4 bg-gradient-to-r mx-auto from-orange-500 to-yellow-500 font-semibold text-white text-[1.5em] rounded-full shadow-md flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-orange-400 hover:to-yellow-500 focus:outline-none">
              <motion.span
                className="mr-2"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                Get Started for Free
              </motion.span>
              <FaArrowRight />
            </button>
          </header>

          <section className="w-full lg:px-[9.8em] px-2 text-center mb-10">
            <h2 className="text-2xl font-semibold py-[0.8em] text-orange-100 ">
              Why Choose{" "}
              <span className="text-orange-800 font-bold tracking-wide">
                JobFlow?
              </span>
            </h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cardData.map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    scale: 1.1,
                    rotate: 3,
                    transition: { duration: 0.15 },
                  }}
                  whileTap={{ scale: 0.95, rotate: -3 }}
                  className={`p-8 ${card.bgColor} rounded-3xl shadow-lg flex flex-col items-center transform transition-transform duration-150 ease-in-out hover:shadow-2xl`}
                >
                  <div className="text-5xl mb-6">{card.icon}</div>
                  <h3 className="font-bold text-2xl text-orange-700">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-gray-700 text-lg">
                    {card.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Content that will not have the video background */}
      <section className="mt-20 w-full lg:px-[9.8em] px-2 ">
        <h2 className="text-primaryBlack text-4xl font-extrabold lg:text-5xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-12">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="cursor-pointer border-t-2 border-solid border-gray-200"
            >
              <div
                className="flex items-center justify-between py-6 text-base font-bold text-primaryBlack hover:opacity-80"
                onClick={() => toggleFAQ(index)}
              >
                <p>{faq.question}</p>
                <div>
                  {activeIndex === index ? (
                    <FaMinus className="w-5 h-5 text-orange-600" />
                  ) : (
                    <FaPlus className="w-5 h-5 text-orange-600" />
                  )}
                </div>
              </div>
              {activeIndex === index && (
                <div className="pb-8 text-base text-gray-700">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div
        className="lg:px-[9.8em] px-2 my-[2em] py-[2em] flex w-full flex-col items-start justify-end bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 20%, rgba(255, 255, 255, 0.7) 40%, rgba(255, 255, 255, 0.4) 60%, rgba(255, 255, 255, 0.1) 80%, rgba(255, 255, 255, 0) 100%), url(${people})`,
        }}
      >
        <h3 className="whitespace-pre leading-none text-gray-800">
          <span className="block text-5xl md:inline-block">Join over </span>
          <span className="block text-6xl text-orange-700 font-bold md:inline-block">
            1.4 million
          </span>
          <span className="block text-5xl md:inline-block"> users</span>
        </h3>
        <p className="mt-10 text-lg leading-[22px] text-gray-600 lg:mt-5 lg:w-[595px]">
          Empower your career growth and success today and join 1.4 million
          users in transforming your professional path with JobFlow.
        </p>
        <Link
          to="/dashboard"
          className="flex items-center gap-3 justify-center bg-gradient-to-tr from-red-200 to-orange-200 h-18 w-max mt-8 lg:mt-13 mb-7 lg:mb-16 rounded-xl py-5 px-5 text-xl font-bold text-black focus-visible:outline-blue-600"
        >
          <MdArrowOutward />
          <span>
            Dive In – No Cost <span className="pl-0.5">🌊</span>
          </span>
        </Link>
      </div>

      <section className="mt-16 w-full max-w-4xl text-center">
        <h2 className="text-primaryBlack text-4xl font-extrabold lg:text-5xl">
          What Our Users Say
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              text: "JobFlow helped me land my dream job in no time!",
              name: "- Jane Doe",
            },
            {
              text: "The templates are modern and easy to use.",
              name: "- John Smith",
            },
            {
              text: "I love the live preview feature!",
              name: "- Sarah Lee",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, translateY: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-8 bg-gray-50 rounded-lg shadow-lg transform transition-transform duration-200 ease-out flex flex-col items-center hover:shadow-xl border border-gray-200"
            >
              <div className="absolute inset-0 w-full h-full bg-gray-200 opacity-0 rounded-lg hover:opacity-10 transition-opacity duration-200"></div>
              <p className="italic text-gray-600 text-lg">{testimonial.text}</p>
              <p className="mt-4 font-bold text-gray-900">{testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="mt-16 w-full max-w-4xl text-center text-gray-200">
        <p>&copy; 2024 All rights reserved.</p>
        <div className="mt-4">
          <Link to="#" className="text-blue-600">
            Privacy Policy
          </Link>
          {" | "}
          <Link to="#" className="text-blue-600">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
