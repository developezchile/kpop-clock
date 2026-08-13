export interface Alarm {
  id: string;
  time: string; // "HH:MM" 24h format
  label: string;
  enabled: boolean;
}
