import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

async function callOpenAIChatModel(prompt: string): Promise<string> {
	const messages = [
		new SystemMessage(
			'You are a friendly AI called Qin, you are my personal assistant to help me out with daily tasks'
		),
		new HumanMessage(prompt),
	];
	const llm = new ChatOpenAI({ apiKey: process.env.OPENAI_API_KEY });

	try {
		const response = await llm.invoke(messages);

		return typeof response.content === 'string'
			? response.content
			: 'Non-text response';
	} catch (error) {
		console.error('Error calling OpenAI API:', error);
		throw new Error('Failed to call OpenAI API');
	}
}

// Example usage
callOpenAIChatModel('Hello, what is your name?')
	.then((response) => console.log('OpenAI Response:', response))
	.catch((error) => console.error('Error:', error));
