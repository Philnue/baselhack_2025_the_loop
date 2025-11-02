const baseUrl = "https://fastapi.nutline.cloud/";

export interface ThemeBoardEntry {
  theme_label: string;
  consensus: number;
  dominant_option: string;
  dom_share: number;
  avg_confidence: number;
  total_weight: number;
  count: number;
}

export interface SentimentRow {
  theme_label: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface EmotionRow {
  theme_label: string;
  "Emotion.ANGER": number;
  "Emotion.ANTICIPATION": number;
  "Emotion.FEAR": number;
  "Emotion.JOY": number;
  "Emotion.SADNESS": number;
  "Emotion.TRUST": number;
}

export interface EvidenceEntry {
  theme_label: string;
  evidence_type: string;
  score: number;
  w: number;
  text: string;
}

export interface ReportPayload {
  summary: {
    agreed_topics: string[];
    disagreed_topics: string[];
  };
  evidence: {
    top10_weighted_texts: EvidenceEntry[];
    against_top7: EvidenceEntry[];
    highlights_top3: EvidenceEntry[];
  };
}

export interface ReportSummary {
  main_summary: string;
  conficting_statement: string;
  top_weighted_points: string[];
}

export interface ReportData {
  theme_board: ThemeBoardEntry[];
  sentiment_table: SentimentRow[];
  emotion_table: EmotionRow[];
  payload: ReportPayload;
  summary: ReportSummary;
}

export interface DiscussionMessage {
  id: string;
  owner_id: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface DiscussionReportResponse {
  template: string;
  name: string;
  description: string;
  tags: string[];
  id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  report: ReportData | null;
  report_progress: number | null;
  messages: DiscussionMessage[];
}

export async function createReport(data: {
  discussion_id: string;
  owner_id: string;
}): Promise<void> {
  try {
    const url =
      baseUrl + `reports/${data.discussion_id}?owner_id=${data.owner_id}`;
    const res = await fetch(url, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    if (res.status !== 204) {
      throw new Error(`Unexpected response status: ${res.status}`);
    }
  } catch (error) {
    console.error("Failed to create report:", error);
    throw error;
  }
}

export async function readReport(
  discussionId: string
): Promise<DiscussionReportResponse> {
  try {
    const url = baseUrl + `discussions/${discussionId}`;
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return (await res.json()) as DiscussionReportResponse;
  } catch (error) {
    console.error("Failed to read report:", error);
    throw error;
  }
}
