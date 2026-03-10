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

      const html = response.data;

      // Extract titles, links, and snippets using regex (since DOMParser is unavailable in MV3 service workers)
      const titles: string[] = [];
      const links: string[] = [];
      const snippets: string[] = [];

      // Regex to find search result blocks (very basic extraction)
      const resultRegex = /<h3[^>]*>(.*?)<\/h3>.*?href="([^"]*?)"/g;
      let match;
      while ((match = resultRegex.exec(html)) !== null) {
        const title = match[1].replace(/<[^>]*>?/gm, ''); // remove tags
        const link = match[2];
        if (title && link && !link.startsWith('/search')) {
          titles.push(title);
          links.push(link);
        }
      }

      const snippetRegex = /<div class="VwiC3b[^>]*>(.*?)<\/div>/g;
      while ((match = snippetRegex.exec(html)) !== null) {
        snippets.push(match[1].replace(/<[^>]*>?/gm, ''));
      }

      // Format the scraped data as a single string
      const formattedResult = `
            Titles: ${titles.join('\n')}
            Links: ${links.join('\n')}
            Snippets: ${snippets.join('\n')}
          `;

      return formattedResult;
    } catch (error: any) {
      return "";
    }
  }

}

export default Scrapper;