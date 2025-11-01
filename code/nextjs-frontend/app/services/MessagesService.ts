import { Message } from "./DiscussionsService";

const baseUrl = "https://fastapi.nutline.cloud/";

export async function createMessageService(data: {
  message: string;
  discussion_id: string;
  owner_id: string;
}) {
  try {
    const url = baseUrl + "messages/";
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

    return (await res.json()) as Message;
  } catch (error) {
    console.error("Failed to create message:", error);
    throw error;
  }
}

export async function removeMessageByIdService(
  messageId: string,
  ownerId: string
) {
  try {
    const url = baseUrl + `messages/${messageId}?owner_id=${ownerId}`;
    const res = await fetch(url, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // 204 No Content response
    if (res.status === 204) {
      return;
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to delete message:", error);
    throw error;
  }
}
