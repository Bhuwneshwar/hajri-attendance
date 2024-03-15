const fs = require("fs").promises;
const dbPath = "Database.json";

const generateReferCode = length => {
    const characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let referCode = "";
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        referCode += characters.charAt(randomIndex);
    }
    return referCode;
};

// Create
async function insertData(key, data) {
    try {
        const rawData = await fs.readFile(dbPath, "utf8");
        const collection = JSON.parse(rawData);

        const matchKey = collection[key];
        if (matchKey) {
            // Example usage
            let dataExist = [true];
            let referCode;
            while (dataExist.length > 0) {
                referCode = generateReferCode(20);
                console.log(referCode);
                dataExist = matchKey.filter(obj => {
                    return obj.referCode === referCode;
                });
                console.log({ dataExist });
            }
            data["referCode"] = referCode;
            console.log({ data });
            collection[key] = [data, ...matchKey];
        } else return "Invalid key!";

        // const collection = { name: "Bhuwneshwar Mandal" };

        await fs.writeFile(dbPath, JSON.stringify(collection, null, 4));
        console.log("File inserted successfully!");
    } catch (err) {
        console.error("Error creating file:", err);
    }
}

// Read
async function readFile(key) {
    try {
        const rawData = await fs.readFile(dbPath, "utf8");
        const db = JSON.parse(rawData);

        const isValid = db[key];
        if (isValid) {
            return isValid;
        } else return "Invalid key!";
    } catch (err) {
        console.error("Error reading file:", err);
    }
}

// Update
async function updateFile(key, referCode, obj) {
    try {
        const rawData = await fs.readFile(dbPath, "utf8");
        const db = JSON.parse(rawData);
        console.log({ obj });

        const arr = db[key];
        if (arr) {
            const modifiedArr = arr.map(ele => {
                if (ele.referCode === referCode) {
                    obj["referCode"] = referCode;
                    return obj;
                } else return ele;
            });
            db[key] = modifiedArr;
        } else return false;

        await fs.writeFile(dbPath, JSON.stringify(db, null, 4));
        console.log("File updated successfully!");
        return true;
    } catch (err) {
        console.error("Error updating file:", err);
        return false;
    }
}

const deleteByRefer = async (key, referCode) => {
    try {
        const rawData = await fs.readFile(dbPath, "utf8");
        const db = JSON.parse(rawData);

        const arr = db[key];
        if (arr) {
            const DeletedArr = arr.filter(obj => obj.referCode !== referCode);
            db[key] = DeletedArr;
        } else return false;
        await fs.writeFile(dbPath, JSON.stringify(db, null, 4));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Delete
async function deleteFile() {
    try {
        await fs.unlink("newfile.txt");
        console.log("File deleted successfully!");
    } catch (err) {
        console.error("Error deleting file:", err);
    }
}

// Usage
module.exports = { readFile, insertData, deleteByRefer, updateFile };
