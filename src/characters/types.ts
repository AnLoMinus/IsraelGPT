export interface Character {
  id: string;
  name: string;
  description: string;
  icon: string;
  systemInstruction: string;
  greeting: string;
  era?: string; // Optional for now, will be populated
}
