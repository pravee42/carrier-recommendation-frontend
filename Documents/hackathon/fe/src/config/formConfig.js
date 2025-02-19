const formConfig = [
    // Basic Information
    {
        "label": "Name",
        "type": "text",
        "name": "name",
        "placeholder": "Enter your full name",
        "required": true
    },
    {
        "label": "Age",
        "type": "number",
        "name": "age",
        "placeholder": "Enter your age",
        "required": true,
        "min": 18,
        "max": 65
    },
    // Education & Certifications
    {
        "label": "Education Level",
        "type": "select",
        "name": "education",
        "options": ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD"],
        "required": true
    },
    {
        "label": "Field of Study",
        "type": "text",
        "name": "field_of_study",
        "placeholder": "E.g., Computer Science, Business Administration",
        "required": true
    },
    {
        "label": "Professional Certifications",
        "type": "textarea",
        "name": "certifications",
        "placeholder": "List any relevant certifications you have",
        "required": false
    },
    // Skills & Experience
    {
        "label": "Technical Skills",
        "type": "textarea",
        "name": "technical_skills",
        "placeholder": "List your technical skills (e.g., Programming languages, tools)",
        "required": true
    },
    {
        "label": "Soft Skills",
        "type": "select",
        "name": "soft_skills",
        "options": ["Communication", "Leadership", "Problem Solving", "Time Management", "Teamwork", "Adaptability"],
        "multiple": true,
        "required": true
    },
    {
        "label": "Years of Experience",
        "type": "number",
        "name": "years_experience",
        "placeholder": "Total years of work experience",
        "required": true,
        "min": 0,
        "max": 50
    },
    // Career Preferences
    {
        "label": "Preferred Work Environment",
        "type": "radio",
        "name": "work_environment",
        "options": ["Startup", "Mid-size Company", "Large Corporation", "Government", "Non-profit"],
        "required": true
    },
    {
        "label": "Work Mode Preference",
        "type": "radio",
        "name": "work_mode",
        "options": ["Remote", "Onsite", "Hybrid"],
        "required": true
    },
    // Market Insights
    {
        "label": "Preferred Job Markets",
        "type": "select",
        "name": "job_markets",
        "options": ["Local", "National", "International"],
        "multiple": true,
        "required": true
    },
    {
        "label": "Interested Growth Industries",
        "type": "select",
        "name": "growth_industries",
        "options": [
            "AI & Machine Learning",
            "Cybersecurity",
            "Healthcare Tech",
            "Renewable Energy",
            "FinTech",
            "E-commerce",
            "Digital Marketing",
            "Cloud Computing",
            "Data Science",
            "Blockchain"
        ],
        "multiple": true,
        "required": true
    },
    // Salary & Benefits
    {
        "label": "Current Salary (in LPA)",
        "type": "select",
        "name": "current_salary",
        "options": ["<5 LPA", "5-10 LPA", "10-20 LPA", "20-30 LPA", "30+ LPA"],
        "required": true
    },
    {
        "label": "Expected Salary (in LPA)",
        "type": "select",
        "name": "expected_salary",
        "options": ["<5 LPA", "5-10 LPA", "10-20 LPA", "20-30 LPA", "30+ LPA"],
        "required": true
    },
    {
        "label": "Preferred Benefits",
        "type": "select",
        "name": "preferred_benefits",
        "options": [
            "Health Insurance",
            "Stock Options",
            "Professional Development",
            "Flexible Hours",
            "Paid Time Off",
            "Remote Work Allowance",
            "Education Reimbursement"
        ],
        "multiple": true,
        "required": true
    },
    // Career Development
    {
        "label": "Career Goals (Next 5 Years)",
        "type": "textarea",
        "name": "career_goals",
        "placeholder": "Describe your career goals for the next 5 years",
        "required": true
    },
    {
        "label": "Learning Interests",
        "type": "select",
        "name": "learning_interests",
        "options": [
            "Technical Skills",
            "Management Skills",
            "Leadership Development",
            "Industry Certifications",
            "Advanced Degree",
            "Soft Skills Development"
        ],
        "multiple": true,
        "required": true
    },
    {
        "label": "Relocation Willingness",
        "type": "radio",
        "name": "relocation",
        "options": ["Yes", "No", "Depends on Opportunity"],
        "required": true
    },
    {
        "label": "Work-Life Balance Priority",
        "type": "select",
        "name": "work_life_balance",
        "options": ["Very Important", "Important", "Somewhat Important", "Not a Priority"],
        "required": true
    },
    {
        "label": "Additional Comments",
        "type": "textarea",
        "name": "additional_comments",
        "placeholder": "Any other information you'd like to share?",
        "required": false
    }
];

export default formConfig;