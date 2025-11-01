import DiscussionCard from "@/components/DiscussionCard";

export default function DiscussionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
          Browse Discussions
        </h1>

        <div className="mt-4 text-gray-500">
          Explore active discussions and add your perspective
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <DiscussionCard
            title={"Which framwork should be use ?"}
            desc={
              "We are creating a new web app. Discuss which framework we should use."
            }
            created={"15 minutes ago"}
            responses={"100 responses"}
            id={"12341231-123141-1231412"}
          />
          <DiscussionCard
            title={"Which framwork should be use ?"}
            desc={
              "We are creating a new web app. Discuss which framework we should use."
            }
            created={"15 minutes ago"}
            responses={"100 responses"}
            id={"12341231-123141-1231412"}
          />
          <DiscussionCard
            title={"Which framwork should be use ?"}
            desc={
              "We are creating a new web app. Discuss which framework we should use."
            }
            created={"15 minutes ago"}
            responses={"100 responses"}
            id={"12341231-123141-1231412"}
          />
          <DiscussionCard
            title={"Which framwork should be use ?"}
            desc={
              "We are creating a new web app. Discuss which framework we should use."
            }
            created={"15 minutes ago"}
            responses={"100 responses"}
            id={"12341231-123141-1231412"}
          />
          <DiscussionCard
            title={"Which framwork should be use ?"}
            desc={
              "We are creating a new web app. Discuss which framework we should use."
            }
            created={"15 minutes ago"}
            responses={"100 responses"}
            id={"12341231-123141-1231412"}
          />
          <DiscussionCard
            title={"Which framwork should be use ?"}
            desc={
              "We are creating a new web app. Discuss which framework we should use."
            }
            created={"15 minutes ago"}
            responses={"100 responses"}
            id={"12341231-123141-1231412"}
          />
          <DiscussionCard
            title={"Which framwork should be use ?"}
            desc={
              "We are creating a new web app. Discuss which framework we should use."
            }
            created={"15 minutes ago"}
            responses={"100 responses"}
            id={"12341231-123141-1231412"}
          />
          <DiscussionCard
            title={"Which framwork should be use ?"}
            desc={
              "We are creating a new web app. Discuss which framework we should use."
            }
            created={"15 minutes ago"}
            responses={"100 responses"}
            id={"12341231-123141-1231412"}
          />
        </div>
      </div>
    </div>
  );
}
