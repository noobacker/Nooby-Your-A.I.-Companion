import { getExtensionVersion, AppName } from '@/utils/utils'
import logo from '@/assets/img/logo.png'

function Header() {
  return (
    <>
      <nav className="nooby--flex nooby--flex-row nooby--justify-between nooby--items-center nooby--mt-5 nooby--px-2">
        <div className="nooby--flex nooby--flex-row nooby--items-center nooby--gap-2">
          <a href="https://nooby.app/" target="_blank" rel="noreferrer">
            <img
              src={logo}
              width={40}
              className="nooby--w-10 nooby--h-10 nooby--rounded-lg"
              style={{ 'vertical-align': 'middle' }}
            />
            <span className="font-semibold">
              {AppName} (v
              {getExtensionVersion()})
            </span>{' '}
          </a>
        </div>
      </nav>
    </>
  )
}

export default Header
