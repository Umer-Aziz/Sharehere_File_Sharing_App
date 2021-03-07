const File=require('./models/file');

const connDB = require('./config/db');
const Files = require('./models/file');
const fs = require('fs');

connDB();

// Get all records older than 24 hours 
async function fetchData() {
    const files = await Files.find({ createdAt : { $lt: new Date(Date.now() - 48 * 60 * 60 * 1000)} })
    if(files.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            } catch(err) {
                console.log(`error while deleting file ${err} `);
            }
        }
    }
    console.log('Job done!');
}

fetchData().then(process.exit);
