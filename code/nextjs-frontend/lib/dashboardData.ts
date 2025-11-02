// Dashboard data types and sample data

export interface ThemeData {
  theme_label: string;
  consensus: number;
  dominant_option: "Helped" | "Hurt" | "Neutral";
  dom_share: number;
  avg_confidence: number;
  total_weight: number;
  count: number;
}

export interface EmotionData {
  theme_label: string;
  annoyance: number;
  anticipation: number;
  fear: number;
  frustration: number;
  joy: number;
  none: number;
  sadness: number;
  trust: number;
}

export interface SentimentData {
  theme_label: string;
  positive: number;
  neutral: number;
  negative: number;
}

export type EmotionType =
  | "annoyance"
  | "anticipation"
  | "fear"
  | "frustration"
  | "joy"
  | "none"
  | "sadness"
  | "trust"
  | "theme_label";

// Theme data
export const themeData: ThemeData[] = [
  {
    theme_label: "Team Collaboration",
    consensus: 43,
    dominant_option: "Helped",
    dom_share: 0.622864,
    avg_confidence: 0.765111,
    total_weight: 14.18,
    count: 13,
  },
  {
    theme_label: "Line Management",
    consensus: 31,
    dominant_option: "Hurt",
    dom_share: 0.537929,
    avg_confidence: 0.705612,
    total_weight: 8.34,
    count: 8,
  },
  {
    theme_label: "Content Pacing",
    consensus: 57,
    dominant_option: "Helped",
    dom_share: 0.712713,
    avg_confidence: 0.806233,
    total_weight: 7.03,
    count: 7,
  },
  {
    theme_label: "Hybrid Setup",
    consensus: 24,
    dominant_option: "Helped",
    dom_share: 0.493203,
    avg_confidence: 0.836363,
    total_weight: 4.85,
    count: 4,
  },
  {
    theme_label: "Presentation Style",
    consensus: 63,
    dominant_option: "Helped",
    dom_share: 0.754647,
    avg_confidence: 0.787843,
    total_weight: 3.86,
    count: 4,
  },
  {
    theme_label: "Inclusivity Initiatives",
    consensus: 54,
    dominant_option: "Helped",
    dom_share: 0.69227,
    avg_confidence: 0.747034,
    total_weight: 3.19,
    count: 3,
  },
  {
    theme_label: "Check-in Process",
    consensus: 30,
    dominant_option: "Hurt",
    dom_share: 0.535919,
    avg_confidence: 0.873204,
    total_weight: 2.37,
    count: 2,
  },
  {
    theme_label: "Signage and Wayfinding",
    consensus: 100,
    dominant_option: "Helped",
    dom_share: 1.0,
    avg_confidence: 0.825184,
    total_weight: 1.9,
    count: 2,
  },
  {
    theme_label: "Meeting Scheduling",
    consensus: 33,
    dominant_option: "Hurt",
    dom_share: 0.550821,
    avg_confidence: 0.610164,
    total_weight: 1.82,
    count: 2,
  },
  {
    theme_label: "Icebreaker",
    consensus: 35,
    dominant_option: "Neutral",
    dom_share: 0.567616,
    avg_confidence: 0.656762,
    total_weight: 1.67,
    count: 2,
  },
];

// Emotion data
export const emotionData: EmotionData[] = [
  {
    theme_label: "Check-in Process",
    annoyance: 0.0,
    anticipation: 0.0,
    fear: 0.0,
    frustration: 0.535919,
    joy: 0.464081,
    none: 0.0,
    sadness: 0.0,
    trust: 0.0,
  },
  {
    theme_label: "Content Pacing",
    annoyance: 0.0,
    anticipation: 0.152414,
    fear: 0.0,
    frustration: 0.0,
    joy: 0.265252,
    none: 0.305218,
    sadness: 0.152414,
    trust: 0.124702,
  },
  {
    theme_label: "Hybrid Setup",
    annoyance: 0.0,
    anticipation: 0.0,
    fear: 0.234065,
    frustration: 0.0,
    joy: 0.261602,
    none: 0.272732,
    sadness: 0.0,
    trust: 0.231601,
  },
  {
    theme_label: "Icebreaker",
    annoyance: 0.0,
    anticipation: 0.0,
    fear: 0.0,
    frustration: 0.0,
    joy: 0.432384,
    none: 0.567616,
    sadness: 0.0,
    trust: 0.0,
  },
  {
    theme_label: "Inclusivity Initiatives",
    annoyance: 0.0,
    anticipation: 0.0,
    fear: 0.0,
    frustration: 0.0,
    joy: 0.0,
    none: 0.336028,
    sadness: 0.30773,
    trust: 0.356242,
  },
  {
    theme_label: "Line Management",
    annoyance: 0.135868,
    anticipation: 0.105302,
    fear: 0.0,
    frustration: 0.0,
    joy: 0.0,
    none: 0.509424,
    sadness: 0.125039,
    trust: 0.124367,
  },
  {
    theme_label: "Meeting Scheduling",
    annoyance: 0.0,
    anticipation: 0.0,
    fear: 0.0,
    frustration: 0.0,
    joy: 0.0,
    none: 1.0,
    sadness: 0.0,
    trust: 0.0,
  },
  {
    theme_label: "Narrative Arc",
    annoyance: 0.0,
    anticipation: 0.0,
    fear: 0.0,
    frustration: 0.0,
    joy: 0.0,
    none: 1.0,
    sadness: 0.0,
    trust: 0.0,
  },
  {
    theme_label: "Presentation Style",
    annoyance: 0.0,
    anticipation: 0.0,
    fear: 0.0,
    frustration: 0.0,
    joy: 0.754647,
    none: 0.0,
    sadness: 0.245353,
    trust: 0.0,
  },
  {
    theme_label: "Signage and Wayfinding",
    annoyance: 0.0,
    anticipation: 0.0,
    fear: 0.0,
    frustration: 0.0,
    joy: 1.0,
    none: 0.0,
    sadness: 0.0,
    trust: 0.0,
  },
  {
    theme_label: "Snack Quality",
    annoyance: 0.0,
    anticipation: 0.0,
    fear: 0.0,
    frustration: 0.0,
    joy: 1.0,
    none: 0.0,
    sadness: 0.0,
    trust: 0.0,
  },
  {
    theme_label: "Team Collaboration",
    annoyance: 0.0,
    anticipation: 0.157783,
    fear: 0.0,
    frustration: 0.081764,
    joy: 0.405765,
    none: 0.354688,
    sadness: 0.0,
    trust: 0.0,
  },
  {
    theme_label: "Workshop Relevance",
    annoyance: 0.0,
    anticipation: 0.0,
    fear: 0.0,
    frustration: 0.0,
    joy: 1.0,
    none: 0.0,
    sadness: 0.0,
    trust: 0.0,
  },
];

