import { PresetRoleInfo } from '../types';

export const PRESET_ROLES: PresetRoleInfo[] = [
  {
    id: 'Frontend',
    title: 'Frontend Engineer',
    iconName: 'Layout',
    description: 'DOM, React 19, TypeScript, Web Vitals, State Management, CSS Architecture & Performance Optimization.',
    techStack: ['React', 'TypeScript', 'Next.js', 'Web Performance', 'Tailwind', 'GraphQL'],
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'AI Engineer',
    title: 'AI Engineer',
    iconName: 'Cpu',
    description: 'LLMs, RAG Architectures, Vector DBs, PyTorch, Prompt Engineering, Model Evaluation & Fine-Tuning.',
    techStack: ['Python', 'LangChain/LlamaIndex', 'Vector DBs', 'PyTorch', 'Gemini/OpenAI APIs', 'RAG'],
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'Data Analyst',
    title: 'Data Analyst',
    iconName: 'BarChart3',
    description: 'Complex SQL, Python, Statistical Inference, Dashboards, Product Metrics, A/B Testing & Data Pipelines.',
    techStack: ['Advanced SQL', 'Python (Pandas)', 'Tableau/PowerBI', 'A/B Testing', 'BigQuery'],
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'Software Engineer',
    title: 'Software Engineer',
    iconName: 'Code2',
    description: 'Data Structures & Algorithms, Distributed System Design, Microservices, Databases & REST/gRPC APIs.',
    techStack: ['Java/Go/Node', 'System Design', 'Algorithms', 'PostgreSQL', 'Docker/K8s', 'CI/CD'],
    color: 'from-amber-500 to-orange-600',
  },
];
