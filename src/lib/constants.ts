
// This constant is not strictly necessary if the game always starts via AI call,
// but can be kept for reference or future direct-start scenarios.
export const INITIAL_GAME_SCENARIO = "Mission Briefing: You are a roving investigative reporter. You've just received an encrypted tip linking a multinational biotech firm, 'NovaGen', to secret, unethical human-testing trials. Your mission: Gather irrefutable proof, expose NovaGen, and protect your sources. The journey begins now. What's your first move to manage your digital footprint before diving deeper?";

export const PRIVACY_EXPLAINED_CONTENT = [
  {
    id: 'what-is-blockchain-privacy',
    title: 'What is Blockchain Privacy?',
    icon: 'FileLock2', // Updated icon
    sections: [
      {
        title: 'Anonymity vs. Pseudonymity',
        text: "On most public blockchains like Bitcoin or Ethereum, transactions are pseudonymous, not anonymous. This means your identity isn't directly tied to your address, but all your transactions are publicly visible and linkable to that pseudonym (your address). If your address gets linked to your real-world identity (e.g., through an exchange), your entire transaction history can be deanonymized.",
      },
      {
        title: 'Transaction Linking',
        text: 'Since all transactions are on a public ledger, anyone can trace the flow of funds. Sophisticated analysis can link multiple addresses to the same entity, revealing patterns, balances, and connections.',
      },
      {
        title: 'Address Reuse',
        text: 'Reusing the same address for multiple transactions makes it easier for observers to link your activities and build a profile. Best practice is often to use a new address for each incoming transaction, though this can be complex to manage without proper tools.',
      },
    ],
  },
  {
    id: 'why-is-it-important',
    title: 'Why is Blockchain Privacy Important?',
    icon: 'ShieldCheck',
    sections: [
      {
        title: 'Financial Surveillance',
        text: 'Without privacy, your financial history is an open book. This can make you a target for advertisers, data brokers, or even malicious actors who can see your wealth and spending habits.',
      },
      {
        title: 'Personal Safety',
        text: 'Publicly displaying large balances can make you a target for theft, extortion, or physical harm. Privacy protects you from unwanted attention.',
      },
      {
        title: 'Competitive Disadvantage',
        text: 'For businesses, transparent transactions can reveal business strategies, supply chains, and customer information to competitors. Privacy is crucial for maintaining a competitive edge.',
      },
      {
        title: 'Censorship Resistance',
        text: 'In oppressive regimes, financial privacy can be a lifeline, allowing individuals to transact without fear of reprisal. Lack of privacy can lead to accounts being frozen or transactions blocked based on identity or associations.',
      }
    ],
  },
  {
    id: 'common-misconceptions',
    title: 'Common Misconceptions',
    icon: 'HelpCircle',
    sections: [
      {
        title: '"All cryptocurrency is anonymous."',
        text: "This is false. Most popular cryptocurrencies are pseudonymous. Only specific privacy-focused coins (like Monero or Zcash with shielded transactions) offer strong anonymity features by default or as an option.",
      },
      {
        title: '"Only criminals need privacy."',
        text: "This is a dangerous myth. Privacy is a fundamental human right. Everyone benefits from privacy, whether it's to protect personal data, secure business operations, or simply maintain autonomy over one's financial life. Assuming only illicit actors seek privacy is a fallacy used to justify mass surveillance.",
      },
    ],
  },
];


export const PRIVACY_VIOLATORS_CONTENT = [
  {
    id: 'centralized-exchanges',
    title: 'Centralized Exchanges (CEXs)',
    icon: 'ShieldOff', // Updated icon
    description:
      "While necessary for onboarding, CEXs are major privacy weak points. They require extensive Know Your Customer (KYC) information, linking your real-world identity to your crypto addresses. They are also prime targets for hackers, potentially exposing your personal data and transaction history.",
    impact: 'Deanonymization, data breaches, potential for account freezes or censorship by the exchange or authorities.',
  },
  {
    id: 'blockchain-analytics-firms',
    title: 'Blockchain Analytics Firms',
    icon: 'ScanSearch', // Updated icon
    description:
      'These companies specialize in deanonymizing blockchain transactions. They use advanced heuristics and data scraping to link pseudonymous addresses to real-world entities, often selling this information to governments, financial institutions, or other corporations.',
    impact: 'Mass surveillance, erosion of pseudonymity, chilling effect on legitimate uses of cryptocurrency.',
  },
  {
    id: 'unverified-smart-contracts',
    title: 'Unverified or Malicious Smart Contracts',
    icon: 'Code2',
    description:
      "Interacting with unaudited or malicious smart contracts can expose your data or funds. Some contracts might have hidden functions to log your address, siphon data, or drain your wallet. Always verify contract sources and be wary of unknown DeFi platforms.",
    impact: 'Financial loss, exposure of connected addresses, potential for targeted attacks.',
  },
  {
    id: 'government-overreach',
    title: 'Government Overreach & Regulation',
    icon: 'Landmark',
    description:
      "While regulation is inevitable, some government actions can severely undermine privacy. Mandates for CEXs to report transactions, attempts to ban privacy coins, or pressure on developers of privacy tools can create a chilling effect and push users to less secure alternatives.",
    impact: 'Increased surveillance, reduced financial freedom, potential criminalization of privacy-seeking behavior.',
  },
];


export const RESOURCE_LINKS = [
  {
    title: 'Monero (XMR) Official Website',
    url: 'https://www.getmonero.org/',
    description: 'Learn about Monero, a leading privacy-focused cryptocurrency with strong anonymity features.',
    icon: 'Link',
  },
  {
    title: 'Zcash (ZEC) Official Website',
    url: 'https://z.cash/',
    description: 'Discover Zcash, a cryptocurrency offering both transparent and shielded (private) transactions.',
    icon: 'Link',
  },
  {
    title: 'Electronic Frontier Foundation (EFF) - Blockchain',
    url: 'https://www.eff.org/issues/blockchain',
    description: 'EFF provides insights and advocacy on privacy, free speech, and innovation in the context of blockchain technology.',
    icon: 'Library',
  },
  {
    title: "CoinCenter - Privacy",
    url: "https://www.coincenter.org/policy-issues/privacy/",
    description: "A leading non-profit focused on the policy issues facing cryptocurrencies, including privacy.",
    icon: 'Library',
  },
  {
    title: "Human Rights Foundation - Financial Freedom",
    url: "https://hrf.org/financialfreedom/",
    description: "Articles and resources on how Bitcoin and cryptocurrencies can be tools for financial freedom and privacy.",
    icon: 'BookOpen',
  }
];

