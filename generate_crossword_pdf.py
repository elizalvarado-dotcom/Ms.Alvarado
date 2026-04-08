#!/usr/bin/env python3
"""
Generate Polynomial Vocabulary Crossword Puzzle PDF using ReportLab.
Mirrors the existing Word document but rendered as a clean, printable PDF.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, Flowable, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
import textwrap

OUTPUT_PATH = "/home/user/Ms.Alvarado/public/Polynomial_Crossword.pdf"

# ── Page geometry ─────────────────────────────────────────────────────────────
PAGE_W, PAGE_H = letter
MARGIN = 0.75 * inch
CONTENT_W = PAGE_W - 2 * MARGIN

# ── Colors ────────────────────────────────────────────────────────────────────
C_GREEN  = colors.Color(0/255, 100/255,   0/255)   # dark green
C_ORANGE = colors.Color(180/255, 70/255,  0/255)   # dark orange
C_RED    = colors.Color(160/255,  0/255,  0/255)   # dark red
C_BLUE   = colors.Color(0/255,    0/255, 140/255)  # dark blue
C_LGRAY  = colors.Color(230/255, 230/255, 230/255) # light gray (table header bg)
C_LBLUE  = colors.Color(240/255, 245/255, 255/255) # very light blue (alt rows)
C_WHITE  = colors.white
C_BLACK  = colors.black
C_DKGRAY = colors.Color(0.33, 0.33, 0.33)

# ── Vocabulary data ───────────────────────────────────────────────────────────
VOCAB = [
    (1,  "POLYNOMIAL",  "polinomio",           10),
    (2,  "TERM",        "término",              4),
    (3,  "LIKETERMS",   "términos semejantes",  9),
    (4,  "COEFFICIENT", "coeficiente",          11),
    (5,  "CONSTANT",    "constante",            8),
    (6,  "SIMPLIFY",    "simplificar",          8),
    (7,  "ADD",         "sumar",                3),
    (8,  "VARIABLE",    "variable",             8),
    (9,  "SUBTRACT",    "restar",               8),
    (10, "EXPRESSION",  "expresión",            10),
    (11, "DEGREE",      "grado",                6),
]

DISPLAY = {
    "POLYNOMIAL":  "POLYNOMIAL",
    "TERM":        "TERM",
    "LIKETERMS":   "LIKE TERMS",
    "COEFFICIENT": "COEFFICIENT",
    "CONSTANT":    "CONSTANT",
    "SIMPLIFY":    "SIMPLIFY",
    "ADD":         "ADD",
    "VARIABLE":    "VARIABLE",
    "SUBTRACT":    "SUBTRACT",
    "EXPRESSION":  "EXPRESSION",
    "DEGREE":      "DEGREE",
}

DISPLAY_TITLE = {
    "POLYNOMIAL":  "Polynomial",
    "TERM":        "Term",
    "LIKETERMS":   "Like Terms",
    "COEFFICIENT": "Coefficient",
    "CONSTANT":    "Constant",
    "SIMPLIFY":    "Simplify",
    "ADD":         "Add",
    "VARIABLE":    "Variable",
    "SUBTRACT":    "Subtract",
    "EXPRESSION":  "Expression",
    "DEGREE":      "Degree",
}

ACROSS_CLUES = [
    (1,  "A math expression with more than one term",          "polinomio"),
    (2,  "A single part of an expression",                     "término"),
    (3,  "Terms that have the same variable and exponent",     "términos semejantes"),
    (4,  "A number in front of a variable",                    "coeficiente"),
    (5,  "A number with no variable",                          "constante"),
    (6,  "To make an expression simpler",                      "simplificar"),
    (7,  "To combine by putting together",                     "sumar"),
    (8,  "Letters used to represent numbers",                  "variable"),
    (9,  "To take away",                                       "restar"),
    (10, "A math phrase with numbers and variables",           "expresión"),
    (11, "The highest exponent in a polynomial",               "grado"),
]

DOWN_CLUES = [
    ("D1", "Something you combine when simplifying",      "TERM"),
    ("D2", "What you do to like terms",                   "ADD"),
    ("D3", "Opposite of add",                             "SUBTRACT"),
    ("D4", 'The prefix "poly" means many — this has many', "POLYNOMIAL"),
    ("D5", "What the letter x is called",                  "VARIABLE"),
]


# ── Custom Flowable: answer box row ──────────────────────────────────────────
class AnswerBoxRow(Flowable):
    """
    Draws a numbered row with N small square boxes (one per letter).
    Boxes are 0.22 in × 0.22 in with a visible black border.
    A small gap is inserted after every 3rd box for readability.
    """
    BOX_SIZE = 0.22 * inch
    GAP = 0.04 * inch        # gap between boxes
    GROUP_GAP = 0.09 * inch  # extra gap between groups of 3
    NUM_WIDTH = 0.30 * inch  # space reserved for the number label

    def __init__(self, number, count):
        super().__init__()
        self.number = number
        self.count = count
        # calculate total width
        n_groups = (count - 1) // 3  # number of group gaps inserted
        total_box_w = count * self.BOX_SIZE
        total_gaps = (count - 1) * self.GAP
        total_group_gaps = n_groups * self.GROUP_GAP
        self.row_width = self.NUM_WIDTH + total_box_w + total_gaps + total_group_gaps
        self.height = self.BOX_SIZE + 4  # a tiny bit of breathing room

    def wrap(self, availW, availH):
        return (min(self.row_width, availW), self.height)

    def draw(self):
        c = self.canv
        # Draw the number label
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(C_BLACK)
        c.drawString(0, 2, f"{self.number}.")

        # Draw boxes
        c.setStrokeColor(C_BLACK)
        c.setFillColor(C_WHITE)
        c.setLineWidth(0.7)
        x = self.NUM_WIDTH
        for i in range(self.count):
            if i > 0 and i % 3 == 0:
                x += self.GROUP_GAP
            c.rect(x, 0, self.BOX_SIZE, self.BOX_SIZE, fill=1, stroke=1)
            x += self.BOX_SIZE + self.GAP


# ── Style helpers ─────────────────────────────────────────────────────────────

def make_styles():
    base = getSampleStyleSheet()

    styles = {}

    styles['title'] = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=28,
        alignment=TA_CENTER,
        textColor=C_BLACK,
        spaceAfter=6,
    )
    styles['subtitle'] = ParagraphStyle(
        'DocSubtitle',
        fontName='Helvetica-Oblique',
        fontSize=14,
        leading=18,
        alignment=TA_CENTER,
        textColor=C_DKGRAY,
        spaceAfter=4,
    )
    styles['teacher'] = ParagraphStyle(
        'Teacher',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        alignment=TA_CENTER,
        spaceAfter=6,
    )
    styles['body'] = ParagraphStyle(
        'Body',
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        alignment=TA_LEFT,
        spaceAfter=4,
    )
    styles['body_italic'] = ParagraphStyle(
        'BodyItalic',
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=14,
        alignment=TA_LEFT,
        spaceAfter=4,
    )
    styles['clue'] = ParagraphStyle(
        'Clue',
        fontName='Helvetica',
        fontSize=10,
        leading=13,
        alignment=TA_LEFT,
        leftIndent=10,
        spaceAfter=1,
    )
    styles['section_header_green'] = ParagraphStyle(
        'SecHeaderGreen',
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=C_GREEN,
        spaceAfter=4,
    )
    styles['section_header_orange'] = ParagraphStyle(
        'SecHeaderOrange',
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=C_ORANGE,
        spaceAfter=4,
    )
    styles['section_header_red'] = ParagraphStyle(
        'SecHeaderRed',
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=C_RED,
        spaceAfter=4,
    )
    styles['section_header_blue'] = ParagraphStyle(
        'SecHeaderBlue',
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=C_BLUE,
        spaceAfter=4,
    )
    styles['subsection'] = ParagraphStyle(
        'SubSection',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        spaceAfter=3,
        spaceBefore=6,
    )
    styles['name_line'] = ParagraphStyle(
        'NameLine',
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        alignment=TA_LEFT,
        spaceAfter=6,
    )
    styles['small_note'] = ParagraphStyle(
        'SmallNote',
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=12,
        textColor=C_DKGRAY,
        spaceAfter=4,
    )
    return styles


def hr():
    return HRFlowable(width="100%", thickness=0.5, color=colors.Color(0.6, 0.6, 0.6),
                      spaceAfter=4, spaceBefore=4)


def sp(h=6):
    return Spacer(1, h)


# ── Table builders ────────────────────────────────────────────────────────────

def difficulty_table(styles):
    """Small table on cover page showing 3 levels with star icons."""
    col_widths = [CONTENT_W * 0.38, CONTENT_W * 0.62]
    data = [
        [
            Paragraph('<b>Level</b>', ParagraphStyle('th', fontName='Helvetica-Bold',
                      fontSize=10, leading=13)),
            Paragraph('<b>Description</b>', ParagraphStyle('th', fontName='Helvetica-Bold',
                      fontSize=10, leading=13)),
        ],
        [
            Paragraph('⭐  Level 1 – Easy', ParagraphStyle('lvl', fontName='Helvetica',
                      fontSize=10, leading=13, textColor=C_GREEN)),
            Paragraph('Word bank with English &amp; Spanish translations provided',
                      ParagraphStyle('desc', fontName='Helvetica', fontSize=10, leading=13)),
        ],
        [
            Paragraph('⭐⭐  Level 2 – Medium', ParagraphStyle('lvl', fontName='Helvetica',
                      fontSize=10, leading=13, textColor=C_ORANGE)),
            Paragraph('Word bank in English only',
                      ParagraphStyle('desc', fontName='Helvetica', fontSize=10, leading=13)),
        ],
        [
            Paragraph('⭐⭐⭐  Level 3 – Challenge', ParagraphStyle('lvl', fontName='Helvetica',
                      fontSize=10, leading=13, textColor=C_RED)),
            Paragraph('No word bank; includes bonus DOWN clues',
                      ParagraphStyle('desc', fontName='Helvetica', fontSize=10, leading=13)),
        ],
    ]
    t = Table(data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), C_LGRAY),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.Color(0.6, 0.6, 0.6)),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [C_WHITE, C_LBLUE]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    return t


def word_bank_bilingual():
    """Level 1: 3-column word bank: # | English | Español."""
    col_widths = [CONTENT_W * 0.08, CONTENT_W * 0.38, CONTENT_W * 0.54]

    header_style = ParagraphStyle('wbh', fontName='Helvetica-Bold', fontSize=10, leading=13)
    cell_style   = ParagraphStyle('wbc', fontName='Helvetica', fontSize=10, leading=13)

    data = [
        [Paragraph('#', header_style),
         Paragraph('English', header_style),
         Paragraph('Español', header_style)],
    ]
    for num, word, spanish, _ in VOCAB:
        display_en = DISPLAY_TITLE[word]
        data.append([
            Paragraph(str(num), cell_style),
            Paragraph(display_en, cell_style),
            Paragraph(spanish, cell_style),
        ])

    t = Table(data, colWidths=col_widths)
    row_colors = []
    for i in range(1, len(data)):
        bg = C_WHITE if i % 2 == 1 else C_LBLUE
        row_colors.append(('BACKGROUND', (0, i), (-1, i), bg))

    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), C_LGRAY),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.Color(0.6, 0.6, 0.6)),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ] + row_colors))
    return t


