import datetime
import io
from fpdf import FPDF


class _Report(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(83, 74, 183)
        self.cell(0, 10, 'CodeSense — Analiz Raporu', align='C')
        self.ln(4)
        self.set_draw_color(83, 74, 183)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(6)

    def footer(self):
        self.set_y(-14)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 8, f'CodeSense  |  {datetime.date.today()}  |  Sayfa {self.page_no()}', align='C')


def generate_pdf(analysis: dict) -> bytes:
    pdf = _Report()
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.add_page()
    pdf.set_margins(15, 15, 15)

    # Timestamp (right-aligned)
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(130, 130, 130)
    pdf.cell(0, 6, f'Tarih: {datetime.datetime.now().strftime("%d.%m.%Y %H:%M")}', align='R')
    pdf.ln(10)

    # ── Summary ──────────────────────────────────────
    def section(title: str):
        pdf.set_font('Helvetica', 'B', 12)
        pdf.set_text_color(40, 40, 40)
        pdf.cell(0, 8, title)
        pdf.ln(9)

    def row(label: str, value: str, highlight: bool = False):
        pdf.set_font('Helvetica', '', 10)
        pdf.set_fill_color(245, 244, 240)
        pdf.set_text_color(80, 80, 80)
        pdf.cell(65, 7, label, fill=True)
        pdf.set_text_color(40 if not highlight else 83, 40 if not highlight else 74, 40 if not highlight else 183)
        pdf.cell(0, 7, str(value))
        pdf.ln(8)

    section('Analiz Özeti')
    lang    = analysis.get('language', {})
    quality = analysis.get('quality', {})
    feats   = analysis.get('features', {})

    row('Dil',          f"{lang.get('language','?')}  (güven: {lang.get('confidence',0):.0%})")
    row('Kalite Skoru', f"{quality.get('quality_score','—')} / 100", highlight=True)
    row('Bug Riski',    quality.get('bug_risk', '—'))
    row('Risk Skoru',   quality.get('risk_score', '—'))
    row('Cyclomatic CC',feats.get('cyclomatic_complexity', '—'))
    row('Satır Sayısı', feats.get('line_count', '—'))
    row('Token Sayısı', feats.get('token_count', '—'))

    # ── SHAP ────────────────────────────────────────
    shap = analysis.get('shap', {}).get('shap_values', {})
    if shap:
        pdf.ln(4)
        section('SHAP Özellik Önemleri')
        for feat, val in list(shap.items())[:6]:
            bar_w = max(int(val * 110), 2)
            pdf.set_font('Helvetica', '', 10)
            pdf.set_text_color(80, 80, 80)
            pdf.cell(80, 6, feat)
            pdf.set_fill_color(127, 119, 221)
            pdf.rect(pdf.get_x(), pdf.get_y() + 1, bar_w, 4, 'F')
            pdf.set_text_color(40, 40, 40)
            pdf.cell(0, 6, f'   {val:.2f}')
            pdf.ln(8)

    return bytes(pdf.output())
