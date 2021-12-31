export interface AudioFeature {
  label: string;
  icon: string;
  value: number;
  range: {
    min: number;
    max: number;
  };
}
