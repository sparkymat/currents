export interface SubtitleLine {
  speaker: string;
  lines: string[];
}

export interface SubtitleEntry {
  start_ms: number;
  end_ms: number;
  lines: SubtitleLine[];
}

export interface Subtitle {
  url: string;
  languageLabel: string;
  languageCode: string;
}
