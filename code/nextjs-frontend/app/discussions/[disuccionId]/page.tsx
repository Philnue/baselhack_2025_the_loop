'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

type Opinion = {
  id: number;
  author: string;
  time: string;
  text: string;
  initialUpvotes: number;
};

const opinionsData: Opinion[] = [
  {
    id: 1,
    author: 'Anonymous Panda',
    time: '5 hours ago',
    text: 'The focus should be on output, not presence. With the right tools and processes, teams can be even more productive remotely. The cost savings on office space alone are a huge incentive for companies to embrace this shift fully.',
    initialUpvotes: 8,
  },
  {
    id: 2,
    author: 'Anonymous Bird',
    time: '2 hours ago',
    text: 'I believe a hybrid model is the most sustainable approach. It offers the flexibility employees desire while maintaining the collaborative benefits of in-person interaction. Forcing a full return to the office could lead to a significant loss of talent.',
    initialUpvotes: 12,
  },
  {
    id: 3,
    author: 'Anonymous Pig',
    time: '1 day ago',
    text: "Full-time office work fosters a stronger company culture and allows for spontaneous collaboration that you just can't replicate over a video call. We should be encouraging people to come back to the office, not stay home.",
    initialUpvotes: 8,
  },
];

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-full border border-pink-400 px-4 py-1 text-sm font-medium text-pink-700">
      {label}
    </span>
  );
}

function OpinionCard({ opinion }: { opinion: Opinion }) {
  const [upvotes, setUpvotes] = useState(opinion.initialUpvotes);
  const [isUpvoted, setIsUpvoted] = useState(false);

  const handleUpvote = () => {
    if (isUpvoted) {
      setUpvotes(upvotes - 1);
      setIsUpvoted(false);
    } else {
      setUpvotes(upvotes + 1);
      setIsUpvoted(true);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="font-semibold text-gray-700">{opinion.author}</span>
        <span>•</span>
        <span>{opinion.time}</span>
      </div>

      <p className="my-4 text-base text-gray-800">{opinion.text}</p>

      <div className="flex justify-end">
        <button
          onClick={handleUpvote}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors
            ${
              isUpvoted
                ? 'border-pink-300 bg-pink-50 text-pink-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            }
          `}
        >
          <Heart
            className="h-4 w-4"
            fill={isUpvoted ? 'currentColor' : 'none'}
          />
          Upvote ({upvotes})
        </button>
      </div>
    </div>
  );
}

export default function DiscussionPage() {
  const [newOpinion, setNewOpinion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting opinion:', newOpinion);
    setNewOpinion('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl space-y-8 px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            How can we improve team collaboration?
          </h1>
          <p className="mb-6 text-lg text-gray-600">
            A discussion on the evolving landscape of work environments,
            exploring the pros and cons of remote, hybrid, and in-office models
            to find a sustainable path forward.
          </p>
          <div className="flex gap-2">
            <Tag label="#Tag1" />
            <Tag label="#Tag2" />
            <Tag label="#Tag3" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="opinion"
              className="mb-2 block text-lg font-semibold text-gray-800"
            >
              Share your opinion
            </label>
            <textarea
              id="opinion"
              name="opinion"
              rows={5}
              className="w-full rounded-lg border border-gray-300 p-4 text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              placeholder="What are your thoughts?"
              value={newOpinion}
              onChange={(e) => setNewOpinion(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-[#9B2C6B] px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#8A265F] focus:outline-none focus:ring-2 focus:ring-[#9B2C6B] focus:ring-offset-2"
              >
                Submit Opinion
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">
            Opinions from other participants
          </h2>
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex max-h-96 flex-col gap-4 overflow-y-auto pr-2">
              {opinionsData.map((opinion) => (
                <OpinionCard key={opinion.id} opinion={opinion} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
