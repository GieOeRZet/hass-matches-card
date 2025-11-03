export interface MatchItem {
  date?: string;
  finished?: boolean;
  league?: string;
  logo_home?: string;
  logo_away?: string;
  home: string;
  away: string;
  score?: string;
  result?: "win" | "loss" | "draw";
}

export interface MatchesCardConfig {
  type: string;
  entity: string;
  name?: string;
  show_name?: boolean;
  show_logos?: boolean;
  fill?: "gradient" | "zebra" | "none";
  show_result_symbol?: boolean;
  font_size?: { date: number; status: number; teams: number; score: number };
  icon_size?: { league: number; crest: number; result: number };
  gradient?: { alpha: number; start: number; end: number };
  colors?: { win: string; loss: string; draw: string };
}
