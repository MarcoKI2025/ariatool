export interface SliderConfig {
  id: string;
  fieldKey: string;
  category: string;
  name: string;
  description: string;
  tooltip: string;
  explainText?: string;
  min: number;
  max: number;
  defaultValue: number;
  labels: Record<number, string>;
}

// ══════════════════════════════════════════════════════════
// CATEGORY 1: CORE AFI DIMENSIONS (10 Sliders)
// ══════════════════════════════════════════════════════════

export const CORE_AFI_SLIDERS: SliderConfig[] = [
  {
    id: 'autonomy',
    fieldKey: 'automation',
    category: 'Core AFI',
    name: 'Autonomy Level',
    description: 'Degree of autonomous decision-making without human confirmation',
    tooltip: 'Level of autonomous execution authority. 1 = Human confirms every action. 3 = AI executes routine decisions autonomously, human approves high-stakes. 5 = AI executes all decisions including high-stakes without confirmation. Higher autonomy increases Delegation Ratio (DR) in AFI calculation.',
    explainText: 'Automation level determines how often the AI system acts without waiting for human sign-off. At level 4–5, the system can initiate decisions, execute transactions, or trigger workflows independently — creating exposure that accumulates between review cycles.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Human-in-Loop', 2: 'Assisted', 3: 'Supervised', 4: 'Autonomous', 5: 'Fully Autonomous' }
  },
  {
    id: 'execution',
    fieldKey: 'executionAuthority',
    category: 'Core AFI',
    name: 'Execution Authority',
    description: 'Can AI commit binding actions (transactions, contracts, communications)?',
    tooltip: 'Authority to execute consequential actions. 1 = AI only recommends, human executes. 3 = AI executes non-financial actions autonomously. 5 = AI commits financial transactions, signs contracts, sends legal communications. Higher execution authority increases Delegation Ratio (DR).',
    explainText: 'Execution authority is the primary driver of the Delegation Ratio (DR). A system with full execution authority can commit to decisions — financial, operational, or regulatory — that are difficult or impossible to reverse without significant disruption.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Recommend Only', 2: 'Low-Stakes Execute', 3: 'Medium-Stakes', 4: 'High-Stakes', 5: 'Binding Authority' }
  },
  {
    id: 'oversight',
    fieldKey: 'oversightLevel',
    category: 'Core AFI',
    name: 'Oversight Quality',
    description: 'Depth and rigor of AI system oversight',
    tooltip: 'Quality of human oversight mechanisms. 1 = No structured oversight. 3 = Periodic review cycles, documented checkpoints. 5 = Continuous monitoring, real-time intervention capability, dedicated oversight team. Higher oversight increases Justificatory Density (JD), reducing AFI.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Ad-hoc', 2: 'Periodic', 3: 'Structured', 4: 'Active', 5: 'Continuous' }
  },
  {
    id: 'reviewCadence',
    fieldKey: 'reviewCadence',
    category: 'Core AFI',
    name: 'Review Cadence',
    description: 'Frequency of formal AI system governance reviews',
    tooltip: 'How often AI deployment is formally reviewed and re-authorized. 1 = No regular reviews, system runs indefinitely. 3 = Quarterly reviews with documented decisions. 5 = Monthly reviews with explicit re-authorization required. EU AI Act Art. 72 requires periodic post-market monitoring. Higher cadence increases JD, reducing AFI.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Never / Ad-hoc', 2: 'Annual', 3: 'Quarterly', 4: 'Monthly', 5: 'Continuous' }
  },
  {
    id: 'sunsetCapability',
    fieldKey: 'sunsetPolicy',
    category: 'Core AFI',
    name: 'Sunset Capability',
    description: 'Ability to deactivate or sunset AI system cleanly',
    tooltip: 'How easily the AI system can be turned off without disrupting operations. 1 = Shutdown would cause operational collapse, no rollback plan. 3 = Sunset possible but requires 3-6 months planning. 5 = Clean shutdown in <30 days, documented rollback procedures, alternative processes ready. Lower sunset capability increases Reversibility Cost (RC), increasing AFI.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Impossible', 2: '12+ months', 3: '3-6 months', 4: '1-3 months', 5: '<30 days' }
  },
  {
    id: 'switchingCost',
    fieldKey: 'switchingCost',
    category: 'Core AFI',
    name: 'Switching Cost',
    description: 'Cost and complexity of moving to alternative AI provider',
    tooltip: 'Effort required to switch to a different AI provider or model. 1 = API-compatible alternatives exist, switch in days. 3 = Some custom integration, switch requires 2-3 months. 5 = Proprietary dependencies, custom fine-tuning, 12+ months to switch. Higher switching cost increases RC, increasing AFI.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Trivial', 2: 'Low', 3: 'Moderate', 4: 'High', 5: 'Prohibitive' }
  },
  {
    id: 'portability',
    fieldKey: 'portability',
    category: 'Core AFI',
    name: 'Portability',
    description: 'How easily can prompts, data, workflows move to alternative systems?',
    tooltip: 'Ability to migrate AI workflows to alternative platforms. 1 = Fully portable, standard APIs, no lock-in. 3 = Some proprietary formats, partial migration possible. 5 = Completely locked to vendor-specific architecture, cannot migrate. Lower portability increases RC, increasing AFI.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Fully Portable', 2: 'Mostly Portable', 3: 'Partial', 4: 'Vendor Lock-in', 5: 'Proprietary' }
  },
  {
    id: 'integrationDepth',
    fieldKey: 'integrationDepth',
    category: 'Core AFI',
    name: 'Integration Depth',
    description: 'How deeply is AI embedded in core business processes?',
    tooltip: 'Depth of AI integration into operational workflows. 1 = Peripheral tool, easily bypassed. 3 = Integrated into several key workflows, but workarounds exist. 5 = Core business logic depends on AI, no manual alternative. Higher integration increases Continuation Density (CD), increasing AFI.',
    explainText: 'Integration depth measures how many other systems, workflows, and processes depend on this AI system. Deep integration creates structural lock-in — the system cannot be modified, replaced, or shut down without cascading disruption across connected processes.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Peripheral', 2: 'Supporting', 3: 'Integrated', 4: 'Core', 5: 'Mission-Critical' }
  },
  {
    id: 'deploymentDensity',
    fieldKey: 'actionDensity',
    category: 'Core AFI',
    name: 'Deployment Density',
    description: 'Concentration of AI usage across organization',
    tooltip: 'How many business units or processes use the AI system. 1 = Single team, isolated use case. 3 = Multiple departments, coordinated usage. 5 = Organization-wide deployment, all units dependent. Higher density increases CD, increasing AFI.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Isolated', 2: 'Departmental', 3: 'Cross-Functional', 4: 'Enterprise-Wide', 5: 'Universal' }
  },
  {
    id: 'systemBreadth',
    fieldKey: 'workflowBreadth',
    category: 'Core AFI',
    name: 'System Breadth',
    description: 'Number of distinct AI use cases or applications',
    tooltip: 'How many different use cases or applications involve AI. 1 = Single use case (e.g. one chatbot). 3 = 3-5 distinct use cases across organization. 5 = 10+ use cases, AI is pervasive across operations. Higher breadth increases CD, increasing AFI.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: '1 Use Case', 2: '2-3 Use Cases', 3: '4-6 Use Cases', 4: '7-10 Use Cases', 5: '10+ Use Cases' }
  },
];
// ══════════════════════════════════════════════════════════
// CATEGORY 2: CRITICALITY & RISK PROFILE (1 Slider)
// ══════════════════════════════════════════════════════════

