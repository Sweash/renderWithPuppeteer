const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const data = require('./data.json');

const compile = async (templateName, data) => {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');

    return hbs.compile(html)(data);
}

hbs.registerHelper('idHelper', (value) => {
    return `${value} helper works`;
});

(async() => {
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        const content = await compile('tests', data);

        await page.setContent(content);
        await page.emulateMedia('screen');
        await page.pdf({
            path: 'tests.pdf',
            format: 'A4',
            printBackground: true,
            landscape: true
        });

        await browser.close();
        process.exit();
    } catch (e){
        console.log(e);
    }
})();