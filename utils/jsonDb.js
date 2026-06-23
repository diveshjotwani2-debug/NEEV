const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// Helper to read JSON file safely
function readJson(filename, defaultValue = []) {
  const filepath = path.join(dataDir, filename);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  try {
    const data = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading database file: ${filename}`, err);
    return defaultValue;
  }
}

// Helper to write JSON file safely
function writeJson(filename, data) {
  const filepath = path.join(dataDir, filename);
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing database file: ${filename}`, err);
    return false;
  }
}

// Users DB actions
function getUsers() {
  return readJson('users.json');
}

function saveUsers(users) {
  return writeJson('users.json', users);
}

function getUserByEmail(email) {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function createUser(user) {
  const users = getUsers();
  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    createdAt: new Date().toISOString(),
    settings: {
      emailNotifications: true,
      weeklySummary: true,
      preferredStudyTime: '14:00',
      goalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
    },
    ...user
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

// Enrollments DB actions (tracking student enrollments in specializations)
function getEnrollments() {
  return readJson('enrollments.json');
}

function saveEnrollments(enrollments) {
  return writeJson('enrollments.json', enrollments);
}

function getEnrollmentByUserId(userId) {
  const enrollments = getEnrollments();
  return enrollments.find(e => e.userId === userId);
}

function createOrUpdateEnrollment(userId, specializationId, details) {
  const enrollments = getEnrollments();
  const index = enrollments.findIndex(e => e.userId === userId);
  
  // Create tasks based on curriculum and general tasks
  const defaultTasks = [
    { id: 't1', text: 'Review syllabus and curriculum overview', completed: false, category: 'Phase 1' },
    { id: 't2', text: 'Set study schedule in profile settings', completed: false, category: 'Phase 1' },
    { id: 't3', text: 'Read the prerequisite material list', completed: false, category: 'Phase 1' },
    { id: 't4', text: 'Join Discord student study group', completed: false, category: 'Phase 2' },
    { id: 't5', text: 'Complete first online fundamentals course module', completed: false, category: 'Phase 2' },
    { id: 't6', text: 'Build 1 basic mini-project for your portfolio', completed: false, category: 'Phase 2' },
    { id: 't7', text: 'Connect with a suggested career mentor', completed: false, category: 'Phase 3' },
    { id: 't8', text: 'Apply for internship positions on platform', completed: false, category: 'Phase 4' }
  ];

  const newEnrollment = {
    userId,
    specializationId,
    enrolledAt: new Date().toISOString(),
    progressPercent: 0,
    currentPhase: 'Phase 1: Foundation',
    tasks: defaultTasks,
    ...(index !== -1 ? enrollments[index] : {})
  };

  // If changing path, reset progress to 0 but save enrollment date
  if (index !== -1 && enrollments[index].specializationId !== specializationId) {
    newEnrollment.specializationId = specializationId;
    newEnrollment.progressPercent = 0;
    newEnrollment.currentPhase = 'Phase 1: Foundation';
    newEnrollment.tasks = defaultTasks;
    newEnrollment.enrolledAt = new Date().toISOString();
  }

  if (index !== -1) {
    enrollments[index] = newEnrollment;
  } else {
    enrollments.push(newEnrollment);
  }
  
  saveEnrollments(enrollments);
  return newEnrollment;
}

// Mentor Requests DB actions
function getMentorRequests() {
  return readJson('mentor_requests.json');
}

function saveMentorRequests(requests) {
  return writeJson('mentor_requests.json', requests);
}

function createMentorRequest(userId, mentorId, mentorName) {
  const requests = getMentorRequests();
  const newRequest = {
    id: 'req_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    userId,
    mentorId,
    mentorName,
    requestedAt: new Date().toISOString(),
    status: 'Pending'
  };
  requests.push(newRequest);
  saveMentorRequests(requests);
  return newRequest;
}

module.exports = {
  getUsers,
  saveUsers,
  getUserByEmail,
  createUser,
  getEnrollments,
  getEnrollmentByUserId,
  createOrUpdateEnrollment,
  saveEnrollments,
  getMentorRequests,
  createMentorRequest
};
