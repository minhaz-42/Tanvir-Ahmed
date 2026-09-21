#!/bin/sh
# Compile both CVs and install them as the site's downloadable PDFs.
#
# Sources of truth:  cv/Tanvir-Ahmed-CV.tex         two pages, for applications
#                    cv/Tanvir-Ahmed-Master-CV.tex  the complete record
# Published copies:  assets/cv/*.pdf
#
# Two pdflatex passes are required because the entry headers use tabular* and
# need their widths settled.
#
# Usage:  ./build-cv.sh
set -e

[ -f cv/Tanvir-Ahmed-CV.tex ] || { echo "run this from the repository root"; exit 1; }
command -v pdflatex >/dev/null 2>&1 || { echo "pdflatex not found (brew install --cask mactex-no-gui)"; exit 1; }

cd cv
for doc in Tanvir-Ahmed-CV Tanvir-Ahmed-Master-CV; do
  pdflatex -interaction=nonstopmode -halt-on-error "$doc.tex" >/dev/null
  pdflatex -interaction=nonstopmode -halt-on-error "$doc.tex" >/dev/null
  # keep the working tree clean; the .tex and .pdf are the only things worth keeping
  rm -f "$doc.aux" "$doc.log" "$doc.out"
done
cd ..

for doc in Tanvir-Ahmed-CV Tanvir-Ahmed-Master-CV; do
  cp "cv/$doc.pdf" "assets/cv/$doc.pdf"
  if command -v pdfinfo >/dev/null 2>&1; then
    PAGES=$(pdfinfo "assets/cv/$doc.pdf" | awk '/^Pages:/{print $2}')
  else
    PAGES="?"
  fi
  # pdflatex stores objects in compressed streams, so count the links at the source
  LINKS=$(grep -o '\\href{' "cv/$doc.tex" | wc -l | tr -d ' ')
  SIZE=$(( $(wc -c < "assets/cv/$doc.pdf") / 1024 ))
  echo "$doc.pdf   pages: $PAGES   size: ${SIZE} KB   hyperlinks: $LINKS"
done
