import { exec } from "child_process";

export function runOllama(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      `ollama run llama3.2:1b "${prompt}"`,
      { maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(stderr || error.message);
        } else {
          resolve(stdout.trim());
        }
      }
    );
  });
}
