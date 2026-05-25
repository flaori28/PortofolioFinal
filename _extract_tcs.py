import sys
from pathlib import Path
pdf = Path(r"assets/docs/TCS_Final (3).pdf")
try:
    from pypdf import PdfReader
except Exception:
    print("NO_PYPDF")
    sys.exit(2)
reader = PdfReader(str(pdf))
texts = []
for i,p in enumerate(reader.pages, start=1):
    try:
        t = p.extract_text() or ""
    except Exception:
        t = ""
    texts.append(f"\n\n===== PAGE {i} =====\n" + t)
out = Path("assets/docs/_tcs_extracted.txt")
out.write_text("".join(texts), encoding="utf-8")
print(f"OK {out} {out.stat().st_size}")
