import fs from 'fs';

export class FakePage {
    readonly url: string;
    readonly content: string;
}

function getPageContent(pageName: string, variables: Map<string, string>) {
    let content = fs.readFileSync(
        `./test/api/mock/${pageName}.html`,
        {encoding: 'utf-8'}
    );
    variables.forEach((value, varName) => {
        const regex = new RegExp('\\$\\{' + varName + '\\}', 'g');
        content = content.replace(regex, value);
    });
    return content;
}

export function yahooPages(searchString: string, value: number): FakePage[] {
    return [
        {url: `https://www.finance.yahoo.com/quote/${searchString}`, content: getPageContent('yahoo-value-page', new Map([['value', `${value}`]]))}
    ];
}

let investingLinkCount = 0;
export function investingPages(searchString: string, value: number): FakePage[] {
    return [
        {url: `https://www.investing.com/search/?q=${searchString}`, content: getPageContent('investing-search-page', new Map([['link', `/link-to-page-${investingLinkCount}`]]))},
        {url: `https://www.investing.com/link-to-page-${investingLinkCount++}`, content: getPageContent('investing-value-page', new Map([['value', `${value}`]]))}
    ];
}
