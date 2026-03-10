import { getPageSummaryContntent, getPageSummaryComments } from '@/content-script/utils'
import { commentSummaryPrompt, pageSummaryPrompt, pageSummaryPromptHighlight } from '@/utils/prompt'
import { getUserConfig, Language, getProviderConfigs } from '@/config'
import { getSummaryPrompt } from '@/content-script/prompt'
import { GeminiProvider } from './chatgemini'


const gemi = new GeminiProvider()

export async function getChatSummary() {
  const prompt = await getPromt()
  if (prompt == "No prompt available.") return prompt
  return await gemi.rawGenerateAnswer(prompt)
}

export async function getPromt() {

    const pageComments = await getPageSummaryComments()
    const pageContent = await getPageSummaryContntent()
    const article = pageComments ? pageComments : pageContent

    const title = article?.title || document.title || ''
    const description =
      article?.description ||
      document.querySelector('meta[name="description"]')?.getAttribute('content') ||
      ''
    const content = article?.content ? description + article?.content : title + description

    if (article?.content || description) {
      const language = window.navigator.language
      const userConfig = await getUserConfig()
      const providerConfigs = await getProviderConfigs()

      const promptContent = getSummaryPrompt(
        content.replace(/(<[^>]+>|\{[^}]+\})/g, ''),
        providerConfigs.provider,
      )
      const replyLanguage = userConfig.language === Language.Auto ? language : userConfig.language

      const prompt = pageComments?.content
        ? commentSummaryPrompt({
            content: promptContent,
            language: replyLanguage,
            prompt: userConfig.promptComment
              ? userConfig.promptComment
              : pageSummaryPromptHighlight,
            rate: article?.['rate'],
          })
        : pageSummaryPrompt({
            content: promptContent,
            language: replyLanguage,
            prompt: userConfig.promptPage ? userConfig.promptPage : pageSummaryPromptHighlight,
          })

      return prompt
    }
    return "No Summary Available For this Page."
}