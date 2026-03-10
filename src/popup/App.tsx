import logo from '@/assets/img/logo.png'
import '@/assets/styles/base.scss'
import { APP_TITLE } from '@/config'
import { useCallback, useState } from 'react'
import useSWR from 'swr'
import Browser from 'webextension-polyfill'
import './styles.scss'

const isChrome = /chrome/i.test(navigator.userAgent)

function App() {
  const [question, setQuestion] = useState('')

  const accessTokenQuery = useSWR(
    'accessToken',
    () => Browser.runtime.sendMessage({ type: 'GET_ACCESS_TOKEN' }),
    { shouldRetryOnError: false },
  )
  const hideShortcutsTipQuery = useSWR('hideShortcutsTip', async () => {
    const { hideShortcutsTip } = await Browser.storage.local.get('hideShortcutsTip')
    return !!hideShortcutsTip
  })

  const openOptionsPage = useCallback(() => {
    Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }, [])

  const openShortcutsPage = useCallback(() => {
    Browser.storage.local.set({ hideShortcutsTip: true })
    Browser.tabs.create({ url: 'chrome://extensions/shortcuts' })
  }, [])

  return (
    <div className="nooby--flex nooby--flex-col nooby--h-full nooby--popup">
      <div className="nooby--mb-1 nooby--flex nooby--flex-row nooby--items-center nooby--px-1">
        <img src={logo} className="nooby--w-5 nooby--h-5 nooby--rounded-sm" />
        <p className="nooby--text-sm nooby--font-semibold nooby--m-0 nooby--ml-1">
          {APP_TITLE}
        </p>
      </div>
      {isChrome && !hideShortcutsTipQuery.isLoading && !hideShortcutsTipQuery.data && (
        <p className="nooby--m-0 nooby--mb-1">
          Tip:{' '}
          <a onClick={openShortcutsPage} className="nooby--underline nooby--cursor-pointer">
            setup shortcuts
          </a>{' '}
          for faster access.
        </p>
      )}
    </div>
  )
}

export default App