export const RISK_PROFILE_SLIDERS: SliderConfig[] = [
  {
    id: 'criticalityScore',
    fieldKey: 'criticality',
    category: 'Risk Profile',
    name: 'Criticality Score',
    description: 'Business impact if AI system fails or produces errors',
    tooltip: 'Consequence severity if AI fails or malfunctions. 1 = Low impact, easily contained (e.g. internal tool). 3 = Moderate impact, affects customer experience or operations. 5 = Critical impact, regulatory breach, financial loss, safety risk. EU AI Act: High-risk systems (employment, creditworthiness, safety) trigger Art. 26 obligations. Higher criticality amplifies Continuation Density.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Low Impact', 2: 'Minor Impact', 3: 'Moderate Impact', 4: 'High Impact', 5: 'Critical Impact' }
  },
];

// ══════════════════════════════════════════════════════════
// CATEGORY 3: AGENT-SPECIFIC INPUTS (4 Sliders)
// ══════════════════════════════════════════════════════════

export const AGENT_SLIDERS: SliderConfig[] = [
  {
    id: 'multiAgentOrch',
    fieldKey: 'multiAgent',
    category: 'Agent Architecture',
    name: 'Multi-Agent Orchestration',
    description: 'Number of AI agents coordinating in workflows',
    tooltip: 'Complexity of multi-agent coordination. 1 = Single AI model, no agent orchestration. 3 = 2-3 agents coordinating (e.g. research agent → writing agent). 5 = Complex agent swarms, 5+ agents with hierarchical orchestration. Each agent layer adds delegation depth and amplifies DR. Multi-agent failures cascade non-linearly.',
    explainText: 'OpenAI Agents SDK, Anthropic tool-use chains, LangGraph, CrewAI, AutoGen and similar frameworks enable one AI to instruct another. Risk is non-linear: in a 5-agent chain, a 20% error rate per step compounds to an 80%+ failure probability at the output — but each step may appear valid in isolation. Standard underwriting frameworks have no mechanism to price this compounding.',
    min: 1, max: 5, defaultValue: 1,
    labels: { 1: 'Single Agent', 2: 'Dual Agents', 3: '3-4 Agents', 4: '5-7 Agents', 5: '8+ Agent Swarm' }
  },
  {
    id: 'toolCallAuthority',
    fieldKey: 'toolCallAuthority',
    category: 'Agent Architecture',
    name: 'Tool-Call Authority',
    description: 'Can AI agents call external APIs, databases, or services?',
    tooltip: 'Authority for AI to invoke external tools or APIs. 1 = No tool access, AI only processes text. 3 = Limited tool calls (read-only APIs, internal databases). 5 = Full tool authority: write to databases, send emails, execute code, financial APIs. Tool-calling agents create execution paths outside traditional oversight. Amplifies DR significantly.',
    explainText: 'MCP (Model Context Protocol), OpenAI function calling, and similar frameworks allow agents to execute real actions: send emails, execute SQL, call payment APIs, write code, modify files. A tool-calling agent at level 4–5 can produce irreversible real-world consequences in milliseconds — far faster than any human governance mechanism can respond. This is qualitatively different from "automation level" — it is about consequence velocity.',
    min: 1, max: 5, defaultValue: 1,
    labels: { 1: 'No Tools', 2: 'Read-Only', 3: 'Limited Write', 4: 'Broad Write', 5: 'Full Authority' }
  },
  {
    id: 'persistentMemory',
    fieldKey: 'persistentMemory',
    category: 'Agent Architecture',
    name: 'Persistent Memory',
    description: 'Does AI maintain state/memory across sessions?',
    tooltip: 'Whether AI retains context and state across interactions. 1 = Stateless, every interaction is independent. 3 = Session memory (context within single conversation). 5 = Long-term memory across sessions, learns from history, builds user profiles. Persistent memory creates proprietary lock-in (cannot migrate memory stores easily). Increases Reversibility Cost (RC).',
    explainText: 'Persistent memory systems (OpenAI persistent threads, Claude\'s memory feature, LangChain vector stores, Mem0) accumulate context that shapes future agent behaviour without explicit human review. A governance decision logged in memory 6 months ago may be silently influencing today\'s agent actions — creating a semantic drift vector that no audit trail captures unless specifically designed to do so.',
    min: 1, max: 5, defaultValue: 1,
    labels: { 1: 'Stateless', 2: 'Session Only', 3: 'Short-Term', 4: 'Long-Term', 5: 'Permanent Profile' }
  },
  {
    id: 'humanCheckpoints',
    fieldKey: 'humanCheckpoints',
    category: 'Agent Architecture',
    name: 'Human Checkpoint Coverage',
    description: 'Percentage of AI workflows with mandatory human review',
    tooltip: 'What % of AI execution paths have human checkpoints. 1 = <20% coverage, most actions unchecked. 3 = 40-60% coverage, key decisions reviewed. 5 = >80% coverage, comprehensive checkpoint architecture. Higher checkpoint coverage constrains delegation, reducing DR. EU AI Act Art. 26 §2 requires human oversight for high-risk systems.',
    explainText: 'For agentic systems, the question is not "is there oversight?" but "at which decision nodes does a human explicitly approve before action?" An agent that sends 1,000 routine emails autonomously but requires approval before any financial commitment has a very different risk profile than one that acts freely across all domains. Checkpoint coverage is the primary lever for reducing agent governance fragility.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: '<20% Coverage', 2: '20-40%', 3: '40-60%', 4: '60-80%', 5: '>80% Coverage' }
  },
];

