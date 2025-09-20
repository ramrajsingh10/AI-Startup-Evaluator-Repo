export type User = {
  id: string;
  email: string;
  role: "Admin" | "Investor" | "Founder";
  status: "Active" | "Pending" | "Deactivated";
};

export type Startup = {
  id: string;
  name: string;
  founder: string;
  logo: string;
  industry: string;
  founded: string;
  employees: string;
  summary: string;
  businessModel: string;
  fundingHistory: string;
  memo: string;
  scores: {
    'Team Strength': number;
    'Market Potential': number;
    'Financial Viability': number;
    'Problem Significance': number;
    'Solution Uniqueness': number;
  };
  traction: {
    mrr: number;
    dau: number;
    mau: number;
  };
  company: string;
  website: string;
  sector: "AI/ML" | "HealthTech" | "CleanTech" | "FinTech" | "SaaS";
  stage: "Pre-Seed" | "Seed" | "Series A" | "Series B" | "Growth";
  oneLiner: string;
  deckUrl: string;
  audioUrl?: string;
  videoUrl?: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: Date;
  founderId: string;
  risk: {
    market: "low" | "medium" | "high";
    tech: "low" | "medium" | "high";
    team: "low" | "medium" | "high";
  };
};

export type Memo = {
  id: string;
  startupId: string;
  type: "Memo 1" | "Memo 2";
  status: "In Progress" | "Completed";
  content: {
    founderAndTeam: string;
    problemAndMarket: string;
    differentiation: string;
    businessAndTraction: string;
    comparables: string;
    riskFlags: string;
    callInsights?: string;
  };
  sources: string[];
};

export type Meeting = {
    id: string;
    title: string;
    participants: string[];
    mode: "Agent" | "1-on-1";
    type: "Voice" | "Video";
    time: Date;
    status: "Upcoming" | "Past" | "Canceled";
    link: string;
};


export type Connection = {
    id: string;
    investorId: string;
    founderId: string;
    startupId: string;
    status: "requested" | "accepted" | "declined";
}