def word_bank_english_only():
    """Level 2: 4-words per row, English only."""
    words = [DISPLAY_TITLE[w] for _, w, _, _ in VOCAB]
    cols = 4

    header_style = ParagraphStyle('wbh2', fontName='Helvetica-Bold', fontSize=10, leading=13,
                                  alignment=TA_CENTER)
    cell_style   = ParagraphStyle('wbc2', fontName='Helvetica', fontSize=10, leading=13)

    col_w = CONTENT_W / cols
    col_widths = [col_w] * cols

    # Header spans all columns (done via merging in TableStyle SPAN)
    data = [[Paragraph('Word Bank (English)', header_style), '', '', '']]

    row = []
    for i, w in enumerate(words):
        row.append(Paragraph(w, cell_style))
        if len(row) == cols:
            data.append(row)
            row = []
    if row:
        while len(row) < cols:
            row.append('')
        data.append(row)

    n_data = len(data)
    row_colors = []
    for i in range(1, n_data):
        bg = C_WHITE if i % 2 == 1 else C_LBLUE
        row_colors.append(('BACKGROUND', (0, i), (-1, i), bg))

    t = Table(data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('SPAN', (0, 0), (-1, 0)),
        ('BACKGROUND', (0, 0), (-1, 0), C_LGRAY),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.Color(0.6, 0.6, 0.6)),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ] + row_colors))
    return t


