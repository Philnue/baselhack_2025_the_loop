const baseUrl = "https://fastapi.nutline.cloud/";

export async function getDiscussionsService() {
  try {
    const url = baseUrl + "discussions/";
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return (await res.json()) as Discussion[];
  } catch (error) {
    console.error("Failed to fetch discussions:", error);
    //return [];
    throw error;
  }
}

export async function createDiscussionService(
  data: Record<string, string | string[] | null>
) {
  try {
    const url = baseUrl + "discussions/";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return (await res.json()) as Discussion;
  } catch (error) {
    console.error("Failed to create discussion:", error);
    throw error;
  }
}

export async function getDiscussionByIdService(discussionId: string) {
  try {
    const url = baseUrl + `discussions/${discussionId}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return (await res.json()) as Discussion;
  } catch (error) {
    console.error("Failed to fetch discussions:", error);
    throw error;
  }
}

export async function removeDiscussionByIdService(
  discussionId: string,
  ownerId: string
) {
  try {
    const url = baseUrl + `discussions/${discussionId}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discussion_id: discussionId,
        owner_id: ownerId,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to delete discussion:", error);
    throw error;
  }
}

export async function patchDiscussionByIdService(
  discussionId: string,
  ownerId: string,
  data: Record<string, any>
) {
  try {
    const url = baseUrl + `discussions/${discussionId}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discussion_id: discussionId,
        owner_id: ownerId,
        ...data,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to update discussion:", error);
    throw error;
  }
}

// Type Definitions

export type DiscussionTemplate =
  | "BINARY_PROPOSAL"
  | "PRIORITIZATION_RANKING"
  | "BRAINSTORMING_IDEATION"
  | "FEEDBACK_RETROSPECTIVE"
  | "FORECASTING_PLANNING";

export type Discussion = {
  template: DiscussionTemplate;
  name: string;
  description: string;
  tags: string[];
  id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  report: string | null;
  report_progress: number | null;
  messages: any[];
};

export type Message = {
  message: string;
  discussion_id: string;
  id: string;
  created_at: string;
  updated_at: string;
};
