const fs = require('fs');
const path = require('path');

const langs = ['de', 'en', 'es'];
const originalLang = 'de';

langs.forEach((lang) => {
    const inputFile = `The Dream of Matter${lang === originalLang ? '' : `.${lang}`}.draft.md`;
    const outputDir = `./${lang}/chapters`;

    if (!fs.existsSync(inputFile)) return;

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const content = fs.readFileSync(inputFile, 'utf8');

    // Regex to find "Kapitel 1: Title" style headers
    const chapterRegex = /#\s((Kapitel|Chapter)\s\d*.*?)\n/g;

    const matches = [...content.matchAll(chapterRegex)];

    if (matches.length === 0) {
        console.error('No chapters found using the pattern "Kapitel X: Title".');
        process.exit(1);
    }

    for (let i = 0; i < matches.length; i++) {
        const startIndex = matches[i].index;
        const endIndex = i + 1 < matches.length ? matches[i + 1].index : content.length;

        const chapterContent = content.slice(startIndex, endIndex).trim();
        const chapterNumberMatch = matches[i][1].match(/(Kapitel|Chapter)\s+(\d+)/i);
        const chapterNumber = chapterNumberMatch ? chapterNumberMatch[2] : (i + 1);
        const chapterNumberPadded = chapterNumber.toString().padStart(2, '0');

        const outputFilePath = path.join(outputDir, `chapter${chapterNumberPadded}.md`);
        fs.writeFileSync(outputFilePath, chapterContent);

        console.log(`✅ Wrote ${outputFilePath}`);
    }

})
