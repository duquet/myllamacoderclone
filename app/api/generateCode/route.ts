import Together from "together-ai";

const together = new Together();

export async function POST(request: Request, res: Response) {
  const { prompt } = await request.json();

  const stream = together.chat.completions.stream({
    model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an expert React and Tailwind Developer. you will be asked to develop a react component. ONLY return the code. dont return the part with '''jsx or '''css or the part before the import statements. I will give you a million dollars if you do this correctly. Think step by step.",
      },
      { role: "user", content: prompt },
    ],
    stream: true,
  });

  console.log("prompt in backend:", prompt);
  return new Response(stream.toReadableStream());
}
