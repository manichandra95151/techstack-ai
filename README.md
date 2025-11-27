<div align="center">
  <h1 align="center">TechStack AI</h1>
  <h3 align="center">Architect your next big idea instantly.</h3>
  <p align="center">
    Stop wasting time on boilerplate. Get a complete tech stack, feature breakdown, and API specification in seconds.
  </p>
  
  <p align="center">
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.svg" alt="Next.js" />
    </a>
    <a href="https://react.dev">
      <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    </a>
    <a href="https://groq.com">
      <img src="https://img.shields.io/badge/Groq_AI-Llama_3-orange?style=for-the-badge&logo=openai" alt="Groq AI" />
    </a>
  </p>
</div>

<br />

## 🎥 See it in Action

<div align="center">
  <img src="public/demo.gif" width="100%" />
</div>


<br />

## ✨ Features

- 🧠 **AI-Powered Stack Generation**: Tailored tech stack recommendations (Beginner, MVP, Enterprise, Budget).
- 📋 **Comprehensive Build Specification**:
  - **Feature Scope**: Detailed list of features with complexity ratings.
  - **Build Plan**: Step-by-step development roadmap.
  - **System Architecture**: Visual diagrams (High Level, Request Flow, Deployment, Database ERD) powered by Mermaid.js.
  - **API Specification**: Complete API endpoint definitions.
- 🎨 **Interactive UI**: Beautiful, dark-mode interface built with Tailwind CSS and Framer Motion.
- 📄 **PDF Export**: Download your complete architecture specification as a professional PDF.
- 📧 **Contact Integration**: Built-in contact form with email delivery via Web3Forms.

<br />

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **AI Model** | [Groq SDK](https://groq.com/) (Llama 3 models) |
| **Diagrams** | [Mermaid.js](https://mermaid.js.org/) |
| **PDF Generation** | [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

<br />

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A [Groq Cloud](https://console.groq.com/) API Key
- A [Web3Forms](https://web3forms.com/) Access Key (for contact form)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/techstack-ai.git
   cd techstack-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # AI Generation
   GROQ_API_KEY=your_groq_api_key_here

   # Contact Form (Client-side)
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the app.

<br />

## 📁 Project Structure

```
├── app/
│   ├── api/            # API routes (stack generation, roadmap, contact)
│   ├── contact/        # Contact page
│   ├── features/       # Features page
│   ├── how-it-works/   # How it Works page
│   ├── utils/          # Utilities (PDF generator)
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main application flow
├── components/
│   ├── landing/        # Landing page components (Hero, Features, etc.)
│   ├── layout/         # Layout components (Navbar, Footer)
│   ├── steps/          # Application steps (StackSelection, BuildSpecification)
│   └── ui/             # Reusable UI components (buttons, inputs, etc.)
├── types/              # TypeScript definitions
└── public/             # Static assets
```

<br />

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<br />

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
