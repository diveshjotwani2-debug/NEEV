const express = require('express');
const jsonDb = require('../utils/jsonDb');
const excelDb = require('../utils/excelDb');
const { verifyToken } = require('../utils/authMiddleware');

const router = express.Router();

// Get Active Enrollment & Progress Dashboard Data
router.get('/', verifyToken, (req, res) => {
  try {
    const enrollment = jsonDb.getEnrollmentByUserId(req.userId);
    if (!enrollment) {
      return res.status(200).json({ enrolled: false });
    }

    const specDetail = excelDb.getSpecializationDetail(enrollment.specializationId);
    if (!specDetail) {
      return res.status(404).json({ error: 'Enrolled career path details not found in Excel DB.' });
    }

    // Recommended YouTube Videos (Real channels/topics for this specialization)
    let youtubeVideos = [];
    const specId = enrollment.specializationId;
    
    if (specId === 'cs-software') {
      youtubeVideos = [
        { id: '8mAITcNt70k', title: 'Harvard CS50 – Full Computer Science Course', channel: 'freeCodeCamp.org', description: 'The absolute gold standard for introducing computational thinking, programming, and algorithms.', url: 'https://www.youtube.com/watch?v=8mAITcNt70k' },
        { id: 'NuS9SntUqg0', title: 'Full Stack Web Development Course for Beginners', channel: 'freeCodeCamp.org', description: 'Comprehensive guide covering HTML, CSS, JavaScript, Node.js, and Databases in one course.', url: 'https://www.youtube.com/watch?v=NuS9SntUqg0' },
        { id: '8hly31xKjhc', title: 'Data Structures and Algorithms for Beginners', channel: 'Programming with Mosh', description: 'Clear visual explanations of lists, trees, and searching algorithms for starting interviews.', url: 'https://www.youtube.com/watch?v=8hly31xKjhc' }
      ];
    } else if (specId === 'cs-aiml') {
      youtubeVideos = [
        { id: 'aircAruvnKk', title: 'But what is a neural network? | Chapter 1, Deep learning', channel: '3Blue1Brown', description: 'Beautiful animations explaining what weights, biases, and layers are inside machine learning.', url: 'https://www.youtube.com/watch?v=aircAruvnKk' },
        { id: 'NWONeJKn6kc', title: 'Machine Learning for Beginners - Full Course', channel: 'freeCodeCamp.org', description: 'Full theory and code examples using Scikit-Learn and Python for classification and regression.', url: 'https://www.youtube.com/watch?v=NWONeJKn6kc' },
        { id: 'Wo5dMEP_BbI', title: 'Neural Networks from Scratch in Python', channel: 'sentdex', description: 'Learn how backpropagation, activations, and dense layers operate by coding them without libraries.', url: 'https://www.youtube.com/watch?v=Wo5dMEP_BbI' }
      ];
    } else if (specId === 'cs-cloud') {
      youtubeVideos = [
        { id: 'Xrgk023l4lI', title: 'DevOps Roadmap for Beginners - What is DevOps?', channel: 'TechWorld with Nana', description: 'Comprehensive overview of Docker, Kubernetes, CI/CD pipelines, and cloud hosting.', url: 'https://www.youtube.com/watch?v=Xrgk023l4lI' },
        { id: 'SOTamWGuDKc', title: 'AWS Certified Cloud Practitioner Study Course', channel: 'freeCodeCamp.org', description: 'Deep dive preparation course for the AWS Cloud Practitioner certification exam.', url: 'https://www.youtube.com/watch?v=SOTamWGuDKc' },
        { id: 'd6WC5n9G_sM', title: 'Complete Git and GitHub Course', channel: 'Kunal Kushwaha', description: 'Master version control, branches, pull requests, and collaboration setups.', url: 'https://www.youtube.com/watch?v=d6WC5n9G_sM' }
      ];
    } else if (specId.startsWith('ca-')) {
      youtubeVideos = [
        { id: '3aR-19VkiK8', title: 'How to Read a Balance Sheet & Financial Statements', channel: 'CA Rachana Ranade', description: 'Learn how to analyze assets, liabilities, cash flows, and profit sheets with ease.', url: 'https://www.youtube.com/watch?v=3aR-19VkiK8' },
        { id: 'cM3uYq9a-gM', title: 'Introduction to Statutory Audit concepts', channel: 'ICAI YouTube Channel', description: 'Official guidance on audit workflows, verifying ledgers, and compliance standards.', url: 'https://www.youtube.com/watch?v=cM3uYq9a-gM' }
      ];
    } else if (specId.startsWith('banking-')) {
      youtubeVideos = [
        { id: 'eBfB10uR6v0', title: 'Investment Banking Career Path Explained', channel: 'Peak Frameworks', description: 'Inside look at hours, salary, expectations, and analytical tasks of investment analysts.', url: 'https://www.youtube.com/watch?v=eBfB10uR6v0' },
        { id: 'gS8mQ-V9_t8', title: 'Introduction to Corporate Financial Modeling', channel: 'Wall Street Prep', description: 'Step-by-step tutorial on building a basic 3-statement forecast in Excel.', url: 'https://www.youtube.com/watch?v=gS8mQ-V9_t8' }
      ];
    } else if (specId.startsWith('law-')) {
      youtubeVideos = [
        { id: '1F_U2p4H3hA', title: 'Corporate Law Careers & CLAT Prep in India', channel: 'Finology Legal', description: 'Overview of legal compliance, mergers, business laws, and top Indian law firms.', url: 'https://www.youtube.com/watch?v=1F_U2p4H3hA' },
        { id: '7uKqM9LszB0', title: 'How to Read Legal Contracts & Agreements', channel: 'LawSikho', description: 'Practical guide on understanding legal clauses, indemnity, and arbitration details.', url: 'https://www.youtube.com/watch?v=7uKqM9LszB0' }
      ];
    } else if (specId === 'consulting') {
      youtubeVideos = [
        { id: '680DugG1jMs', title: 'What is Management Consulting? (McKinsey, BCG, Bain)', channel: 'Firm Learning', description: 'Explanation of business case solving, slide decks, and structural recommendations.', url: 'https://www.youtube.com/watch?v=680DugG1jMs' },
        { id: 'tF3F3qI_aF4', title: 'Case Interview 101 - Introductory Guide', channel: 'Crafting Cases', description: 'How to structure consulting cases, ask clarifying questions, and do math calculations.', url: 'https://www.youtube.com/watch?v=tF3F3qI_aF4' }
      ];
    } else if (specId.startsWith('design-')) {
      youtubeVideos = [
        { id: 'c9Wg6RY_ADc', title: 'UX / UI Design Tutorial for Beginners (Figma)', channel: 'freeCodeCamp.org', description: 'Learn user experience principles, wireframing, color theory, and prototype design in Figma.', url: 'https://www.youtube.com/watch?v=c9Wg6RY_ADc' },
        { id: 'xSscgA4K0y4', title: 'How To Design A Logo - Complete Creative Process', channel: 'The Futur', description: 'Watch professional designers extract client guidelines and create typography and logomarks.', url: 'https://www.youtube.com/watch?v=xSscgA4K0y4' }
      ];
    } else {
      youtubeVideos = [
        { id: 'ukLnPbIffxE', title: 'How to Study Effectively for Exams (Active Recall)', channel: 'Ali Abdaal', description: 'Science-backed techniques like spaced repetition and practice testing to learn 2x faster.', url: 'https://www.youtube.com/watch?v=ukLnPbIffxE' },
        { id: 'CqHjOig0v3s', title: 'My Study Method - How I Memorize Complex Concepts', channel: 'Anuj Pachhel', description: 'Practical roadmap of notes, schedules, and active recall used by a top medical student.', url: 'https://www.youtube.com/watch?v=CqHjOig0v3s' }
      ];
    }

    // Dynamic Notifications
    const notifications = [
      { id: 'n1', text: 'Welcome to your career journey! Keep up Phase 1 progress.', date: new Date(enrollment.enrolledAt).toLocaleDateString() }
    ];

    if (enrollment.progressPercent >= 50) {
      notifications.unshift({ id: 'n2', text: 'Milestone Alert! You have finished 50% of your checklist. Keep it up!', date: 'Just now' });
    }

    res.status(200).json({
      enrolled: true,
      enrollment: {
        ...enrollment,
        specializationName: specDetail.name,
        careerName: specDetail.careerId === 'eng' ? 'Engineering' : specDetail.careerId === 'med' ? 'Medicine' : specDetail.careerId === 'ca' ? 'Chartered Accountancy' : specDetail.careerId,
        duration: specDetail.duration,
        cost: specDetail.totalCost
      },
      youtubeVideos,
      notifications
    });
  } catch (err) {
    console.error('Fetch dashboard error:', err);
    res.status(500).json({ error: 'Failed to retrieve dashboard data.' });
  }
});

