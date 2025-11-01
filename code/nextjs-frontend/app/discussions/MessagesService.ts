const baseUrl = "https://fastapi.nutline.cloud/";


type Message = {
    message: string;
    discussion_id: string;
    owner_id   : string;
}

export async function createMessageService(
  data: Message
) {
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

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch discussions:", error);
    //return [];
    throw error;
  }
}

