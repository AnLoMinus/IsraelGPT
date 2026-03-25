export interface Character {
  id: string;
  name: string;
  description: string;
  icon: string;
  systemInstruction: string;
  greeting: string;
  era?: string; // Optional for now, will be populated
  color?: string; // Optional color for the character's UI elements
}