// Enroll in a specialization
router.post('/enroll', verifyToken, (req, res) => {
  try {
    const { specializationId } = req.body;
    if (!specializationId) {
      return res.status(400).json({ error: 'Specialization ID is required to enroll.' });
    }

    const specDetail = excelDb.getSpecializationDetail(specializationId);
    if (!specDetail) {
      return res.status(404).json({ error: `Specialization '${specializationId}' does not exist.` });
    }

    const enrollment = jsonDb.createOrUpdateEnrollment(req.userId, specializationId);
    
    res.status(200).json({
      message: `Enrolled successfully in ${specDetail.name}!`,
      enrollment
    });
  } catch (err) {
    console.error('Enrollment error:', err);
    res.status(500).json({ error: 'Server error during path enrollment.' });
  }
});

// Update Checklist Tasks & recalculate progress
router.put('/tasks', verifyToken, (req, res) => {
  try {
    const { tasks } = req.body;
    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ error: 'Tasks array is required.' });
    }

    const enrollments = jsonDb.getEnrollments();
    const index = enrollments.findIndex(e => e.userId === req.userId);
    if (index === -1) {
      return res.status(404).json({ error: 'No active career path enrollment found.' });
    }

    const enrollment = enrollments[index];
    enrollment.tasks = tasks;

    // Recalculate progress
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    enrollment.progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update current phase based on progress percentage
    if (enrollment.progressPercent <= 25) {
      enrollment.currentPhase = 'Phase 1: Foundation';
    } else if (enrollment.progressPercent <= 50) {
      enrollment.currentPhase = 'Phase 2: Core Concepts';
    } else if (enrollment.progressPercent <= 75) {
      enrollment.currentPhase = 'Phase 3: Specialization Niche';
    } else {
      enrollment.currentPhase = 'Phase 4: Internship & Capstone';
    }

    enrollments[index] = enrollment;
    jsonDb.saveEnrollments(enrollments);

    res.status(200).json({
      message: 'Tasks progress updated successfully.',
      enrollment
    });
  } catch (err) {
    console.error('Update tasks error:', err);
    res.status(500).json({ error: 'Server error while saving task progress.' });
  }
});

