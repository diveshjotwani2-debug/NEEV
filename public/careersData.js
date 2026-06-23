// ==========================================================================
// NEEV - CAREER & STUDY RESOURCES DATABASE
// ==========================================================================

const CAREER_DATABASE = {
  // 1. Careers List
  careers: [
    { id: 'eng', stream: 'Science', name: 'Engineering', description: 'Technical design, problem solving, and building structures, software, or machinery.' },
    { id: 'med', stream: 'Science', name: 'Medicine', description: 'Healthcare, diagnosis, surgery, dental hygiene, and pharmaceutical development.' },
    { id: 'rd', stream: 'Science', name: 'Research & Development', description: 'Scientific exploration in physics, chemistry, biology, and math.' },
    { id: 'biotech', stream: 'Science', name: 'Biotechnology', description: 'Merging biology and technology to build medical devices, agricultural tools, and genetics.' },
    { id: 'ca', stream: 'Commerce', name: 'Chartered Accountancy (CA)', description: 'Financial auditing, taxation, financial reporting, and regulatory advice.' },
    { id: 'banking', stream: 'Commerce', name: 'Banking & Finance', description: 'Investment banking, wealth advisory, commercial banking, and asset management.' },
    { id: 'law', stream: 'Commerce', name: 'Law & Legal Services', description: 'Corporate litigation, tax laws, intellectual property rights, and advocacy.' },
    { id: 'consulting', stream: 'Commerce', name: 'Management Consulting', description: 'Solving business problems, streamlining operations, and digital transformations.' },
    { id: 'design', stream: 'Arts', name: 'Design & Visual Arts', description: 'Visual communication, User Experience, UI interfaces, and product packaging.' },
    { id: 'media', stream: 'Arts', name: 'Media & Journalism', description: 'Reporting, video journalism, anchoring, news editing, and digital content creation.' },
    { id: 'edu', stream: 'Arts', name: 'Education & EdTech', description: 'Teaching, syllabus design, instructional design, and educational technology platforms.' },
    { id: 'psychology', stream: 'Arts', name: 'Social Work & Psychology', description: 'Counseling, clinical therapy, rehabilitation services, and non-profit operations.' }
  ],

  // 2. Specializations List
  specializations: [
    {
      id: 'cs-software',
      careerId: 'eng',
      name: 'Software Development',
      description: 'Core coding focus. Building web, mobile, and enterprise software systems.',
      duration: '4 Years',
      totalCost: 400000,
      costPerYear: 100000,
      difficulty: 3,
      prerequisites: '12th Science (PCM), Logical thinking, basic computer literacy',
      alternatives: 'QA Engineering, Systems Administration, IT support',
      recruiters: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Flipkart', 'TCS', 'Infosys', 'Wipro']
    },
    {
      id: 'cs-aiml',
      careerId: 'eng',
      name: 'AI & Machine Learning',
      description: 'Data science focus. Building predictive models, neural networks, and automated intelligence.',
      duration: '4 Years',
      totalCost: 480000,
      costPerYear: 120000,
      difficulty: 4,
      prerequisites: '12th Science (PCM), Excellent Mathematics (Linear Algebra & Calculus), Python basics',
      alternatives: 'Data Analytics, Data Engineering, Python Developer',
      recruiters: ['NVIDIA', 'Google Brain', 'Adobe', 'IBM Watson', 'Fractal Analytics', 'Mu Sigma', 'Amazon']
    },
    {
      id: 'cs-cloud',
      careerId: 'eng',
      name: 'Cloud & DevOps',
      description: 'Infrastructure and automation. Deploying software, scaling servers, managing AWS/Azure/GCP clouds.',
      duration: '4 Years',
      totalCost: 440000,
      costPerYear: 110000,
      difficulty: 3.5,
      prerequisites: '12th Science (PCM), Linux basics, computer networks understanding',
      alternatives: 'Network Engineer, System Administrator, Site Reliability Engineer',
      recruiters: ['AWS', 'Microsoft Azure', 'Google Cloud', 'RedHat', 'VMware', 'Accenture', 'Cognizant']
    },
    {
      id: 'mech-eng',
      careerId: 'eng',
      name: 'Mechanical Engineering (Robotics)',
      description: 'Designing physical machines, HVAC systems, automobiles, and automated manufacturing lines.',
      duration: '4 Years',
      totalCost: 360000,
      costPerYear: 90000,
      difficulty: 4,
      prerequisites: '12th Science (PCM), Physics, mechanical drawing, interest in hardware',
      alternatives: 'CAD Designer, HVAC Engineer, Industrial Engineer',
      recruiters: ['Tata Motors', 'Mahindra & Mahindra', 'Larsen & Toubro', 'Maruti Suzuki', 'Bosch', 'Siemens']
    },
    {
      id: 'mbbs-general',
      careerId: 'med',
      name: 'General Medicine (MBBS)',
      description: 'Primary patient care, diagnostics, internal medicine, and health management.',
      duration: '5.5 Years',
      totalCost: 1200000,
      costPerYear: 220000,
      difficulty: 5,
      prerequisites: '12th Science (PCB), High NEET score, empathy, resilience',
      alternatives: 'BAMS (Ayurveda), BHMS (Homeopathy), Public Health Administration',
      recruiters: ['Apollo Hospitals', 'Fortis Healthcare', 'Max Healthcare', 'Manipal Hospitals', 'Government Civil Hospitals']
    },
    {
      id: 'bds-dental',
      careerId: 'med',
      name: 'Orthodontics & Dental Surgery (BDS)',
      description: 'Oral hygiene, teeth corrections, root canals, and cosmetic dental surgeries.',
      duration: '5 Years',
      totalCost: 800000,
      costPerYear: 160000,
      difficulty: 4,
      prerequisites: '12th Science (PCB), NEET qualifying score, fine motor skills',
      alternatives: 'Dental Lab Technology, Oral Hygiene Specialist',
      recruiters: ['Clove Dental', 'Apollo White Dental', 'Private Dental Chains', 'Self-Owned Clinics']
    },
    {
      id: 'physics-res',
      careerId: 'rd',
      name: 'Physics Research & Academics',
      description: 'Exploring quantum mechanics, astrophysics, material sciences, and laboratory research.',
      duration: '5 Years (Integrated B.Sc-M.Sc)',
      totalCost: 250000,
      costPerYear: 50000,
      difficulty: 5,
      prerequisites: '12th Science (PCM), High analytical skill, research curiosity, KVPY/JEE qualification',
      alternatives: 'Data Analyst, High School Physics Teacher, Laboratory Assistant',
      recruiters: ['ISRO', 'BARC', 'IISc', 'IIT Laboratories', 'TIFR', 'CSIR Institutes']
    },
    {
      id: 'biomed-eng',
      careerId: 'biotech',
      name: 'Biomedical Engineering & Devices',
      description: 'Designing ECG machines, pacemakers, prosthetics, and medical software.',
      duration: '4 Years',
      totalCost: 480000,
      costPerYear: 120000,
      difficulty: 4,
      prerequisites: '12th Science (PCM/PCB), Interest in both hardware electronics and human anatomy',
      alternatives: 'Clinical Equipment Technician, Healthcare Sales Manager',
      recruiters: ['Siemens Healthineers', 'Philips Healthcare', 'GE Healthcare', 'Medtronic', 'Johnson & Johnson']
    },
    {
      id: 'ca-audit',
      careerId: 'ca',
      name: 'Audit & Assurance',
      description: 'Reviewing company accounts, ensuring tax compliance, verifying financial integrity.',
      duration: '4.5 Years',
      totalCost: 200000,
      costPerYear: 45000,
      difficulty: 4.5,
      prerequisites: '12th Commerce/Science, Passing CA Foundation & IPCC, numerical accuracy',
      alternatives: 'Internal Auditor, Finance Analyst, Accounts Executive',
      recruiters: ['Deloitte', 'EY', 'PwC', 'KPMG (Big 4)', 'Grant Thornton', 'BDO', 'Corporate Auditing Wings']
    },
    {
      id: 'ca-tax',
      careerId: 'ca',
      name: 'Taxation Specialist',
      description: 'Advising corporations and individuals on income tax, GST, and legal structures to optimize taxes.',
      duration: '4.5 Years',
      totalCost: 200000,
      costPerYear: 45000,
      difficulty: 4.5,
      prerequisites: '12th Commerce/Science, Strong law reading comprehension, analytical aptitude',
      alternatives: 'GST Filing Professional, Corporate Compliance Advisor',
      recruiters: ['PwC', 'EY', 'KPMG', 'Deloitte', 'Corporate Tax Consultancies', 'Private Practices']
    },
    {
      id: 'banking-ib',
      careerId: 'banking',
      name: 'Investment Banking',
      description: 'Corporate fundraising, mergers & acquisitions (M&A), IPO planning, and financial modeling.',
      duration: '3 Years (B.Com/BBA) + 2 Years MBA',
      totalCost: 800000,
      costPerYear: 160000,
      difficulty: 4,
      prerequisites: '12th Stream (Any, Commerce preferred), High GPA, analytical mindset, long work stamina',
      alternatives: 'Equity Research Analyst, Corporate Finance Executive, Risk Analyst',
      recruiters: ['Goldman Sachs', 'J.P. Morgan', 'Morgan Stanley', 'HSBC', 'ICICI Securities', 'Kotak Mahindra Capital']
    },
    {
      id: 'law-corp',
      careerId: 'law',
      name: 'Corporate Law',
      description: 'Drafting contracts, merging companies, resolving shareholder disputes, legal compliance.',
      duration: '5 Years (Integrated BA/BBA LLB)',
      totalCost: 750000,
      costPerYear: 150000,
      difficulty: 4,
      prerequisites: '12th Stream (Any), CLAT score, logical writing, debating skills',
      alternatives: 'Legal Consultant, Legal Journalist, Company Secretary',
      recruiters: ['Shardul Amarchand Mangaldas', 'Cyril Amarchand Mangaldas', 'Khaitan & Co', 'Trilegal', 'Luthra & Luthra']
    },
    {
      id: 'consulting',
      careerId: 'consulting',
      name: 'Strategy & Operations Consulting',
      description: 'Advising Fortune 500 companies on growth plans, product-market fits, and cost optimization.',
      duration: '3 Years (Undergrad) + 2 Years MBA',
      totalCost: 1000000,
      costPerYear: 200000,
      difficulty: 4,
      prerequisites: '12th Stream (Any), Outstanding problem solving, public presentation skills, case study practice',
      alternatives: 'Business Analyst, Operations Executive, Project Manager',
      recruiters: ['McKinsey & Company', 'Boston Consulting Group (BCG)', 'Bain & Company', 'Accenture Strategy', 'PwC', 'EY']
    },
    {
      id: 'design-ui',
      careerId: 'design',
      name: 'UX/UI Product Design',
      description: 'Designing software apps, wireframes, animations, user flows, and conducting user interviews.',
      duration: '4 Years (B.Des)',
      totalCost: 600000,
      costPerYear: 150000,
      difficulty: 3,
      prerequisites: '12th Stream (Any), Creative design portfolio, UCEED/NID entrance preferred',
      alternatives: 'Front-end Developer (Design systems), Graphic Designer, Brand Strategist',
      recruiters: ['Razorpay', 'Flipkart', 'Swiggy', 'Zomato', 'CRED', 'Microsoft', 'Samsung Design', 'Google']
    },
    {
      id: 'design-graphic',
      careerId: 'design',
      name: 'Graphic & Brand Design',
      description: 'Creating logo designs, social media flyers, package designs, and marketing billboards.',
      duration: '3 Years',
      totalCost: 300000,
      costPerYear: 100000,
      difficulty: 2.5,
      prerequisites: '12th Stream (Any), Visual aesthetics, expertise in Photoshop/Illustrator',
      alternatives: 'DTP Operator, Video Editor, Social Media Creator',
      recruiters: ['Ogilvy & Mather', 'Dentsu', 'JWT', 'Brand Design Agencies', 'In-house Marketing Teams']
    },
    {
      id: 'media-journal',
      careerId: 'media',
      name: 'Digital Journalism',
      description: 'Writing columns, conducting video interviews, running podcasts, investigative blogging.',
      duration: '3 Years (BJMC)',
      totalCost: 270000,
      costPerYear: 90000,
      difficulty: 3,
      prerequisites: '12th Stream (Any), Fluent writing & speaking, confidence before camera',
      alternatives: 'PR Specialist, Content Writer, Copywriter',
      recruiters: ['NDTV', 'Times Network', 'Republic TV', 'The Indian Express', 'The Hindu', 'Scroll.in', 'Quint']
    },
    {
      id: 'edu-edtech',
      careerId: 'edu',
      name: 'Online Education & EdTech',
      description: 'Developing digital curriculums, shooting interactive lectures, building online test series.',
      duration: '3 Years',
      totalCost: 180000,
      costPerYear: 60000,
      difficulty: 3,
      prerequisites: '12th Stream (Any), Teaching skills, screen recording knowledge, clarity of explanations',
      alternatives: 'School Teacher, Content Creator, Corporate Trainer',
      recruiters: ["Byju's", 'Unacademy', 'PhysicsWallah', 'Simplilearn', 'Great Learning', 'K-12 School Groups']
    },
    {
      id: 'psychology',
      careerId: 'psychology',
      name: 'Clinical Psychology & Counseling',
      description: 'Assessing mental health, counseling students and corporate workers, running therapeutic clinics.',
      duration: '3 Years (B.Sc) + 2 Years (M.Sc)',
      totalCost: 400000,
      costPerYear: 80000,
      difficulty: 4.5,
      prerequisites: '12th Arts/Science, High EQ, listening capacity, patience',
      alternatives: 'HR Recruiter, Special Educator, NGO Program Coordinator',
      recruiters: ['Corporate Wellness Centers', 'Schools & Universities', 'Private Mental Health Clinics', 'NGOs', 'Rehab Centers']
    }
  ],

  // 3. Curriculum Data (Year-by-year subject summary)
  curriculum: [
    // cs-software
    { specializationId: 'cs-software', year: 1, subjects: 'Programming in C/C++; Computational Logic; Engineering Mathematics 1; Communication Skills', skillsGained: 'Basic Syntax, Troubleshooting, Math foundations' },
    { specializationId: 'cs-software', year: 2, subjects: 'Data Structures & Algorithms; Object Oriented Programming (Java); DBMS (SQL); Operating Systems', skillsGained: 'Write efficient programs, manage tables, memory concepts' },
    { specializationId: 'cs-software', year: 3, subjects: 'Web Technologies (HTML/CSS/React); Computer Networks; Software Engineering Methodologies', skillsGained: 'Build full-stack frontends, route network packets, Agile basics' },
    { specializationId: 'cs-software', year: 4, subjects: 'Distributed Systems; Project Management; System Architecture; 6-Month Industry Internship', skillsGained: 'Design scalable backends, deploy server architectures' },

    // cs-aiml
    { specializationId: 'cs-aiml', year: 1, subjects: 'Python Foundations; Linear Algebra; Introduction to Computing; Basic Calculus', skillsGained: 'Python automation, Vector space manipulations' },
    { specializationId: 'cs-aiml', year: 2, subjects: 'Data Structures & Algorithms; Probability & Statistics; Data Visualization (Pandas, Seaborn); SQL', skillsGained: 'Perform data cleaning, calculate distributions' },
    { specializationId: 'cs-aiml', year: 3, subjects: 'Machine Learning (Scikit-Learn); Neural Networks & Deep Learning; Big Data Analytics (Spark)', skillsGained: 'Train classifier/regression models, build perceptrons' },
    { specializationId: 'cs-aiml', year: 4, subjects: 'Natural Language Processing; Computer Vision; Ethics in AI; Major Capstone Project', skillsGained: 'Train transformers, load YOLO models, manage model bias' },

    // cs-cloud
    { specializationId: 'cs-cloud', year: 1, subjects: 'Computer Organization; Linux Command Line; Intro to Networks; HTML/CSS basics', skillsGained: 'Bash scripting, network topologies' },
    { specializationId: 'cs-cloud', year: 2, subjects: 'Python for SysOps; Database Administration; Network Routing & Switching; Virtualization', skillsGained: 'Manage VMs, configure router settings' },
    { specializationId: 'cs-cloud', year: 3, subjects: 'AWS Cloud Architecture; Docker Containers; CI/CD Pipelines (Jenkins, Git); Kubernetes', skillsGained: 'Spin up EC2 instances, write Dockerfiles, configure pods' },
    { specializationId: 'cs-cloud', year: 4, subjects: 'Terraform (Infrastructure as Code); Cloud Security; System Monitoring (Prometheus/Grafana); Live Deployment Project', skillsGained: 'Write declarative cloud scripts, configure TLS' },

    // ca-audit
    { specializationId: 'ca-audit', year: 1, subjects: 'Accounting Principles; Mercantile Law; Quantitative Aptitude; Business Economics', skillsGained: 'Double-entry bookkeeping, business math' },
    { specializationId: 'ca-audit', year: 2, subjects: 'Company Law; Cost & Management Accounting; Direct Tax Laws; Strategic Management', skillsGained: 'Analyze cost sheets, prepare tax returns' },
    { specializationId: 'ca-audit', year: 3, subjects: 'Advanced Auditing Standards; Information Systems Control; Indirect Tax (GST); Articleship Training (Year 1)', skillsGained: 'Execute statutory audits, assess system security' },
    { specializationId: 'ca-audit', year: 4, subjects: 'Financial Reporting; Corporate Laws; Articleship Training (Year 2); Final Exam Prep', skillsGained: 'Format consolidated balance sheets, present corporate audits' }
  ],

  // 4. Timelines Data
  timeline: [
    // cs-software
    { specializationId: 'cs-software', year: 1, focus: 'Programming Foundation', milestoneDescription: 'Learn C++ or Java. Master variables, loops, arrays, and basic functions. Build 3 terminal games.' },
    { specializationId: 'cs-software', year: 2, focus: 'Data Structures & OOP', milestoneDescription: 'Deep dive into stacks, queues, trees, and hash maps. Master DBMS and build a local inventory tracker using SQL.' },
    { specializationId: 'cs-software', year: 3, focus: 'Full-Stack Web Dev', milestoneDescription: 'Learn HTML, CSS, JavaScript, and Node.js. Build a portfolio and deploy two complete full-stack web applications online.' },
    { specializationId: 'cs-software', year: 4, focus: 'Internships & Projects', milestoneDescription: 'Apply to roles via LinkedIn/Internshala. Perform a 6-month developer internship and build a scalable capstone project.' },

    // cs-aiml
    { specializationId: 'cs-aiml', year: 1, focus: 'Python & Linear Algebra', milestoneDescription: 'Master Python syntax. Study matrix transformations, eigenvalues, and vectors on Khan Academy/YouTube.' },
    { specializationId: 'cs-aiml', year: 2, focus: 'Data Cleaning & Stats', milestoneDescription: 'Learn Pandas, NumPy, and statistics. Clean 10 messy public Kaggle datasets and publish analysis reports.' },
    { specializationId: 'cs-aiml', year: 3, focus: 'Model Training', milestoneDescription: 'Build regression, classification, and clustering models. Create a convolutional neural network (CNN) image classifier.' },
    { specializationId: 'cs-aiml', year: 4, focus: 'AI Deployment & Portfolio', milestoneDescription: 'Deploy models using Gradio/Streamlit. Complete a capstone project using NLP or Vision and secure a data science internship.' },

    // ca-audit
    { specializationId: 'ca-audit', year: 1, focus: 'Foundation Exam', milestoneDescription: 'Register with ICAI. Attend coaching for Foundation exams. Solve past 5 years of exam papers and clear in first attempt.' },
    { specializationId: 'ca-audit', year: 2, focus: 'IPCC Intermediate', milestoneDescription: 'Prepare for both Groups of Intermediate. Clear exams and complete mandatory Information Technology training.' },
    { specializationId: 'ca-audit', year: 3, focus: 'Articleship Kickoff', milestoneDescription: 'Apply to mid-size or Big 4 CA firms. Start 2-year practical training under a mentor CA. Work on actual corporate audits.' },
    { specializationId: 'ca-audit', year: 4, focus: 'Final Preparation', milestoneDescription: 'Complete articleship. Dedicate 6 months for rigorous study of CA Final. Pass and obtain ICAI Membership.' }
  ],

  // 5. Salary Progression
  salaries: [
    { specializationId: 'cs-software', year1: 550000, year3: 1200000, year5: 2200000, trajectory: 'Junior Software Engineer -> Senior Developer -> Tech Lead / Engineering Manager' },
    { specializationId: 'cs-aiml', year1: 700000, year3: 1500000, year5: 2800000, trajectory: 'Associate ML Engineer -> Senior Data Scientist -> Principal AI Architect' },
    { specializationId: 'cs-cloud', year1: 600000, year3: 1300000, year5: 2400000, trajectory: 'DevOps Associate -> Site Reliability Engineer -> Cloud Solutions Architect' },
    { specializationId: 'mech-eng', year1: 400000, year3: 850000, year5: 1500000, trajectory: 'Graduate Engineer Trainee -> Design Engineer -> Automation Specialist' },
    { specializationId: 'mbbs-general', year1: 720000, year3: 1200000, year5: 1800000, trajectory: 'Resident Doctor -> General Practitioner -> Consultant Physician (Requires MD)' },
    { specializationId: 'bds-dental', year1: 300000, year3: 650000, year5: 1200000, trajectory: 'Junior Dentist -> Dental Surgeon -> Clinical Director / Private Clinic Owner' },
    { specializationId: 'physics-res', year1: 450000, year3: 800000, year5: 1400000, trajectory: 'Research Fellow (PhD) -> Postdoctoral Scholar -> Assistant Professor / Research Scientist' },
    { specializationId: 'biomed-eng', year1: 420000, year3: 900000, year5: 1600000, trajectory: 'Biomedical Service Engineer -> Clinical Systems Analyst -> R&D Manager' },
    { specializationId: 'ca-audit', year1: 800000, year3: 1500000, year5: 2500000, trajectory: 'Assistant Auditor -> Senior Manager -> Partner in CA Firm / CFO' },
    { specializationId: 'ca-tax', year1: 750000, year3: 1400000, year5: 2400000, trajectory: 'Tax Consultant -> Senior Tax Associate -> VP of Taxation / Tax Advisor' },
    { specializationId: 'banking-ib', year1: 900000, year3: 1800000, year5: 3200000, trajectory: 'Investment Analyst -> Associate -> Vice President -> Managing Director' },
    { specializationId: 'law-corp', year1: 700000, year3: 1400000, year5: 2400000, trajectory: 'Legal Associate -> Senior Associate -> Partner in Law Firm / General Counsel' },
    { specializationId: 'consulting', year1: 850000, year3: 1600000, year5: 2800000, trajectory: 'Management Analyst -> Associate Consultant -> Engagement Manager' },
    { specializationId: 'design-ui', year1: 600000, year3: 1300000, year5: 2200000, trajectory: 'Junior UX/UI Designer -> Senior Product Designer -> UX Director' },
    { specializationId: 'design-graphic', year1: 350000, year3: 700000, year5: 1200000, trajectory: 'Junior Designer -> Creative Lead -> Art Director' },
    { specializationId: 'media-journal', year1: 360000, year3: 750000, year5: 1300000, trajectory: 'Reporter / Sub-editor -> Correspondent -> Executive Editor' },
    { specializationId: 'edu-edtech', year1: 400000, year3: 800000, year5: 1500000, trajectory: 'SME (Subject Matter Expert) -> Content Lead -> EdTech Curriculum Manager' },
    { specializationId: 'psychology', year1: 360000, year3: 720000, year5: 1200000, trajectory: 'Junior Counselor -> Clinical Psychologist -> Chief Psychotherapist' }
  ],

  // 6. YouTube Videos Suggestions
  youtubeVideos: {
    'cs-software': [
      { id: '8mAITcNt70k', title: 'Harvard CS50 – Full Computer Science Course', channel: 'freeCodeCamp.org', description: 'The absolute gold standard for introducing computational thinking, programming, and algorithms.', url: 'https://www.youtube.com/watch?v=8mAITcNt70k' },
      { id: 'NuS9SntUqg0', title: 'Full Stack Web Development Course for Beginners', channel: 'freeCodeCamp.org', description: 'Comprehensive guide covering HTML, CSS, JavaScript, Node.js, and Databases in one course.', url: 'https://www.youtube.com/watch?v=NuS9SntUqg0' },
      { id: '8hly31xKjhc', title: 'Data Structures and Algorithms for Beginners', channel: 'Programming with Mosh', description: 'Clear visual explanations of lists, trees, and searching algorithms for starting interviews.', url: 'https://www.youtube.com/watch?v=8hly31xKjhc' }
    ],
    'cs-aiml': [
      { id: 'aircAruvnKk', title: 'But what is a neural network? | Chapter 1, Deep learning', channel: '3Blue1Brown', description: 'Beautiful animations explaining what weights, biases, and layers are inside machine learning.', url: 'https://www.youtube.com/watch?v=aircAruvnKk' },
      { id: 'NWONeJKn6kc', title: 'Machine Learning for Beginners - Full Course', channel: 'freeCodeCamp.org', description: 'Full theory and code examples using Scikit-Learn and Python for classification and regression.', url: 'https://www.youtube.com/watch?v=NWONeJKn6kc' },
      { id: 'Wo5dMEP_BbI', title: 'Neural Networks from Scratch in Python', channel: 'sentdex', description: 'Learn how backpropagation, activations, and dense layers operate by coding them without libraries.', url: 'https://www.youtube.com/watch?v=Wo5dMEP_BbI' }
    ],
    'cs-cloud': [
      { id: 'Xrgk023l4lI', title: 'DevOps Roadmap for Beginners - What is DevOps?', channel: 'TechWorld with Nana', description: 'Comprehensive overview of Docker, Kubernetes, CI/CD pipelines, and cloud hosting.', url: 'https://www.youtube.com/watch?v=Xrgk023l4lI' },
      { id: 'SOTamWGuDKc', title: 'AWS Certified Cloud Practitioner Study Course', channel: 'freeCodeCamp.org', description: 'Deep dive preparation course for the AWS Cloud Practitioner certification exam.', url: 'https://www.youtube.com/watch?v=SOTamWGuDKc' },
      { id: 'd6WC5n9G_sM', title: 'Complete Git and GitHub Course', channel: 'Kunal Kushwaha', description: 'Master version control, branches, pull requests, and collaboration setups.', url: 'https://www.youtube.com/watch?v=d6WC5n9G_sM' }
    ],
    'ca-audit': [
      { id: '3aR-19VkiK8', title: 'How to Read a Balance Sheet & Financial Statements', channel: 'CA Rachana Ranade', description: 'Learn how to analyze assets, liabilities, cash flows, and profit sheets with ease.', url: 'https://www.youtube.com/watch?v=3aR-19VkiK8' },
      { id: 'cM3uYq9a-gM', title: 'Introduction to Statutory Audit concepts', channel: 'ICAI YouTube Channel', description: 'Official guidance on audit workflows, verifying ledgers, and compliance standards.', url: 'https://www.youtube.com/watch?v=cM3uYq9a-gM' }
    ],
    'ca-tax': [
      { id: '3aR-19VkiK8', title: 'How to Read a Balance Sheet & Financial Statements', channel: 'CA Rachana Ranade', description: 'Learn how to analyze assets, liabilities, cash flows, and profit sheets with ease.', url: 'https://www.youtube.com/watch?v=3aR-19VkiK8' },
      { id: 's35R62o7Uos', title: 'Basic Concepts of Income Tax in India', channel: 'Study At Home', description: 'Practical introduction to tax slabs, salary deductions, and filing rules in India.', url: 'https://www.youtube.com/watch?v=s35R62o7Uos' }
    ],
    'banking-ib': [
      { id: 'eBfB10uR6v0', title: 'Investment Banking Career Path Explained', channel: 'Peak Frameworks', description: 'Inside look at hours, salary, expectations, and analytical tasks of investment analysts.', url: 'https://www.youtube.com/watch?v=eBfB10uR6v0' },
      { id: 'gS8mQ-V9_t8', title: 'Introduction to Corporate Financial Modeling', channel: 'Wall Street Prep', description: 'Step-by-step tutorial on building a basic 3-statement forecast in Excel.', url: 'https://www.youtube.com/watch?v=gS8mQ-V9_t8' }
    ],
    'law-corp': [
      { id: '1F_U2p4H3hA', title: 'Corporate Law Careers & CLAT Prep in India', channel: 'Finology Legal', description: 'Overview of legal compliance, mergers, business laws, and top Indian law firms.', url: 'https://www.youtube.com/watch?v=1F_U2p4H3hA' },
      { id: '7uKqM9LszB0', title: 'How to Read Legal Contracts & Agreements', channel: 'LawSikho', description: 'Practical guide on understanding legal clauses, indemnity, and arbitration details.', url: 'https://www.youtube.com/watch?v=7uKqM9LszB0' }
    ],
    'consulting': [
      { id: '680DugG1jMs', title: 'What is Management Consulting? (McKinsey, BCG, Bain)', channel: 'Firm Learning', description: 'Explanation of business case solving, slide decks, and structural recommendations.', url: 'https://www.youtube.com/watch?v=680DugG1jMs' },
      { id: 'tF3F3qI_aF4', title: 'Case Interview 101 - Introductory Guide', channel: 'Crafting Cases', description: 'How to structure consulting cases, ask clarifying questions, and do math calculations.', url: 'https://www.youtube.com/watch?v=tF3F3qI_aF4' }
    ],
    'design-ui': [
      { id: 'c9Wg6RY_ADc', title: 'UX / UI Design Tutorial for Beginners (Figma)', channel: 'freeCodeCamp.org', description: 'Learn user experience principles, wireframing, color theory, and prototype design in Figma.', url: 'https://www.youtube.com/watch?v=c9Wg6RY_ADc' },
      { id: 'xSscgA4K0y4', title: 'How To Design A Logo - Complete Creative Process', channel: 'The Futur', description: 'Watch professional designers extract client guidelines and create typography and logomarks.', url: 'https://www.youtube.com/watch?v=xSscgA4K0y4' }
    ],
    'design-graphic': [
      { id: 'xSscgA4K0y4', title: 'How To Design A Logo - Complete Creative Process', channel: 'The Futur', description: 'Watch professional designers extract client guidelines and create typography and logomarks.', url: 'https://www.youtube.com/watch?v=xSscgA4K0y4' }
    ]
  }
};
