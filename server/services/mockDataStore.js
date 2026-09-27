import bcrypt from 'bcryptjs';

// Pre-hashed password for "password123"
const DEFAULT_HASH = bcrypt.hashSync('password123', 10);

export const initialUsers = [
  {
    _id: '65f01a010000000000000001',
    name: 'Admin Director',
    email: 'admin@resolveai.io',
    password: DEFAULT_HASH,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    company: 'ResolveAI Technologies',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000),
  },
  {
    _id: '65f01a010000000000000002',
    name: 'Sarah Jenkins',
    email: 'agent@resolveai.io',
    password: DEFAULT_HASH,
    role: 'agent',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    company: 'ResolveAI Support Squad',
    status: 'active',
    createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000),
  },
  {
    _id: '65f01a010000000000000003',
    name: 'David Kim',
    email: 'david.kim@resolveai.io',
    password: DEFAULT_HASH,
    role: 'agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    company: 'ResolveAI Support Squad',
    status: 'active',
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000),
  },
  {
    _id: '65f01a010000000000000004',
    name: 'Emily Watson',
    email: 'emily.w@resolveai.io',
    password: DEFAULT_HASH,
    role: 'agent',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    company: 'ResolveAI Support Squad',
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000),
  },
  {
    _id: '65f01a010000000000000005',
    name: 'Alex Rivera',
    email: 'customer@resolveai.io',
    password: DEFAULT_HASH,
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    company: 'Apex Cloud Solutions',
    status: 'active',
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000),
  },
  {
    _id: '65f01a010000000000000006',
    name: 'Rachel Zane',
    email: 'rachel.zane@lawcorp.com',
    password: DEFAULT_HASH,
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    company: 'Pearson Specter Litt',
    status: 'active',
    createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000),
  },
  {
    _id: '65f01a010000000000000007',
    name: 'Marcus Vance',
    email: 'marcus.vance@techcorp.io',
    password: DEFAULT_HASH,
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    company: 'FinTech Velocity',
    status: 'active',
    createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000),
  },
  {
    _id: '65f01a010000000000000008',
    name: 'Sophia Chen',
    email: 'sophia.c@biohealth.org',
    password: DEFAULT_HASH,
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    company: 'BioHealth Dynamics',
    status: 'active',
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000),
  }
];

