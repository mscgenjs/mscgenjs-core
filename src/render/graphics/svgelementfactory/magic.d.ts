export interface IBoxOptions {
  class: string;
  color?: string;
  bgColor?: string;
}

export interface IOptions {
  lineWidth: number;
  class: string;
  color?: string;
  bgColor?: string;
  foldSize?: number;
}

export type MagicType = "straight" | "wobbly";
