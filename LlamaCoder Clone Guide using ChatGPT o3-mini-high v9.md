# Building a LlamaCoder Clone: Step-by-Step Guide

This guide details how to build an open-source AI-powered code generator using **Next.js**, **Together AI**, and **Sandpack**. It’s based on Hassan’s live coding session (see transcript for section start times) from his youtube video tutorial  
["Learn How To Build and Scale AI Apps: A Deep Dive Into LlamaCoder, an Open-Source Code Generator"](https://www.youtube.com/watch?v=hARmHYaZ_MQ). 

This document provides very detailed, transcript-based summary for each step and includes explicit references to the sample code sources used during the session.

TODO:
Use code specific to each step and create a repo that has each step in it (currently referring to final code which is confusing)
Update the GPT o3-mini-high shared session to include changes

Here is my shared ChatGPT session for trying to create the guide from the youtube video
https://chatgpt.com/share/67be4423-e5b0-800d-843b-79f41a7ee896

TODO:
Review README “guide” and clean it up using MD

I tried to ask ChatGPT o3-mini-high to remove '''markdown and closing '''' (so I could use directly in Github) but it then didn't display the markdown correctly
Think about how the guide could have been created from scratch using an App

prompt: Use Exact Code

add a section number to section titles in the body but don't have redundant section numbers in the table of contents (have the sections in a numbered list without the starting number from the section title)

remove timestamp in first bullet point

put explanation of “This section” and “This Snippet” above the bullet points. Instead of saying "This Section sets up" and "This Snippet", rephrase to say "Set up" or other action word phrase. For example, replace "This ensures the input updates the state dynamically." with "Update the prompt state dynamically".
Remove the subtitle “Detailed Transcript Summary:”

maybe remove the line numbers in the code cells

Create a questions section and add this to it: Question #1: Why Use stream.toReadableStream();? and remove it as a separate section

For some reason, Add input field starts at 13:07 but my time stamped transcript must have said per the document 12:03. need to double check all start times?

Add an Intro section that includes that Hassan have a demo (shared screen at 4:04) which included Create a Calculator App using Lllama 3.1 405B LLM and demonstrates it woks and how you can publish and modify it (caveat: good for small or limited applications only) and a landing page. Free and open source. Popular app. Showed Pausible (436k visitors) and Helicone (over a million requests (apps and edits)). Target audience is anyone with or without NextJS experience.

---

## Table of Contents

1. [Setup Your Next.js Project (8:44)](#1-setup-your-nextjs-project-844)
2. [Creating the Basic Home Page (10:14)](#2-creating-the-basic-home-page-1014)
3. [Adding the Input Field (12:03)](#3-adding-the-input-field-1203)
4. [Saving the Prompt in State (13:42)](#4-saving-the-prompt-in-state-1342)
5. [Creating the API Backend Route for Code Generation (14:49)](#5-creating-the-api-backend-route-for-code-generation-1449)
6. [Wrapping the Input Field into a Form (15:57)](#6-wrapping-the-input-field-into-a-form-1597)
7. [Calling the `generateCode` Function (16:37)](#7-calling-the-generatecode-function-1637)
8. [Testing API Calls in Terminal (17:17)](#8-testing-api-calls-in-terminal-1717)
9. [Replacing API Route with Together AI API (18:00)](#9-replacing-api-route-with-together-ai-api-1800)
10. [Updating Frontend to Use `runner.on` for Streaming (21:10)](#10-updating-frontend-to-use-runneron-for-streaming-2110)
11. [Creating `generatedCode` State and Displaying Output (22:07)](#11-creating-generatedcode-state-and-displaying-output-2207)
12. [Using Sandpack to Render the Code (24:05)](#12-using-sandpack-to-render-the-code-2405)
13. [Changing the LLM Prompt for Better Code Output (26:03)](#13-changing-the-llm-prompt-for-better-code-output-2603)
14. [Fixing the Tailwind Bug in Sandpack (27:25)](#14-fixing-the-tailwind-bug-in-sandpack-2725)
15. [Why Use `stream.toReadableStream();`?](#15-why-use-streamtoreadablestream)
16. [Common Mistakes](#16-common-mistakes)
17. [Complete Code Files with Inline Comments](#17-complete-code-files-with-inline-comments)
18. [Debugging & Feedback](#18-debugging--feedback)

---

## 1. Setup Your Next.js Project (8:44)

_Set up your project and add Together AI and Sandpack to your dependency list. We will also make sure these are added later._

- **Terminal Commands:** Hassan begins by running `npx create-next-app llama-coder-clone` to generate a new Next.js project.
- **Environment Note:** He stresses using the latest Node.js version and confirms that the project is created with all necessary configurations.
- **Dependency Installation:** After entering the project directory, he installs `together-ai` and `@codesandbox/sandpack-react` to integrate AI features and live code preview. We will double-check to make sure this was done later when needed.
- **Sample Code Source:** These commands are standard and referenced from the Next.js documentation.

```bash
npx create-next-app@latest llama-coder-clone (Say Yes to All)
```


```bash
cd llama-coder-clone
npm install together-ai @codesandbox/sandpack-react (Hassan skips this and does it later)
npm run dev
```

---

## 2. Creating the Basic (Frontend) Home Page (10:14)

_We will be working with only 2 files: page.tsx (frontend) and api/generateCode/route.ts (backend). We will discuss backend later._
  
- **UI Verification:** He instructs viewers to navigate to [https://localhost:3000](https://localhost:3000) to verify that the home page displays the title "My Llama Coder Clone".
- **Clean Slate:** He mentions deleting the default content to start with a blank slate. Remove any CSS if there is a black background.
- **Sample Code Source:** The structure is based on Next.js starter templates.

start with basic text:
```tsx
export default function Home() {
  // Basic component structure for the Home page
  return (
    <div>
    My Llama Coder Clone
    </div>
  );
}
```

and add H1 and Tailwind styling:

```tsx

export default function Home() {
  // Basic component structure for the Home page
  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="text-5xl font-bold text-center">My Llama Coder Clone</h1>
    </div>
  );
}
```

---

## 3. Adding the Input Field (12:50)

- **Input Addition:** Hassan adds an input field for user prompts.
- **Styling Details:** He demonstrates using Tailwind CSS classes for border, padding, and margin.
- **User Guidance:** The placeholder "Enter your prompt here" is added to guide the user.
- **Sample Code Source:** This code is directly derived from Hassan’s live demonstration in the transcript.

```tsx
// Inside the Home component's return statement:
  <input
    placeholder="Enter your prompt here"
    className="border p-2 my-4"
  />
```
Observe the input field on localhost:3000

## 4. Saving the Prompt in State (14:00)

_We will add a value and event handler_

```tsx
// Inside the Home component's return statement:
<form>
  <input
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    placeholder="Enter your prompt here"
    className="border p-2 my-4"
  />
</form>
```

_This snippet shows the input field with appropriate styling and placeholder text._

_Update the prompt state dynamically._

- **State Management:** Hassan explains the necessity of storing the prompt in React state using `useState`.
- **Dynamic Input:** He demonstrates how each keystroke updates the state and how to log the prompt to verify its value.
- **Sample Code Source:** Standard React practice, as illustrated in many Next.js tutorials.

```tsx
import { useState } from "react"; // Importing useState for state management
```

```tsx
// Initialize the prompt state inside your Home component:
const [prompt, setPrompt] = useState("");
```
```tsx
"use client";
```
_Note: Set up client-side rendering_

- **Client-Side Rendering:** Hassan emphasizes enabling client-side rendering with `"use client";`.

_Add console.log(prompt) and via the console in Chrome page_
```tsx
const [prompt, setPrompt] = useState("");
console.log({prompt});  //Add this and what it logging via in Chrome at localhost:3000 as input is changed manually
```

---

## 5. Creating the API Backend Route for Code Generation (14:49)

_This API route handles JSON requests and returns a streaming response from Together AI._

- **Backend Route Creation:** Hassan sets up an API route (`route.ts`) to process code generation requests.
- **JSON Parsing:** He explains how the backend extracts the prompt from the JSON body.


Create a new file app/api/generateCode/route.ts

```tsx
export async function POST(req: Request) {
 const { prompt } = await request.json();
 console.log({ prompt });
 return new Response ("Done.")
}
```

---

## 6. Wrapping the Input Field into a Form (15:57)

_Ensure the form submission triggers the code generation process without reloading the page._

- **Form Usage:** Hassan emphasizes the need to wrap the input field within a `<form>` element to handle submission with the Enter key.
- **Event Handling:** He explains that using an `onSubmit` event prevents the default page reload and calls the `generateCode` function.
- **Sample Code Source:** Derived directly from Hassan’s demonstration and standard HTML form practices.

```tsx
<form onSubmit={generateCode}>
  <input
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    placeholder="Enter your prompt here"
    className="border p-2 my-4"
  />
</form>
```

---

## 7. Calling the `generateCode` Function (16:45)

_Create a function that handles form submission and processes the streaming response.  
**Note:** Sample code is available in the Together AI documentation under Streaming Responses._

- **Function Implementation:** Hassan introduces the `generateCode` function.
- **Preventing Default:** He emphasizes using `e.preventDefault()` to stop the page from reloading.
- **API Call and Streaming:** The function makes a POST request to the API route and processes the response using `ChatCompletionStream` from Together AI.
- **Sample Code Source:** The code is adapted from the Together AI SDK examples provided in their documentation.

```tsx
async function generateCode(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const res = await fetch("/api/generateCode", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
  console.log(res);
}
```
_Now type "Calculator app" and notice in the terminal that POST /api/generateCode ran and we got back the prompt which is awesome_
_We can now remove the console.log(prompt) in the route.ts file and we can work on the interesting part which is sending to an LLM instead_
---

## 8. Testing API Calls in Terminal (17:40)

_Note: Start by going to docs at docs.together.ai/docs/introduction and Click on Quickstart (under Introduction link on left hand side navigator)_
_Note: Click on Typescript in Section 3. Run your first query against a model" and copy sample code._

_First, open a new terminal window and install together_ai if not done already_
```tsx
npm i together-ai
```
_NOTE: Don't forget to put your Together API Key in your .env in the root directory or add to your overall environment_
```tsx
TOGETHER_API_KEY=
```

_NOTE: see docs.together.ai/docs/nextjs-chat-quickstart and copy 1. API Route but replace runner wiht stream

_NOTE: Copy this code and change runner.on to stream.on_

```tsx
  let runner = ChatCompletionStream.fromReadableStream(res.body!);
  runner.on("content", (delta) => {
    setGeneratedCode((text) => text + delta);
  });
```

_Here is the modified code_

```tsx
import Together from "together-ai";

const together = new Together();

export default function POST(request: Request) {
 const { prompt } = await request.json();

 const stream = together.chat.completions.stream({
  model: "meta-llama/Meta-llama-3.1-405B-Instruct-Turbo",
  messages: [
    { role: "system", content: "You are a React developer"},
    { role: "user", content: prompt},
  ],
  stream: true,
});

 return new Response(stream.toReadableStream());  
}
```

_Simulate a POST request using curl to verify the API backend._

- **Testing with Curl:** Hassan demonstrates testing the API using a `curl` command.
- **Response Verification:** He explains that the prompt is logged and the expected JSON response confirms the API route works.
- **Sample Code Source:** This testing method is standard practice and is referenced from common REST API testing guides.

```bash
curl -X POST http://localhost:3000/api/generateCode \
  -d '{"prompt":"Create a calculator"}' \
  -H "Content-Type: application/json"
```

---

## 9. Replacing API Route with Together AI API (18:00) ???????
 
_Integrate the Together AI API for real-time code generation.  
**Note:** Sample code for the runner setup is available on the Together AI website under Streaming Responses._


- **Direct AI Integration:** Hassan replaces custom logic with a direct Together AI API call.
- **Model and Streaming:** He specifies the model `"meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo"` and enables streaming.
- **System Prompt (Brief Mention):** He hints at adding a system prompt later to refine outputs.
- **Sample Code Source:** The code is taken from the Together AI API quickstart examples.

```tsx
// In route.ts, the Together AI API call:
const response = await together.chat.completions.create({
  model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
  messages: [{ role: "user", content: prompt }],
  stream: true,
});
```

```tsx
// In page.tsx, integrating the streaming response:
let runner = ChatCompletionStream.fromReadableStream(res.body!);
runner.on("content", (delta) => {
  setGeneratedCode((text) => text + delta);
});
```

---

## 10. Updating Frontend to Use `runner.on` for Streaming (21:10)

_Clarify how streaming responses are handled on the frontend.  
**Note:** Sample code for these blocks was found in the NextJS quickstart guide at [https://docs.together.ai/docs/nextjs-chat-quickstart](https://docs.together.ai/docs/nextjs-chat-quickstart). Grab 2 lines of code in section "2. Page"_

- **Real-Time Streaming Update:** Hassan details how to update the frontend to process streaming responses.
- **Splitting the Code:** He splits the logic into two parts: one for creating the runner and one for handling the `content` event.
- **Sample Code Reference:** Hassan explicitly mentioned that he used sample code from the NextJS quickstart guide available at [https://docs.together.ai/docs/nextjs-chat-quickstart](https://docs.together.ai/docs/nextjs-chat-quickstart) for this purpose.

```tsx
// Code block for creating the streaming runner:
let runner = ChatCompletionStream.fromReadableStream(res.body!);
```

```tsx
// Code block for handling streamed content:
runner.on("content", (delta) => {
  setGeneratedCode((text) => text + delta); // See next step for setGeneratedCode definition
});
```
_NOTE: Include ChatCompletionStream from sample code_
```tsx
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream.mjs";
```

---

## 11. Creating `generatedCode` State and Displaying Output (21:40)


_Ensures that the generated code is dynamically displayed._

- **State for Output:** Hassan adds a new state variable, `generatedCode`, to capture the streamed response.
- **Dynamic UI Update:** He explains how the `<pre>` tag preserves formatting as the code updates in real time.
- **Sample Code Source:** This practice is common in React applications and is highlighted in many Next.js tutorials.

```tsx
const [generatedCode, setGeneratedCode] = useState("");
```

```tsx
// In the JSX return block:
<pre>{generatedCode}</pre>
```

_NOTE: Awesome, it's now ready to test! Type something like "Make me a calculator app" in the input field and watch the streaming response with code returned! The response includes "Here's a simple calculator app built with React....  and includes an explaination after the code. Amazing!_

---

## 12. Using Sandpack to the Frontend to Render the Code (24:05)


This sets up a live code preview using Sandpack.  
**Note:** Sample code and configuration details were taken from the Sandpack documentation at sandpack.codesandbox.io/docs . Click on Install then npm (may need to add --force if needed due to canary version of React)

```bash
npm install @codesandbox/sandpack-react
npm run dev
```

```tsx
import { sandpack } from "@codesandbox/sandpack-react";
```
- **Interactive Code Preview:** Hassan demonstrates integrating Sandpack to provide a live preview of the generated code.
- **External Resources Configuration:** He explains how to include Tailwind CSS via external resources for proper styling.
- **Template Selection:** He chooses the `react-ts` template and sets options like editor height.
- **Sample Code Source:** The Sandpack integration follows instructions from the Sandpack documentation.

```tsx
// Shared options for Sandpack:
let sharedOptions = {
  externalResources: [
    "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
  ],
};
```

```tsx
// Sandpack component in page.tsx under the form close tag:
  generatedCode && (
    <Sandpack
      template="react-ts"
      files={{
        "/App.tsx": generatedCode,
      }}
    />

```
_NOTE: Awesome, it's working but the code isnt rendered correctly yet. Before jumping into how to fix Sandpack to properly render Tailwind, modify the "system" prompt..._
```tsx
  {role: "system", content: "You are a React and tailwind developer. You will be asked to build an app - ONLY return code for the app.,
```

_NOTE: Awesome, it's working but the code still isnt rendered correctly yet. Before jumping into how to fix Sandpack to properly render Tailwind, modify the "system" prompt to remove the '''jsx..._
```tsx
  {role: "system", content: "You are a React and tailwind developer. You will be asked to build a React component - ONLY return react code for the app. DO NOT return (dash dash dash) jsx or any other text and don't return the package.json. Only return the component,
```
_NOTE: You can play around and also view the github for the real llamacoder_
```tsx
// Sandpack component in page.tsx:
{
  generatedCode && (
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
  );
}
```


---

## 13. Changing the LLM Prompt for Better Code Output (25:30)


_Improve the quality of the AI-generated code._


- **Prompt Engineering:** Hassan discusses refining the system prompt to guide the AI to produce cleaner, more modular React code.
- **Concatenation:** He shows how the system prompt is concatenated with the user’s input before sending the request.
- **Elaboration:** He notes that in the actual codebase, the prompt is more extensive with additional instructions.
- **Sample Code Source:** The idea is based on prompt engineering best practices detailed in Together AI’s documentation.

```tsx
const systemPrompt = `
Please generate clean, efficient, and well-commented React code.
Focus on best practices and ensure the code is modular and maintainable.
`;
```

```tsx
// Use systemPrompt in your Together AI API call:
const response = await together.chat.completions.create({
  model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
  messages: [{ role: "user", content: systemPrompt + prompt }],
  stream: true,
});
```

---

## 14. Fixing the Tailwind Bug in Sandpack using sharedOptions and externalResources (27:25)

_This ensures proper styling in the live preview._

- **Bug Resolution:** Hassan shows how to fix issues where Tailwind CSS might not load correctly in Sandpack.
- **HTML Update:** He includes a script tag in the HTML file to import Tailwind CSS.
- **Shared Options Update:** He also updates the Sandpack shared options to include the external Tailwind stylesheet.
- **Sample Code Source:** These adjustments are based on common troubleshooting steps found in the Sandpack documentation.

```html
<!-- In your /public/index.html file used by Sandpack -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

```tsx
// Ensure shared options in Sandpack include the external resource:
let sharedOptions = {
  externalResources: [
    "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
  ],
};
```


---

## 15. Question #1: Why Use `stream.toReadableStream();`?


_This conversion is essential for real-time data handling by the browser._


- **Technical Explanation:** At this point in the transcript, Hassan explains why converting the stream using `stream.toReadableStream()` is necessary.
- **Browser Compatibility:** He notes that this conversion ensures the browser can correctly handle and display the streamed data.
- **Alternate Method:** Also shows an alternative method using the response body directly.
- **Sample Code Source:** These examples are taken from Together AI’s documentation on streaming responses.

```tsx
// Example conversion (if required):
const readable = stream.toReadableStream();
return new Response(readable, {
  headers: { "Content-Type": "application/json" },
});
```

```tsx
// Alternatively, using the response body directly:
return new Response(response.body, {
  headers: { "Content-Type": "application/json" },
});
```

---

## 16. Common Mistakes


_These tips help avoid common mistakes and improve code quality._

- **New Programmers:** Hassan advises new programmers to always use `e.preventDefault()` and handle asynchronous API calls properly.
- **Intermediate Programmers:** Mixing business logic with UI rendering and stresses careful state management.
- **Expert Programmers:** He emphasizes the importance of prompt engineering and profiling streaming performance.
- **General Advice:** Throughout the session, Hassan reiterates iterative development and thorough testing.
- **Sample Code Source:** These tips are based on common pitfalls discussed in multiple sections of the transcript and are standard best practices in web development.

```tsx
// New Programmers:
// - Always use e.preventDefault() in form submissions.
// - Handle asynchronous API calls using async/await.
```

```tsx
// Intermediate Programmers:
// - Keep business logic separate from UI rendering.
// - Manage state updates carefully to avoid race conditions.
```

```tsx
// Expert Programmers:
// - Optimize the system prompt to improve AI responses.
// - Profile streaming performance when handling large responses.
```


---

## 17. Complete Code Files with Inline Comments

**Note:** Below are the complete code files exactly as provided in the attached files.

- _page.tsx_ contains **68 lines** (including 5 blank lines; **63 non-blank lines**).
- _route.ts_ contains **17 lines** (including 3 blank lines; **14 non-blank lines**).

### page.tsx

```tsx
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
    });
    let runner = ChatCompletionStream.fromReadableStream(res.body!);
    runner.on("content", (delta) => {
      setGeneratedCode((text) => text + delta);
    }); // setAnswer is a function that sets the answer in the UI
  }

  let sharedOptions = {
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
```

### route.ts

```tsx
import Together from "together-ai"; // Section 9: Import API

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY! });

export async function POST(req: Request) {
  const { prompt } = await req.json(); // Section 5: Parse JSON input

  const response = await together.chat.completions.create({
    model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo", // Section 9: Uses best AI model
    messages: [{ role: "user", content: prompt }],
    stream: true,
  });

  return new Response(response.body, {
    headers: { "Content-Type": "application/json" },
  }); // Section 15: Enables streaming response
}
```

---

## 18. Debugging & Feedback



- **Version Control Reminder:** Hassan advises using Git to save versions of your work and prevent loss of sections.
- **Mapping Comments:** He stresses that each code snippet’s inline comments help trace its function.
- **Documentation Cross-Reference:** He recommends referring to Together AI and Sandpack documentation for further clarification on the code.
- **Troubleshooting Tips:** Emphasizes checking console logs, verifying API responses, and testing UI updates.
- **Sample Code Sources:** References are made to Together AI documentation and Sandpack documentation throughout the session.

- **Preserving Sections:**  
  Work on a copy of your Markdown file and use version control (e.g., Git) to track changes and recover any lost sections.

- **Inline Comments & Cross-References:**  
  Each code snippet now maps to a specific guide section, making it easier to trace and debug the functionality.

- **External Documentation:**

  - The `useState` import in Section 4 and the `ChatCompletionStream` import in Section 7 are essential for state management and streaming responses.
  - For streaming responses and `runner.on` implementation, refer to the Together AI developer documentation.
  - Sandpack documentation is available [here](https://sandpack.codesandbox.io/docs) for further details on templates and options.

- **Common Pitfalls:**  
  Review Section 16 for common mistakes at different experience levels and strategies to avoid them.

---

_End of Guide._

