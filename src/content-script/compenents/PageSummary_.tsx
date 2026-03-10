import { useState, useCallback, useEffect } from 'preact/hooks'
import classNames from 'classnames'
import { XCircleFillIcon } from '@primer/octicons-react'
import Browser from 'webextension-polyfill'
import ChatGPTQuery from '@/content-script/compenents/ChatGPTQuery'
import { getUserConfig, Language, getProviderConfigs } from '@/config'
import { getSummaryPrompt } from '@/content-script/prompt'
import { isIOS } from '@/utils/utils'
import { getPageSummaryContntent, getPageSummaryComments } from '@/content-script/utils'
import { commentSummaryPrompt, pageSummaryPrompt, pageSummaryPromptHighlight } from '@/utils/prompt'

interface Props {
  pageSummaryEnable: boolean
  pageSummaryWhitelist: string
  pageSummaryBlacklist: string
  siteRegex: RegExp
}

function PageSummary(props: Props) {

  const { pageSummaryEnable, pageSummaryWhitelist, pageSummaryBlacklist, siteRegex } = props
  const [showCard, setShowCard] = useState(false)
  const [supportSummary, setSupportSummary] = useState(true)
  const [question, setQuestion] = useState('')

  const onSwitch = useCallback(() => {
    setShowCard((state) => {
      const cardState = !state

      if (cardState) {
        setQuestion('')
      }

      return cardState
    })
  }, [])


  const onSummary = useCallback(async () => {

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

    setSupportSummary(false)
  }, [])

  useEffect(() => {
    Browser.runtime.onMessage.addListener((message) => {
      const { type } = message
      if (type === 'OPEN_WEB_SUMMARY') {
        if (showCard) {
          return
        }

        setQuestion('')
        setShowCard(true)
      }
    })
  }, [showCard])

  useEffect(() => {
    const hostname = location.hostname
    const blacklist = pageSummaryBlacklist.replace(/[\s\r\n]+/g, '')
    const whitelist = pageSummaryWhitelist.replace(/[\s\r\n]+/g, '')

    const inWhitelist = !whitelist
      ? !blacklist.includes(hostname)
      : !blacklist.includes(hostname) && pageSummaryWhitelist.includes(hostname)

    const show =
      pageSummaryEnable && ((isIOS && inWhitelist) || (inWhitelist && !siteRegex?.test(hostname)))

  }, [pageSummaryBlacklist, pageSummaryEnable, pageSummaryWhitelist, siteRegex])

  return (
    <>
      {
      showCard &&
        <div className="nooby--card">
          <div className="nooby--card__head ">

            <div className="nooby--card__head--action">
              <button
                className={classNames('nooby--btn', 'nooby--btn__icon')}
                onClick={onSwitch}
              >
                <XCircleFillIcon />
              </button>
            </div>


          </div>

          <div className="nooby--card__content">
            {question ? (
              <div className="nooby--container">
                <div className="nooby--chatgpt">
                  <ChatGPTQuery question={question} />
                </div>
              </div>
            ) : (
              <div className="nooby--card__empty ">
                {!supportSummary ? (
                  'Sorry, the summary of this page is not supported.'
                ) : (
                  <button
                    className={classNames(
                      'nooby--btn',
                      'nooby--btn__primary',
                      'nooby--btn__block',
                    )}
                    onClick={onSummary}
                  >
                    Summary
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      }
    </>
  )
}

export default PageSummary


  // const openOptionsPage = useCallback(() => {
  //   Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  // }, [])