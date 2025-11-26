export const COMPLEXITY_OPTIONS = [
    {
        value: "Beginner",
        label: "Beginner",
        description: "Simple CRUD apps, Basic features, No advanced backend logic, Few screens/pages"
    },
    {
        value: "Intermediate",
        label: "Intermediate",
        description: "Multi-feature applications, Authentication, APIs and databases, Some performance considerations, Real-time OR moderate integrations"
    },
    {
        value: "Advanced",
        label: "Advanced",
        description: "Complex logic, Multiple integrations, Heavy real-time features, AI or ML components, Microservices"
    },
    {
        value: "Enterprise",
        label: "Enterprise-Grade",
        description: "Multiple teams, Huge features, Compliance, analytics, governance, Multi-region, distributed systems"
    }
];

export const SCALE_OPTIONS = [
    {
        value: "Low",
        label: "Low",
        description: "Small user base (0–5k), No real-time needs, Simple DB. Examples: Personal projects, MVP v1."
    },
    {
        value: "Medium",
        label: "Medium",
        description: "Moderate traffic (5k–50k users), Needs optimization, Real-time or caching might be required. Examples: Growing SaaS tools, learning apps."
    },
    {
        value: "High",
        label: "High",
        description: "High traffic (50k–500k users), Needs: load balancing, caching, workers, queues, Data spikes. Examples: Social apps, delivery apps."
    },
    {
        value: "Very High",
        label: "Very High / Enterprise",
        description: "Massive (>500k users), Multi-region deployments, Auto-scaling infra, Analytics, observability. Examples: fintech, streaming, enterprise SaaS."
    }
];
