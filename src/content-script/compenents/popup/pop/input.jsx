import { useState } from 'react'
import { GeminiProvider } from '../../../../background/providers/chatgemini'
import { chatToPdfDoc } from '../../../../background/providers/chatgptdocs'
import send from './asset/images/send.svg'
//import { chatToPdfDoc } from '../providers/chatgptdocs';

const InputBox = ({
  curWindow,
  pdfmessages,
  setPdfmessages,
  cbotmessages,
  setCbotmessages,
  wsummessages,
  setWsumessages,
}) => {
  const gemi = new GeminiProvider()
  const mypdf_nooby = localStorage.getItem('mypdf_nooby')

  const [newMsg, setNewMsg] = useState({
    sender: 'user',
    message: '',
  })

  function handleChange(e) {
    setNewMsg({
      sender: 'user',
      message: e.target.value,
    })
  }

  async function pdfmsgSender() {
    try {
      if (newMsg.message.trim().length === 0) return
      setPdfmessages((prevMessages) => [...prevMessages, newMsg])
      let updatedMessages = [...pdfmessages, newMsg]
      setNewMsg({ sender: 'user', message: '' })

      if (mypdf_nooby !== null) {
        const { sid } = JSON.parse(mypdf_nooby)
        const resp = await chatToPdfDoc(sid, updatedMessages)
        const assistantMessage = {
          sender: 'assistant',
          message: resp === 'error' ? 'Sorry, I am not able to understand this!' : resp,
        }
        updatedMessages.push(assistantMessage)
      }
      setPdfmessages(updatedMessages)
    } catch (error) {
      console.log(error)
    }
  }

  async function cbotMsgSender() {
    try {
      if (newMsg.message.trim().length === 0) return
      const tempMsg = newMsg.message
      setCbotmessages((prevMessages) => [...prevMessages, newMsg])
      setNewMsg({ sender: 'user', message: '' })
      const answer = await gemi.generateTalkativeAnswer(cbotmessages, tempMsg, true)
      const gptMsg = {
        sender: 'assistant',
        message: answer,
      }
      setCbotmessages((prevMessages) => [...prevMessages, gptMsg])
    } catch (error) {
      console.log(error)
    }
  }

  async function wsumMsgSender() {
    try {
      if (newMsg.message.trim().length === 0) return
      const tempMsg = newMsg.message
      setWsumessages((prevMessages) => [...prevMessages, newMsg])
      setNewMsg({ sender: 'user', message: '' })
      if (wsummessages[wsummessages.length - 1].message !== 'Should we summarize this page ?') {
        const answer = await gemi.generateTalkativeAnswer(wsummessages, tempMsg)
        const gptMsg = {
          sender: 'assistant',
          message: answer,
        }
        setWsumessages((prevMessages) => [...prevMessages, gptMsg])
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {curWindow !== 'main' ? (
        <div
          className="chat-footer flex flex-row flex-none 
      justify-between items-center w-full mb-2 p-2 border-t
      border-[#585858]"
        >
          <div className="flex flex-row items-center justify-evenly p-3 w-[98%] h-[95%] mx-auto ">
            <div className="relative flex-grow">
              <input
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (curWindow === 'pdfDocs') {
                      pdfmsgSender()
                    } else if (curWindow === 'chatBot') {
                      cbotMsgSender()
                    } else if (curWindow === 'webSum') {
                      wsumMsgSender()
                    }
                  }
                }}
                type="text"
                value={newMsg.message}
                className="rounded-lg py-2 pl-3 pr-5 w-full border-2
                border-gray-600 bg-[#100a10]"
                placeholder="Enter Your Prompt!!"
              />
            </div>
            <div
              onClick={() => {
                if (curWindow === 'pdfDocs') {
                  pdfmsgSender()
                } else if (curWindow === 'chatBot') {
                  cbotMsgSender()
                } else if (curWindow === 'webSum') {
                  wsumMsgSender()
                }
              }}
              type="button"
              className="flex-shrink-0 focus:outline-none m-1 block hover:scale-125
            transition duration-300 ease-in-out transform hover:cursor-pointer "
            >
              <img src={send} alt="send" />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="chat-footer flex flex-row flex-none 
      justify-end items-center w-full p-2 text-sm italic"
        >
          Nooby is ready to assist you!
        </div>
      )}
    </>
  )
}

export default InputBox