// ══════════════════════════════════════════════════════════
// CATEGORY 4: LIABILITY RISK DIMENSIONS (5 Sliders)
// ══════════════════════════════════════════════════════════

export const LIABILITY_SLIDERS: SliderConfig[] = [
  {
    id: 'hallucinationExposure',
    fieldKey: 'hallucinationLiability',
    category: 'Liability Risk',
    name: 'Hallucination Exposure',
    description: 'Risk that AI outputs are presented as factual without verification',
    tooltip: 'Risk of AI generating false information presented as fact. 1 = Outputs verified before customer-facing use. 3 = Some verification, but gaps exist. 5 = Customer-facing outputs without systematic verification, direct E&O liability.',
    explainText: 'Hallucination liability is the fastest-growing AI claims category in 2025. AIG and W.R. Berkley are seeking regulatory approval to exclude "any actual or alleged use of AI" from standard corporate policies. If your AI outputs are customer-facing, legally relevant, or used in decisions — without human review before delivery — you carry unpriced E&O exposure that standard cyber policies do not cover.',
    min: 1, max: 5, defaultValue: 1,
    labels: { 1: 'Fully Verified', 2: 'Mostly Verified', 3: 'Partial Verification', 4: 'Minimal Verification', 5: 'Unverified Output' }
  },
  {
    id: 'deepfakeRisk',
    fieldKey: 'deepfakeFraud',
    category: 'Liability Risk',
    name: 'Deepfake / Synthetic Media Risk',
    description: 'Exposure to AI-generated video, audio, or image fraud',
    tooltip: 'Risk from AI-generated synthetic media used for fraud or impersonation. 1 = No generative media capabilities. 5 = Public-facing synthetic media without robust authentication.',
    explainText: 'Deepfakes require only 10 seconds of public footage of a corporate leader to enable voice/video impersonation. Standard social engineering coverage may not respond to deepfake-specific losses unless explicitly endorsed. Coalition\'s December 2025 endorsement is the first market-standard response — most policies still have no explicit deepfake trigger.',
    min: 1, max: 5, defaultValue: 1,
    labels: { 1: 'Not Applicable', 2: 'Internal Only', 3: 'Controlled Use', 4: 'Limited Public', 5: 'Public-Facing' }
  },
  {
    id: 'promptInjection',
    fieldKey: 'promptInjection',
    category: 'Liability Risk',
    name: 'Prompt Injection Risk',
    description: 'Vulnerability to adversarial prompt manipulation',
    tooltip: 'Risk that external users can manipulate AI behavior via crafted prompts. 1 = No user-facing prompts. 5 = Direct user prompt access, minimal input validation.',
    explainText: 'Prompt injection is qualitatively different from traditional cyber attack: a legitimate-looking email or document can redirect an AI agent\'s behaviour without triggering any traditional security alert. Traditional cybersecurity controls are insufficient — CGI\'s 2026 research calls this "architectural" risk requiring specific AI governance controls, not just security tooling.',
    min: 1, max: 5, defaultValue: 1,
    labels: { 1: 'No User Prompts', 2: 'Heavily Filtered', 3: 'Moderate Filtering', 4: 'Light Filtering', 5: 'Direct Access' }
  },
  {
    id: 'modelDrift',
    fieldKey: 'modelDrift',
    category: 'Liability Risk',
    name: 'Model Drift / Behavioral Shift',
    description: 'Risk of AI behavior changing unexpectedly over time',
    tooltip: 'Risk that AI behavior changes without explicit updates. 1 = Locked model version. 5 = Continuous model updates, no version control or drift detection.',
    explainText: 'Model drift is the primary mechanism behind systemic AI liability. The Cigna case shows how a production model can silently accumulate discriminatory decisions — creating class-action exposure that only becomes visible at regulatory intervention. NAIC\'s 2026 AI Systems Evaluation Tool explicitly requires "assessments of model drift, repeatability and auditability." Absence of drift monitoring is now a direct underwriting flag.',
    min: 1, max: 5, defaultValue: 1,
    labels: { 1: 'Version Locked', 2: 'Controlled Updates', 3: 'Monitored Rolling', 4: 'Auto-Updates', 5: 'Uncontrolled Drift' }
  },
  {
    id: 'algorithmicBias',
    fieldKey: 'algorithmicBias',
    category: 'Liability Risk',
    name: 'Algorithmic Bias Risk',
    description: 'Risk of discriminatory or unfair AI outputs',
    tooltip: 'Risk of AI producing biased or discriminatory outcomes. 1 = Comprehensive bias testing. 5 = No bias testing, decisions affect protected groups without validation.',
    explainText: 'Colorado\'s 2025 AI Act requires insurers to follow governance and testing procedures to prevent unfair discrimination. 50 US states introduced AI legislation in 2025. The EU AI Act classifies AI used in employment, credit, insurance and healthcare as high-risk (Annex III), requiring fundamental rights impact assessments. Absence of bias documentation is moving from reputational risk to regulatory liability.',
    min: 1, max: 5, defaultValue: 1,
    labels: { 1: 'Tested & Monitored', 2: 'Periodic Audits', 3: 'Reactive Mitigation', 4: 'Minimal Testing', 5: 'Untested' }
  },
  {
    id: 'dataIntegrity',
    fieldKey: 'dataIntegrity',
    category: 'Liability Risk',
    name: 'Data Supply Chain Integrity',
    description: 'Confidence in training data provenance and quality',
    tooltip: 'Assurance that AI training data is accurate, unbiased, and legally obtained. 1 = Full data lineage. 5 = No provenance tracking.',
    explainText: 'Data supply chain integrity is the "upstream" equivalent of prompt injection. A compromised data vendor or poisoned training dataset can corrupt every decision the AI makes — systematically and invisibly. The EU AI Act (Art. 10) mandates data governance for high-risk AI systems.',
    min: 1, max: 5, defaultValue: 2,
    labels: { 1: 'Full Lineage', 2: 'Known Sources', 3: 'Partial Lineage', 4: 'Unknown Sources', 5: 'No Tracking' }
  },
  {
    id: 'esgAlignment',
    fieldKey: 'esgLiability',
    category: 'Liability Risk',
    name: 'ESG / Climate Risk Alignment',
    description: 'Exposure to climate-related AI infrastructure risks',
    tooltip: 'Vulnerability to climate/ESG risks in AI supply chain. Water usage, energy grid stress, physical location risks.',
    explainText: 'AI data centres consume enormous energy and water resources. A single GPT-4 training run consumes as much electricity as 120 US homes use in a year. Regulatory ESG disclosure requirements (CSRD, SFDR) increasingly cover AI infrastructure dependencies.',
    min: 1, max: 5, defaultValue: 2,
    labels: { 1: 'Low ESG Risk', 2: 'Moderate ESG Risk', 3: 'Some ESG Exposure', 4: 'High ESG Risk', 5: 'Critical ESG Risk' }
  },
];

