/**
 * One-time utility: strip duplicated chrome from page-specific CSS files.
 * Shared styles live in base.css and page-hero.css.
 */
const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, '..', 'styles');

function extractBetween(content, start, end) {
    const s = content.indexOf(start);
    if (s === -1) return '';
    const e = end ? content.indexOf(end, s) : content.length;
    if (e === -1) return content.slice(s);
    return content.slice(s, e);
}

function writePageCss(filename, header, body) {
    fs.writeFileSync(
        path.join(stylesDir, filename),
        `${header}\n\n${body.trim()}\n`,
        'utf8'
    );
}

const aboutus = fs.readFileSync(path.join(stylesDir, 'aboutus.css'), 'utf8');
const aboutBody =
    extractBetween(aboutus, '/* Content Section */', '/* Buttons */') +
    extractBetween(
        aboutus,
        'Timeline Section',
        '/* Page Hero Section */'
    ) +
    `
/* Page-specific responsive */
@media (max-width: 768px) {
    .about-grid { grid-template-columns: 1fr; }
    .expertise-content { flex-direction: column; }
    .expertise-image { max-width: 100%; }
    .locations-grid { grid-template-columns: 1fr; }
    .cta-section h2 { font-size: 2rem; }
}
`;
writePageCss('aboutus.css', '/* About Us — shared chrome in base.css & page-hero.css */', aboutBody);

const products = fs.readFileSync(path.join(stylesDir, 'products.css'), 'utf8');
const productsBody =
    extractBetween(products, '/* Products Section */', '/* Buttons */') +
    `
/* Page-specific responsive */
@media (max-width: 768px) {
    .products-grid { grid-template-columns: 1fr; }
    .section-intro h2 { font-size: 2rem; }
}

@media (max-width: 480px) {
    .section-intro h2 { font-size: 1.75rem; }
}
`;
writePageCss('products.css', '/* Products — shared chrome in base.css & page-hero.css */', productsBody);

const contact = fs.readFileSync(path.join(stylesDir, 'contact.css'), 'utf8');
let contactBody = extractBetween(contact, '/* Contact Section */', '/* Footer */');
contactBody = contactBody.replace(
    /\.section-title[\s\S]*?border-radius: 2px;\n\}/,
    ''
);
contactBody = contactBody.replace(
    /\.btn \{[\s\S]*?box-shadow: var\(--shadow-medium\);\n\}/,
    `.contact-form .btn-primary {
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
`
);
contactBody +=
    `
/* Page-specific responsive */
@media (max-width: 968px) {
    .contact-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
}

@media (max-width: 768px) {
    .locations-grid { grid-template-columns: 1fr; }
}
`;
writePageCss('contact.css', '/* Contact — shared chrome in base.css & page-hero.css */', contactBody);

console.log('Trimmed aboutus.css, products.css, and contact.css');
