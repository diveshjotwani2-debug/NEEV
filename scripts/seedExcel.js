const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Ensure data folder exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. Careers List
const careers = [
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
];

// 2. Specializations List
const specializations = [
  // Engineering Specializations
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
    alternatives: 'QA Engineering, Systems Administration, IT support'
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
    alternatives: 'Data Analytics, Data Engineering, Python Developer'
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
    alternatives: 'Network Engineer, System Administrator, Site Reliability Engineer'
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
    alternatives: 'CAD Designer, HVAC Engineer, Industrial Engineer'
  },
  
  // Medicine
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
    alternatives: 'BAMS (Ayurveda), BHMS (Homeopathy), Public Health Administration'
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
    alternatives: 'Dental Lab Technology, Oral Hygiene Specialist'
  },

  // Research
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
    alternatives: 'Data Analyst, High School Physics Teacher, Laboratory Assistant'
  },

  // Biotech
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
    alternatives: 'Clinical Equipment Technician, Healthcare Sales Manager'
  },

  // Commerce - CA
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
    alternatives: 'Internal Auditor, Finance Analyst, Accounts Executive'
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
    alternatives: 'GST Filing Professional, Corporate Compliance Advisor'
  },

  // Banking
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
    alternatives: 'Equity Research Analyst, Corporate Finance Executive, Risk Analyst'
  },

  // Law
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
    alternatives: 'Legal Consultant, Legal Journalist, Company Secretary'
  },

  // Consulting
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
    alternatives: 'Business Analyst, Operations Executive, Project Manager'
  },

  // Design
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
    alternatives: 'Front-end Developer (Design systems), Graphic Designer, Brand Strategist'
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
    alternatives: 'DTP Operator, Video Editor, Social Media Creator'
  },

  // Media
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
    alternatives: 'PR Specialist, Content Writer, Copywriter'
  },

  // Education
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
    alternatives: 'School Teacher, Content Creator, Corporate Trainer'
  },

  // Psychology
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
    alternatives: 'HR Recruiter, Special Educator, NGO Program Coordinator'
  }
];

// 3. Curriculum Data (Year-by-year subject summary)
const curriculums = [
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
];

// 4. Timelines Data
const timelines = [
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
  { specializationId: 'ca-audit', year: 4, focus: 'Final Preparation', milestoneDescription: 'Complete articleship. Dedicate 6 months for rigorous study of Group 1 and 2 of CA Final. Pass and obtain ICAI Membership.' }
];

// 5. Salary Progression
const salaries = [
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
];

// 6. Recruiters List
const recruiters = [
  { specializationId: 'cs-software', companies: 'Google, Microsoft, Amazon, Meta, Flipkart, TCS, Infosys, Wipro' },
  { specializationId: 'cs-aiml', companies: 'NVIDIA, Google Brain, Adobe, IBM Watson, Fractal Analytics, Mu Sigma, Amazon' },
  { specializationId: 'cs-cloud', companies: 'AWS, Microsoft Azure, Google Cloud, RedHat, VMware, Accenture, Cognizant' },
  { specializationId: 'mech-eng', companies: 'Tata Motors, Mahindra & Mahindra, Larsen & Toubro, Maruti Suzuki, Bosch, Siemens' },
  { specializationId: 'mbbs-general', companies: 'Apollo Hospitals, Fortis Healthcare, Max Healthcare, Manipal Hospitals, Government Civil Hospitals' },
  { specializationId: 'bds-dental', companies: 'Clove Dental, Apollo White Dental, Private Dental Chains, Self-Owned Clinics' },
  { specializationId: 'physics-res', companies: 'ISRO, BARC, IISc, IIT Laboratories, TIFR, CSIR Institutes' },
  { specializationId: 'biomed-eng', specializationId: 'biomed-eng', companies: 'Siemens Healthineers, Philips Healthcare, GE Healthcare, Medtronic, Johnson & Johnson' },
  { specializationId: 'ca-audit', companies: 'Deloitte, EY, PwC, KPMG (Big 4), Grant Thornton, BDO, Corporate Auditing Wings' },
  { specializationId: 'ca-tax', companies: 'PwC, EY, KPMG, Deloitte, Corporate Tax Consultancies, Private Practices' },
  { specializationId: 'banking-ib', companies: 'Goldman Sachs, J.P. Morgan, Morgan Stanley, HSBC, ICICI Securities, Kotak Mahindra Capital' },
  { specializationId: 'law-corp', companies: 'Shardul Amarchand Mangaldas, Cyril Amarchand Mangaldas, Khaitan & Co, Trilegal, Luthra & Luthra' },
  { specializationId: 'consulting', companies: 'McKinsey & Company, Boston Consulting Group (BCG), Bain & Company, Accenture Strategy, PwC, EY' },
  { specializationId: 'design-ui', companies: 'Razorpay, Flipkart, Swiggy, Zomato, CRED, Microsoft, Samsung Design, Google' },
  { specializationId: 'design-graphic', companies: 'Ogily & Mather, Dentsu, JWT, Brand Design Agencies, In-house Marketing Teams' },
  { specializationId: 'media-journal', companies: 'NDTV, Times Network, Republic TV, The Indian Express, The Hindu, Scroll.in, Quint' },
  { specializationId: 'edu-edtech', companies: 'Byju\'s, Unacademy, PhysicsWallah, Simplilearn, Great Learning, K-12 School Groups' },
  { specializationId: 'psychology', companies: 'Corporate Wellness Centers, Schools & Universities, Private Mental Health Clinics, NGOs, Rehab Centers' }
];

