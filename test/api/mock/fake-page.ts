import fs from 'fs';

export default function (pageName: string, values: Map<string, string>) {
    let content = fs.readFileSync(
        `./test/api/mock/${pageName}.html`, 
        {encoding: 'utf-8'}
    );
    values.forEach((value, varName) => {
        const regex = new RegExp('\\$\\{' + varName + '\\}', 'g');
        content = content.replace(regex, value);
    });
    return content;
}
