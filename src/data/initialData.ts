import { ProfileData, Project, SkillCategory, Experience, Service, Testimonial, Article } from '../types';

export const initialProfile: ProfileData = {
  name: 'Shobha Solanki',
  pronouns: 'she/her',
  role: 'Senior Full-Stack Engineer & Product Builder',
  headline: 'Crafting scalable web architectures, resilient distributed systems & intuitive digital experiences.',
  bio: 'I am a software engineer and creative problem solver with over 6 years of experience transforming complex business logic into high-performance, user-centered digital products.',
  detailedBio: [
    'Specialized in building end-to-end web applications with React, TypeScript, Node.js, and cloud-native systems.',
    'Passionate about performance engineering, accessible UI design, clean code architectures, and developer tooling.',
    'Experienced in collaborating across cross-functional teams, driving architectural decisions, and shipping products that scale to millions of users.'
  ],
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  location: 'San Francisco, CA & Remote',
  timezone: 'PST (UTC-8)',
  email: 'shobhasolanki230@gmail.com',
  status: 'available',
  statusText: 'Available for high-impact roles & select consulting',
  yearsOfExperience: 6,
  projectsCompleted: 34,
  clientsSatisfied: 28,
  openSourceContributions: 140,
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    email: 'mailto:shobhasolanki230@gmail.com',
  },
  keyHighlights: [
    'Led migration of monolith to micro-frontends serving 2M+ active monthly users',
    'Architected real-time collaboration engines using WebSockets & CRDTs',
    'Reduced core web vitals LCP by 64% and backend payload sizes by 40%',
    'Author of multiple popular open-source UI component and utility packages'
  ]
};

