import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DoctorMember, Course } from '../types';

export function exportDoctorsPDF(doctors: DoctorMember[], lang: 'ar' | 'en' = 'en') {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const timestamp = new Date().toLocaleString();
  const generatedId = `REP-DOC-${Date.now().toString(36).toUpperCase()}`;

  // Header Background bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 55, 'F');

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('SUDANESE DOCTORS IN IRELAND (SDI) • SECRETARIAT REGISTRY', 40, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('OFFICIAL REGULATORY & CLINICAL ROSTER AUDIT REPORT', 40, 46);

  // Reference Code & Date right aligned
  doc.setFontSize(8);
  doc.text(`REF: ${generatedId}  |  GENERATED: ${timestamp}`, pageWidth - 40, 38, { align: 'right' });

  // Subheader / Summary Metrics Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(40, 70, pageWidth - 80, 45, 6, 6, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('REGISTRY EXECUTIVE METRICS', 55, 87);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  const activeCount = doctors.filter(d => d.standing === 'Active' || d.standing === 'Fellow').length;
  const specialistCount = doctors.filter(d => d.division === 'Specialist Division').length;
  const totalCpd = doctors.reduce((acc, curr) => acc + (curr.cpdUnits || 0), 0);

  doc.text(
    `Total Clinicians: ${doctors.length}   |   Active/Fellows: ${activeCount}   |   Specialist Division: ${specialistCount}   |   Cumulative CPD: ${totalCpd} Units`,
    55,
    102
  );

  // Table Data Preparation
  const tableData = doctors.map((d, index) => [
    index + 1,
    d.id,
    d.name,
    d.imcNumber ? `IMC #${d.imcNumber}` : '—',
    d.title || d.roleCategory || 'Clinician',
    d.specialty,
    d.hospital,
    d.division || 'General Division',
    `${d.cpdUnits || 0} CPD`,
    d.standing || 'Active',
  ]);

  autoTable(doc, {
    startY: 125,
    head: [[
      '#',
      'ID',
      'Clinician Name',
      'IMC Reg.',
      'Clinical Role & Title',
      'Specialty',
      'Hospital / HSE Base',
      'Division',
      'CPD',
      'Standing'
    ]],
    body: tableData,
    margin: { left: 40, right: 40, bottom: 40 },
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59], // slate-800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
      cellPadding: 6,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    columnStyles: {
      0: { cellWidth: 24, halign: 'center' },
      1: { cellWidth: 42, fontStyle: 'bold' },
      2: { cellWidth: 120, fontStyle: 'bold' },
      3: { cellWidth: 65 },
      4: { cellWidth: 110 },
      5: { cellWidth: 100 },
      6: { cellWidth: 140 },
      7: { cellWidth: 75 },
      8: { cellWidth: 45, halign: 'center' },
      9: { cellWidth: 55, halign: 'center' },
    },
    didDrawPage: (data) => {
      // Footer
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Sudanese Doctors in Ireland • Confidential Official Secretariat Audit • For Regulatory & Administrative Use Only',
        40,
        pageHeight - 20
      );
      doc.text(
        `Page ${data.pageNumber}`,
        pageWidth - 40,
        pageHeight - 20,
        { align: 'right' }
      );
    },
  });

  const filename = `SDI_Doctor_Registry_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

export function exportCoursesPDF(courses: Course[], lang: 'ar' | 'en' = 'en') {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const timestamp = new Date().toLocaleString();
  const generatedId = `REP-CRS-${Date.now().toString(36).toUpperCase()}`;

  // Header Background bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 55, 'F');

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('SUDANESE DOCTORS IN IRELAND • CPD COURSES & ACADEMIC VAULT', 40, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('ACCREDITED CONTINUOUS PROFESSIONAL DEVELOPMENT & CLINICAL MODULES REPORT', 40, 46);

  // Reference Code & Date
  doc.setFontSize(8);
  doc.text(`REF: ${generatedId}  |  GENERATED: ${timestamp}`, pageWidth - 40, 38, { align: 'right' });

  // Summary Metrics Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, 70, pageWidth - 80, 45, 6, 6, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('ACADEMIC CURRICULUM SUMMARY', 55, 87);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  const totalCPD = courses.reduce((sum, c) => sum + (c.cpdUnits || 0), 0);
  const membersOnly = courses.filter(c => c.accessType === 'members').length;
  const openAccess = courses.filter(c => c.accessType !== 'members').length;

  doc.text(
    `Total Accredited Courses: ${courses.length}   |   Cumulative CPD Value: ${totalCPD} Units   |   Members Exclusive: ${membersOnly}   |   Open Access: ${openAccess}`,
    55,
    102
  );

  // Table Data Preparation
  const tableData = courses.map((c, index) => [
    index + 1,
    c.id,
    c.title,
    c.leadFaculty,
    `${c.cpdUnits} CPD`,
    c.format,
    c.accessType === 'members' ? 'Members Only' : 'Open Access',
    c.cohort || 'All Tiers',
    c.syllabus ? c.syllabus.slice(0, 3).join(', ') + (c.syllabus.length > 3 ? '...' : '') : '—',
  ]);

  autoTable(doc, {
    startY: 125,
    head: [[
      '#',
      'Course ID',
      'Course Title & Masterclass',
      'Lead Faculty / Speaker',
      'CPD Units',
      'Format / Delivery',
      'Access Tier',
      'Cohort',
      'Syllabus & Core Stations'
    ]],
    body: tableData,
    margin: { left: 40, right: 40, bottom: 40 },
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59], // slate-800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
      cellPadding: 6,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 24, halign: 'center' },
      1: { cellWidth: 60, fontStyle: 'bold' },
      2: { cellWidth: 160, fontStyle: 'bold' },
      3: { cellWidth: 120 },
      4: { cellWidth: 55, halign: 'center' },
      5: { cellWidth: 90 },
      6: { cellWidth: 70, halign: 'center' },
      7: { cellWidth: 70 },
      8: { cellWidth: 135 },
    },
    didDrawPage: (data) => {
      // Footer
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Sudanese Doctors in Ireland • Official Academic Directorate & CPD Accreditation Ledger',
        40,
        pageHeight - 20
      );
      doc.text(
        `Page ${data.pageNumber}`,
        pageWidth - 40,
        pageHeight - 20,
        { align: 'right' }
      );
    },
  });

  const filename = `SDI_Courses_Catalog_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

