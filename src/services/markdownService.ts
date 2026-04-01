export interface MarkdownFile {
  filename: string;
  content: string;
}

export async function listMarkdownFiles(): Promise<string[]> {
  const response = await fetch("/api/markdown/list");
  if (!response.ok) {
    throw new Error("Failed to list markdown files");
  }
  return response.json();
}

export async function readMarkdownFile(filename: string, type?: "changelog" | "todo"): Promise<string> {
  const url = new URL("/api/markdown/read", window.location.origin);
  if (filename) url.searchParams.append("filename", filename);
  if (type) url.searchParams.append("type", type);
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to read markdown file");
  }
  const data = await response.json();
  return data.content;
}
