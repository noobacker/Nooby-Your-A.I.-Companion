import { render } from 'preact'
import { createRoot } from "react-dom/client";
import '@/assets/styles/base.scss'
import { getUserConfig } from '@/config'
import ChatGPTTip from '@/content-script/compenents/ChatGPTTip'
import { config } from '@/content-script/search-engine-configs'
import Browser from 'webextension-polyfill'
// import PageSummary from '@/content-script/compenents/PageSummary'
import mount from '@/content-script/compenents/Mount'
import getQuestion from './compenents/GetQuestion'
import { siteConfig as sietConfigFn } from './utils'
import '@/content-script/styles.scss'
import MainPopup from './compenents/popup/PopupBox'
import register from 'preact-custom-element';

//twind 
import { twind, cssom, observe, install } from "@twind/core";
import "construct-style-sheets-polyfill";
import Tconfig from "./twind.config";

const siteConfig = sietConfigFn()

async function Run() {

  let container = document.createElement("nooby-component");
  container.id = "nooby-chatterino";
  container.style.lineHeight="18px";
  container.classList.add("nooby-container");
  const shadowRooto : ShadowRoot = container.attachShadow({ mode: "open" })
  shadowRooto.innerHTML = 
  `
  <div id="react-app-root"></div>
  `
  const domElement = document.querySelector("head");
  domElement!.before(container);

  // shadow DOM as react root
  const root = createRoot(shadowRooto.querySelector("#react-app-root")!);
  root.render(<MainPopup />);

  //SHADOW DOM TAILWIND
  const sheet = cssom(new CSSStyleSheet());
  const tw = twind(Tconfig, sheet);
  const shadowRoot : any = document.querySelector(".nooby-container")!.shadowRoot;

  var css2 = new CSSStyleSheet()
  css2.replaceSync
  (`

.group:hover .group-hover\:block {
    display: block;
}
.hover\:w-64:hover {
    width: 45%;
}

.option-message {
    @apply hidden group-hover:block flex flex-shrink-0 focus:outline-none mx-2 block rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-700 bg-gray-800 w-8 h-8 p-2
}

#react-app-root {
    font-family: "Open Sans", sans-serif;
}

*::-webkit-scrollbar {
  width: 7px;
}

*::-webkit-scrollbar-track {
  background: #ffffff1e;
  border-radius: 10px;
}

*::-webkit-scrollbar-thumb {
  background-color: #0000007a;
  border-radius:20px;
}

.gradient-box-a {
    display: flex;
    align-items: center;
    width: 70%;
    margin: auto;
    position: relative;
    box-sizing: border-box;
    color: #FFF;
    background: #000;
    background-clip: padding-box;
    border: solid 5px transparent;
    border-radius: 1em;
}
.gradient-box-b {
    display: flex;
    align-items: center;
    width: 70%;
    margin: auto;
    position: relative;
    box-sizing: border-box;
    color: #FFF;
    background: #000;
    background-clip: padding-box;
    border: solid 5px transparent;
    border-radius: 1em;
}
.gradient-box-c {
    display: flex;
    align-items: center;
    width: 70%;
    margin: auto;
    position: relative;
    box-sizing: border-box;
    color: #FFF;
    background: #000;
    background-clip: padding-box;
    border: solid 5px transparent;
    border-radius: 1em;
}
.gradient-box-a:before {
content: '';
position: absolute;
top: 0;
right: 0;
bottom: 0;
left: 0;
z-index: -1;
margin: -2.5px;
border-radius: inherit;
background: linear-gradient(to right, rgba(135, 255, 173, 1), rgba(84, 244, 44, 1));
}
.gradient-box-b:before {
content: '';
position: absolute;
top: 0;
right: 0;
bottom: 0;
left: 0;
z-index: -1;
margin: -2.5px;
border-radius: inherit;
background: linear-gradient(to right, rgb(239, 135, 255 , 1), rgb(44, 231, 244 , 1));
}
.gradient-box-c:before {
content: '';
position: absolute;
top: 0;
right: 0;
bottom: 0;
left: 0;
z-index: -1;
margin: -2.5px;
border-radius: inherit;
background: linear-gradient(to right, rgb(228 189 22), rgb(44, 231, 244 , 1));
}

`)
  shadowRoot.adoptedStyleSheets = [sheet.target, css2] 
  observe(tw, shadowRoot);
  

  const questionData = await getQuestion()
  if (questionData) {
    mount(questionData)
  }


  Browser.runtime.onMessage.addListener((message , _ , sendResponse) => {
    const { type, data } = message
    switch (type) {
      case 'CHATGPT_TAB_CURRENT': {
        const container = document.createElement('section')
        container.className = 'nooby--chatgpt--tips'
        container.id = 'nooby--chatgpt--tips'
        document.body.prepend(container)
        render(<ChatGPTTip isLogin={data.isLogin} />, container)
        break
      }
      case 'GET_DOM': {
        sendResponse({ html: document.querySelector('html')?.outerHTML })
        break
      }
    }
  }) 
}

Run()

if (siteConfig?.watchRouteChange) {
  siteConfig.watchRouteChange(Run)
}