def fill_in_blank_grid():
    """Return a list of AnswerBoxRow flowables for all 11 vocab items."""
    rows = []
    for num, word, spanish, count in VOCAB:
        rows.append(AnswerBoxRow(num, count))
        rows.append(sp(3))
    return rows


def across_clues_section(styles):
    """Return list of flowables for the ACROSS clues."""
    items = []
    items.append(Paragraph('ACROSS Clues  |  Pistas HORIZONTALES', styles['subsection']))

    clue_style = styles['clue']
    for num, clue_en, clue_es in ACROSS_CLUES:
        txt = (f'<b>{num}.</b>  {clue_en} '
               f'<i><font color="#555555">({clue_es})</font></i>')
        items.append(Paragraph(txt, clue_style))
    return items


def down_clues_section(styles):
    """Return list of flowables for the DOWN clues (Challenge level)."""
    items = []
    items.append(sp(8))
    items.append(Paragraph('Bonus Down Clues  |  Pistas Verticales Adicionales',
                            styles['subsection']))
    items.append(Paragraph(
        '<i>These bonus clues share answers with the ACROSS list. '
        'Use them as extra hints! | '
        '¡Estas pistas comparten respuestas con la lista Horizontal!</i>',
        styles['small_note']
    ))
    clue_style = styles['clue']
    for label, clue, answer in DOWN_CLUES:
        items.append(Paragraph(f'<b>{label}.</b>  {clue}', clue_style))
    return items


