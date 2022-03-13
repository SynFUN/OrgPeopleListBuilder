const sqlite = require('sqlite3').verbose();
const fs = require('fs');
let database = {};
let org_name;
let con;
database.obj = function (organization_name) {
    org_name = organization_name;
    con = new sqlite.Database(organization_name + '.db');
    try {
        con.run('CREATE TABLE IF NOT EXISTS users (name text primary key, link text);');
    } catch (err) {
        console.log('CREATE TABLE IF NOT EXISTS users (name text primary key, page_number text);');
    }
};
database.obj.prototype.insert = function (name, page_number) {
    // 防注入过滤 | filtration chars that will cause SQL errors
    name = name.replace(/[^a-zA-Z0-9]/g, '');
    con.run('INSERT INTO users VALUES ("' + name + '", "' + page_number + '");', function (err) {
        if (err) {
            console.log('INSERT INTO users VALUES ("' + name + '", "' + page_number + '");');
        }
    });
};
database.obj.prototype.close = function () {
    // 生成csv版本的文件 | form a csv file of the users table
    con.all('SELECT * FROM users', function (err, rows) {
        if (err) {
            console.log('SELECT * FROM users');
        }
        let csv = '';
        for (let i = 0; i < rows.length; i++) {
            csv += rows[i].name + ',' + rows[i].link + '\n';
        }
        fs.writeFile(__dirname + '/' + org_name + '.csv', csv, function (err) {
            if (err) {
                console.log('csv file failed to write');
            }
        });
    });
    con.close();
};
exports.database = database.obj;