export const initialProjects: Project[] = [
  {
    id: 'pulse-ai',
    title: 'PulseAnalytics AI',
    tagline: 'Real-time telemetry and predictive operational intelligence platform',
    description: 'An enterprise-grade observability engine that aggregates application logs, predicts anomaly spikes with machine learning models, and visualizes complex telemetry streams with sub-second latency.',
    category: 'fullstack',
    tags: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Redis'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    demoUrl: 'https://example.com/demo/pulse',
    githubUrl: 'https://github.com/example/pulse-analytics',
    featured: true,
    year: '2025',
    role: 'Lead Architect & Full-Stack Engineer',
    metrics: [
      { label: 'Query Latency', value: '< 45ms' },
      { label: 'Daily Events', value: '45M+' },
      { label: 'Data Compression', value: '72%' }
    ],
    highlights: [
      'Designed customizable streaming dashboards with high-density canvas visualizers',
      'Engineered automated alert routing engine integrating Slack, PagerDuty, and webhooks',
      'Implemented distributed caching layers reducing database CPU utilization by 58%'
    ],
    architecture: [
      'Microservice telemetry ingestion layer with Node.js event loops',
      'Real-time WebSocket pipeline pushing granular state updates',
      'Strict TypeScript client application with optimistic UI rollbacks'
    ]
  },
  {
    id: 'nexus-flow',
    title: 'NexusFlow Collaboration Engine',
    tagline: 'Multi-player digital workspace with CRDT-backed real-time state sync',
    description: 'A rich visual document and canvas collaboration workspace enabling cross-functional product teams to wireframe, diagram, and draft specs with zero merge conflicts.',
    category: 'frontend',
    tags: ['TypeScript', 'React', 'WebSockets', 'Canvas API', 'TailwindCSS'],
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
    demoUrl: 'https://example.com/demo/nexus',
    githubUrl: 'https://github.com/example/nexus-flow',
    featured: true,
    year: '2024',
    role: 'Frontend Principal',
    metrics: [
      { label: 'Active Concurrent Users', value: '1,200+' },
      { label: 'Sync Latency', value: '< 20ms' },
      { label: 'Crash-Free Sessions', value: '99.98%' }
    ],
    highlights: [
      'Custom spatial index algorithm for rendering 10,000+ interactive canvas elements at 60 FPS',
      'Conflict-free Replicated Data Types (CRDTs) to preserve offline edits seamlessly',
      'Granular permission system with role-based document access controls'
    ],
    architecture: [
      'Declarative state machine managing undo/redo history trees',
      'Offscreen Canvas rendering workers for compute-heavy geometry calculations',
      'Binary serialization protocol over persistent WebSockets'
    ]
  },
  {
    id: 'aurora-commerce',
    title: 'Aurora Headless Commerce',
    tagline: 'High-speed global storefront with sub-second page loads and localized checkout',
    description: 'A headless e-commerce storefront delivering localized multicurrency shopping, instant faceted catalog searches, and automated inventory sync across multiple fulfillment hubs.',
    category: 'fullstack',
    tags: ['Next.js', 'GraphQL', 'Stripe API', 'PostgreSQL', 'TailwindCSS'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    demoUrl: 'https://example.com/demo/aurora',
    githubUrl: 'https://github.com/example/aurora-storefront',
    featured: true,
    year: '2024',
    role: 'Full-Stack Developer & UI Designer',
    metrics: [
      { label: 'Conversion Lift', value: '+34%' },
      { label: 'Lighthouse Score', value: '99/100' },
      { label: 'Checkout Abandonment', value: '-22%' }
    ],
    highlights: [
      'Sub-second instant faceted search with debounced index lookups',
      'Zero-layout-shift image optimization and responsive picture delivery',
      'Stripe Payment Element checkout flow with localized payment methods'
    ],
    architecture: [
      'Edge-cached GraphQL layer resolving queries against distributed data sources',
      'Event-driven inventory webhook listeners ensuring real-time stock status'
    ]
  },
  {
    id: 'synth-agent',
    title: 'SynthMind AI Studio',
    tagline: 'Autonomous AI workflow orchestrator and prompt engineering workbench',
    description: 'A developer platform for designing, benchmarking, and executing multi-step LLM reasoning chains with structured schema validation and cost monitoring.',
    category: 'ai',
    tags: ['Gemini API', 'TypeScript', 'Python', 'FastAPI', 'React'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    demoUrl: 'https://example.com/demo/synthmind',
    githubUrl: 'https://github.com/example/synthmind-studio',
    featured: true,
    year: '2025',
    role: 'AI Systems Engineer',
    metrics: [
      { label: 'Token Cost Reduction', value: '42%' },
      { label: 'Execution Speed', value: '3.2x faster' },
      { label: 'Schema Accuracy', value: '99.4%' }
    ],
    highlights: [
      'Interactive visual graph editor for branching agent decision trees',
      'Automated semantic token budget optimizer and hallucination validator',
      'Live streaming responses with formatted JSON payload previews'
    ]
  },
  {
    id: 'hyper-kit',
    title: 'HyperUI Design System',
    tagline: 'Accessible, unstyled primitives with comprehensive keyboard navigation',
    description: 'An open-source library of 40+ accessible UI primitives built with strict WCAG AAA guidelines, complete keyboard navigation, and theme customizer tokens.',
    category: 'opensource',
    tags: ['TypeScript', 'Accessibility', 'CSS Variables', 'Storybook', 'Vite'],
    image: 'https://images.unsplash.com/photo-1581291518655-9523c932deda?q=80&w=1000&auto=format&fit=crop',
    demoUrl: 'https://example.com/demo/hyperui',
    githubUrl: 'https://github.com/example/hyper-ui',
    featured: false,
    year: '2023',
    role: 'Creator & Maintainer',
    metrics: [
      { label: 'GitHub Stars', value: '1.8k+' },
      { label: 'Monthly NPM Downloads', value: '45k+' }
    ],
    highlights: [
      'Full WAI-ARIA compliance test suite with 100% code coverage',
      'Zero runtime dependencies and tree-shakeable modular exports'
    ]
  },
  {
    id: 'vault-auth',
    title: 'VaultID Biometric Gateway',
    tagline: 'Passkey & WebAuthn authentication suite for mobile and web apps',
    description: 'A developer-friendly identity and authentication microservice enabling one-click passkey logins, multi-factor hardware security key validations, and audit logs.',
    category: 'fullstack',
    tags: ['WebAuthn', 'Node.js', 'TypeScript', 'Redis', 'Docker'],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
    demoUrl: 'https://example.com/demo/vaultid',
    githubUrl: 'https://github.com/example/vault-id',
    featured: false,
    year: '2024',
    role: 'Security Engineer',
    metrics: [
      { label: 'Auth Time', value: '< 200ms' },
      { label: 'Security Score', value: 'A+' }
    ],
    highlights: [
      'Standardized FIDO2 / WebAuthn protocol implementation',
      'Encrypted session token rotation with cryptographic proof of possession'
    ]
  }
];

export const initialSkills: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend & UI Architecture',
    description: 'Building responsive, snappy, and accessible user interfaces',
    icon: 'Layout',
    skills: [
      { name: 'TypeScript & JavaScript', level: 96, years: '6+ yrs', badge: 'Expert' },
      { name: 'React 18 / 19', level: 95, years: '6 yrs', badge: 'Core' },
      { name: 'Tailwind CSS & CSS Architecture', level: 94, years: '5 yrs', badge: 'Advanced' },
      { name: 'Next.js & Vite Ecosystems', level: 90, years: '4 yrs' },
      { name: 'State Management (Zustand, Redux)', level: 92, years: '5 yrs' },
      { name: 'Motion / Animations & WebGL', level: 85, years: '3 yrs' }
    ]
  },
  {
    id: 'backend',
    title: 'Backend & Cloud Infrastructure',
    description: 'Designing resilient distributed services and database schemas',
    icon: 'Server',
    skills: [
      { name: 'Node.js & Express / Fastify', level: 93, years: '5+ yrs', badge: 'Core' },
      { name: 'PostgreSQL & Drizzle / Prisma ORM', level: 88, years: '4 yrs', badge: 'Advanced' },
      { name: 'REST & GraphQL APIs', level: 92, years: '5 yrs' },
      { name: 'Redis Caching & Pub/Sub', level: 86, years: '3 yrs' },
      { name: 'Docker & Containerization', level: 84, years: '4 yrs' },
      { name: 'Cloud Run & AWS / GCP Services', level: 82, years: '4 yrs' }
    ]
  },
  {
    id: 'ai-tools',
    title: 'AI Engineering & Systems',
    description: 'Integrating LLMs, prompt pipelines, and intelligent automations',
    icon: 'Sparkles',
    skills: [
      { name: 'Gemini API & LLM Integrations', level: 90, years: '2+ yrs', badge: 'Modern' },
      { name: 'Structured Outputs & Tool Calling', level: 88, years: '2 yrs' },
      { name: 'Vector Embeddings & Semantic Search', level: 82, years: '2 yrs' },
      { name: 'Prompt Optimization & Eval Suites', level: 86, years: '2 yrs' }
    ]
  },
  {
    id: 'design-devops',
    title: 'Design, Testing & Tooling',
    description: 'Crafting user journeys, automated pipelines, and developer tooling',
    icon: 'Terminal',
    skills: [
      { name: 'Figma UI/UX & Design Systems', level: 88, years: '4 yrs' },
      { name: 'CI/CD Pipelines (GitHub Actions)', level: 87, years: '4 yrs' },
      { name: 'Testing (Vitest, Playwright, Jest)', level: 89, years: '5 yrs' },
      { name: 'Web Performance & Core Web Vitals', level: 94, years: '5 yrs', badge: 'Specialist' }
    ]
  }
];

