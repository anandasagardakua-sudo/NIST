import fs from 'fs';
fs.writeFileSync('env.txt', JSON.stringify(process.env, null, 2));
