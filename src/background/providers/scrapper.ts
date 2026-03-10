import { getUserConfig } from '@/config'
import axios from 'axios'


class Scrapper {

  async scrateData(question) {
    try {
    const userConfig = await getUserConfig()
    const googleResult = await this.getGoogleSearchResult(question)
    const res = `
      You are Nooby , Talk with user
      Use Language : ${userConfig.language}
      This Data May Help You : ${googleResult}
      
      ${question}
      
      Directly Write Answer Below
`
    return res
    } catch (e) {
      return question
    }
  }

  async getGoogleSearchResult(question: any) {
    try {

      const encodedString = encodeURI(question); 
      const AXIOS_OPTIONS = {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
        },                                                  // adding the User-Agent header as one way to prevent the request from being blocked
        params: {
            q: encodedString,                               // our encoded search string        
            tbm: "nws",                                     // parameter defines the type of search you want to do ("nws" means news)
            hl: 'en',                                       // Parameter defines the language to use for the Google search
            gl: 'us'                                        // parameter defines the country to use for the Google search
        },
    };

      const response = await axios.get(`https://www.google.com/search?q=${question}`);

      const html= await response.data;

      // Create a DOMParser and parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Initialize arrays to store the scraped data
      const titles: any = [];
      const links: any = [];
      const snippets: any = [];
      const displayedLinks: any = [];

      // Select elements representing search results
      const resultElements = doc.querySelectorAll('.g');

      // Loop through each search result and extract data
      resultElements.forEach((resultElement: any) => {
        const titleElement = resultElement.querySelector('.yuRUbf h3');
        const linkElement = resultElement.querySelector('.yuRUbf a');
        const snippetElement = resultElement.querySelector('.VwiC3b');
        const displayedLinkElement = resultElement.querySelector('.yuRUbf .NJjxre .tjvcx');
        const timeElement = resultElement.querySelector('.sL6Rbf');

        if (titleElement) {
          titles.push(titleElement.innerText);
        }

        if (linkElement) {
          links.push(linkElement.getAttribute('href'));
        }

        if (snippetElement) {
          snippets.push(snippetElement.innerText);
        }

        if (displayedLinkElement) {
          displayedLinks.push(displayedLinkElement.innerText);
        }

        if (timeElement) {
          console.log(timeElement.innerText);
        }

      });

      // Format the scraped data as a single string
      const formattedResult = `
            Titles: ${titles.join('\n')}
            Links: ${links.join('\n')}
            Snippets: ${snippets.join('\n')}
            Displayed Links: ${displayedLinks.join('\n')}
          `;

      return formattedResult;
    } catch (error: any) {
      return "";
    }
  }

}

export default Scrapper;