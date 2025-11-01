import Link from "next/link";

interface Props {
  title: string;
  desc: string;
  created: string;
  responses: string;
  id: string;
}

export default function DiscussionCard({
  title = "Which framwork should be use ?",
  desc = "We are creating a new web app. Discuss which framework we should use.",
  created = "14 minutes ago",
  responses = "150 responses",
  id = "12345-12345-123455-12314",
}: Props) {
  return (
    <Link href={`/discussions/${id}`}>
      <div className="border rounded-md p-2 border-gray-300">
        <h1 className="font-semibold text-slate-800">{title}</h1>

        <div className="text-gray-500 text-sm mt-2">{desc}</div>

        <div className="flex justify-between text-gray-500 text-xs mt-4">
          <div>{created}</div>
          <div>{responses}</div>
        </div>
      </div>
    </Link>
  );
}
