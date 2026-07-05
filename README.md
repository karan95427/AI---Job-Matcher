# CareerLens – AI Resume Intelligence & RAG Job Recommendation Platform

CareerLens is a production-ready AI application that intelligently matches resumes with relevant job opportunities using semantic search, Retrieval-Augmented Generation (RAG), transformer embeddings, vector search, and Large Language Models.

Instead of relying on keyword matching, CareerLens understands resumes and job descriptions semantically, retrieves the most relevant opportunities using FAISS vector search, and leverages the OpenAI API to generate personalized explanations and career recommendations.

---

# Live Demo

Frontend:
https://YOUR_NETLIFY_URL

Backend API:
https://YOUR_RAILWAY_URL/docs

---

# Features

## Semantic Resume Analysis

- Upload PDF resumes
- Extract structured resume information
- Detect technical skills
- Understand candidate profiles using transformer embeddings

---

## Semantic Job Retrieval

- Generate dense embeddings using Sentence Transformers
- Store job embeddings in FAISS
- Perform Top-K semantic retrieval
- Retrieve jobs based on meaning rather than keyword overlap

---

## Retrieval-Augmented Generation (RAG)

CareerLens implements a RAG pipeline:

Resume
→ Embedding Generation
→ FAISS Retrieval
→ Hybrid Ranking
→ OpenAI LLM
→ Personalized Career Recommendation

The retrieved jobs are provided as context to the LLM, enabling grounded and explainable recommendations instead of generic responses.

---

## Hybrid Ranking Engine

Recommendations combine multiple signals:

- Semantic Similarity
- Skill Overlap Analysis
- Retrieval Score
- Combined Relevance Ranking

This improves recommendation quality beyond embedding-only approaches.

---

## AI Recommendation Engine

The system generates:

- Personalized career summaries
- Job fit explanations
- Skill gap insights
- Resume improvement suggestions
- Explainable recommendation reasoning

using OpenAI's GPT models.

---

## Production Deployment

Backend

- FastAPI
- Railway

Frontend

- React
- Vite
- Netlify

Deployment Features

- Git-based automatic deployment
- Environment-based configuration
- Production CORS configuration
- Health & Readiness endpoints
- Production API documentation

---

# System Architecture

```
                    Resume PDF
                         │
                         ▼
                 PDF Text Extraction
                         │
                         ▼
                 Skill Extraction
                         │
                         ▼
          Sentence Transformer Embeddings
                         │
                         ▼
                FAISS Vector Search
                 (Top-K Retrieval)
                         │
                         ▼
               Hybrid Ranking Engine
                         │
                         ▼
           Retrieved Job Descriptions
                         │
                         ▼
              OpenAI GPT Recommendation
                         │
                         ▼
         Personalized Career Suggestions
```

---

# Tech Stack

## Backend

- FastAPI
- Python

## AI / Machine Learning

- Sentence Transformers
- OpenAI API
- Hugging Face
- FAISS
- Scikit-learn
- NumPy
- Pandas

## Database

- PostgreSQL

## Frontend

- React
- TypeScript
- Vite

## Deployment

- Railway
- Netlify
- GitHub

---

# Project Structure

```text
CareerLens/
│
├── Backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── models/
│   │   ├── utils/
│   │   ├── core/
│   │   └── data/
│   │
│   ├── hf_cache/
│   ├── requirements.txt
│   └── main.py
│
├── Frontend/
│
└── README.md
```

---

# Application Workflow

### 1. Resume Upload

Users upload their PDF resume.

↓

### 2. Resume Parsing

The system extracts structured text and candidate information.

↓

### 3. Embedding Generation

Sentence Transformers convert resume text into dense semantic vectors.

↓

### 4. Vector Retrieval

FAISS retrieves the Top-K most relevant job descriptions.

↓

### 5. Hybrid Ranking

Jobs are reranked using:

- Semantic similarity
- Skill overlap
- Combined relevance score

↓

### 6. RAG Generation

Retrieved jobs are supplied to the OpenAI model as grounding context.

The LLM generates:

- Personalized career advice
- Job-fit explanations
- Skill gap analysis
- Resume recommendations

↓

### 7. Final Recommendations

The highest-quality recommendations are returned to the user.

---

# Performance

Performance was validated using **k6**.

| Metric | Result |
|---------|--------|
| Concurrent Virtual Users | 100 |
| Average Latency | 95 ms |
| P95 Latency | 116 ms |
| Throughput | ~88 requests/sec |
| Failed Requests | 0% |

---

# Key Learnings

This project provided hands-on experience with:

- Retrieval-Augmented Generation (RAG)
- Semantic Search
- Vector Databases
- Transformer Embeddings
- Large Language Model Integration
- FastAPI
- Backend System Design
- Production Deployment
- Performance Benchmarking
- CORS Configuration
- Environment-based Configuration
- API Design

---

# Future Improvements

- Multi-model LLM support
- Conversation memory
- Resume versioning
- Authentication
- User dashboards
- Job bookmarking
- Interview preparation
- Skill roadmap generation
- Metadata filtering
- Redis caching
- Streaming LLM responses

---

# Results

- Replaced keyword matching with semantic retrieval
- Built a production-ready RAG application
- Integrated OpenAI for grounded recommendation generation
- Deployed backend on Railway and frontend on Netlify
- Achieved ~88 requests/sec with 100 concurrent virtual users during k6 benchmarking
- Designed a modular FastAPI architecture for maintainability and scalability

---

# Author

**Karan Shihire**

AI Engineer | Applied AI | Semantic Search | RAG | FastAPI