export const initialTickets = [
  {
    _id: '65f02b010000000000000001',
    ticketNumber: 'TCK-1024',
    customer: '65f01a010000000000000005', // Alex Rivera
    assignedAgent: '65f01a010000000000000002', // Sarah Jenkins
    subject: 'Stripe 3D-Secure Payment Failed repeatedly at checkout',
    description: 'Payment keeps failing whenever our finance team attempts to renew the annual enterprise tier. The Stripe 3DS popup shows a blank screen and throws ERR_SSL_PROTOCOL_ERROR.',
    category: 'Payment',
    priority: 'High',
    status: 'In Progress',
    sentiment: 'Frustrated',
    urgency: 'High',
    aiSummary: 'Customer experiencing payment failure during annual renewal due to 3D Secure modal protocol error.',
    aiSuggestedResponse: `Hi Alex,\n\nI apologize for the frustration with your annual renewal payment. I have reviewed our Stripe logs and found that the 3DS gateway handshake was temporarily interrupted by an edge SSL certificate rotation.\n\nWe have re-synced the payment intent token. Could you please try processing the renewal once more via your Billing Settings? If the error persists, I can generate a direct secure payment link for you.\n\nBest regards,\nSarah Jenkins\nResolveAI Support`,
    tags: ['stripe', 'checkout', 'billing-critical', '3ds'],
    slaDueAt: new Date(Date.now() + 4 * 3600 * 1000),
    createdAt: new Date(Date.now() - 2 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    _id: '65f02b010000000000000002',
    ticketNumber: 'TCK-1025',
    customer: '65f01a010000000000000006', // Rachel Zane
    assignedAgent: '65f01a010000000000000003', // David Kim
    subject: 'Okta SAML 2.0 Single Sign-On redirect loop',
    description: 'Our organization recently enabled Okta SAML SSO. All 40 team members are stuck in an infinite redirect between our identity provider and resolveai.io/auth/saml/callback.',
    category: 'Account',
    priority: 'Critical',
    status: 'Open',
    sentiment: 'Angry',
    urgency: 'Immediate',
    aiSummary: 'Enterprise-wide SSO blocker: 40 users locked out in infinite SAML callback redirect loop.',
    aiSuggestedResponse: `Hi Rachel,\n\nI completely understand the urgency of having your entire team locked out of the workspace. I am personally escalating this to our Senior Security & Identity Engineering team.\n\nIn our telemetry, this redirect loop occurs when the SAML Assertion Consumer Service (ACS) URL or Entity ID in Okta has a trailing slash mismatch. Please verify if your Okta ACS URL matches exactly "https://api.resolveai.io/auth/saml/callback".\n\nI will monitor your connection and update you within 20 minutes.\n\nWarm regards,\nDavid Kim\nSenior Technical Support`,
    tags: ['okta', 'sso', 'saml', 'blocker'],
    slaDueAt: new Date(Date.now() + 1 * 3600 * 1000),
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    _id: '65f02b010000000000000003',
    ticketNumber: 'TCK-1026',
    customer: '65f01a010000000000000007', // Marcus Vance
    assignedAgent: '65f01a010000000000000004', // Emily Watson
    subject: 'Webhook payloads timing out on 5000+ batch event dispatches',
    description: 'When our data pipeline emits bulk ticket updates (around 5,000 events/minute), ResolveAI outgoing webhooks return 504 Gateway Timeout after 30 seconds.',
    category: 'Technical',
    priority: 'High',
    status: 'In Progress',
    sentiment: 'Neutral',
    urgency: 'Medium',
    aiSummary: 'Webhook delivery degradation under high concurrency batch load (5000 events/min) causing HTTP 504 timeouts.',
    aiSuggestedResponse: `Hi Marcus,\n\nThank you for the detailed benchmark numbers. Our webhook dispatcher queue currently caps concurrent socket connections at 50 per endpoint.\n\nWe are enabling the High-Throughput Webhook Pipeline for your account which handles batch chunking in 250-record groups. You should see timeout rates drop to zero within 10 minutes.\n\nBest regards,\nEmily Watson`,
    tags: ['webhooks', 'api', 'high-volume', 'performance'],
    slaDueAt: new Date(Date.now() + 8 * 3600 * 1000),
    createdAt: new Date(Date.now() - 5 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000),
  },
  {
    _id: '65f02b010000000000000004',
    ticketNumber: 'TCK-1027',
    customer: '65f01a010000000000000008', // Sophia Chen
    assignedAgent: '65f01a010000000000000002', // Sarah Jenkins
    subject: 'Requesting HIPAA compliance BAA document signature',
    description: 'We are expanding our deployment to store patient feedback records and need ResolveAI signed Business Associate Agreement (BAA) and SOC 2 Type II report.',
    category: 'Feature Request',
    priority: 'Medium',
    status: 'Pending',
    sentiment: 'Positive',
    urgency: 'Low',
    aiSummary: 'Compliance and regulatory inquiry: Customer requesting BAA and SOC2 Type II package for healthcare tier.',
    aiSuggestedResponse: `Hi Sophia,\n\nThank you for partnering with ResolveAI for your healthcare compliance expansion! We are proud to support HIPAA compliance across our Enterprise infrastructure.\n\nI have generated our standard BAA docusign envelope and sent it to your registered admin email. Our latest SOC 2 Type II report is also attached for your security team's review.\n\nBest regards,\nSarah Jenkins`,
    tags: ['hipaa', 'security', 'compliance', 'soc2'],
    slaDueAt: new Date(Date.now() + 20 * 3600 * 1000),
    createdAt: new Date(Date.now() - 10 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000),
  },
  {
    _id: '65f02b010000000000000005',
    ticketNumber: 'TCK-1028',
    customer: '65f01a010000000000000005', // Alex Rivera
    assignedAgent: '65f01a010000000000000003', // David Kim
    subject: 'Dashboard analytics chart not rendering on Safari 17.4',
    description: 'The response time trend chart is blank when viewing on macOS Sonoma Safari 17.4. Console logs show CanvasRenderingContext2D error.',
    category: 'Bug',
    priority: 'Low',
    status: 'Resolved',
    sentiment: 'Neutral',
    urgency: 'Low',
    aiSummary: 'Safari 17.4 canvas rendering bug resolved with SVG fallback polyfill.',
    aiSuggestedResponse: `Hi Alex,\n\nThank you for reporting this Safari-specific rendering issue! Our frontend team released patch v2.4.1 which resolves the Canvas context initialization on WebKit engines.\n\nPlease refresh your dashboard to verify the fix.\n\nBest regards,\nDavid Kim`,
    tags: ['safari', 'charts', 'frontend', 'bugfix'],
    slaDueAt: new Date(Date.now() - 12 * 3600 * 1000),
    resolvedAt: new Date(Date.now() - 14 * 3600 * 1000),
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 14 * 3600 * 1000),
  },
  {
    _id: '65f02b010000000000000006',
    ticketNumber: 'TCK-1029',
    customer: '65f01a010000000000000007', // Marcus Vance
    assignedAgent: '65f01a010000000000000004', // Emily Watson
    subject: 'Duplicate seat billing invoice for June 2026',
    description: 'We were charged twice for 15 added support seats on invoice #INV-8891 and #INV-8892.',
    category: 'Billing',
    priority: 'High',
    status: 'Resolved',
    sentiment: 'Frustrated',
    urgency: 'High',
    aiSummary: 'Duplicate pro-rated invoice issue. Full refund of $450 issued immediately.',
    aiSuggestedResponse: `Hi Marcus,\n\nI have verified the duplicate billing on invoice #INV-8892 and immediately voided it. A full refund of $450.00 has been credited back to your corporate Visa card (receipt #REF-9921).\n\nThank you for bringing this to our attention.\n\nWarm regards,\nEmily Watson`,
    tags: ['refund', 'billing', 'invoice', 'seats'],
    slaDueAt: new Date(Date.now() - 4 * 3600 * 1000),
    resolvedAt: new Date(Date.now() - 6 * 3600 * 1000),
    createdAt: new Date(Date.now() - 36 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000),
  },
  {
    _id: '65f02b010000000000000007',
    ticketNumber: 'TCK-1030',
    customer: '65f01a010000000000000006', // Rachel Zane
    assignedAgent: '65f01a010000000000000002', // Sarah Jenkins
    subject: 'Integration with custom Jira cloud custom fields',
    description: 'Need assistance mapping ResolveAI AI Summary tags to our Jira custom ticket field customfield_10023.',
    category: 'Technical',
    priority: 'Medium',
    status: 'Open',
    sentiment: 'Neutral',
    urgency: 'Medium',
    aiSummary: 'Customer requires webhook integration schema mapping for Jira custom field 10023.',
    aiSuggestedResponse: `Hi Rachel,\n\nYou can easily map custom fields under Settings > Integrations > Jira Cloud > Custom Mappings. I have also prepared a sample JSON payload transformer for customfield_10023.\n\nBest regards,\nSarah Jenkins`,
    tags: ['jira', 'integration', 'custom-fields'],
    slaDueAt: new Date(Date.now() + 18 * 3600 * 1000),
    createdAt: new Date(Date.now() - 3 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000),
  }
];

