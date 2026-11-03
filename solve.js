const axios = require('axios');
const cheerio = require('cheerio');

async function printSecretMessage(url) {
    try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);
        
        let maxX = 0;
        let maxY = 0;
        const points = [];

        // Parse table rows from the Google Doc
        $('table tr').each((i, row) => {
            const cols = $(row).find('td').map((_, el) => $(el).text().trim()).get();
            if (cols.length >= 3) {
                const char = cols[1]; // Character column
                const x = parseInt(cols[0], 10); // x-coordinate column
                const y = parseInt(cols[2], 10); // y-coordinate column
                
                if (!isNaN(x) && !isNaN(y)) {
                    points.push({ char, x, y });
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                }
            }
        });

        // Initialize grid filled with spaces
        const grid = Array.from({ length: maxY + 1 }, () => Array(maxX + 1).fill(' '));
        
        // Place characters into the grid (inverted y-axis so it prints right-side up)
        for (const p of points) {
            grid[maxY - p.y][p.x] = p.char;
        }

        // Print the final decoded message
        console.log(grid.map(row => row.join('')).join('\n'));
    } catch (error) {
        console.error('Error fetching or parsing the document:', error);
    }
}

// Run the function with your assessment URL
printSecretMessage('https://docs.google.com/document/d/e/2PACX-1vSvM5gDlNvt7npYHhp_XfsJvuntUhq184By5xO_pA4b_gCWeXb6dM6ZxwN8rE6S4ghUsCj2VKR21oEP/pub');