/**
 * Chronicles - Curated Mock News Feed
 * Provides instant, highly reliable fallbacks and topic-rich articles
 * formatted uniformly for the portal.
 */

export const FALLBACK_ARTICLES = [
  {
    id: "fb-1",
    title: "Quantum Breakthrough: New Quantum Processing Architecture Achieves Coherence Milestone",
    description: "Researchers at international laboratories have successfully demonstrated sustained quantum coherence across 1,000 qubits, paving the way for fault-tolerant quantum algorithms in cryptographic research and materials science.",
    content: "Quantum computing has cleared one of its most persistent theoretical hurdles. Today, a joint coalition of physics laboratories announced the sustained coherence of a 1,000-qubit topological array operating at near-absolute zero temperatures without exponential noise degradation.\n\nThe implications for high-throughput computational biology, climate modeling, and molecular simulation are profound. Lead researchers confirmed the platform utilized specialized error-mitigation pulse sequences that dynamically suppress environmental decoherence.\n\nIndustry analysts project that commercial grade quantum processors could reach pilot enterprise trials as early as next quarter, signaling a major paradigm shift for compute-heavy industries.",
    category: "technology",
    author: "Elena Rostova",
    source: "Chronicles Tech Lab",
    url: "https://example.com/quantum-breakthrough",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    readTime: "4 min read",
    isTrending: true,
    isBreaking: true
  },
  {
    id: "fb-2",
    title: "Global Clean Energy Transition Accelerates as Grid-Scale Solid-State Batteries Deploy",
    description: "Next-generation energy storage networks now supply renewable backup power to over 5 million households, eliminating peak-hour fossil fuel dependencies.",
    content: "The clean energy transition marked a historic inflection point this morning as the first metropolitan-scale solid-state storage battery farm became fully operational.\n\nUnlike traditional lithium-ion predecessors, these solid-state units boast zero degradation over twenty thousand cycles and operate under complete thermal stability. Regional energy ministers confirmed that the battery network absorbed record wind and solar surpluses over the weekend.\n\nEnergy economics experts estimate the initiative will reduce metropolitan peak power tariffs by up to 28% while providing rock-solid baseload resilience against extreme climatic conditions.",
    category: "world",
    author: "Marcus Thorne",
    source: "Global Ecological Review",
    url: "https://example.com/clean-energy-transition",
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    readTime: "5 min read",
    isTrending: true,
    isBreaking: false
  },
  {
    id: "fb-3",
    title: "Venture Markets Rally as Autonomous AI Workflow Infrastructure Expands Worldwide",
    description: "B2B automation platforms driven by autonomous agents see unprecedented seed and series funding across international financial hubs.",
    content: "Global technology equities and venture capitals closed sharply higher today following landmark quarterly earnings from major autonomous systems providers.\n\nCorporate adoption of multimodal AI agents across supply chain optimization, software testing, and compliance documentation has accelerated by 310% year-over-year. Investment syndicates note that profitability horizons for automated workflow platforms have compressed dramatically.\n\nFinancial regulators in London, Tokyo, and New York also published joint harmonized guidelines for autonomous algorithmic governance, providing welcomed clarity to enterprise institutional investors.",
    category: "business",
    author: "Devon Vance",
    source: "Wall Street Chronicle",
    url: "https://example.com/venture-markets-ai",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    readTime: "3 min read",
    isTrending: false,
    isBreaking: false
  },
  {
    id: "fb-4",
    title: "Deep-Space Observatories Uncover Earliest Known Organic Molecules in Young Star System",
    description: "Astronomers decipher spectroscopic signatures containing complex prebiotic hydro-carbons in a protoplanetary disk 450 light years away.",
    content: "Using infrared spectroscopic interferometry, astrophysicists have discovered complex organic compounds swirling in the accretion disk of a nascent stellar system.\n\nThe molecular inventory includes amino acid precursors, formaldehyde derivatives, and dense polycyclic hydrocarbons. These findings suggest that the biochemical ingredients required for planetary habitability are far more pervasive across the cosmos than previously theorized.\n\nA complete chemical breakdown will appear in next month's Astrophysical Journal, with follow-up observation runs scheduled for deep space radio telescopes in the southern hemisphere.",
    category: "science",
    author: "Dr. Maya Lin",
    source: "Cosmic Frontier",
    url: "https://example.com/deep-space-organic-molecules",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    readTime: "6 min read",
    isTrending: true,
    isBreaking: false
  },
  {
    id: "fb-5",
    title: "AI in Clinical Oncology: Predictive Biomarkers Identify Early-Stage Cell Abnormalities",
    description: "Groundbreaking medical clinical trial demonstrates 98.4% detection accuracy for latent oncological biomarkers years before clinical symptoms appear.",
    content: "A multi-center international trial across twelve leading university medical hospitals has validated a preventative blood-screening technique powered by predictive machine learning algorithms.\n\nBy analyzing micro-RNA fragmentation patterns alongside circulating tumor DNA, the platform successfully identified microscopic cellular changes with an unprecedented 98.4% specificity rate.\n\nChief medical officers hailed the development as a watershed moment for proactive preventive medicine, predicting that routine annual health screenings could incorporate these diagnostic panels within eighteen months.",
    category: "health",
    author: "Dr. Rachel Sterling",
    source: "Medical Lancet Tribune",
    url: "https://example.com/ai-clinical-oncology",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    readTime: "5 min read",
    isTrending: false,
    isBreaking: false
  },
  {
    id: "fb-6",
    title: "Indie Cinema Renaissance: Generative Virtual Production Tools Empower Independent Directors",
    description: "Low-budget filmmakers harness real-time rendering and virtual volumes to produce studio-caliber visual epics on shoestring budgets.",
    content: "The annual international festival of cinematic arts experienced an electrifying opening weekend dominated by independent creators utilizing open-source virtual production pipelines.\n\nRather than multimillion-dollar soundstages, independent directors utilized real-time 3D game engines and commodity LED backdrops to render breathtaking architectural landscapes and interstellar spectacles.\n\nFilm critics have universally celebrated the democratization of visionary filmmaking, noting that narrative originality and emotional authenticity are once again taking center stage over corporate committee formulas.",
    category: "entertainment",
    author: "Julian Hayes",
    source: "Cinematic Chronicles",
    url: "https://example.com/indie-cinema-renaissance",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    readTime: "4 min read",
    isTrending: false,
    isBreaking: false
  },
  {
    id: "fb-7",
    title: "Next-Gen Web Standards: The Rise of WebAssembly Components in Distributed Edge Cloud",
    description: "Developers adopt Wasm micro-runtimes delivering sub-millisecond cold starts and hardware-level isolation for distributed web backends.",
    content: "The landscape of cloud architecture is experiencing a monumental migration away from bulky operating system container images toward lightweight WebAssembly (Wasm) component models.\n\nWith zero-millisecond cold starts and minute memory footprints measuring in kilobytes rather than gigabytes, edge nodes can seamlessly execute polyglot microservices at wire speed.\n\nSoftware engineering architects report up to 70% infrastructure cost savings and near-instantaneous scaling responses during intense traffic spikes.",
    category: "technology",
    author: "Devon Vance",
    source: "Chronicles Tech Lab",
    url: "https://example.com/wasm-edge-standards",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    readTime: "4 min read",
    isTrending: false,
    isBreaking: false
  },
  {
    id: "fb-8",
    title: "Global Athletic Championships: Sensor-Integrated Smart Tracks Reveal Biomechanical Limits",
    description: "Haptic and high-frequency force plates embedded directly in stadium surfaces provide unprecedented real-time athletic kinematics.",
    content: "Spectators and sports scientists at the World Athletics Invitational were treated to revolutionary live analytics today as smart force-sensing tracks made their tournament debut.\n\nEvery stride, sprint velocity, and ground contact angle was rendered in real-time holographic overlays for broadcast audiences, showing how microsecond force distributions separate Olympic champions from silver medalists.\n\nCoaches emphasized that the data will fundamentally reshape training regimens and injury rehabilitation protocols across track and field disciplines worldwide.",
    category: "sports",
    author: "Carlos Ortiz",
    source: "Chronicles Sports Arena",
    url: "https://example.com/smart-athletic-tracks",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 560).toISOString(),
    readTime: "3 min read",
    isTrending: false,
    isBreaking: false
  }
];

