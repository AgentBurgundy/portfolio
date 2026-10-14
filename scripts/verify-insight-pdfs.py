"""Check built or downloaded PDFs against every approved public field.

Requires pypdf; --render also requires Poppler's pdftoppm. QA-only dependencies
are not needed by the application or Railway build.
"""
import argparse
import json
import re
import shutil
import subprocess
from pathlib import Path

from pypdf import PdfReader


def normalized(value):
    return re.sub(r"\s+", "", value)


parser = argparse.ArgumentParser()
parser.add_argument("directory", type=Path, help="Directory containing downloaded <slug>.pdf files, or dist/insights")
parser.add_argument("--render", action="store_true")
arguments = parser.parse_args()
data_directory = Path(__file__).resolve().parents[1] / "src" / "content" / "insights"
checked = []
for data_file in sorted(data_directory.glob("*.json")):
    report = json.loads(data_file.read_text(encoding="utf-8"))
    pdf = arguments.directory / f"{report['slug']}.pdf"
    if not pdf.exists():
        pdf = arguments.directory / report["slug"] / "report.pdf"
    reader = PdfReader(pdf)
    assert len(reader.pages) == 1, f"{pdf}: expected one page"
    page = reader.pages[0]
    text = normalized(page.extract_text())
    expected = [report["companyName"], *report.get("limitations", [])]
    if report.get("scope"):
        expected.append(report["scope"])
    for metric in report["metrics"]:
        expected.extend(metric[key] for key in ["label", "value", "context"])
    for observation in report["observations"]:
        expected.extend(observation[key] for key in ["title", "observed", "improvement"])
    for source in report["sources"]:
        expected.append(source["label"])
        if source.get("context"):
            expected.append(source["context"])
    for value in expected:
        assert normalized(value) in text, f"{pdf}: missing or changed text: {value}"
    links = {
        str(annotation.get_object().get("/A", {}).get("/URI", ""))
        for annotation in page.get("/Annots", [])
    }
    for source in report["sources"]:
        assert source["url"] in links, f"{pdf}: missing evidence link {source['id']}"
    assert report["website"] in links, f"{pdf}: missing company website link"
    assert "https://aibaker.io/#contact" in links, f"{pdf}: missing invitation link"
    if arguments.render:
        executable = shutil.which("pdftoppm")
        assert executable, "pdftoppm is required for --render"
        subprocess.run([executable, "-scale-to", "1500", "-png", "-singlefile", str(pdf), str(pdf.with_suffix(""))], check=True)
    checked.append(report["slug"])
print(json.dumps({"status": "PASS", "reports": len(checked), "pages": len(checked), "checks": "all public text preserved, one page, evidence/company/contact links", "rendered": arguments.render}, indent=2))
