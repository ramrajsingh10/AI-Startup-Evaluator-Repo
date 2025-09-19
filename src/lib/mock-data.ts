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
  {
    id: "s3",
    company: "EcoSolutions",
    website: "ecosolutions.earth",
    sector: "CleanTech",
    stage: "Seed",
    oneLiner: "Biodegradable packaging from seaweed.",
    deckUrl: "/mock-deck.pdf",
    status: "Rejected",
    submittedAt: new Date("2023-11-05"),
    founderId: "3",
    risk: { market: "low", tech: "medium", team: "medium" },
  },
  {
    id: "s4",
    company: "FinAnalytica",
    website: "finanalytica.ai",
    sector: "FinTech",
    stage: "Series B",
    oneLiner: "Predictive analytics for financial markets.",
    deckUrl: "/mock-deck.pdf",
    status: "Pending",
    submittedAt: new Date("2023-11-10"),
    founderId: "4",
    risk: { market: "high", tech: "low", team: "low" },
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
