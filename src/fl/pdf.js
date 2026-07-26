import { T } from './i18n.js'

const PAGE_MARGIN = 14
const PAGE_WIDTH = 210 // A4 mm

export async function downloadQuizReportPdf({ lang, unitTitle, moduleTitle, studentInfo, earned, max, percentage, results }) {
  const { jsPDF } = await import('jspdf')
  const t = T[lang]
  const doc = new jsPDF()
  const contentWidth = PAGE_WIDTH - PAGE_MARGIN * 2
  let y = 20

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(t.siteName, PAGE_MARGIN, y)
  y += 6
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(t.reportTitle, PAGE_MARGIN, y)
  y += 10

  doc.setDrawColor(200, 190, 160)
  doc.line(PAGE_MARGIN, y, PAGE_WIDTH - PAGE_MARGIN, y)
  y += 8

  doc.setFontSize(11)
  const name = `${studentInfo.firstName || '—'} ${studentInfo.lastName || ''}`.trim()
  const rows = [
    [t.labelStudent, name || '—'],
    [t.periodLabel, studentInfo.period || '—'],
    [t.labelUnit, unitTitle],
    [t.labelModule, moduleTitle],
    [t.labelDate, new Date().toLocaleDateString(lang === 'es' ? 'es' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
  ]
  rows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, PAGE_MARGIN, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value), PAGE_MARGIN + 32, y)
    y += 7
  })

  y += 4
  doc.setFontSize(15)
  doc.setFont('helvetica', 'bold')
  doc.text(`${t.labelScore}: ${percentage}%  (${earned}/${max} ${t.pointsLabel})`, PAGE_MARGIN, y)
  y += 10

  doc.setDrawColor(200, 190, 160)
  doc.line(PAGE_MARGIN, y, PAGE_WIDTH - PAGE_MARGIN, y)
  y += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(t.breakdownLabel, PAGE_MARGIN, y)
  y += 8

  results.forEach((r, i) => {
    if (y > 270) { doc.addPage(); y = 20 }

    doc.setFontSize(10.5)
    doc.setFont('helvetica', 'bold')
    const qLines = doc.splitTextToSize(`${t.question} ${i + 1}: ${r.question}`, contentWidth)
    doc.text(qLines, PAGE_MARGIN, y)
    y += qLines.length * 5 + 1

    doc.setFont('helvetica', 'normal')
    doc.text(`${t.colAnswer}: ${r.correctAnswer}`, PAGE_MARGIN + 4, y)
    y += 5
    doc.text(`${t.colAttempts}: ${t.attemptsLabel(r.attempts)}   ·   ${t.colPoints}: ${r.points}/10`, PAGE_MARGIN + 4, y)
    y += 8
  })

  const fileName = `money-matters-${(moduleTitle || 'quiz').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`
  doc.save(fileName)
}
