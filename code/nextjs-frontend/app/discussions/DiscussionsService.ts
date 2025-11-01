import { json } from "stream/consumers";

const baseUrl = "https://fastapi.nutline.cloud/";

export async function getDiscussionsService() {
  try {
    const url = baseUrl + "discussions/";
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
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

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch discussions:", error);
    //return [];
    throw error;
  }
}
