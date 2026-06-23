const path = require('path');
const XLSX = require('xlsx');

const excelPath = path.join(__dirname, '../data/careers.xlsx');

function loadWorkbook() {
  return XLSX.readFile(excelPath);
}

function getCareers() {
  const wb = loadWorkbook();
  const sheet = wb.Sheets['Careers'];
  return XLSX.utils.sheet_to_json(sheet);
}

function getSpecializations(careerId = null) {
  const wb = loadWorkbook();
  const sheet = wb.Sheets['Specializations'];
  const specs = XLSX.utils.sheet_to_json(sheet);
  
  if (careerId) {
    return specs.filter(s => s.careerId === careerId);
  }
  return specs;
}

function getSpecializationDetail(specId) {
  const wb = loadWorkbook();
  
  // Find specialization basic info
  const specs = XLSX.utils.sheet_to_json(wb.Sheets['Specializations']);
  const spec = specs.find(s => s.id === specId);
  if (!spec) return null;

  // Find curriculum
  const curriculumSheet = XLSX.utils.sheet_to_json(wb.Sheets['Curriculum']);
  const curriculum = curriculumSheet
    .filter(c => c.specializationId === specId)
    .sort((a, b) => a.year - b.year);

  // Find timelines
  const timelinesSheet = XLSX.utils.sheet_to_json(wb.Sheets['Timelines']);
  const timeline = timelinesSheet
    .filter(t => t.specializationId === specId)
    .sort((a, b) => a.year - b.year);

  // Find salaries
  const salariesSheet = XLSX.utils.sheet_to_json(wb.Sheets['Salaries']);
  const salary = salariesSheet.find(s => s.specializationId === specId) || {
    year1: 300000,
    year3: 600000,
    year5: 1000000,
    trajectory: 'Entry Level -> Mid Level -> Senior Specialist'
  };

  // Find recruiters
  const recruitersSheet = XLSX.utils.sheet_to_json(wb.Sheets['Recruiters']);
  const recruiterRow = recruitersSheet.find(r => r.specializationId === specId);
  const recruiters = recruiterRow ? recruiterRow.companies.split(',').map(s => s.trim()) : [];

  return {
    ...spec,
    curriculum,
    timeline,
    salary,
    recruiters
  };
}

module.exports = {
  getCareers,
  getSpecializations,
  getSpecializationDetail
};
