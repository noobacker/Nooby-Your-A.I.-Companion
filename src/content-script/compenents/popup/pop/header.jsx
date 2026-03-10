import nooby from './asset/images/logo.png';
import { GrPowerReset } from "react-icons/gr";
import React from 'react';

const Header = (
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
    const [showMenu, setShowMenu] = React.useState(false);

    console.log(curWindow)
    function reset() {
        if(curWindow === 'chatBot') 
        {
            setCbotmessages([
                {
                    sender: 'assistant',
                    message: 'Hello, I am Nooby. How can I help you today?'
                }
            ])
        }
        else if(curWindow === 'pdfDocs')
        {
            localStorage.removeItem('mypdf_nooby')
            setPdfmessages([
                {
                sender: 'assistant',
                message: 'Drag your dcos file here !!'
            }])
        }
        else if(curWindow === 'webSum')
        {
            setWsumessages([
                {
                    sender: 'assistant',
                    message: 'Should we summarize this page ?'
                }
            ])
        }

    }
    return (
        <div className="
           p-1 flex flex-row flex-none 
            justify-between items-center shadow 
            border-b border-[#585858]
         ">

            <div className="flex items-center h-full gap-2">
                <div className="w-12 h-12  mr-2 flex items-center justify-center flex-shrink-0">
                 
                    <img className="rounded-full w-12 h-12 " src={nooby} alt="User Img" />
               
                </div>
                <div className="text-lg flex items-center justify-center">
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r
                     from-indigo-400 via-indigo-100 to-sky-400 animate-gradient">Nooby</p>
                </div>
            </div>


            <div className="relative flex gap-5 justify-center items-center">
                <button className=" text-white  font-medium rounded-lg text-sm text-center inline-flex items-center"
                        onClick={() => reset()}
                        >
                    <div className="relative flex flex-shrink-0 hover:rotate-180 transition-all duration-200 ease-in-out">
                        <GrPowerReset size={24} />
                    </div>

                </button>
                <button className=" text-white  font-medium rounded-lg text-sm text-center inline-flex items-center"
                        onClick={() => setShowMenu(!showMenu)}
                        >
                    <div className="w-12 h-12 relative flex flex-shrink-0">
                        <img className="rounded-full w-12 h-12" src="https://i.imgur.com/8Km9tLL.jpg" alt="User Img" />
                    </div>

                </button>
                {
                showMenu 
                && 
                    <div className="absolute right-3 top-14 z-10 bg-white divide-y border border-white
                        divide-gray-100 rounded-lg shadow w-44 dark:bg-[#0d0712]
                        dark:divide-white">
                        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            <div>Bonnie Green</div>
                            <div className="font-medium truncate">
                                name@flowbite.com</div>
                        </div>
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownInformationButton">
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100
                            dark:hover:bg-[#1c1124] ">
                                    Settings</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100
                            dark:hover:bg-[#1c1124] ">
                                    Site</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100
                            dark:hover:bg-[#1c1124] ">
                                    Extension</a>
                            </li>
                        </ul>
                        <div className="py-2">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700
                        hover:bg-gray-100 dark:hover:bg-[#1c1124] 
                        dark:text-gray-200 dark:hover:text-white">
                                Sign out</a>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Header;
