import React from 'react';
import { 
  MessageSquareText, 
  LayoutList, 
  PieChart, 
  CheckCheck, 
  GitPullRequestArrow 
} from 'lucide-react';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description }) => (
  <div className="flex h-full flex-col justify-start bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 bg-gray-100 rounded-full p-3">
        {icon}
      </div>
      <div className="flex-1">
  <h3 className="font-sans text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </div>
);

/**
 * Main page component
 */
export default function DiscussionPage() {
  
  // Data for the 4-card grid
  const cardData = [
    {
      icon: <LayoutList className="h-6 w-6 text-gray-700" />,
      title: "Key Themes",
      description: "Main ideas that emerged from the discussion"
    },
    {
      icon: <PieChart className="h-6 w-6 text-gray-700" />,
      title: "Opinion Distribution",
      description: "How opinions are spread"
    },
    {
      icon: <CheckCheck className="h-6 w-6 text-gray-700" />,
      title: "Agreements", // Corrected typo from "Aggrements" in image
      description: "Main ideas that emerged from the discussion"
    },
    {
      icon: <GitPullRequestArrow className="h-6 w-6 text-gray-700" />,
      title: "Conflicting viewpoints",
      description: "Areas where opinions differ significantly"
    }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-50 p-4 sm:p-8 lg:p-12">
      <div className="w-full max-w-5xl mx-auto">
        
        {/* === Section 1: Header === */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            How can we improve team collaboration?
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            A discussion on the evolving landscape of work environments, exploring the 
            pros and cons of remote, hybrid, and in-office models to find a sustainable 
            path forward.
          </p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {['#Tag1', '#Tag2', '#Tag3'].map((tag) => (
              <span 
                key={tag}
                className="inline-block bg-white border border-gray-300 rounded-full px-4 py-1.5 text-sm font-medium text-pink-600 cursor-pointer hover:bg-pink-50 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <hr className="border-gray-200" />
        </header>

        {/* === Section 2: Consensus Summary === */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="flex-shrink-0 bg-gray-100 rounded-full p-3">
              {/* Using a similar icon for "Consensus" */}
              <MessageSquareText className="h-7 w-7 text-gray-700" />
            </div>
            
            <div className="flex-1">
              <h2 className="font-sans text-xl font-semibold text-gray-900">Consensus Summary</h2>
              <p className="text-base text-gray-500 mb-4">A detailed explanation of the AIs findings</p>
              
              {/* Using prose to style the dummy text */}
              <div className="space-y-4 text-gray-700 prose prose-sm max-w-none">
                <p>
                  Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the 
                  industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type 
                  and scrambled it to make a type specimen book. It has survived not only five centuries, but also 
                  the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 
                  1960s with the release of Letraset sheets containing
                </p>
                <p>
                  Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker 
                  including versions of Lorem Ipsum.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* === Section 3: Grid of Cards === */}
        {/* Responsive Grid: 1 column on mobile, 2 columns on medium screens and up */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {cardData.map((card) => (
            <InfoCard 
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </section>

        {/* === Section 4: Buttons === */}
        {/* Responsive Buttons: Stacked on mobile, side-by-side on desktop */}
        <footer className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-[#A8005C] text-white font-medium py-3 px-6 rounded-lg hover:bg-purple-800 transition-colors shadow-sm">
            View all opinions
          </button>
          <button className="w-full sm:w-auto bg-white text-[#A8005C] border border-[#A8005C] font-medium py-3 px-6 rounded-lg hover:bg-[#A8005C] hover:text-white transition-colors">
            Start new discussion
          </button>
        </footer>

      </div>
    </main>
  );
}