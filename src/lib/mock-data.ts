import type { User, Startup, Memo, Meeting, Connection } from "@/lib/types";

export const users: User[] = [
  {
    id: "1",
    email: "admin@startupverse.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    email: "investor@startupverse.com",
    role: "Investor",
    status: "Active",
  },
  {
    id: "3",
    email: "founder@startupverse.com",
    role: "Founder",
    status: "Active",
  },
  {
    id: "4",
    email: "pending.founder@example.com",
    role: "Founder",
    status: "Pending",
  },
  {
    id: "5",
    email: "deactivated.investor@example.com",
    role: "Investor",
    status: "Deactivated",
  },
];

export const startups: Startup[] = [
  {
    id: "s1",
    name: "InnovateX",
    founder: "Jane Doe",
    logo: "/logos/innovatex.png",
    industry: "AI/ML",
    founded: "2022",
    employees: "15",
    summary: "InnovateX is developing AI-driven solutions for enterprise automation, aiming to revolutionize the way businesses handle large-scale data.",
    businessModel: "SaaS subscription model with tiered pricing based on usage and features. Enterprise-level plans include dedicated support and custom integrations.",
    fundingHistory: "Seed round of $2M in 2022, led by Future Ventures. Currently raising a Series A to scale sales and engineering teams.",
    memo: "InnovateX presents a strong investment opportunity due to its experienced team, proprietary technology, and significant market traction. The AI-powered automation market is rapidly growing, and InnovateX's solution is well-positioned to capture a significant share. Key risks include competition from established players and the need to scale the team effectively.",
    scores: {
      'Team Strength': 90,
      'Market Potential': 85,
      'Financial Viability': 80,
      'Problem Significance': 95,
      'Solution Uniqueness': 88,
    },
    traction: "Reached $1M in ARR with 20 enterprise clients. Key customers include Fortune 500 companies in the finance and healthcare sectors. Month-over-month growth of 15%.",
    company: "InnovateX",
    website: "innovatex.com",
    sector: "AI/ML",
    stage: "Series A",
    oneLiner: "AI-driven solutions for enterprise automation.",
    deckUrl: "/mock-deck.pdf",
    status: "Approved",
    submittedAt: new Date("2023-10-15"),
    founderId: "3",
    risk: { market: "low", tech: "medium", team: "low" },
  },
  {
    id: "s2",
    name: "Healthify",
    founder: "John Smith",
    logo: "/logos/healthify.png",
    industry: "HealthTech",
    founded: "2023",
    employees: "8",
    summary: "Healthify provides personalized nutrition plans based on genetic data, helping users achieve their health and wellness goals.",
    businessModel: "Direct-to-consumer subscription service. Users receive a genetic testing kit and a personalized nutrition plan with ongoing support.",
    fundingHistory: "Pre-seed round of $500K from angel investors. Seeking a seed round to expand marketing efforts and conduct further research.",
    memo: "Healthify is tapping into the growing trend of personalized health and wellness. The use of genetic data provides a strong competitive advantage. However, the company faces challenges in terms of regulatory hurdles and the need to educate the market. The founding team has a strong scientific background but may need to bring in business expertise.",
    scores: {
      'Team Strength': 80,
      'Market Potential': 90,
      'Financial Viability': 75,
      'Problem Significance': 85,
      'Solution Uniqueness': 92,
    },
    traction: "Beta launched with 1,000 users. Positive feedback on the user experience and the effectiveness of the nutrition plans. Strategic partnerships with fitness influencers.",
    company: "Healthify",
    website: "healthify.io",
    sector: "HealthTech",
    stage: "Seed",
    oneLiner: "Personalized nutrition plans using genetic data.",
    deckUrl: "/mock-deck.pdf",
    status: "Approved",
    submittedAt: new Date("2023-11-01"),
    founderId: "4",
    risk: { market: "medium", tech: "high", team: "low" },
  },
];

export const memos: Memo[] = [
  {
    id: "m1",
    startupId: "s1",
    type: "Memo 1",
    status: "Completed",
    content: {
      founderAndTeam: "Experienced team with multiple exits.",
      problemAndMarket: "Large TAM in a growing market.",
      differentiation: "Proprietary AI models with high accuracy.",
      businessAndTraction: "Strong initial traction with 10 enterprise clients.",
      comparables: "Similar to DataBot (acquired for $500M).",
      riskFlags: "Dependent on key AI talent.",
    },
    sources: ["/mock-deck.pdf", "https://innovatex.com"],
  },
  {
    id: "m2",
    startupId: "s1",
    type: "Memo 2",
    status: "In Progress",
    content: {
      founderAndTeam: "Experienced team with multiple exits.",
      problemAndMarket: "Large TAM in a growing market.",
      differentiation: "Proprietary AI models with high accuracy.",
      businessAndTraction: "Strong initial traction with 10 enterprise clients.",
      comparables: "Similar to DataBot (acquired for $500M).",
      riskFlags: "Dependent on key AI talent.",
      callInsights: "Founder was very articulate and had a clear vision for the next 18 months.",
    },
    sources: ["/mock-deck.pdf", "https://innovatex.com", "/audio-call.mp3"],
  },
  {
    id: "m3",
    startupId: "s2",
    type: "Memo 1",
    status: "Completed",
    content: {
      founderAndTeam: "Strong technical founder, needs business co-founder.",
      problemAndMarket: "Huge market, but heavily regulated.",
      differentiation: "Novel approach, but unproven at scale.",
      businessAndTraction: "Pre-revenue, waiting for FDA approval.",
      comparables: "Similar to 23andMe but for nutrition.",
      riskFlags: "Regulatory hurdles and long sales cycles.",
    },
    sources: ["/mock-deck.pdf", "https://healthify.io"],
  },
];

export const meetings: Meeting[] = [
    {
        id: "meet1",
        title: "Founder <> AI Agent: InnovateX",
        participants: ["founder@startupverse.com", "AI Agent"],
        mode: "Agent",
        type: "Video",
        time: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: "Upcoming",
        link: "https://meet.google.com/placeholder-1"
    },
    {
        id: "meet2",
        title: "Investor <> Founder: Healthify 1:1",
        participants: ["investor@startupverse.com", "founder-healthify@example.com"],
        mode: "1-on-1",
        type: "Voice",
        time: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: "Upcoming",
        link: "https://meet.google.com/placeholder-2"
    },
    {
        id: "meet3",
        title: "Past Meeting: EcoSolutions Intro",
        participants: ["investor@startupverse.com", "founder-eco@example.com"],
        mode: "1-on-1",
        type: "Video",
        time: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        status: "Past",
        link: "https://meet.google.com/placeholder-3"
    },
];


export const connections: Connection[] = [
    {
        id: "c1",
        investorId: "2",
        founderId: "3",
        startupId: "s1",
        status: "accepted"
    },
    {
        id: "c2",
        investorId: "2",
        founderId: "4",
        startupId: "s2",
        status: "requested"
    },
     {
        id: "c3",
        investorId: "5",
        founderId: "3",
        startupId: "s3",
        status: "declined"
    },
];