// Sentiment data
export const sentimentData: SentimentData[] = [
  {
    theme_label: "Check-in Process",
    positive: 0.0,
    neutral: 1.0,
    negative: 0.0,
  },
  {
    theme_label: "Content Pacing",
    positive: 1.0,
    neutral: 0.0,
    negative: 0.0,
  },
  {
    theme_label: "Hybrid Setup",
    positive: 1.0,
    neutral: 0.0,
    negative: 0.0,
  },
  {
    theme_label: "Icebreaker",
    positive: 1.0,
    neutral: 0.0,
    negative: 0.0,
  },
  {
    theme_label: "Inclusivity Initiatives",
    positive: 0.0,
    neutral: 1.0,
    negative: 0.0,
  },
  {
    theme_label: "Line Management",
    positive: 0.0,
    neutral: 0.0,
    negative: 1.0,
  },
  {
    theme_label: "Meeting Scheduling",
    positive: 0.0,
    neutral: 1.0,
    negative: 0.0,
  },
  {
    theme_label: "Narrative Arc",
    positive: 0.0,
    neutral: 1.0,
    negative: 0.0,
  },
  {
    theme_label: "Presentation Style",
    positive: 1.0,
    neutral: 0.0,
    negative: 0.0,
  },
  {
    theme_label: "Signage and Wayfinding",
    positive: 1.0,
    neutral: 0.0,
    negative: 0.0,
  },
  {
    theme_label: "Snack Quality",
    positive: 1.0,
    neutral: 0.0,
    negative: 0.0,
  },
  {
    theme_label: "Team Collaboration",
    positive: 1.0,
    neutral: 0.0,
    negative: 0.0,
  },
  {
    theme_label: "Workshop Relevance",
    positive: 1.0,
    neutral: 0.0,
    negative: 0.0,
  },
];

// Helper functions to get top-rated data
export function getTopEmotions(
  limit: number = 5
): Array<{ emotion: EmotionType; value: number; theme: string }> {
  const emotionTotals: Map<EmotionType, { value: number; themes: string[] }> =
    new Map();

  emotionData.forEach((item) => {
    // Find corresponding theme data to weight by importance
    const themeInfo = themeData.find((t) => t.theme_label === item.theme_label);
    const weight = themeInfo?.total_weight || 1.0;

    (Object.keys(item) as EmotionType[]).forEach((emotion) => {
      if (emotion !== "theme_label") {
        const value = item[emotion];
        if (value > 0 && emotion !== "none") {
          if (!emotionTotals.has(emotion)) {
            emotionTotals.set(emotion, { value: 0, themes: [] });
          }
          const current = emotionTotals.get(emotion)!;
          // Weight emotion by theme's total_weight for better representation
          current.value += value * weight;
          if (!current.themes.includes(item.theme_label)) {
            current.themes.push(item.theme_label);
          }
        }
      }
    });
  });

  return Array.from(emotionTotals.entries())
    .map(([emotion, data]) => ({
      emotion,
      value: data.value,
      theme: data.themes[0] || "",
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function getTopSentiments(): Array<{
  sentiment: "positive" | "neutral" | "negative";
  count: number;
  percentage: number;
}> {
  let positive = 0;
  let neutral = 0;
  let negative = 0;

  sentimentData.forEach((item) => {
    if (item.positive === 1.0) positive++;
    else if (item.neutral === 1.0) neutral++;
    else if (item.negative === 1.0) negative++;
  });

  const total = positive + neutral + negative;

  return [
    {
      sentiment: "positive" as const,
      count: positive,
      percentage: total > 0 ? (positive / total) * 100 : 0,
    },
    {
      sentiment: "neutral" as const,
      count: neutral,
      percentage: total > 0 ? (neutral / total) * 100 : 0,
    },
    {
      sentiment: "negative" as const,
      count: negative,
      percentage: total > 0 ? (negative / total) * 100 : 0,
    },
  ].sort((a, b) => b.count - a.count);
}