// ══════════════════════════════════════════════════════════
// CATEGORY 5: GOVERNANCE & TRANSPARENCY (3 Sliders)
// ══════════════════════════════════════════════════════════

export const GOVERNANCE_SLIDERS: SliderConfig[] = [
  {
    id: 'shadowAI',
    fieldKey: 'shadowAI',
    category: 'Governance',
    name: 'Shadow AI Prevalence',
    description: 'Extent of unauthorized or untracked AI usage',
    tooltip: 'Degree of unmanaged AI usage outside official channels. 1 = All AI use is centrally managed. 5 = Widespread shadow AI, no visibility.',
    explainText: 'Shadow AI is the primary vector for data exfiltration and privacy violations in 2025–2026. Employees uploading customer PII, contracts, or IP into public LLMs creates direct GDPR/data protection liability — and may void cyber insurance coverage if the insurer determines the loss arose from unauthorised use of AI. Coalition identifies chatbots as an "emerging risk" based on nearly 200 cyber claims from 2023–25.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Fully Managed', 2: 'Mostly Managed', 3: 'Some Shadow AI', 4: 'Significant Shadow', 5: 'Widespread Shadow' }
  },
  {
    id: 'explainability',
    fieldKey: 'explainabilityGap',
    category: 'Governance',
    name: 'Explainability / XAI',
    description: 'Ability to explain AI decisions to stakeholders',
    tooltip: 'Capability to provide clear explanations of AI decisions. 1 = Full explainability. 5 = Complete black box.',
    explainText: 'Explainability gap creates a "forensic liability hole" — when an AI causes harm, the organisation cannot explain what happened, cannot demonstrate due diligence, and cannot defend itself in litigation. Digital Insurance (Feb 2026) reports that insurers now view unexplainable AI as approaching "uninsurable" territory. A human kill switch and audit trail are moving from best practice to coverage prerequisites.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Fully Explainable', 2: 'Mostly Explainable', 3: 'Partially Explainable', 4: 'Limited Explainability', 5: 'Black Box' }
  },
  {
    id: 'dataIntegrity',
    fieldKey: 'dataIntegrity',
    category: 'Governance',
    name: 'Data Supply Chain Integrity',
    description: 'Confidence in training data provenance and quality',
    tooltip: 'Assurance that AI training data is accurate, unbiased, and legally obtained. 1 = Full data lineage. 5 = No provenance tracking.',
    explainText: 'Data supply chain integrity is the "upstream" equivalent of prompt injection. A compromised data vendor or poisoned training dataset can corrupt every decision the AI makes — systematically and invisibly. The EU AI Act (Art. 10) mandates data governance for high-risk AI systems. EIOPA GenAI Survey (Feb 2026) found data quality and integrity as the primary governance concern among European insurers using generative AI.',
    min: 1, max: 5, defaultValue: 2,
    labels: { 1: 'Full Lineage', 2: 'Known Sources', 3: 'Partial Lineage', 4: 'Unknown Sources', 5: 'No Tracking' }
  },
];

