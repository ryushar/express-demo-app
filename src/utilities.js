const HRA = 15000;
const DA_PERCENT = 0.12;
const EPF_PERCENT = 0.15;
const PROFESSIONAL_TAX = 2500;

function CalculateIncomeTax(amount) {
  if (amount > 1000000) return 112500 + amount * 0.3;
  if (amount > 500000) return 12500 + amount * 0.2;
  if (amount > 250000) return salary * 0.05;
  return 0;
}

function CalculateHRATaxExemption(hra, basicSalary, rentPayed, address) {
  const isMetroCity = ["delhi", "mumbai", "chennai", "kolkata"].some((s) => {
    return address.toLowerCase().includes(s);
  });
  const a = hra * 12;
  const b = basicSalary * (isMetroCity ? 0.5 : 0.4);
  const c = rentPayed - basicSalary * 0.1;
  return Math.max(0, Math.min(a, b, c));
}

function CalculateSalaryInfo(basicSalary, rentPayed, address) {
  const hraTaxExemption = CalculateHRATaxExemption(HRA, basicSalary, rentPayed, address);
  const da = basicSalary * DA_PERCENT;
  const epf = basicSalary * EPF_PERCENT;
  const ctc = basicSalary + HRA + da;
  const grossSalary = ctc - epf;
  const incomeTax = CalculateIncomeTax(basicSalary - hraTaxExemption);
  const netSalary = grossSalary - incomeTax - PROFESSIONAL_TAX;
  return { ctc, da, epf, grossSalary, netSalary };
}

function GetFieldsByType(type) {
  const fields = ["name", "type"];
  if (["accountant", "hr"].includes(type)) {
    fields.push("ctc", "da", "epf", "grossSalary", "netSalary");
  }
  if (type === "hr") fields.push("address");
  return fields;
}

module.exports = { CalculateSalaryInfo, GetFieldsByType };