export function exportConsolidatedReportPDF(doctors: DoctorMember[], courses: Course[], lang: 'ar' | 'en' = 'en') {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const timestamp = new Date().toLocaleString();
  const generatedId = `REP-ALL-${Date.now().toString(36).toUpperCase()}`;

  // Section 1: Header Cover Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 55, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('SUDANESE DOCTORS IN IRELAND • COMPREHENSIVE SECRETARIAT REPORT', 40, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('OFFICIAL COMBINED AUDIT: ACTIVE DOCTOR REGISTRY & CPD ACADEMIC CATALOG', 40, 46);

  doc.setFontSize(8);
  doc.text(`REF: ${generatedId}  |  DATE: ${timestamp}`, pageWidth - 40, 38, { align: 'right' });

  // Summary Metrics Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, 70, pageWidth - 80, 45, 6, 6, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('SECRETARIAT CONSOLIDATED AUDIT SUMMARY', 55, 87);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  const activeCount = doctors.filter(d => d.standing === 'Active' || d.standing === 'Fellow').length;
  const totalCPD = courses.reduce((sum, c) => sum + (c.cpdUnits || 0), 0);

  doc.text(
    `Total Registered Doctors: ${doctors.length} (${activeCount} Active/Fellows)   |   Accredited Courses: ${courses.length} (${totalCPD} Cumulative CPD Units)   |   Status: Fully Certified`,
    55,
    102
  );

  // Table 1: Doctors
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Clinician Membership & Medical Council Registration', 40, 134);

  const doctorRows = doctors.map((d, index) => [
    index + 1,
    d.id,
    d.name,
    d.imcNumber ? `IMC #${d.imcNumber}` : '—',
    d.title || d.roleCategory || 'Clinician',
    d.specialty,
    d.hospital,
    d.division || 'General Division',
    `${d.cpdUnits || 0} CPD`,
    d.standing || 'Active',
  ]);

  autoTable(doc, {
    startY: 142,
    head: [[
      '#',
      'ID',
      'Clinician Name',
      'IMC Reg.',
      'Role & Title',
      'Specialty',
      'Hospital',
      'Division',
      'CPD',
      'Standing'
    ]],
    body: doctorRows,
    margin: { left: 40, right: 40, bottom: 40 },
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 5,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 40, fontStyle: 'bold' },
      2: { cellWidth: 120, fontStyle: 'bold' },
      3: { cellWidth: 65 },
      4: { cellWidth: 105 },
      5: { cellWidth: 100 },
      6: { cellWidth: 140 },
      7: { cellWidth: 75 },
      8: { cellWidth: 45, halign: 'center' },
      9: { cellWidth: 55, halign: 'center' },
    },
  });

  // Table 2: Courses (start on new page)
  doc.addPage();

  // Header Bar on page 2
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 50, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('SUDANESE DOCTORS IN IRELAND • CPD COURSES & ACADEMIC CATALOG', 40, 31);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`REF: ${generatedId}  |  CONSOLIDATED AUDIT PART II`, pageWidth - 40, 31, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Academic Masterclasses & Clinical Training Vault', 40, 75);

  const courseRows = courses.map((c, index) => [
    index + 1,
    c.id,
    c.title,
    c.leadFaculty,
    `${c.cpdUnits} CPD`,
    c.format,
    c.accessType === 'members' ? 'Members Only' : 'Open Access',
    c.cohort || 'All Tiers',
    c.syllabus ? c.syllabus.slice(0, 3).join(', ') : '—',
  ]);

  autoTable(doc, {
    startY: 85,
    head: [[
      '#',
      'Course ID',
      'Course Title & Description',
      'Lead Faculty / Speaker',
      'CPD Units',
      'Format',
      'Access Tier',
      'Cohort',
      'Core Syllabus Stations'
    ]],
    body: courseRows,
    margin: { left: 40, right: 40, bottom: 40 },
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 5,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 60, fontStyle: 'bold' },
      2: { cellWidth: 165, fontStyle: 'bold' },
      3: { cellWidth: 120 },
      4: { cellWidth: 55, halign: 'center' },
      5: { cellWidth: 90 },
      6: { cellWidth: 70, halign: 'center' },
      7: { cellWidth: 65 },
      8: { cellWidth: 135 },
    },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Sudanese Doctors in Ireland • Official Consolidated Secretariat Report',
        40,
        pageHeight - 20
      );
      doc.text(
        `Page ${data.pageNumber}`,
        pageWidth - 40,
        pageHeight - 20,
        { align: 'right' }
      );
    },
  });

  const filename = `SDI_Secretariat_Consolidated_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
