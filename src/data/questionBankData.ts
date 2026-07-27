import { QuestionBankItem } from '../types';

export const QUESTION_BANK: QuestionBankItem[] = [
  {
    id: 'qb-1',
    category: 'Frontend',
    question: 'How does React 19 handles automatic batching and Server Components (RSC)?',
    difficulty: 'Hard',
    concept: 'React Architecture & Server Components',
    answerGuideline:
      'Explain that RSCs run exclusively on the server, producing non-blocking HTML/JSON streams. They reduce client bundle size by keeping heavy dependencies on the server while client components handle interactive state.',
    proTips: [
      'Mention how "use client" boundaries operate.',
      'Discuss data fetching efficiency without client-side waterfalls.',
    ],
  },
  {
    id: 'qb-2',
    category: 'Frontend',
    question: 'Explain the difference between call, apply, and bind in JavaScript with practical examples.',
    difficulty: 'Medium',
    concept: 'JS Engine & Scope Context',
    answerGuideline:
      'All three modify the `this` context. `call` passes arguments individually, `apply` passes an array of arguments, and `bind` returns a new function with bound context for later execution.',
    proTips: [
      'Write a quick syntax comparison.',
      'Relate `bind` to event listeners and React class callbacks.',
    ],
  },
  {
    id: 'qb-3',
    category: 'AI Interview',
    question: 'What is Retrieval-Augmented Generation (RAG), and how do you reduce hallucinations in LLM outputs?',
    difficulty: 'Hard',
    concept: 'AI System Architecture & RAG',
    answerGuideline:
      'RAG connects LLMs to external vector databases (e.g. Pinecone/Chroma) by retrieving top-K semantic chunks and augmenting the prompt. Hallucinations are reduced via tight system prompt constraints, citation verification, reranking, and temperature tuning.',
    proTips: [
      'Differentiate dense vector retrieval from BM25 sparse keyword search.',
      'Mention metadata filtering and chunk chunking strategy (e.g., 512 tokens with overlap).',
    ],
  },
  {
    id: 'qb-4',
    category: 'System Design',
    question: 'Design a scalable real-time Notification System that handles 100M daily active users.',
    difficulty: 'Hard',
    concept: 'Distributed Systems & WebSockets',
    answerGuideline:
      'Propose an architecture using API Gateways, Message Queues (Kafka/RabbitMQ), User Preference DB (Redis/DynamoDB), and WebSocket/Push Notification workers (FCM, APNS) with rate limiters and idempotency keys.',
    proTips: [
      'Focus on decoupling notification producers from delivery channels.',
      'Address delivery guarantees (at-least-once) and user preference mute settings.',
    ],
  },
  {
    id: 'qb-5',
    category: 'Behavioural Interview',
    question: 'Describe a situation where you had a strong technical disagreement with a team lead or peer. How did you resolve it?',
    difficulty: 'Medium',
    concept: 'Conflict Resolution & STAR Method',
    answerGuideline:
      'Use the STAR method (Situation, Task, Action, Result). Emphasize objectiveness, creating benchmark proof-of-concepts, listening actively, and prioritizing project goals over ego.',
    proTips: [
      'Avoid blaming colleagues; highlight metrics-driven decisions.',
      'Conclude with the positive outcome and learned experience.',
    ],
  },
  {
    id: 'qb-6',
    category: 'Backend',
    question: 'How do index scans work in PostgreSQL, and when might an index actually slow down database performance?',
    difficulty: 'Hard',
    concept: 'Database Indexing & Query Planner',
    answerGuideline:
      'PostgreSQL uses B-Tree indexes for fast lookup O(log N). However, excessive indexes slow down WRITE operations (INSERT/UPDATE/DELETE) because indexes must be updated on every write, and can waste RAM buffer cache if low cardinality.',
    proTips: [
      'Mention EXPLAIN ANALYZE for query plan diagnosis.',
      'Discuss partial indexes and multi-column composite indexes.',
    ],
  },
  {
    id: 'qb-7',
    category: 'Coding Interview',
    question: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    concept: 'Hash Maps & O(N) Time Complexity',
    answerGuideline:
      'Iterate through the array maintaining a Hash Map storing value -> index mapping. For each element `num`, check if `target - num` exists in map. Return indices immediately if found for O(N) time and O(N) space.',
    proTips: [
      'Highlight why brute force O(N^2) double loops are suboptimal.',
      'State boundary checks (array length < 2, negative numbers).',
    ],
  },
  {
    id: 'qb-8',
    category: 'HR Interview',
    question: 'Why do you want to join our engineering team, and where do you see your technical trajectory in 3 years?',
    difficulty: 'Easy',
    concept: 'Culture Fit & Growth Mindset',
    answerGuideline:
      'Connect personal growth with company mission. Discuss specific technical domains you want to master (e.g. system scalability, AI integration) and your desire to mentor junior engineers.',
    proTips: [
      'Research company tech blog and product architecture.',
      'Be genuine about skill progression rather than title titles.',
    ],
  },
  {
    id: 'qb-9',
    category: 'DevOps',
    question: 'Explain Canary Deployment vs. Blue-Green Deployment strategies in Kubernetes.',
    difficulty: 'Medium',
    concept: 'CI/CD & Kubernetes Traffic Routing',
    answerGuideline:
      'Blue-Green maintains two identical production environments (active vs passive) for instant zero-downtime rollback. Canary rolls out new version to a small percentage of users first (e.g., 5% -> 20% -> 100%) monitoring error rate telemetry.',
    proTips: [
      'Mention Istio / Envoy mesh routing for percentage splitting.',
      'Discuss database schema backward-compatibility during rollouts.',
    ],
  },
  {
    id: 'qb-10',
    category: 'Data Science',
    question: 'What is the bias-variance tradeoff in Machine Learning, and how do you diagnose overfitting?',
    difficulty: 'Medium',
    concept: 'ML Fundamentals & Model Regularization',
    answerGuideline:
      'High bias leads to underfitting (model too simple), while high variance leads to overfitting (model memorizes noise). Diagnose overfitting when training loss drops continuously while validation/test error starts rising.',
    proTips: [
      'Suggest solutions: L1/L2 regularization, dropout, cross-validation, or collecting more training data.',
    ],
  },
];