def answer_key_table(styles):
    """Return a table for the teacher answer key."""
    header_para = ParagraphStyle('akh', fontName='Helvetica-Bold', fontSize=10, leading=13,
                                 textColor=C_WHITE)
    cell_style  = ParagraphStyle('akc', fontName='Helvetica', fontSize=10, leading=13)
    bold_cell   = ParagraphStyle('akb', fontName='Helvetica-Bold', fontSize=10, leading=13,
                                 textColor=C_GREEN)

    col_widths = [
        CONTENT_W * 0.08,   # #
        CONTENT_W * 0.28,   # Answer
        CONTENT_W * 0.38,   # Spanish
        CONTENT_W * 0.15,   # Letters
    ]

    data = [
        [Paragraph('#', header_para),
         Paragraph('Answer', header_para),
         Paragraph('Spanish', header_para),
         Paragraph('Letters', header_para)],
    ]
    for num, word, spanish, count in VOCAB:
        data.append([
            Paragraph(str(num), cell_style),
            Paragraph(DISPLAY[word], bold_cell),
            Paragraph(spanish, cell_style),
            Paragraph(str(count), cell_style),
        ])

    row_colors = []
    for i in range(1, len(data)):
        bg = C_WHITE if i % 2 == 1 else C_LBLUE
        row_colors.append(('BACKGROUND', (0, i), (-1, i), bg))

    t = Table(data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.Color(0, 0, 0.55)),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.Color(0.6, 0.6, 0.6)),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ] + row_colors))
    return t


# ── Page builders ─────────────────────────────────────────────────────────────

def build_cover(story, styles):
    story.append(sp(18))
    story.append(Paragraph('Polynomial Vocabulary Crossword Puzzle', styles['title']))
    story.append(Paragraph('<i>Rompecabezas de vocabulario de polinomios</i>',
                           styles['subtitle']))
    story.append(sp(8))
    story.append(Paragraph('Teacher: Miss Alvarado', styles['teacher']))
    story.append(sp(14))

    # Name / Period / Date line
    story.append(Paragraph(
        'Name: ________________________________  Period: _____  Date: ________________',
        styles['name_line']
    ))
    story.append(hr())
    story.append(sp(8))

    # Bilingual instructions
    instr_style = ParagraphStyle('instr', fontName='Helvetica', fontSize=10, leading=14,
                                 spaceAfter=4)
    story.append(Paragraph(
        '<b>Instructions (English):</b>  '
        'Use the clues to fill in the blanks. Each blank represents one letter.',
        instr_style
    ))
    story.append(Paragraph(
        '<b>Instrucciones (Español):</b>  '
        'Usa las pistas para completar los espacios. Cada espacio representa una letra.',
        instr_style
    ))
    story.append(sp(14))

    # Difficulty table
    story.append(Paragraph('Difficulty Levels  |  Niveles de Dificultad',
                            styles['subsection']))
    story.append(sp(4))
    story.append(difficulty_table(styles))