// Helper to fill data if some specializations don't have matching details
// (e.g. we will fill fallback rows so reading sheets doesn't fail)
const allSpecIds = specializations.map(s => s.id);
const curSpecIds = curriculums.map(c => c.specializationId);
const timeSpecIds = timelines.map(t => t.specializationId);

allSpecIds.forEach(id => {
  if (!curSpecIds.includes(id)) {
    curriculums.push(
      { specializationId: id, year: 1, subjects: 'Foundation Principles; Introduction to Field; Mathematical Basics', skillsGained: 'Domain literacy, terminology' },
      { specializationId: id, year: 2, subjects: 'Intermediate Theories; Case Studies & Experiments; Practical Labs', skillsGained: 'Hands-on practice, methodologies' },
      { specializationId: id, year: 3, subjects: 'Specialized Electives; Advanced Tools; Industry Standards', skillsGained: 'System design, tool optimization' },
      { specializationId: id, year: 4, subjects: 'Professional Ethics; Internship / Field Work; Final Project', skillsGained: 'Real-world deployment, operations' }
    );
  }
  if (!timeSpecIds.includes(id)) {
    timelines.push(
      { specializationId: id, year: 1, focus: 'Foundation Building', milestoneDescription: 'Read 3 introductory textbooks, attend classes, clear basic tests.' },
      { specializationId: id, year: 2, focus: 'Skill Development', milestoneDescription: 'Work on 2 practical mini-projects, join professional societies.' },
      { specializationId: id, year: 3, focus: 'Advanced Specialization', milestoneDescription: 'Choose your narrow niche, complete 1 specialized certification.' },
      { specializationId: id, year: 4, focus: 'Transition to Industry', milestoneDescription: 'Complete 3-6 months internship or field placement, prepare resume.' }
    );
  }
});

// Create Workbook
const workbook = XLSX.utils.book_new();

// Add sheets
const careersSheet = XLSX.utils.json_to_sheet(careers);
XLSX.utils.book_append_sheet(workbook, careersSheet, 'Careers');

const specializationsSheet = XLSX.utils.json_to_sheet(specializations);
XLSX.utils.book_append_sheet(workbook, specializationsSheet, 'Specializations');

const curriculumSheet = XLSX.utils.json_to_sheet(curriculums);
XLSX.utils.book_append_sheet(workbook, curriculumSheet, 'Curriculum');

const timelinesSheet = XLSX.utils.json_to_sheet(timelines);
XLSX.utils.book_append_sheet(workbook, timelinesSheet, 'Timelines');

const salariesSheet = XLSX.utils.json_to_sheet(salaries);
XLSX.utils.book_append_sheet(workbook, salariesSheet, 'Salaries');

const recruitersSheet = XLSX.utils.json_to_sheet(recruiters);
XLSX.utils.book_append_sheet(workbook, recruitersSheet, 'Recruiters');

// Save Excel file
const excelPath = path.join(dataDir, 'careers.xlsx');
XLSX.writeFile(workbook, excelPath);

console.log(`Excel database seeded successfully at: ${excelPath}`);
