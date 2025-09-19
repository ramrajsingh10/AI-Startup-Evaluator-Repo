# **App Name**: StartupVerse

## Core Features:

- Home / Root (Public): If user not logged in: show hero + “Sign in”. If logged in: show a simple “Continue to your dashboard” with 3 buttons (Admin / Investor / Founder) that navigate to /admin, /investor, or /founder.
- Login (Public): Keep Email/Password + Google sign-in. Three info tiles explaining the roles (Admin, Investor, Founder). “Request access” modal (creates local mock record only; no backend).
- Admin Dashboard (/admin): Tabs: Access Control, Submissions, Memos, System. Access Control: table with columns: Email, Role, Status; row actions: Grant/Revoke (admin|investor|founder), Deactivate/Reactivate. Submissions: table of all startup submissions; row actions: Approve/Reject (mock). Memos: searchable list of Memo 1 / Memo 2; clicking opens Memo page (read-only). System: read-only cards showing placeholders for Region, Buckets, API endpoints.
- Startup Submission (/founder/submit) – Founders’ form (UI only): Fields: Company, Website, Sector, Stage, One-liner. Upload pickers (no real upload): Deck (PDF/PPTX), optional Audio/Video. Buttons: Save Draft (mock), Submit (mock). On Submit, create a local “submission” item and a local “Memo 1 in progress” item, then show a success toast. Button: “Schedule with AI Agent” → navigates to /meet with mode preset = “Agent”.
- Founder Dashboard (/founder): Cards: My Startup (latest submission with status and Edit link to /founder/submit). Memos (links to Memo 1 & Memo 2 pages if present, read-only). Investor Interest (list with status: requested / accepted / declined). Connections (list with Cancel connection action—mock). Meetings (upcoming/past; Reschedule/Cancel—mock).
- Investor Dashboard (/investor): Browse Startups: gallery/table of approved submissions; filters (Sector, Stage), search, sort (Recent, Traction—mock). Risk Heatmap: show Market/Tech/Team heat badges (static calculation for now). Growth Stage badges (Seed, Series A, etc.). Row actions: View Memo, Connect with Founder (creates mock connection), Schedule 1:1 (navigates to /meet).
- Investor Memo Page (/memo/[id]): Read-only layout with sections: Founder & Team, Problem & Market, Differentiation, Business & Traction, Comparables, Risk Flags; for Memo 2 add Call Insights section. Show “Memo 1” or “Memo 2” label and a simple Progress chip for in-progress state. Add a right-side “Sources” panel listing files/links (mock).
- Scheduling (/meet): Two modes: Agent (Founder ↔ AI Agent) and 1:1 (Investor ↔ Founder). Simple availability picker, Meeting type toggle (Voice/Video). On Schedule, create a mock meeting with a placeholder Meet link and show success toast. List of upcoming/past meetings with Cancel/Reschedule (mock).

## Style Guidelines:

- Primary color: Deep Indigo (#4B0082) for a professional and trustworthy feel, aligning with investment and strategic decision-making. Its versatility makes it suitable for various UI components.
- Background color: Very light grey (#F0F0F5), offering a subtle backdrop that allows content to stand out while maintaining a clean, corporate aesthetic.
- Accent color: Soft Lavender (#E6E6FA), analogous to indigo, yet with less saturation. It will bring a lighter contrast suitable for highlights, progress indicators, and interactive elements, while aligning with the primary's vibe.
- Body text: 'PT Sans', a versatile sans-serif, will be used for body text, and also used for headlines when the content needs a less expressive touch. Sans-serif.
- Simple, professional icons to represent different sections and actions.
- Card-based layout with clear sections for each role.
- Subtle animations for loading states and transitions to enhance user experience.