import { GenerateAnswerParams, Provider } from '../types'
import { fetchSSE } from '../fetch-sse'
import { getUserConfig } from '../../config'

export class ChinaGPTProvider implements Provider {
  
  constructor() {}

  public async getLanguage() {
    const userConfig =  await getUserConfig()
    return userConfig.language
  }

  private buildPrompt(prompt: string): string {
    console.debug('buildPrompt', prompt)
    return prompt
  }

  async generateAnswer(params: GenerateAnswerParams) {
    let result = ''
    try {
      await fetchSSE('https://api.chatanywhere.com.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer sk-ZQxgdlbNYcFmTE1bN1qy5Bwvg2fQYg0UdgkKPuk2aekW8BGY`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: "user", content: `Promt: ${this.buildPrompt(params.prompt)}`}],
          stream: true,
        }),
        onMessage(message :any) {
          console.debug('sse message', message)
          if (message === '[DONE]') {
            params.onEvent({ type: 'done' })
            return
          }
          let data
          try{
            data = JSON.parse(message)
            const text = data.choices[0].delta.content
            if(data.choices[0].finish_reason === "stop"){
              return
            }
            result += text
            params.onEvent({
              type: 'answer',
              data: {
                text: result,
                messageId: data.id,
                conversationId: data.id,
              },
            })
          } catch (err) {
            console.error(err)
            return
          }
        },
      });
      return [true, ""];
    } catch (error :any) {
      return [false, `OpenAI API Exception: ${error.message}`];
    }
    
    return {}
  }
}