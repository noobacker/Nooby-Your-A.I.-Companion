import { useState, useEffect,} from "react"
import Browser from 'webextension-polyfill'
import {CheckUser } from '../../../background/supabase/Auth'
import Header from './pop/header'
import ChatBody from './pop/chatbody'
import InputBox from './pop/input'

function MainPopup() {

const mypdf_nooby = localStorage.getItem('mypdf_nooby')
const [cur_url, setCur_url] = useState(window.location.href)
const [login, setLogin] = useState(false)
const [loading, setLoading] = useState(false)
const [showCard, setShowCard] = useState(false)
const [curWindow , setCurWindow] = useState('main');

// async function checkLogin() {
//   await CheckUser() ? setLogin(true) : setLogin(false)
// }

// useEffect(() => {
//   checkLogin()
// }, [])

const [pdfmessages, setPdfmessages] = useState([{
  sender: "assistant",
  message: mypdf_nooby !== null ? "You are chatting with " + JSON.parse(mypdf_nooby).file : "Drag your dcos file here !!",
},]
);

const [cbotmessages, setCbotmessages] = useState([{
sender: "assistant",
message: "Hello, I am Nooby. How can I help you today?",
},]
);

const [wsummessages, setWsumessages] = useState([{
sender: "assistant",
message: "Should we summarize this page ?",
},]
);



Browser.runtime.onMessage.addListener((message) => {
  const { type, data } = message
  switch (type) {
    case 'OPEN_WEB_SUMMARY': {
      if(showCard) {
        setShowCard(false)
      }
      else {
        setShowCard(true)
      }
    }
  }
}) 

return (
showCard &&
<div >
  <div 
  style={{
    "fontFamily" : "Open Sans, sans-serif",
  }}
  className=" z-[2147483647] fixed w-[33rem] h-[98vh] rounded-xl 
      top-[6px] right-[1px] bg-[#0f0913] border-l 
      border-[#585858] flex flex-col text-white text-lg"
  >
    <Header 
      curWindow={curWindow}
      setCurWindow={setCurWindow} 
      pdfmessages={pdfmessages}
      setPdfmessages={setPdfmessages}
      cbotmessages={cbotmessages}
      setCbotmessages={setCbotmessages}
      wsummessages={wsummessages}
      setWsumessages={setWsumessages}
    />
    <ChatBody 

      curWindow={curWindow} 
      setCurWindow={setCurWindow} 
      pdfmessages={pdfmessages}
      setPdfmessages={setPdfmessages}
      cbotmessages={cbotmessages}
      setCbotmessages={setCbotmessages}
      wsummessages={wsummessages}
      setWsumessages={setWsumessages}
    />
    <InputBox 
      curWindow={curWindow} 
      pdfmessages={pdfmessages}
      setPdfmessages={setPdfmessages}
      cbotmessages={cbotmessages}
      setCbotmessages={setCbotmessages}
      wsummessages={wsummessages}
      setWsumessages={setWsumessages}
    />
  </div>
</div>
);




}

export default MainPopup