const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = 4000; // Use a different port for testing
process.env.PORT = PORT;

// Start server
console.log('Starting test server...');
const server = spawn('node', [path.join(__dirname, '../server.js')], {
  env: { ...process.env }
});

let serverOutput = '';
server.stdout.on('data', (data) => {
  serverOutput += data.toString();
});
server.stderr.on('data', (data) => {
  console.error('Server stderr:', data.toString());
});

// Wait for server to start
setTimeout(async () => {
  console.log('Server logs check:');
  console.log(serverOutput);
  
  try {
    await runTests();
  } catch (err) {
    console.error('Tests failed with error:', err);
    cleanup(1);
  }
}, 2000);

function cleanup(exitCode = 0) {
  console.log('Shutting down test server...');
  server.kill('SIGINT');
  
  // Delete test db file if we want clean tests, or keep it.
  // We can leave it since it will be overwritten next seed/test.
  
  console.log(`Exiting test process with code ${exitCode}`);
  process.exit(exitCode);
}

async function runTests() {
  const baseUrl = `http://localhost:${PORT}/api`;
  let token = '';
  let testUserEmail = `test_${Date.now()}@school.com`;
  let testPassword = 'testpassword123';

  console.log('\n=========================================');
  console.log(' RUNNING NEEV API INTEGRATION TESTS');
  console.log('=========================================\n');

  // Test 1: Register User
  console.log('Test 1: Student Signup...');
  const regRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Student',
      email: testUserEmail,
      password: testPassword,
      phone: '9999988888',
      school: 'Test Boarding High School',
      stream: 'Science'
    })
  });
  
  const regData = await regRes.json();
  if (regRes.status !== 201 || !regData.token) {
    throw new Error(`Signup failed: ${JSON.stringify(regData)}`);
  }
  token = regData.token;
  console.log('✓ Student Signup Passed!');

  // Test 2: Login User
  console.log('Test 2: Student Login...');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testUserEmail,
      password: testPassword
    })
  });
  const loginData = await loginRes.json();
  if (loginRes.status !== 200 || !loginData.token) {
    throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
  }
  console.log('✓ Student Login Passed!');

  // Test 3: Fetch Careers
  console.log('Test 3: Fetch Careers from Excel...');
  const careersRes = await fetch(`${baseUrl}/careers`);
  const careersData = await careersRes.json();
  if (careersRes.status !== 200 || !Array.isArray(careersData) || careersData.length === 0) {
    throw new Error(`Fetch careers failed: ${JSON.stringify(careersData)}`);
  }
  console.log(`✓ Fetch Careers Passed! Retrieved ${careersData.length} careers.`);

  // Test 4: Fetch Specialization Details
  console.log('Test 4: Fetch AI/ML Specialization details from Excel...');
  const detailRes = await fetch(`${baseUrl}/careers/specializations/cs-aiml`);
  const detailData = await detailRes.json();
  if (detailRes.status !== 200 || detailData.id !== 'cs-aiml' || !detailData.curriculum || !detailData.timeline || !detailData.salary) {
    throw new Error(`Fetch specialization details failed: ${JSON.stringify(detailData)}`);
  }
  console.log('✓ Fetch Specialization Details Passed!');

  // Test 5: Fetch Dashboard (Unenrolled)
  console.log('Test 5: Fetch Unenrolled Dashboard...');
  const dashRes1 = await fetch(`${baseUrl}/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const dashData1 = await dashRes1.json();
  if (dashRes1.status !== 200 || dashData1.enrolled !== false) {
    throw new Error(`Fetch unenrolled dashboard failed: ${JSON.stringify(dashData1)}`);
  }
  console.log('✓ Fetch Unenrolled Dashboard Passed!');

  // Test 6: Enroll in Path
  console.log('Test 6: Enrolling in CS AI/ML Path...');
  const enrollRes = await fetch(`${baseUrl}/dashboard/enroll`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ specializationId: 'cs-aiml' })
  });
  const enrollData = await enrollRes.json();
  if (enrollRes.status !== 200 || !enrollData.enrollment) {
    throw new Error(`Enrollment failed: ${JSON.stringify(enrollData)}`);
  }
  console.log('✓ Enrollment Passed!');

  // Test 7: Fetch Dashboard (Enrolled)
  console.log('Test 7: Fetch Enrolled Dashboard...');
  const dashRes2 = await fetch(`${baseUrl}/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const dashData2 = await dashRes2.json();
  if (dashRes2.status !== 200 || dashData2.enrolled !== true || !dashData2.enrollment.tasks || !Array.isArray(dashData2.youtubeVideos)) {
    throw new Error(`Fetch enrolled dashboard failed: ${JSON.stringify(dashData2)}`);
  }
  console.log(`✓ Fetch Enrolled Dashboard Passed! Progress: ${dashData2.enrollment.progressPercent}%, Tasks count: ${dashData2.enrollment.tasks.length}, YouTube guides: ${dashData2.youtubeVideos.length}`);

  // Test 8: Complete a checklist task and verify progress increases
  console.log('Test 8: Completing task and syncing...');
  const tasks = dashData2.enrollment.tasks;
  tasks[0].completed = true; // Complete the first task
  
  const tasksRes = await fetch(`${baseUrl}/dashboard/tasks`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tasks })
  });
  const tasksData = await tasksRes.json();
  if (tasksRes.status !== 200 || tasksData.enrollment.progressPercent === 0) {
    throw new Error(`Sync checklist tasks failed: ${JSON.stringify(tasksData)}`);
  }
  console.log(`✓ Checklist Sync Passed! Progress increased to: ${tasksData.enrollment.progressPercent}%`);

  // Test 9: Request Mentor connection
  console.log('Test 9: Requesting Mentor connection...');
  const mentorRes = await fetch(`${baseUrl}/dashboard/mentor-request`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ mentorId: 'm1', mentorName: 'Rahul Sharma' })
  });
  const mentorData = await mentorRes.json();
  if (mentorRes.status !== 200) {
    throw new Error(`Request mentor failed: ${JSON.stringify(mentorData)}`);
  }
  console.log('✓ Request Mentor Connection Passed!');

  // Test 10: Save Settings
  console.log('Test 10: Saving custom study settings...');
  const settingsRes = await fetch(`${baseUrl}/dashboard/settings`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      preferredStudyTime: '06:00',
      goalDate: '2027-06-30',
      emailNotifications: true,
      weeklySummary: false
    })
  });
  const settingsData = await settingsRes.json();
  if (settingsRes.status !== 200 || settingsData.user.settings.preferredStudyTime !== '06:00') {
    throw new Error(`Save settings failed: ${JSON.stringify(settingsData)}`);
  }
  console.log('✓ Save Settings Passed!');

  console.log('\n=========================================');
  console.log(' ALL NEEV INTEGRATION TESTS PASSED!');
  console.log('=========================================\n');
  
  cleanup(0);
}
