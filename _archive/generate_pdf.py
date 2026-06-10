import os
from fpdf import FPDF

class ReplicationGuidePDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font('helvetica', 'I', 8)
            self.set_text_color(150, 150, 150)
            self.cell(0, 10, 'SMARTCASHIER - Panduan Replikasi Proyek dari Nol', 0, 0, 'L')
            self.cell(0, 10, 'Kelompok 7', 0, 1, 'R')
            self.set_draw_color(220, 220, 220)
            self.line(10, 18, 200, 18)
            self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f'Halaman {self.page_no()}/{{nb}}', 0, 0, 'C')

def clean_text(text):
    if not text:
        return ""
    # Replace tabs with spaces
    text = text.replace('\t', '    ')
    # Filter out characters that cannot be represented in Latin-1
    return "".join(c for c in text if ord(c) < 256)

def generate_pdf(md_path, pdf_path):
    pdf = ReplicationGuidePDF()
    pdf.alias_nb_pages()
    
    # Title Page
    pdf.add_page()
    pdf.set_y(40)
    pdf.set_font('helvetica', 'B', 24)
    pdf.set_text_color(30, 41, 59) # Slate 800
    pdf.cell(0, 15, clean_text('SMARTCASHIER'), 0, 1, 'C')
    
    pdf.set_font('helvetica', 'B', 14)
    pdf.set_text_color(71, 85, 105) # Slate 600
    pdf.cell(0, 10, clean_text('PANDUAN REPLIKASI PROYEK DARI NOL'), 0, 1, 'C')
    pdf.ln(10)
    
    # Horizontal line
    pdf.set_draw_color(99, 102, 241) # Indigo
    pdf.set_fill_color(99, 102, 241)
    pdf.rect(60, 80, 90, 1, 'F')
    pdf.ln(20)
    
    # Team Info
    pdf.set_y(100)
    pdf.set_font('helvetica', 'B', 11)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 8, clean_text('Mata Kuliah: Pemrograman Berorientasi Objek'), 0, 1, 'C')
    pdf.cell(0, 8, clean_text('Kelompok: 7'), 0, 1, 'C')
    pdf.ln(10)
    
    pdf.set_font('helvetica', '', 10)
    pdf.cell(0, 6, clean_text('Anggota Kelompok:'), 0, 1, 'C')
    members = [
        "1. Farel Gusviransyah",
        "2. Lutfi Nasrullah Aziz",
        "3. Muhammad Alfin Ramadhan",
        "4. Muhammad Fadli Al Hafizh Wibiksana",
        "5. Ringo Noer Junaedy"
    ]
    for member in members:
        pdf.cell(0, 6, clean_text(member), 0, 1, 'C')
        
    pdf.set_y(-40)
    pdf.set_font('helvetica', 'I', 9)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 10, clean_text('Di-generate secara otomatis untuk Kelompok 7'), 0, 1, 'C')

    # Main Content
    pdf.add_page()
    pdf.set_y(25)
    
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_code_block = False
    
    for line in lines:
        line = line.rstrip('\n')
        line_clean = clean_text(line)

        # Check for code blocks
        if line.startswith('```'):
            in_code_block = not in_code_block
            pdf.ln(2)
            continue
            
        if in_code_block:
            pdf.set_font('courier', '', 7.5)
            pdf.set_text_color(50, 50, 50)
            pdf.set_fill_color(245, 245, 245)
            if line_clean.strip() == '':
                pdf.ln(3)
            else:
                # Use explicit width 190 (A4 size with 10mm margins)
                pdf.multi_cell(190, 4, line_clean, border=0, align='L', fill=True)
        else:
            pdf.set_text_color(30, 41, 59)
            if line.startswith('# '):
                pdf.ln(6)
                pdf.set_font('helvetica', 'B', 16)
                pdf.set_text_color(99, 102, 241) # Indigo
                pdf.cell(0, 10, clean_text(line[2:]), 0, 1, 'L')
                pdf.ln(2)
            elif line.startswith('## '):
                pdf.ln(4)
                pdf.set_font('helvetica', 'B', 12)
                pdf.set_text_color(30, 41, 59)
                pdf.cell(0, 8, clean_text(line[3:]), 0, 1, 'L')
                pdf.ln(1)
            elif line.startswith('### '):
                pdf.ln(3)
                pdf.set_font('helvetica', 'B', 10)
                pdf.cell(0, 6, clean_text(line[4:]), 0, 1, 'L')
                pdf.ln(1)
            elif line.startswith('* ') or line.startswith('- '):
                pdf.set_font('helvetica', '', 9.5)
                # Bullet character
                pdf.cell(5, 5, chr(149), 0, 0, 'C')
                # Bullet text
                pdf.multi_cell(185, 5, clean_text(line[2:]))
            elif line.strip() == '':
                pdf.ln(3)
            else:
                # Normal text
                pdf.set_font('helvetica', '', 9.5)
                pdf.multi_cell(190, 5, line_clean)

    pdf.output(pdf_path)
    print(f"PDF successfully generated at: {pdf_path}")

if __name__ == '__main__':
    md_file = r"C:\Users\Ringo Noer J\AppData\Local\Temp\antigravity-artifacts\replication_guide.md"
    if not os.path.exists(md_file):
        md_file = r"C:\Users\Ringo Noer J\.gemini\antigravity\brain\01c05f91-77a9-425f-bf34-fe5cc091b7fe\artifacts\replication_guide.md"
    
    pdf_out = r"c:\PROJECT\pbo-tubes-kelompok7\REPLICATION_GUIDE.pdf"
    generate_pdf(md_file, pdf_out)
