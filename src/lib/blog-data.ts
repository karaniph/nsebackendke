export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  coverImage: string;
  draft: boolean;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "building-resilient-systems-with-circuit-breakers",
    title: "Building Resilient Systems with Circuit Breakers",
    description: "How to implement the circuit breaker pattern in distributed systems to prevent cascading failures and improve fault tolerance.",
    date: "2026-03-08",
    author: "Ada Kovács",
    tags: ["systems-design", "reliability", "typescript"],
    coverImage: "",
    draft: false,
    content: `## The Problem with Cascading Failures

In distributed systems, a single failing service can bring down your entire architecture. When Service A depends on Service B, and Service B becomes unresponsive, Service A will accumulate blocked threads waiting for responses that never arrive.

This is the cascading failure problem. It's not theoretical — it's the most common cause of large-scale outages in production systems.

## What Is a Circuit Breaker?

The circuit breaker pattern, popularized by Michael Nygard in *Release It!*, is borrowed directly from electrical engineering. An electrical circuit breaker detects excessive current and breaks the circuit to prevent damage. A software circuit breaker does the same for network calls.

It operates in three states:

**Closed** — requests flow normally. The breaker monitors failure rates.

**Open** — after a threshold of failures, the breaker "trips." All subsequent requests fail immediately without attempting the network call. This is the key insight: *fail fast* rather than fail slow.

**Half-Open** — after a timeout period, the breaker allows a single test request through. If it succeeds, the breaker closes. If it fails, the breaker opens again.

## Implementation in TypeScript

Here's a minimal circuit breaker implementation:

\`\`\`typescript
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime: number | null = null;

  constructor(
    private threshold: number = 5,
    private timeout: number = 30000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime! > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
\`\`\`

The critical detail is in the \`execute\` method. When the circuit is open, we don't even attempt the call. We fail immediately. This protects both the caller and the downstream service.

## When to Use Circuit Breakers

Circuit breakers are not universally applicable. Use them for:

- Remote service calls (HTTP, gRPC)
- Database connections under high load
- Any I/O operation with unpredictable latency

Do *not* use them for:

- Local function calls
- Operations where failure is expected and handled
- Idempotent retry scenarios (use retry with backoff instead)

## Monitoring Is Non-Negotiable

A circuit breaker without monitoring is worse than no circuit breaker at all. You need to track:

- State transitions (CLOSED → OPEN is an incident)
- Failure rates per downstream service
- Time spent in OPEN state

> The circuit breaker doesn't fix the underlying problem. It buys you time to fix it without losing your entire system.

This pattern is foundational. If you're building anything that makes network calls in production, you need circuit breakers.`,
  },
  {
    slug: "the-case-for-boring-technology",
    title: "The Case for Boring Technology",
    description: "Why choosing well-understood, battle-tested technology is almost always the right decision for production systems.",
    date: "2026-02-22",
    author: "Ada Kovács",
    tags: ["engineering-culture", "architecture"],
    coverImage: "",
    draft: false,
    content: `## Innovation Tokens

Dan McKinley introduced the concept of "innovation tokens" in his influential essay. The idea is simple: every organization has a limited capacity for novelty. Each new, unproven technology you adopt spends one of these tokens.

Most companies have approximately three innovation tokens to spend. If you spend them all on your database, your message queue, and your deployment pipeline, you have none left for the actual product you're building.

## What "Boring" Actually Means

Boring technology is not bad technology. It is technology whose failure modes are well-understood. When PostgreSQL has a problem at 3 AM, you can find the answer on Stack Overflow. When your cutting-edge distributed database has a problem at 3 AM, you're reading source code on GitHub and hoping the maintainer is awake.

Boring means:

- **Extensive documentation.** Not just API docs, but war stories, migration guides, and performance tuning articles written by people who have run it in production for years.
- **Predictable failure modes.** You know how it breaks. You've seen the errors before. You have runbooks.
- **A large hiring pool.** You can find engineers who already know the technology, reducing onboarding time and operational risk.

## The Real Cost of New Technology

Every technology choice has two cost curves:

1. **The visible cost** — learning curve, integration time, initial setup.
2. **The invisible cost** — operational surprises, missing tooling, ecosystem gaps, and the knowledge debt you accumulate when only two people on your team understand how it works.

The invisible cost is always larger than the visible cost. Always.

\`\`\`
Cost
 │
 │    ╱ Invisible (operational)
 │   ╱
 │  ╱
 │ ╱  ╱ Visible (setup)
 │╱  ╱
 │  ╱
 │ ╱
 └──────────── Time
\`\`\`

## A Decision Framework

Before adopting a new technology, answer these questions:

1. **What specific problem does this solve that existing tools cannot?** If the answer is "it's faster" or "it's more modern," that's not sufficient.

2. **What happens when it breaks at 3 AM?** Can your on-call engineer fix it, or do they need to escalate to the one person who understands it?

3. **What is the migration path if it doesn't work out?** Every technology adoption should have a reversal plan.

4. **Is the team willing to own this for five years?** Technology choices outlast the engineers who make them. Choose accordingly.

## The Exception

There is one valid reason to adopt non-boring technology: when the boring option genuinely cannot solve the problem. If you're processing ten million events per second, PostgreSQL might not be the answer. But make sure you've actually hit that limit before reaching for something exotic.

> The goal is not to use the newest technology. The goal is to solve problems for users. Technology is the means, never the end.

Build on foundations you trust. Save your innovation tokens for the problems that actually require innovation.`,
  },
  {
    slug: "effective-code-review-practices",
    title: "Effective Code Review Practices",
    description: "A framework for code reviews that improve code quality without slowing down your team or creating adversarial dynamics.",
    date: "2026-02-10",
    author: "Ada Kovács",
    tags: ["engineering-culture", "practices", "typescript"],
    coverImage: "",
    draft: false,
    content: `## Code Review Is Communication

The primary purpose of code review is not to find bugs. Static analysis tools and tests are better at that. The primary purpose is *knowledge transfer* and *shared ownership*.

A good code review leaves both the author and the reviewer with a better understanding of the system. A bad code review leaves the author demoralized and the reviewer frustrated.

## The Framework

### 1. Start with Why

Before reading any code, read the pull request description. Understand the problem being solved. If the description is insufficient, your first comment should be: "Can you add more context about what problem this solves?"

Never review code without understanding its intent.

### 2. Distinguish Between Three Levels

Not all feedback is equal. Explicitly categorize your comments:

**Must fix** — correctness issues, security vulnerabilities, data loss risks. These block the PR.

\`\`\`typescript
// MUST FIX: This query is vulnerable to SQL injection.
// Use parameterized queries instead of string interpolation.
const query = \`SELECT * FROM users WHERE id = \${userId}\`;
// Should be:
const query = 'SELECT * FROM users WHERE id = $1';
\`\`\`

**Should fix** — performance issues, maintainability concerns, missing error handling. These should be addressed but can be negotiated.

**Nit** — style preferences, naming suggestions, minor readability improvements. These are explicitly optional.

If you don't categorize your comments, the author cannot prioritize their response. Everything feels equally urgent, which means nothing is.

### 3. Ask Questions Instead of Making Demands

Compare these two comments:

*Bad:* "This function is too long. Break it up."

*Good:* "I'm having trouble following the logic here. Would it be clearer if the validation step were extracted into its own function?"

The first is a command. The second is a collaboration. The first creates defensiveness. The second creates dialogue.

### 4. Review in Context

A function that looks messy in isolation might be perfectly appropriate given the constraints of the surrounding code. Before suggesting a refactor, understand:

- What are the performance requirements?
- Is this a hot path or a rarely-executed branch?
- Is this a temporary workaround with a tracked issue, or a permanent solution?

### 5. Time-Box Your Reviews

A code review should take no more than 60 minutes. After that, your attention degrades and you start either rubber-stamping or nitpicking.

If a PR requires more than 60 minutes to review, it's too large. This is feedback for the author about PR sizing, not something to power through.

## What Not to Review

- **Formatting.** Use automated formatters. Humans should never argue about semicolons.
- **Things covered by linters.** If ESLint can catch it, you don't need to.
- **Personal style preferences** that have no impact on correctness or maintainability.

## Measuring Success

A healthy code review culture has these properties:

- PRs are reviewed within 4 hours during working hours
- Review comments are discussions, not mandates
- Authors feel comfortable pushing back on feedback
- Knowledge is distributed — no single person is a bottleneck reviewer

> The best code review is one where both people learn something. The worst is one where someone feels diminished.

Invest in your review culture. It compounds.`,
  },
];

export function getPublishedPosts(): BlogPost[] {
  return blogPosts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getPublishedPosts().forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getPublishedPosts().filter((p) => p.tags.includes(tag));
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
