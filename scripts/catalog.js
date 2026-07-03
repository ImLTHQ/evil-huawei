const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const genCatalog = async () => {
    const dirPath = path.join(__dirname, '../events/');
    const fileNames = await fsPromises.readdir(dirPath);
    const subDirs = [];

    for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i];
        const filePath = path.join(dirPath, fileName);
        const stats = await fsPromises.stat(filePath);
        if (stats.isDirectory()) subDirs.push(fileName);
    }

    const templatePath = path.join(__dirname, '../README.template.md');
    const templateFile = await fsPromises.readFile(templatePath);
    const links = subDirs
        .map((dir) => `  <li><a href="./events/${encodeURI(dir)}/">${dir}</a></li>`)
        .join('\n');

    const comment = '<!-- This file is automatic generated, please edit template file instead. -->';
    const generatedDoc = templateFile.toString().replace('{{catelog_links}}', `<ul class="index-list">\n${links}\n</ul>`);
    const docPath = path.join(__dirname, '../README.md');
    fsPromises.writeFile(docPath, comment + '\n' + generatedDoc);
};

genCatalog();