// ══════════════════════════════════════════════════════════
// CATEGORY 6: SYSTEMIC / CONCENTRATION RISK (5 Sliders)
// ══════════════════════════════════════════════════════════

export const SYSTEMIC_SLIDERS: SliderConfig[] = [
  {
    id: 'cloudProviderConcentration',
    fieldKey: 'cloudConcentration',
    category: 'Systemic Risk',
    name: 'Cloud Provider Concentration',
    description: 'Diversity of cloud infrastructure providers',
    tooltip: 'Number of distinct cloud providers supporting AI workloads. Lower diversity = higher systemic risk.',
    explainText: 'Swiss Re sigma insights 01/2026 identifies this as the fastest-growing new risk category: "Growing reliance on a small number of cloud and AI service providers adds a further layer of systemic and accumulation risk." These inputs drive the Portfolio Cascade Amplification factor — the mechanism behind non-linear aggregate losses.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Single Provider', 2: 'Primary + Backup', 3: 'Two Active', 4: 'Three Providers', 5: 'Multi-Cloud Active' }
  },
  {
    id: 'modelProviderConcentration',
    fieldKey: 'modelConcentration',
    category: 'Systemic Risk',
    name: 'Model Provider Concentration',
    description: 'Diversity of AI model providers',
    tooltip: 'Number of distinct AI model providers. Single provider creates correlated failure risk.',
    explainText: 'Model provider outages (OpenAI Nov 2023: 3hrs global impact) create correlated exposure across all customers. A single provider event affects every entity in the portfolio that depends on that provider simultaneously — geographic diversification does not help.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Single Provider', 2: 'Primary + Backup', 3: 'Two Active', 4: 'Three Providers', 5: 'Multi-Provider' }
  },
  {
    id: 'gpuConcentration',
    fieldKey: 'gpuConcentration',
    category: 'Systemic Risk',
    name: 'GPU / Compute Concentration',
    description: 'Concentration in compute infrastructure',
    tooltip: 'Dependence on specific GPU clusters or compute regions. Concentration creates systemic bottlenecks.',
    explainText: 'Swiss Re sigma 01/2026 identifies Hyperscale Data Centres and High-Performance Computing as new insurable asset classes with concentration risk. GPU shortages, datacenter outages, or regional power failures create systemic bottlenecks that cascade across all AI-dependent operations.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Single Region', 2: 'Multi-Region', 3: 'Multi-Provider', 4: 'Distributed', 5: 'Fully Diversified' }
  },
  {
    id: 'crossVendorContagion',
    fieldKey: 'crossVendorContagion',
    category: 'Systemic Risk',
    name: 'Cross-Vendor Contagion Risk',
    description: 'Degree of shared dependencies across AI vendors',
    tooltip: 'Extent to which different AI vendors share underlying infrastructure. Hidden correlations amplify tail risk.',
    explainText: 'Multiple AI providers running on the same underlying cloud (e.g. AWS) creates hidden correlation: an AWS outage affects all simultaneously. The Crowdstrike incident (July 2024) demonstrated how a single vendor failure cascaded across the entire Microsoft ecosystem globally — affecting airlines, hospitals, banks, and government services simultaneously.',
    min: 1, max: 5, defaultValue: 3,
    labels: { 1: 'Isolated Stacks', 2: 'Mostly Isolated', 3: 'Some Overlap', 4: 'Significant Overlap', 5: 'Fully Correlated' }
  },
  {
    id: 'esgAlignment',
    fieldKey: 'esgLiability',
    category: 'Systemic Risk',
    name: 'ESG / Climate Risk Alignment',
    description: 'Exposure to climate-related AI infrastructure risks',
    tooltip: 'Vulnerability to climate/ESG risks in AI supply chain. Water usage, energy grid stress, physical location risks.',
    explainText: 'AI data centres consume enormous energy and water resources. A single GPT-4 training run consumes as much electricity as 120 US homes use in a year. Water-cooled data centres in water-stressed regions create physical climate risk. Regulatory ESG disclosure requirements (CSRD, SFDR) increasingly cover AI infrastructure dependencies.',
    min: 1, max: 5, defaultValue: 2,
    labels: { 1: 'Low ESG Risk', 2: 'Moderate ESG Risk', 3: 'Some ESG Exposure', 4: 'High ESG Risk', 5: 'Critical ESG Risk' }
  },
];

