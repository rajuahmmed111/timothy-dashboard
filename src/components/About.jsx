import React, { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* About Section */}
      <section className="text-center mb-10">
        <h1
          data-aos="zoom-in"
          className="text-4xl my-6 mt-20 md:mt-6 ralewayfont font-bold"
        >
          About <span className="text-[#309255]">Us</span>
        </h1>
        <p className="text-lg text-darkGray mb-6">
          Welcome to{" "}
          <span className="font-semibold text-brandGreen">Lingo Bingo</span>,
          your go-to platform for mastering new vocabularies and enhancing your
          language skills! 🧠📚
        </p>
        <p className="text-lg text-darkGray mb-6">
          At <span className="font-semibold text-brandGreen">Lingo Bingo</span>,
          our mission is simple:{" "}
          <strong className="text-brandGreen">
            to make language learning fun, accessible, and effective for
            everyone. 🌍💬
          </strong>{" "}
          Whether you're just starting your language journey or looking to
          improve your vocabulary, our platform offers a variety of tools and
          resources that make learning both engaging and rewarding. 🎉
        </p>
      </section>

      {/* How We Help Section */}
      <section className="bg-[#EEFBF3] border border-green-300 p-8 rounded-lg shadow-md">
        {/* Animated Title */}
        <h3 className="text-3xl font-bold mb-4 text-center bounce-animation">
          How We Help You{" "}
          <span className="text-[#309255]">Learn Vocabulary</span> 📖✨
        </h3>

        {/* Animated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            data-aos="fade-up"
          >
            <h4 className="font-semibold text-xl text-[#309255]">
              📝 Curated Vocabulary Lists
            </h4>
            <p className="text-brandGray">
              Our platform offers a wide array of carefully curated vocabulary
              sets across different themes, making learning relevant to your
              needs and interests.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            data-aos="fade-up"
          >
            <h4 className="font-semibold text-xl text-[#309255]">
              📚 Interactive Quizzes
            </h4>
            <p className="text-brandGray">
              Practice makes perfect! With our quizzes and flashcards, you can
              reinforce your vocabulary skills and track your progress.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            data-aos="fade-down"
          >
            <h4 className="font-semibold text-xl text-[#309255]">
              🎯 Personalized Learning Paths
            </h4>
            <p className="text-brandGray">
              Based on your level, we suggest a personalized learning path that
              evolves as you progress. Whether you're a beginner or advanced
              learner, we ensure that every lesson is tailored to your needs.
            </p>
          </div>

          {/* Card 4 */}
          <div
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            data-aos="fade-down"
          >
            <h4 className="font-semibold text-xl text-[#309255]">
              💪 Motivational Content
            </h4>
            <p className="text-brandGray">
              Learning vocabulary can be challenging, but we’re here to inspire
              you. Expect to see motivational messages and success stories along
              your learning journey to keep you engaged and motivated!
            </p>
          </div>

          {/* Card 5 */}
          <div
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            data-aos="flip-up"
          >
            <h4 className="font-semibold text-xl text-[#309255]">
              🌍 Real-Life Examples
            </h4>
            <p className="text-brandGray">
              Learn how each vocabulary word is used in real-world contexts with
              example sentences, so you not only remember the word but also
              understand how to apply it in conversation.
            </p>
          </div>

          {/* Card 6 */}
          <div
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            data-aos="flip-up"
          >
            <h4 className="font-semibold text-xl text-[#309255]">
              🌍 Fast Learning Environment
            </h4>
            <p className="text-brandGray">
              You will learn each vocabulary and sentences, In a very short time
              with good environment and also understand how to apply it in
              conversation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