export const initialExperience: Experience[] = [
  {
    id: 'exp-1',
    role: 'Senior Software Engineer',
    company: 'Veloce Systems',
    location: 'San Francisco, CA (Remote)',
    period: '2023 — Present',
    type: 'Full-time',
    summary: 'Spearheading frontend architecture and telemetry microservices for an enterprise cloud platform powering over 2M+ active monthly operations.',
    achievements: [
      'Led the transition from a monolithic frontend to modular micro-frontends, reducing team deployment collision by 85%.',
      'Architected real-time WebSocket state distribution layers, lowering average message propagation to under 25ms.',
      'Mentored 6 junior and mid-level engineers, running weekly technical design reviews and establishing strict TypeScript standards.'
    ],
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'GCP']
  },
  {
    id: 'exp-2',
    role: 'Full-Stack Developer',
    company: 'Apex Digital Labs',
    location: 'New York, NY',
    period: '2021 — 2023',
    type: 'Full-time',
    summary: 'Built high-impact web products, customer portals, and internal tooling for high-growth tech startups and financial clients.',
    achievements: [
      'Delivered 8 client web platforms on-time with 100% automated test coverage and sub-second Lighthouse performance.',
      'Implemented secure payment flows with Stripe and multi-factor biometric authentication gateways.',
      'Streamlined CI/CD deployment pipelines on GitHub Actions, cutting staging release cycles from 40 minutes to 6 minutes.'
    ],
    techStack: ['React', 'Next.js', 'TailwindCSS', 'GraphQL', 'Express', 'Jest', 'AWS']
  },
  {
    id: 'exp-3',
    role: 'Frontend Engineer',
    company: 'Zenith Studio',
    location: 'Austin, TX',
    period: '2019 — 2021',
    type: 'Full-time',
    summary: 'Collaborated directly with product designers to translate Figma design systems into reusable, WCAG AAA compliant component libraries.',
    achievements: [
      'Engineered an internal design system component library adopted by 5 engineering squads, increasing UI consistency and velocity by 3x.',
      'Refactored legacy DOM manipulation patterns to modern React functional hooks, eliminating 400+ memory leaks.'
    ],
    techStack: ['JavaScript', 'React', 'CSS Modules', 'Storybook', 'Webpack']
  }
];