export const initialMessages = [
  {
    _id: '65f03c010000000000000001',
    ticketId: '65f02b010000000000000001', // TCK-1024
    sender: '65f01a010000000000000005', // Alex Rivera
    message: 'Payment keeps failing whenever our finance team attempts to renew the annual enterprise tier. The Stripe 3DS popup shows a blank screen and throws ERR_SSL_PROTOCOL_ERROR.',
    isInternalNote: false,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000),
  },
  {
    _id: '65f03c010000000000000002',
    ticketId: '65f02b010000000000000001', // TCK-1024
    sender: '65f01a010000000000000002', // Sarah Jenkins (Agent)
    message: "Hi Alex, thank you for reporting this. I'm actively investigating our payment gateway logs to see why the 3D-Secure challenge handshake is stalling.",
    isInternalNote: false,
    createdAt: new Date(Date.now() - 90 * 60 * 1000),
  },
  {
    _id: '65f03c010000000000000003',
    ticketId: '65f02b010000000000000001', // TCK-1024
    sender: '65f01a010000000000000005', // Alex Rivera
    message: 'Thanks Sarah, our CFO wants to lock this in before end-of-quarter today so any quick bypass or direct invoice would also work!',
    isInternalNote: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    _id: '65f03c010000000000000004',
    ticketId: '65f02b010000000000000002', // TCK-1025
    sender: '65f01a010000000000000006', // Rachel Zane
    message: 'Our organization recently enabled Okta SAML SSO. All 40 team members are stuck in an infinite redirect between our identity provider and resolveai.io/auth/saml/callback.',
    isInternalNote: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    _id: '65f03c010000000000000005',
    ticketId: '65f02b010000000000000003', // TCK-1026
    sender: '65f01a010000000000000007', // Marcus Vance
    message: 'When our data pipeline emits bulk ticket updates (around 5,000 events/minute), ResolveAI outgoing webhooks return 504 Gateway Timeout after 30 seconds.',
    isInternalNote: false,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000),
  }
];

export const mockData = {
  users: [...initialUsers],
  tickets: [...initialTickets],
  messages: [...initialMessages],
  aiInsights: [],
};
