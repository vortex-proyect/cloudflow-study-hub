# 🎓 CloudFlow Study Hub

CloudFlow Study Hub is an AI-powered academic assistant designed to revolutionize the way students and educators process documents and generate learning materials. Built with a modern edge-first architecture, it provides low-latency AI capabilities directly on the Cloudflare network.

## 🚀 Core Features

- **📄 Intelligent Document Processing**: Upload academic documents and extract key concepts.
- **✍️ Automatic Quiz Generation**: Generate quizzes and study guides based on uploaded content.
- **💬 AI Study Chat**: Interactive chat powered by RAG (Retrieval-Augmented Generation) for precise answers based on your documents.
- **⚡ Edge Performance**: Built on Cloudflare Pages for global scale and minimum latency.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Transformation**: [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages)
- **Storage**:
  - **D1**: Relational database for users, documents, and history.
  - **R2**: Object storage for PDF and text files.
- **AI & Vector Search**:
  - **Workers AI**: LLMs (`llama-3-8b`) and Embeddings (`bge-large-en-v1.5`).
  - **Vectorize**: Vector database for high-performance embedding retrieval.

## ⚙️ Setup & Installation

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd cloudflow-study-hub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Cloudflare Bindings**:
   Refer to `.env.example` and ensure you have a `wrangler.toml` configured with your local/remote IDs.

4. **Start the development server**:
   ```bash
   npm run dev
   ```

### Deployment

The project is configured for **Continuous Deployment** via GitHub Actions. Every push to the `main` branch automatically triggers the build and deploy pipeline.

**Manual Deployment**:
```bash
npm run deploy
```

## 🏗️ Infrastructure Requirements

To run this project, you need the following resources in your Cloudflare account:

| Resource | Binding Name | Purpose |
| :--- | :--- | :--- |
| **D1 Database** | `DB` | User and metadata storage |
| **R2 Bucket** | `BUCKET` | Original document storage |
| **Vectorize Index**| `VECTOR_INDEX` | Document embeddings for RAG |
| **Workers AI** | `AI` | LLM and Embedding models |

## 📝 License
MIT
