# Noobackers - Nooby: Your A.I. Companion 🤖

[![Nooby Preview](https://nooby.noobacker.com/)](https://nooby.noobacker.com/)

**Live Demo:** [nooby.noobacker.com](https://nooby.noobacker.com/)

Nooby is a powerful browser extension designed to enhance your web browsing experience with AI-driven insights, summaries, and conversational assistance. Built during 2023-24, it integrates multiple AI providers to give you the best possible answers directly in your browser.

## Why Nooby? 🚀

In an era of information overload, Nooby acts as your personal filter and assistant. Whether you're researching, coding, or just browsing, Nooby helps you understand content faster and more accurately.

- **Unified Interface**: Access multiple AI models (ChatGPT, Gemini, etc.) in one place.
- **Context-Aware**: Understands the content of the page you're currently visiting.
- **Privacy Focused**: No personal API keys are hardcoded; you have full control over your configurations.
- **Developer Friendly**: Built with modern web technologies (Preact, Tailwind CSS, esbuild).

## Key Features ✨

- **Smart Summaries**: Get concise summaries of long articles and web pages.
- **Interactive Chat**: Chat with AI about the content of the current tab.
- **Multi-Provider Support**: 
    - Google Gemini
    - OpenAI ChatGPT
    - ChinaGPT
- **Customizable Prompts**: Tailor Nooby's behavior to your specific needs through the options page.
- **Search Integration**: Get AI answers alongside your search engine results.

## Installation 🛠️

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/noobacker/Nooby-Your-A.I.-Companion.git
   cd Nooby-Your-A.I.-Companion
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your API keys as shown in `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and provide your `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `GEMINI_API_KEY`.

## How to Run Locally 💻

### Development Mode
To start the extension in development mode with hot-reloading:
```bash
npm run dev
```

### Build for Production
To build the extension for production (outputs to the `build` folder):
```bash
npm run build
```

After building, you can load the extension into your browser:
1. Open Chrome/Firefox and go to the extensions management page (`chrome://extensions` or `about:debugging`).
2. Enable "Developer mode".
3. Click "Load unpacked" and select the `build/chromium` or `build/firefox` folder.

## Future Scope 🔮

- **Enhanced Multi-Modal Support**: Integration with image and voice models.
- **Deeper Integration**: Better scraping and context gathering for complex web apps.
- **Plugin System**: Allow community-contributed prompt templates and scrapers.
- **Mobile Support**: Extending the companion to mobile browsers.

## Contributing 🤝

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Credits ❤️

Developed by **noobacker** - [noobacker.com](https://noobacker.com/)
Built in **2023-24**

Special thanks to the Google Deepmind team and the creators of Preact, Tailwind CSS, and esbuild.

---
*Nooby - Making the web smarter, one tab at a time.*