export const initialServices: Service[] = [
  {
    id: 'srv-1',
    title: 'Full-Stack Web Development',
    tagline: 'End-to-end production web applications tailored for speed and scale',
    description: 'Complete development lifecycle from database schema design and API construction to responsive frontend applications with modern UX.',
    icon: 'Layers',
    deliverables: [
      'Type-safe React & TypeScript frontend',
      'Scalable Express/Node.js or serverless backend',
      'Relational or NoSQL database architecture',
      'Full deployment configuration and CI/CD pipelines'
    ],
    turnaround: '2 — 6 weeks',
    idealFor: 'Startups, SaaS platforms & growing businesses needing robust MVPs or core features.'
  },
  {
    id: 'srv-2',
    title: 'UI/UX & Design Systems',
    tagline: 'Accessible, unified design systems and high-converting user interfaces',
    description: 'Creating cohesive design tokens, modular component libraries, and ergonomic user experiences that adhere strictly to accessibility standards.',
    icon: 'Palette',
    deliverables: [
      'Figma design files and interactive prototypes',
      'Tailwind CSS tokens and component library',
      'Keyboard-first accessibility compliance (WCAG AA/AAA)',
      'Design system documentation and usage guidelines'
    ],
    turnaround: '1 — 3 weeks',
    idealFor: 'Product teams looking to eliminate UI debt and scale their design language.'
  },
  {
    id: 'srv-3',
    title: 'AI & Workflow Automation',
    tagline: 'Intelligent AI integrations, prompt engineering & smart pipeline automation',
    description: 'Supercharging products with modern LLM capabilities, structured document processing, automated categorization, and intelligent assistants.',
    icon: 'Bot',
    deliverables: [
      'Custom LLM integration (Gemini, OpenAI, Anthropic)',
      'Structured JSON schema parsing and prompt tuning',
      'Agentic workflow execution and fallback logic',
      'Token cost minimization and latency benchmarks'
    ],
    turnaround: '1 — 4 weeks',
    idealFor: 'Companies seeking to add AI features, smart search, or automated knowledge workflows.'
  },
  {
    id: 'srv-4',
    title: 'Performance & Architecture Audit',
    tagline: 'Diagnostic review, Core Web Vitals optimization & code refactoring',
    description: 'In-depth code reviews, bundle size dissection, database indexing audits, and performance refactoring to boost conversions and SEO ranking.',
    icon: 'Gauge',
    deliverables: [
      'Comprehensive performance bottleneck audit report',
      'Actionable refactoring pull requests and code fixes',
      'Bundle optimization, code-splitting & cache tuning',
      'Core Web Vitals guarantee (LCP, FID, CLS improvements)'
    ],
    turnaround: '3 — 7 days',
    idealFor: 'Applications facing sluggish load times, high server costs, or poor user retention.'
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'Marcus Vance',
    role: 'VP of Product',
    company: 'HyperScale Labs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    content: 'Shobha is one of the rarest engineers who bridges deep technical architecture with an exceptional eye for design. She delivered our analytics suite 2 weeks ahead of schedule with flawless code quality.',
    rating: 5,
    relationship: 'Worked together on Enterprise Analytics Platform'
  },
  {
    id: 't-2',
    name: 'Elena Rostova',
    role: 'Chief Technology Officer',
    company: 'Krypton Cloud',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
    content: 'Her ability to solve concurrency bottlenecks and design frictionless user interactions is extraordinary. The real-time synchronization engine she built for our collaborative workspace has been rock-solid.',
    rating: 5,
    relationship: 'Client on Real-time Engine Project'
  },
  {
    id: 't-3',
    name: 'David Chen',
    role: 'Engineering Director',
    company: 'Synergy Media Group',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    content: 'Exceptional communication, clear milestones, and clean, documented code. Working with Shobha was seamless from day one. Highly recommended for any critical software initiative.',
    rating: 5,
    relationship: 'Manager & Collaborator'
  }
];

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Architecting Resilient Real-Time State Sync with CRDTs',
    summary: 'A deep dive into how conflict-free replicated data types and optimistic client caches solve multi-user document collaboration without server race conditions.',
    date: 'February 2025',
    readTime: '6 min read',
    category: 'Architecture'
  },
  {
    id: 'art-2',
    title: 'Reducing Core Web Vitals LCP by 60% with Modern Asset Pipelines',
    summary: 'Practical techniques for font subsetting, priority hints, zero-runtime CSS, and edge caching to achieve perfect Lighthouse 100 scores.',
    date: 'January 2025',
    readTime: '8 min read',
    category: 'Performance'
  },
  {
    id: 'art-3',
    title: 'Building Reliable AI Workflows with Structured JSON Schemas',
    summary: 'How to enforce deterministic outputs, handle token limits gracefully, and build evaluation suites for production LLM applications.',
    date: 'November 2024',
    readTime: '5 min read',
    category: 'AI Engineering'
  }
];
