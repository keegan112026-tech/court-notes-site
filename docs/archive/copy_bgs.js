const fs = require('fs');

const src1 = 'C:/Users/User/.gemini/antigravity/brain/af2b9ed2-ce23-469e-91e8-087aaaaa5198/about_solemn_bg_1772519195066.png';
const dest1 = 'C:/Users/User/OneDrive/Desktop/社工觀庭筆記共構平台_整合版/frontend/public/about_solemn.png';

const src2 = 'C:/Users/User/.gemini/antigravity/brain/af2b9ed2-ce23-469e-91e8-087aaaaa5198/about_hope_bg_1772519213197.png';
const dest2 = 'C:/Users/User/OneDrive/Desktop/社工觀庭筆記共構平台_整合版/frontend/public/about_hope.png';

fs.copyFileSync(src1, dest1);
fs.copyFileSync(src2, dest2);
console.log('Images copied successfully.');
