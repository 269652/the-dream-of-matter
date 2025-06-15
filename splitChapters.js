const fs = require('fs');
const path = require('path');

const inputFile = 'The Dream of Matter.draft.md';
const outputDir = './chapters';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const content = fs.readFileSync(inputFile, 'utf8');

// Regex to find "Kapitel 1: Title" style headers
const chapterRegex = /#\s(Kapitel\s\d.*?)\n/g;

const matches = [...content.matchAll(chapterRegex)];

if (matches.length === 0) {
    console.error('No chapters found using the pattern "Kapitel X: Title".');
    process.exit(1);
}

for (let i = 0; i < matches.length; i++) {
    const startIndex = matches[i].index;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index : content.length;

    const chapterContent = content.slice(startIndex, endIndex).trim();
    const chapterNumberMatch = matches[i][1].match(/Kapitel\s+(\d+)/i);
    const chapterNumber = chapterNumberMatch ? chapterNumberMatch[1] : (i + 1);

    const outputFilePath = path.join(outputDir, `chapter${chapterNumber}.md`);
    fs.writeFileSync(outputFilePath, chapterContent);

    console.log(`✅ Wrote ${outputFilePath}`);
}
