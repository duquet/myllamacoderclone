"use client";
import { useState } from "react";
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream.mjs";
import { Sandpack } from "@codesandbox/sandpack-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  async function generateCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch("/api/generateCode", {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const runner = ChatCompletionStream.fromReadableStream(res.body!);
    runner.on("content", (delta) => {
      setGeneratedCode((text) => text + delta);
    }); // setAnswer is a function that sets the answer in the UI
  }

  const sharedOptions = {
    externalResources: [
      "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
    ],
  };
  return (
    <div className="mx-auto max-w-4xl p-4 y-4">
      <h1 className="text-5xl font-bold text-center">My Llama Coder Clone</h1>
      <form onSubmit={generateCode}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here"
          className="border p-2 my-4"
        />
      </form>

      {generatedCode && (
        <Sandpack
          template="react-ts"
          files={{
            "/App.tsx": generatedCode,
            "/public/index.html": `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css"></script>
        </head>
        <body>
          <div id="root"></div>
        </body>
        </html>`,
          }}
          options={{
            editorHeight: "80vh",
            showTabs: false,
            showNavigator: true,
            ...sharedOptions,
          }}
        />
      )}
    </div>
  );
}
