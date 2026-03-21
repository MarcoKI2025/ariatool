export const TOOLTIPS = {
  afi: `Authority Fragility Index (AFI) measures structural dependency, governance gaps, and continuation risk in AI deployments. Range: 0.0 (minimal dependency) to 3.0+ (extreme fragility). Thresholds: <0.85 Stable, 0.85-1.35 Sensitive, >1.35 Fragile. Formula: AFI = (DR × RC × CD) / (JD × NA). Developed by AI Governance Architecture Framework (AGAF) v3.0.`,

  band: `Risk classification based on AFI score. Stable (<0.85): Within normal parameters, maintain governance cadence. Sensitive (0.85-1.35): Elevated exposure, structural improvements recommended within 90 days. Fragile (>1.35): Above underwriting tolerance, mandatory governance remediation required. Band determines insurance premium loading and regulatory attention.`,

  cd: `Continuation Density (CD) measures how deeply AI is embedded in ongoing operations. Higher CD means system continues operating without explicit re-authorization, creating governance drift. Combines: Integration Depth + Deployment Density + System Breadth. Range: 0.0 (peripheral tool) to 1.0 (mission-critical dependency).`,

  dependencies: `AI providers and models your organization relies on. Examples: OpenAI GPT-4, Anthropic Claude, Google Gemini, Azure OpenAI Service. Provider concentration creates correlated exposure: if one provider fails, all dependent systems fail simultaneously. Swiss Re sigma 01/2026: "Growing reliance on small number of providers adds systemic risk."`,

  dr: `Delegation Ratio (DR) measures degree of autonomous decision-making without human confirmation. Higher DR = more decisions made by AI without oversight. Combines: Autonomy Level + Execution Authority + Multi-Agent amplification - Human Checkpoints. Range: 0.0 (human confirms everything) to 1.0 (fully autonomous execution). EU AI Act Art. 26 §2 requires human oversight for high-risk systems.`,

  eci: `Existence Cost of Intelligence (ECI) classifies systems by operational dependency and infrastructure status. Tier 0: Peripheral tool, easily replaced. Tier 1: Embedded tool, operational convenience. Tier 2: Infrastructural system, significant operational dependency. Tier 3: Critical infrastructure, business cannot function without it. Higher ECI triggers EU AI Act Infrastructural AI continuation governance review.`,

  euAiAct: `EU AI Act (Regulation 2024/1689) entered force August 2024. Key dates: Art. 5 prohibited practices (Feb 2025), GPAI model provisions (Aug 2025), High-risk deployer obligations Art. 26 (Aug 2026). Penalties: Up to €35M or 7% global turnover for prohibited practices (Art. 99 §3), Up to €15M or 3% turnover for deployer violations (Art. 99 §4). This tool assesses structural exposure, not legal compliance.`,

  iat: `Infrastructural AI Trigger (IAT) — 7 criteria that indicate when an AI system has become infrastructural and requires continuation governance review (AGAF §5.2). Criteria: Revenue dependency >40%, No documented alternatives, Business processes redesigned around AI, >12 months continuous operation, No formal re-authorization cycle, Provider lock-in >18 months to exit, Cross-system cascade exposure. 6+ criteria = Continuation governance mandatory before August 2026.`,

  jd: `Justificatory Density (JD) measures quality and frequency of human oversight and governance review. Higher JD = better governance. Combines: Oversight Quality + Review Cadence. Range: 0.0 (no oversight) to 1.0 (continuous monitoring with re-authorization). Low JD creates governance gaps where AI operates without scrutiny. EU AI Act Art. 72 requires periodic post-market monitoring.`,

  mdr: `Model Dependency Ratio (MDR) measures concentration risk in AI model providers. Formula: MDR = 1 / (number of distinct providers). Examples: Single provider (OpenAI only) = MDR 1.0 (maximum concentration). Two providers = MDR 0.5. Four providers = MDR 0.25 (diversified). Higher MDR amplifies correlated failure risk. Swiss Re sigma 01/2026: Provider concentration creates systemic exposure.`,

  na: `Network Amplification (NA) captures how risk propagates across interconnected systems. Fixed at 0.5 in current version. Future versions will model cross-system cascade effects. Lower NA increases AFI (risk amplifies more severely). Relevant for organizations with tightly coupled AI systems where failure in one triggers cascade across others.`,

  premium: `Indicative annual premium range for AI Liability / Tech E&O coverage based on AFI score, industry sector, and revenue scale. NOT actuarially certified. NOT binding. Governance-oriented estimate only. Formula: Base Premium (€120k) × Industry Multiplier × AFI Loading × Revenue Scale. Fragile band (AFI >1.35): Premium loading +40-80% above standard baseline. Use ONLY with independent actuarial validation.`,

  rc: `Reversibility Cost (RC) measures difficulty of exiting or replacing AI system. Higher RC = harder to reverse deployment. Combines: Switching Cost + (1 - Sunset Capability) + Portability + Provider Concentration penalty. Range: 0.0 (trivial to exit) to 1.0 (irreversible dependency). High RC creates lock-in: organization cannot easily stop using AI even if it becomes problematic. Increases AFI significantly.`,

  rfs: `Responsibility Fragmentation Score (RFS) measures clarity of system ownership and accountability. Scale 0-100. Low RFS (0-40): Clear ownership, named accountable individual, documented stop authority. High RFS (70-100): No single owner, diffused responsibility, unclear escalation paths. EU AI Act Art. 26 requires deployers to assign clear responsibility. High RFS creates governance vacuum where no one can stop problematic AI.`,

  rfsi: `Risk-Free Substitution Index (RFSI) measures whether alternative non-AI processes exist and are maintained. High RFSI: Manual alternatives documented and exercised, can operate without AI. Low RFSI: Manual processes deprecated, institutional knowledge lost, cannot function without AI. Affects Continuation Density and Reversibility Cost. Organizations with low RFSI cannot easily sunset AI even if needed.`,

  sigmaInsights: `Swiss Re sigma insights 01/2026 (published 13 Jan 2026): "AI adoption, reshaping the (re)insurance landscape". Key findings: AI introduces emerging risk dimensions that do not fit neatly within traditional insurance boundaries. New insurable asset classes: Hyperscale Data Centres, High-Performance Computing (HPC), Expanded energy infrastructure. Growing reliance on small number of cloud and AI service providers adds systemic and accumulation risk. May lead to reallocation rather than pure growth of insurable demand.`,
};
