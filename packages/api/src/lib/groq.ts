import { env } from "@traveler-app/env/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL ?? "openai/gpt-oss-120b";

export async function callGroq(prompt: string): Promise<string> {
	try {
		const res = await fetch(GROQ_URL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${env.GROQ_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: MODEL,
				messages: [{ role: "user", content: prompt }],
				response_format: { type: "json_object" },
				temperature: 0.7,
			}),
		});

		if (!res.ok) {
			throw new Error(`Groq failed: ${res.status} ${await res.text()}`);
		}

		const json = (await res.json()) as {
			choices: { message: { content: string } }[];
		};

		const content = json.choices[0]?.message.content;
		if (!content) throw new Error("Groq returned no content");

		return content;
	} catch (err) {
		console.warn(`   failed: ${err}`);
	}
	throw new Error("Prompt failed");
}
