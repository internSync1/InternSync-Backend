export const broadCategories = {
    internships: [
        'Software Engineering', 'Data Science', 'AI/ML', 'Cybersecurity', 'Cloud/DevOps', 'Mobile', 'Web', 'Game Dev',
        'Design/UX', 'Product', 'Marketing', 'Sales', 'Finance', 'Operations', 'HR',
        'Research', 'Healthcare', 'Education', 'Law/Policy', 'Media/Communications', 'Nonprofit/Government'
    ],
    scholarships: [
        'Merit-based', 'Need-based', 'STEM', 'Arts & Design', 'Business & Finance', 'International',
        'Women in Tech', 'Undergraduate', 'Graduate', 'Minority', 'Leadership', 'Community Service'
    ],
    extracurriculars: [
        'Hackathons', 'Competitions', 'Volunteering', 'Clubs & Societies', 'Conferences', 'Bootcamps', 'Workshops & Courses'
    ],
} as const;

export type BroadArea = keyof typeof broadCategories;

// Lightweight keyword map to suggest category from title/tags on the client
export const categoryKeywords: Record<string, string[]> = {
    'Software Engineering': ['software', 'developer', 'backend', 'frontend', 'fullstack', 'node', 'typescript', 'java', 'python'],
    'Data Science': ['data', 'analytics', 'analyst', 'ml', 'machine learning', 'ai', 'statistics'],
    'AI/ML': ['machine learning', 'deep learning', 'llm', 'genai', 'ai'],
    'Cybersecurity': ['security', 'cyber', 'infosec'],
    'Cloud/DevOps': ['cloud', 'aws', 'azure', 'gcp', 'devops', 'kubernetes', 'docker'],
    'Mobile': ['android', 'ios', 'react native', 'flutter', 'mobile'],
    'Web': ['web', 'react', 'vue', 'angular', 'next.js', 'nuxt'],
    'Game Dev': ['game', 'unity', 'unreal'],
    'Design/UX': ['design', 'ui', 'ux', 'figma'],
    'Product': ['product', 'pm'],
    'Marketing': ['marketing', 'seo', 'content', 'growth'],
    'Sales': ['sales', 'bd', 'business development', 'account'],
    'Finance': ['finance', 'accounting', 'investment', 'banking'],
    'Operations': ['operations', 'ops', 'supply chain'],
    'HR': ['hr', 'talent', 'recruiting'],
    'Research': ['research', 'lab', 'academic'],
    'Healthcare': ['health', 'medical', 'clinical'],
    'Education': ['education', 'teaching', 'tutor'],
    'Law/Policy': ['law', 'legal', 'policy', 'government'],
    'Media/Communications': ['media', 'communication', 'journalism', 'pr'],
    'Nonprofit/Government': ['ngo', 'nonprofit', 'government', 'public']
};
