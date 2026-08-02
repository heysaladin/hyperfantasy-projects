export interface Hyperstory {
  slug: string
  title: string
  excerpt: string
  client: string
  year: string
  role: string
  category: string
  readTime: string
  gradient: string
  content: string
}

export const HYPERSTORIES: Hyperstory[] = [
  {
    slug: 'reimagining-lumina-banking',
    title: 'Reimagining Lumina: How We Turned a Legacy Bank Into a Digital-First Brand',
    excerpt:
      'A 9-month journey of untangling a 40-year-old identity, rebuilding trust with three generations of customers, and shipping a design system that now powers 14 products.',
    client: 'Lumina Bank',
    year: '2025',
    role: 'Brand & Product Design',
    category: 'Case Study',
    readTime: '12 min read',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 55%, #be185d 100%)',
    content: `
      <p>When Lumina Bank first reached out to us, their brief was deceptively simple: <em>"Make us look modern."</em> But after two weeks of stakeholder interviews, we realized the real problem was much deeper. Lumina wasn't suffering from an outdated logo — it was suffering from forty years of accumulated design decisions that no one could explain anymore.</p>
      <h2>The archaeology phase</h2>
      <p>We started by doing something unusual: a full audit of every customer touchpoint, from the mobile app to the paper forms in physical branches. We catalogued 340 distinct visual artifacts. Fourteen different shades of blue. Nine typefaces. Three logos in active circulation, one of which the marketing team didn't know existed.</p>
      <p>This wasn't carelessness. Each artifact was a fossil from a specific era — a merger in the 90s, a rushed app launch in 2014, an agency rebrand that was abandoned halfway. Understanding <em>why</em> the inconsistency existed was the key to fixing it without repeating history.</p>
      <blockquote><p>"You can't design a future for a brand until you understand which parts of its past it's still carrying."</p></blockquote>
      <h2>Designing for three generations</h2>
      <p>Lumina's customer base spans retirees who visit branches weekly and students who have never seen the inside of one. Early concepts that tested brilliantly with younger users read as "untrustworthy" to older ones — too playful, too light, too fast.</p>
      <p>Our breakthrough came from separating <strong>brand warmth</strong> from <strong>interface density</strong>. The visual identity became warmer and more human across the board, while the product surfaces adapted: a calm, spacious default experience with a "focus mode" that surfaces power-user density for those who want it.</p>
      <h2>The system that shipped</h2>
      <p>The final deliverable wasn't a brand book — it was a living design system with 120 components, semantic color tokens that survive theming, and documentation written for engineers first. Within six months of handoff, Lumina's internal teams had shipped 14 product surfaces on the system without us in the room. That, more than any award, is how we measure whether a design system actually works.</p>
      <hr />
      <p>The rebrand launched in March 2025. App Store rating moved from 3.1 to 4.6, support tickets about "finding things" dropped 38%, and — our favorite metric — branch staff started using the design system's illustration library to make their own signage. The brand finally belonged to everyone.</p>
    `,
  },
  {
    slug: 'orbit-saas-dashboard',
    title: 'Orbit: Designing a Dashboard People Actually Open in the Morning',
    excerpt:
      'Most analytics dashboards are graveyards of unused charts. Here is how we rebuilt Orbit around questions instead of metrics — and doubled weekly active usage.',
    client: 'Orbit Analytics',
    year: '2024',
    role: 'Product Design & Research',
    category: 'Case Study',
    readTime: '9 min read',
    gradient: 'linear-gradient(135deg, #0f766e 0%, #2563eb 60%, #4f46e5 100%)',
    content: `
      <p>Orbit had a problem every SaaS founder recognizes: customers signed up, connected their data, admired the dashboard once — and never came back. Retention analytics showed the median user opened Orbit 1.4 times per week. For a product that positioned itself as "your business command center," that number was an existential threat.</p>
      <h2>Watching people not use the product</h2>
      <p>We ran 22 contextual interviews, but the most valuable sessions were the silent ones: screen recordings of real users during their actual workday. The pattern was brutal. Users didn't open Orbit to <em>explore data</em>. They opened it with a specific question — "did yesterday's campaign work?" — scanned for 40 seconds, failed to find the answer among 30 charts, and left.</p>
      <p>The dashboard was organized around <strong>what the system could measure</strong>, not <strong>what the user wanted to know</strong>.</p>
      <h2>From metrics to questions</h2>
      <p>We rebuilt the entire information architecture around a simple primitive we called a <em>Question Card</em>. Instead of "Sessions by Source (Last 30 Days)," users see "Is traffic growing?" — with an answer, a confidence indicator, and the supporting chart one tap away.</p>
      <blockquote><p>Charts are evidence. Answers are the product.</p></blockquote>
      <p>This inverted the visual hierarchy of the whole product. The homepage became a morning briefing: three to five answered questions, ranked by what changed. The full chart library still exists, but it's a second layer — reference material, not the front door.</p>
      <h2>The hard part: earning trust in the answers</h2>
      <p>The riskiest design decision was letting the product say things like "Revenue is flat — nothing needs your attention today." Telling a user <em>not</em> to look at more data is terrifying for an analytics company. We spent a full month on the anatomy of an answer: how to show the reasoning, when to hedge, and how to make "view the raw data" always one click away so trust never depended on blind faith.</p>
      <hr />
      <p>Three months after launch, weekly active usage was up 2.1×, and the average session got <em>shorter</em> — from 6 minutes to 2.5. Users found that success metric confusing until we reframed it: Orbit stopped being a place to wander and became a place to get answered.</p>
    `,
  },
  {
    slug: 'kembara-heritage-ecommerce',
    title: 'Kembara: Bringing 200 Artisan Workshops Online Without Flattening Their Souls',
    excerpt:
      'An e-commerce platform for Indonesian craft heritage faced a paradox — scale demands standardization, but craft is defined by everything standardization destroys.',
    client: 'Kembara Collective',
    year: '2024',
    role: 'UX Strategy & Visual Design',
    category: 'Case Study',
    readTime: '11 min read',
    gradient: 'linear-gradient(135deg, #b45309 0%, #dc2626 55%, #7e22ce 100%)',
    content: `
      <p>Kembara Collective represents over 200 artisan workshops across Java, Bali, and Sumba — batik makers, wood carvers, ikat weavers whose techniques go back generations. They came to us with a tension they couldn't resolve: every e-commerce template they tried made a hand-dyed ikat textile look exactly like a mass-produced tote bag. Same grid, same white background, same "Add to Cart."</p>
      <h2>The problem with product grids</h2>
      <p>E-commerce conventions exist because they work — for commodities. A uniform grid says "these items are comparable, choose by price." But an heirloom-quality textile that took three weeks to weave isn't comparable to anything. Presenting it in a commodity grid doesn't just undersell it; it actively miscommunicates what it is.</p>
      <p>Our design principle became: <strong>the interface should transfer the reverence</strong>. Whatever the maker feels about the object, the buyer should feel through the screen.</p>
      <h2>Story-first product pages</h2>
      <p>We flipped the standard product page. Instead of photo-price-button above the fold, each piece opens with its story: the workshop, the maker's hands in process, the meaning of the motif. The price and purchase action are present but arrive <em>after</em> context — a deliberate pacing decision that tested poorly with e-commerce consultants and beautifully with actual customers.</p>
      <blockquote><p>"People don't pay artisan prices for objects. They pay artisan prices for stories they get to keep."</p></blockquote>
      <h2>Designing the maker's side</h2>
      <p>The invisible half of this project was the workshop-facing tools. Many makers manage their business from a shared smartphone with intermittent connectivity. We designed the listing flow to work entirely through guided photo capture and voice notes in Bahasa Indonesia — a field coordinator transcribes and translates, and the maker approves the final story. No forms, no dashboard, no login friction.</p>
      <h2>What we learned</h2>
      <p>Average order value came in 3× higher than the collective's previous marketplace channels, and the return rate is near zero — buyers know exactly what they're getting, because the story told them. But the result we keep coming back to is qualitative: makers reported that reading their own product pages made them price their work higher. The design didn't just communicate value to buyers. It reflected it back to the people who create it.</p>
      <hr />
      <p>Kembara launched in late 2024 and now onboards roughly ten new workshops each month. The pattern library we built — story blocks, process galleries, maker profiles — has become the collective's shared visual language.</p>
    `,
  },
]

export function getHyperstory(slug: string): Hyperstory | undefined {
  return HYPERSTORIES.find(s => s.slug === slug)
}