// All slider categories for rendering
export const SLIDER_CATEGORIES = [
  {
    key: 'core-afi',
    title: 'Core AFI Dimensions',
    icon: '📐',
    subtitle: 'These 10 inputs directly drive the Authority Fragility Index (AFI). AFI = (DR × RC × CD) / (JD × NA). Each slider maps to one of the five AFI components.',
    badge: '10 inputs · Core AFI Formula',
    confidenceBadge: 'Self-Declared',
    sliders: CORE_AFI_SLIDERS,
  },
  {
    key: 'risk-profile',
    title: 'Criticality & Risk Profile',
    icon: '⚡',
    subtitle: 'Business impact classification. Higher criticality amplifies Continuation Density and increases premium loading.',
    badge: '1 input · Impact Assessment',
    sliders: RISK_PROFILE_SLIDERS,
  },
  {
    key: 'agent-arch',
    title: 'AI Agent Architecture',
    icon: '🤖',
    subtitle: 'Autonomous AI agents create non-linear exposure through multi-agent orchestration, tool-calling authority, and persistent memory. These inputs apply specifically to <strong>agentic AI systems</strong> — autonomous agents that plan, use tools, spawn sub-agents, or maintain persistent memory.',
    badge: '4 inputs · Agentic Risk',
    confidenceBadge: 'Emerging Risk Class',
    sliders: AGENT_SLIDERS,
  },
  {
    key: 'liability',
    title: 'AI-Specific Liability Exposure',
    icon: '⚠',
    subtitle: 'These dimensions reflect actual AI liability claim patterns emerging in 2025–2026. Each maps to a realized or imminent loss vector with documented precedent.',
    badge: '5 inputs · 2025–26 Claim Vectors',
    confidenceBadge: '2025–2026 Claim Patterns',
    sliders: LIABILITY_SLIDERS,
  },
  {
    key: 'governance',
    title: 'Governance & Transparency',
    icon: '🔒',
    subtitle: 'Governance maturity signals that affect Justificatory Density and overall risk posture. Low scores signal systemic entrenchment — the system cannot be safely exited without significant disruption.',
    badge: '3 inputs · Governance Maturity',
    sliders: GOVERNANCE_SLIDERS,
  },
  {
    key: 'systemic',
    title: 'Systemic & Concentration Risk',
    icon: '🌐',
    subtitle: 'Swiss Re sigma 01/2026: "Growing reliance on a small number of cloud and AI service providers adds a further layer of systemic and accumulation risk." Lower diversity scores indicate higher concentration risk.',
    badge: '5 inputs · Swiss Re sigma 01/2026',
    sliders: SYSTEMIC_SLIDERS,
  },
];

export const ALL_SLIDERS = [
  ...CORE_AFI_SLIDERS,
  ...RISK_PROFILE_SLIDERS,
  ...AGENT_SLIDERS,
  ...LIABILITY_SLIDERS,
  ...GOVERNANCE_SLIDERS,
  ...SYSTEMIC_SLIDERS,
];
