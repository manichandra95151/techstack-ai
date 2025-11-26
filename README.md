# TechStack AI

**Architect your next big idea instantly.**

TechStack AI is an intelligent architecture design tool that helps developers and founders stop wasting time on boilerplate and planning. Simply describe your project idea, and get a complete, AI-generated tech stack, feature breakdown, system architecture, and API specification in seconds.

<img width="1668" height="2542" alt="techstack-ai vercel app_" src="https://github.com/user-attachments/assets/fc7b79be-4302-4e9f-b3ca-60b8abe672b8" />

## ✨ Features

- **AI-Powered Stack Generation**: Get tailored tech stack recommendations (Beginner, MVP, Enterprise, Budget) based on your project requirements.
- **Comprehensive Build Specification**:
  - **Feature Scope**: Detailed list of features with complexity ratings.
  - **Build Plan**: Step-by-step development roadmap.
  - **System Architecture**: Visual diagrams (High Level, Request Flow, Deployment, Database ERD) powered by Mermaid.js.
  - **API Specification**: Complete API endpoint definitions with request/response examples.
- **Interactive UI**: Beautiful, dark-mode interface built with Tailwind CSS and Framer Motion.
- **PDF Export**: Download your complete architecture specification as a professional PDF.
- **Contact Integration**: Built-in contact form with email delivery via Web3Forms.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI Model**: [Groq SDK](https://groq.com/) (Llama 3 models)
- **Diagrams**: [Mermaid.js](https://mermaid.js.org/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

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
   Create a `.env.local` file in the root directory and add your keys:
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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
