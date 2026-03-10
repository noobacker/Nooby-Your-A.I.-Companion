import React, { useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import nooby from '../../../../assets/img/logo.png';
import rehypeHighlight from 'rehype-highlight';
import robo from './asset/images/robo.svg';
import web from './asset/images/web.svg';
import pdf from './asset/images/pdf.svg';
import Dropzone from './dragZone';
import { getChatSummary  } from '../../../../background/providers/chatsummary';
import { uploadToPdfDoc } from '../../../../background/providers/chatgptdocs';
//import { uploadToPdfDoc , chatToPdfDoc } from '../providers/chatgptdocs';
//import { getChatSummary } from '../providers/chatsummary';

const ChatBody = (
    { 
        curWindow , 
        setCurWindow ,  
        pdfmessages ,
        setPdfmessages ,
        cbotmessages ,
        setCbotmessages ,
        wsummessages ,
        setWsumessages ,
    }) => {
    const chatBodyRef = useRef(null);

    const [wsumloading , setWsumloading] = React.useState(false)

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [pdfmessages , cbotmessages , wsummessages]);

    async function onUpload (files) {
        try {
            console.log("File" , {files})
            const sid = await uploadToPdfDoc(files[0])
            localStorage.setItem('mypdf_nooby', JSON.stringify({ file : files[0].name , sid }));
                        
            setPdfmessages([
                ...pdfmessages,
                {
                    sender: 'user',
                    message: files[0].name + 'File Uploaded Successfully!!'
                },
                {
                    sender: 'assistant',
                    message: 'Ask me anything about the document!!'
                }
            ]);

            setCurWindow('pdfDocs')
        } catch (error) {
            console.log(error)

        }
    }

    async function wsumHandler () {
        try {
            setWsumloading(true)
            setWsumessages(prevMessages => [...prevMessages, {
                sender: 'user',
                message: 'Yes'
            }])
            const summary = await getChatSummary()
            setWsumessages(prevMessages => [...prevMessages, 
                {
                    sender: 'assistant',
                    message: summary
            }])
            setCurWindow('webSum')
        } catch (error) {
            console.log(error)
        } finally {
            setWsumloading(false)
        }
    }

    function newWindow() {
        setCurWindow('main')
    }

    return (
        <>
            <div className="p-5 flex-1 overflow-y-scroll overflow-x-hidden" ref={chatBodyRef}>

                {curWindow === 'main' && (
                    <div className='flex justify-center items-center w-full h-full'>
                        <div className='flex flex-col gap-5 w-full '>

                            <button onClick={() => setCurWindow('chatBot')} className="flex flex-col mx-auto 
                            hover:bg-[#100d0f] w-[80%] h-[80px] gradient-box-a last:flex justify-center items-center
                             text-center text-xl hover:text-white duration-200 ease-in-out transition-all">


                                <div className='flex flex-row justify-center items-center w-full'>

                                    <div className=' w-[30%] flex justify-center items-center '>

                                        <img src={robo} alt='robo' className='w-[60%] h-[60%]' />

                                    </div>
                                    <div className='w-[70%]'>
                                        <p>Chat Bots</p>
                                        <p className='text-sm text-gray-500'>Chatbots at your fingertip!! </p>
                                    </div>
                                </div>


                            </button>


                            <button onClick={() => setCurWindow('pdfDocs')} className="flex flex-col mx-auto hover:bg-[#100d0f]
                             w-[80%] h-[80px] gradient-box-b last:flex justify-center items-center text-center text-xl 
                             hover:text-white duration-200 ease-in-out transition-all">
                                <div className=' flex flex-row justify-center items-center w-full'>

                                    <div className='w-[30%] flex justify-center items-center '>

                                        <img src={pdf} alt='pdf' className='w-[60%] h-[60%]' />

                                    </div>

                                    <div className='w-[70%]'>
                                        <p>Chat with Document</p>
                                        <p className='text-sm text-gray-500'>Pdf, Txt, Docs </p>
                                    </div>
                                </div>
                            </button>


                            <button onClick={() => setCurWindow('webSum')} className='flex flex-col mx-auto hover:bg-[#100d0f] w-[80%]
                             h-[80px] gradient-box-c justify-center items-center text-center text-xl hover:text-white duration-200 
                             ease-in-out transition-all'>

                                <div className='flex flex-row justify-center items-center w-full'>

                                    <div className='w-[30%] flex justify-center items-center '>

                                        <img src={web} alt='web' className='w-[60%] h-[60%]' />

                                    </div>
                                    <div className='w-[70%]'>
                                        <p>Chat with Webpage</p>
                                        <p className='text-sm text-gray-500'>Summarize this web page </p>
                                    </div>
                                </div>


                            </button>
                        </div>
                    </div>
                )}

                { curWindow === 'pdfDocs' && (
                        localStorage.getItem('mypdf_nooby') !== null ? 
                        pdfmessages?.map((content, idx) => (
                            <MemoizedMarkdown key={idx} content={content} />
                        ))
                        :
                        <div className='flex justify-center items-center w-full h-full'>
                            <Dropzone 
                                onUpload={onUpload}
                            />
                        </div>
                )}

                {curWindow === 'webSum' && 
                    <>
                        {wsummessages?.map((content, idx) => (
                            <MemoizedMarkdown key={idx} content={content} />
                        ))}
                        {!wsumloading && wsummessages[wsummessages.length - 1].message === 'Should we summarize this page ?' && 
                            <div className='flex flex-row gap-2 mt-5 m-2 w-full justify-center'>
                                <button onClick={() => {wsumHandler()}} className="flex justify-center 
                                items-center  w-[100px] bg-[#101010] 
                                hover:bg-[#5e5e5e40] hover:scale-105 hover:text-[#ffffff] 
                                border border-white duration-200 ease-in-out transition-all 
                                rounded-lg p-1 cursor-pointer">
                                    Yes
                                </button>     
                            </div>
                        }
                    </>
                }



                { curWindow === 'chatBot' && cbotmessages?.map((content, idx) => (
                    <MemoizedMarkdown key={idx} content={content} />
                ))}

            </div>

            {
            curWindow !== 'main' &&
                <div className='m-2'>
                    <button onClick={newWindow} 
                    className="flex justify-center items-center mx-auto w-[100px] 
                    bg-[#101010] hover:bg-[#5e5e5e40] hover:scale-105 hover:text-[#ffffff] 
                    border border-white duration-200 ease-in-out transition-all rounded-lg p-1 cursor-pointer">
                        Back
                    </button>
                </div>
            }
        </>

    );
};

const MemoizedMarkdown = ({ content }) => {
    return useMemo(() => {
        return <div className={`m-3 flex flex-row ${content.sender !== 'user' ? 'justify-start' : 'justify-end'}`}>
            {content.sender !== 'user' && (
                <div className="w-8 h-8 relative flex flex-shrink-0 mr-4">
                    <img
                        className="shadow-md rounded-full w-full h-full object-cover"
                        src={nooby}
                        alt=""
                    />
                </div>
            )}
            <div className="w-full rounded-md overflow-y-auto messages text-sm text-gray-700 grid grid-flow-row gap-2">
                <div className={`flex items-center group ${content.sender !== 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`px-3 py-2 border border-white rounded-lg bg-[#060304] max-w-xs lg:max-w-md text-gray-200`}>
                        <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>{content.message}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>;
    }, [content]);
};

export default ChatBody;