def build_level1(story, styles):
    story.append(hr())
    story.append(Paragraph('⭐  Level 1 – Easy  |  Nivel 1 – Fácil',
                            styles['section_header_green']))
    story.append(Paragraph(
        '<i>Use the word bank below to fill in the blanks. Each blank = one letter. '
        '|  Usa el banco de palabras para llenar los espacios. Cada espacio = una letra.</i>',
        styles['body_italic']
    ))
    story.append(sp(8))

    story.append(Paragraph('Word Bank  |  Banco de Palabras', styles['subsection']))
    story.append(word_bank_bilingual())
    story.append(sp(10))

    story.append(Paragraph('Fill in the Blanks  |  Llena los espacios', styles['subsection']))
    story.append(sp(4))
    story.extend(fill_in_blank_grid())
    story.append(sp(10))

    story.extend(across_clues_section(styles))


def build_level2(story, styles):
    story.append(hr())
    story.append(Paragraph('⭐⭐  Level 2 – Medium  |  Nivel 2 – Intermedio',
                            styles['section_header_orange']))
    story.append(Paragraph(
        '<i>Use the English word bank to fill in the blanks. '
        '|  Usa el banco de palabras en inglés para llenar los espacios.</i>',
        styles['body_italic']
    ))
    story.append(sp(8))

    story.append(Paragraph('Word Bank  |  Banco de Palabras', styles['subsection']))
    story.append(word_bank_english_only())
    story.append(sp(10))

    story.append(Paragraph('Fill in the Blanks  |  Llena los espacios', styles['subsection']))
    story.append(sp(4))
    story.extend(fill_in_blank_grid())
    story.append(sp(10))

    story.extend(across_clues_section(styles))


def build_level3(story, styles):
    story.append(hr())
    story.append(Paragraph('⭐⭐⭐  Level 3 – Challenge  |  Nivel 3 – Desafío',
                            styles['section_header_red']))
    story.append(Paragraph(
        '<i>No word bank! Use the clues to figure out each answer. '
        'Bonus DOWN clues are provided as extra hints. '
        '|  ¡Sin banco de palabras! Usa las pistas para deducir cada respuesta.</i>',
        styles['body_italic']
    ))
    story.append(sp(10))

    story.append(Paragraph('Fill in the Blanks  |  Llena los espacios', styles['subsection']))
    story.append(sp(4))
    story.extend(fill_in_blank_grid())
    story.append(sp(10))

    story.extend(across_clues_section(styles))
    story.extend(down_clues_section(styles))


def build_answer_key(story, styles):
    story.append(hr())
    story.append(Paragraph('🔑  Teacher Answer Key  |  Clave de Respuestas',
                            styles['section_header_blue']))
    story.append(sp(6))
    story.append(answer_key_table(styles))
    story.append(sp(12))

    # Bottom note
    story.append(Paragraph(
        '<b>Note:</b> Accept LIKE TERMS (with space) or LIKETERMS for #3.',
        ParagraphStyle('note', fontName='Helvetica-Oblique', fontSize=9,
                       leading=12, textColor=C_DKGRAY)
    ))


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=MARGIN,
        title="Polynomial Vocabulary Crossword Puzzle",
        author="Miss Alvarado",
    )

    styles = make_styles()
    story = []

    # Page 1 — Cover
    build_cover(story, styles)

    # Page 2 — Level 1
    story.append(PageBreak())
    build_level1(story, styles)

    # Page 3 — Level 2
    story.append(PageBreak())
    build_level2(story, styles)

    # Page 4 — Level 3
    story.append(PageBreak())
    build_level3(story, styles)

    # Page 5 — Answer Key
    story.append(PageBreak())
    build_answer_key(story, styles)

    doc.build(story)
    print(f"Created: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
