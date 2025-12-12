import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Cpu, FileText } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Make Academy <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              Create intelligent academic work using AI
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
            Generate, organize, and export complete assignments in minutes. Simple, fast, and specifically designed for academic standards.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link 
              to="/generator" 
              className="px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 group"
            >
              Start Now 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how-it-works" className="px-8 py-3 rounded-full bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-all border border-gray-700">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400">Three simple steps to your perfect assignment</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard 
              icon={<BookOpen className="w-8 h-8 text-primary" />}
              step="01"
              title="Enter your topic"
              description="Provide the subject, specific requirements, and format style (APA, ABNT, etc.)."
            />
            <StepCard 
              icon={<Cpu className="w-8 h-8 text-purple-400" />}
              step="02"
              title="AI Generation"
              description="Our advanced AI generates structured, academic, and unique content for you."
            />
            <StepCard 
              icon={<FileText className="w-8 h-8 text-green-400" />}
              step="03"
              title="Export & Save"
              description="Download your work as PDF or Word document instantly or save it to your dashboard."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-16">What Students Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Sarah J."
              role="History Student"
              text="This tool saved my semester! The bibliography generation is spot on and the structure is perfect."
            />
            <TestimonialCard 
              name="Mike T."
              role="Engineering Major"
              text="I use it to brainstorm structure for my reports. It helps me get started and overcome writer's block."
            />
            <TestimonialCard 
              name="Jessica L."
              role="Postgrad Student"
              text="The ability to choose between APA and ABNT is a game changer for my international submissions."
            />
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
             <FaqItem question="Is the content unique?" answer="Yes, our AI generates unique content for every request based on your specific inputs." />
             <FaqItem question="Can I edit the generated text?" answer="Absolutely! You can export to Word and make any changes you need." />
             <FaqItem question="Is it free?" answer="We offer a generous free tier for all students to help them succeed." />
          </div>
        </div>
      </section>
    </div>
  );
};

const StepCard: React.FC<{ icon: React.ReactNode, step: string, title: string, description: string }> = ({ icon, step, title, description }) => (
  <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-primary/50 transition-all hover:transform hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-800 rounded-lg">{icon}</div>
      <span className="text-4xl font-bold text-gray-800 select-none">{step}</span>
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const TestimonialCard: React.FC<{ name: string, role: string, text: string }> = ({ name, role, text }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
    <p className="text-gray-300 italic mb-4">"{text}"</p>
    <div>
      <h4 className="font-bold text-white">{name}</h4>
      <span className="text-sm text-primary">{role}</span>
    </div>
  </div>
);

const FaqItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => (
  <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
    <h3 className="font-bold text-lg mb-2">{question}</h3>
    <p className="text-gray-400">{answer}</p>
  </div>
);

export default Home;