// Request connection with a mentor
router.post('/mentor-request', verifyToken, (req, res) => {
  try {
    const { mentorId, mentorName } = req.body;
    if (!mentorId || !mentorName) {
      return res.status(400).json({ error: 'Mentor ID and Mentor Name are required.' });
    }

    const request = jsonDb.createMentorRequest(req.userId, mentorId, mentorName);

    res.status(200).json({
      message: `Request sent to ${mentorName} successfully! They will contact you shortly.`,
      request
    });
  } catch (err) {
    console.error('Mentor request error:', err);
    res.status(500).json({ error: 'Server error during mentor connection request.' });
  }
});

// Save Settings
router.put('/settings', verifyToken, (req, res) => {
  try {
    const { emailNotifications, weeklySummary, preferredStudyTime, goalDate } = req.body;

    const users = jsonDb.getUsers();
    const index = users.findIndex(u => u.id === req.userId);
    if (index === -1) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    users[index].settings = {
      emailNotifications: emailNotifications !== undefined ? emailNotifications : users[index].settings.emailNotifications,
      weeklySummary: weeklySummary !== undefined ? weeklySummary : users[index].settings.weeklySummary,
      preferredStudyTime: preferredStudyTime || users[index].settings.preferredStudyTime,
      goalDate: goalDate || users[index].settings.goalDate
    };

    jsonDb.saveUsers(users);

    const { password: _, ...userWithoutPassword } = users[index];
    res.status(200).json({
      message: 'Settings updated successfully.',
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Save settings error:', err);
    res.status(500).json({ error: 'Server error while saving settings.' });
  }
});

module.exports = router;
