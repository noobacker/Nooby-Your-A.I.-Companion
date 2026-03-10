import { GenerateAnswerParams, Provider } from '../types'
import { getUserConfig } from '../../config'
import { GoogleGenerativeAI } from "@google/generative-ai";
import Scrapper from './scrapper';

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


export class GeminiProvider implements Provider {
  model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
  constructor() {}

  public async getLanguage() {
    const userConfig =  await getUserConfig()
    return userConfig.language
  }

  async rawGenerateAnswer(prompt: string) {
    const result = await this.model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text
  }

  async promtBuilderForScraping(history , prompt) {
    const scraper = new Scrapper()
    const prom = `
    Convert this is one line(dont write any code) - ` + 
    history.filter((item) => item.sender === 'user').
    map((item) => item.message).join(" ") + " " + prompt
    const result = await this.model.generateContent(prom);
    const response = result.response;
    const text = response.text();
    console.log(text)
    return text
  } 

  async generateTalkativeAnswer(history , prompt , scraping=false) {
    let prom = prompt

    if (scraping) {
      const scraper = new Scrapper()
      const scrapeProm = await this.promtBuilderForScraping(history , prompt);
      const scraped = await scraper.scrateData(scrapeProm)
      prom =  scraped + "\n[Previos Chats for context] : " + JSON.stringify(history)
    } else {
      prom = "PROMPT - " + prompt + "\n[Previos Chats for context] : " + JSON.stringify(history)
    }
    console.log(prom)
    const result = await this.model.generateContent(prom);
    const response = result.response;
    const text = response.text();
    
    return text
  }

  async generateAnswer(params: GenerateAnswerParams) {
    // For text-only input, use the gemini-pro model
    const result = await this.model.generateContentStream(params.prompt);

    let text = '';

    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText

        params.onEvent({
            type: 'answer',
            data: {
            text: text,
            messageId: chunk.candidates![0].index.toString(),
            conversationId: '413431'
            },
        })

    }

    params.onEvent({ type: 'done' })

    return {}
  }


}