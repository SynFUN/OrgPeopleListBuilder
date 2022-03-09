var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var fs = require("fs");
var puppeteer = require('puppeteer');
var errors = require("puppeteer").errors;
var database = require("./database").database;
(function () { return __awaiter(_this, void 0, void 0, function () {
    function toHTML() {
        return __awaiter(this, void 0, void 0, function () {
            var file_name_list, path_for_browser, _i, file_name_list_1, file_name;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // 转跳到index.html文件 | goto this html file
                    return [4 /*yield*/, page.goto(__dirname + "/index.html")];
                    case 1:
                        // 转跳到index.html文件 | goto this html file
                        _a.sent();
                        file_name_list = fs.readdirSync(__dirname);
                        path_for_browser = __dirname.replace(/\\/g, "/");
                        _i = 0, file_name_list_1 = file_name_list;
                        _a.label = 2;
                    case 2:
                        if (!(_i < file_name_list_1.length)) return [3 /*break*/, 7];
                        file_name = file_name_list_1[_i];
                        if (!file_name.endsWith(".csv")) return [3 /*break*/, 4];
                        return [4 /*yield*/, page.evaluate("addNewElements('" + file_name + "','" + path_for_browser + "' + '/');")];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (!file_name.endsWith(".db")) return [3 /*break*/, 6];
                        return [4 /*yield*/, page.evaluate("addNewElements('" + file_name + "','" + path_for_browser + "' + '/');")];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    var browser, pages, page, e_1, e_2, e_3, people_page_url, organization_name, page_numbers, last_page_number, db, page_counter, names, _i, names_1, name_1, e_4, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer.launch({
                    ignoreDefaultArgs: ['--enable-automation'],
                    args: [
                        '--no-sandbox',
                        "--window-size=1300,800",
                        '--disable-ios-password-suggestions' // 不保存密码 | do not memory passwords
                    ],
                    timeout: 8000,
                    defaultViewport: null,
                    ignoreHTTPSErrors: true,
                    headless: false // 关闭无头模式 | turn off headless
                })];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.pages()];
            case 2:
                pages = _a.sent();
                page = pages[0];
                return [4 /*yield*/, page.goto('https://github.com/login')];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!true) return [3 /*break*/, 11];
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 10]);
                // 此检测器检测的是登录后GitHub页面左上角的Logo | selector recognize the GitHub logo at the top left
                return [4 /*yield*/, page.waitForSelector('body > div > header > div > a > svg > path', { timeout: 1000 })];
            case 6:
                // 此检测器检测的是登录后GitHub页面左上角的Logo | selector recognize the GitHub logo at the top left
                _a.sent();
                return [3 /*break*/, 11];
            case 7:
                e_1 = _a.sent();
                if (!!(e_1 instanceof errors.TimeoutError)) return [3 /*break*/, 9];
                console.log(e_1);
                return [4 /*yield*/, page.evaluate(function () { return alert("Unexpected error:\n" + e_1); })];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9: return [3 /*break*/, 10];
            case 10: return [3 /*break*/, 4];
            case 11:
                if (!true) return [3 /*break*/, 57];
                // 用户登录后进入此页面 | goto this html page after login
                return [4 /*yield*/, toHTML()];
            case 12:
                // 用户登录后进入此页面 | goto this html page after login
                _a.sent();
                _a.label = 13;
            case 13:
                if (!true) return [3 /*break*/, 30];
                _a.label = 14;
            case 14:
                _a.trys.push([14, 25, , 29]);
                // 此检测器检测的是登录后GitHub页面左上角的Logo | selector recognize the GitHub logo at the top left
                return [4 /*yield*/, page.waitForSelector('body > div > header > div > a > svg > path', { timeout: 100 })];
            case 15:
                // 此检测器检测的是登录后GitHub页面左上角的Logo | selector recognize the GitHub logo at the top left
                _a.sent();
                _a.label = 16;
            case 16:
                _a.trys.push([16, 18, , 24]);
                // 此检测器检测Organization页面的People元素 | selector recognize people element in the require page
                return [4 /*yield*/, page.waitForSelector('#organization-people-label', { timeout: 1000 })];
            case 17:
                // 此检测器检测Organization页面的People元素 | selector recognize people element in the require page
                _a.sent();
                return [3 /*break*/, 30];
            case 18:
                e_2 = _a.sent();
                if (!!(e_2 instanceof errors.TimeoutError)) return [3 /*break*/, 21];
                console.log(e_2);
                return [4 /*yield*/, toHTML()];
            case 19:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () { return alert("Unexpected error:\n" + e_2); })];
            case 20:
                _a.sent();
                _a.label = 21;
            case 21: 
            // 此处timeout说明转跳的网页是错误的 重新回到HTML | timeout error means the page is wrong so back to html page
            return [4 /*yield*/, toHTML()];
            case 22:
                // 此处timeout说明转跳的网页是错误的 重新回到HTML | timeout error means the page is wrong so back to html page
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () { return alert("You need to fill in the organization\'s GitHub ID correctly!"); })];
            case 23:
                _a.sent();
                return [3 /*break*/, 24];
            case 24: return [3 /*break*/, 29];
            case 25:
                e_3 = _a.sent();
                if (!!(e_3 instanceof errors.TimeoutError)) return [3 /*break*/, 28];
                console.log(e_3);
                return [4 /*yield*/, toHTML()];
            case 26:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () { return alert("Unexpected error:\n" + e_3); })];
            case 27:
                _a.sent();
                _a.label = 28;
            case 28: return [3 /*break*/, 29];
            case 29: return [3 /*break*/, 13];
            case 30:
                people_page_url = page.url().substring(0, page.url().length - 1);
                organization_name = page.url().substring(0, page.url().lastIndexOf('/'));
                organization_name = organization_name.substring(organization_name.lastIndexOf('/') + 1);
                return [4 /*yield*/, page.goto(people_page_url + '1')];
            case 31:
                _a.sent();
                _a.label = 32;
            case 32:
                _a.trys.push([32, 50, , 56]);
                // 此处需要抓取page尾页的页码 用于下方循环的截停 | select the largest page number from the bottom page chooser in page
                // 如果没有次页码 表示页面数量不足一页 会造成timeout 直接结束爬取 | cannot get this value will means less than 1 page so direct end
                return [4 /*yield*/, page.waitForSelector('#org-members-table > div.paginate-container > div', { timeout: 1000 })];
            case 33:
                // 此处需要抓取page尾页的页码 用于下方循环的截停 | select the largest page number from the bottom page chooser in page
                // 如果没有次页码 表示页面数量不足一页 会造成timeout 直接结束爬取 | cannot get this value will means less than 1 page so direct end
                _a.sent();
                return [4 /*yield*/, page.$$eval('#org-members-table > div.paginate-container > div', function (links) { return links.map(function (x) { return x.innerText; }); })];
            case 34:
                page_numbers = _a.sent();
                last_page_number = page_numbers[0].substring(0, page_numbers[0].lastIndexOf(' '));
                last_page_number = last_page_number.substring(last_page_number.lastIndexOf(' ') + 1);
                db = new database(organization_name);
                page_counter = 1;
                _a.label = 35;
            case 35:
                if (!(Number(page_counter) !== Number(last_page_number))) return [3 /*break*/, 46];
                _a.label = 36;
            case 36:
                _a.trys.push([36, 44, , 45]);
                return [4 /*yield*/, page.goto(people_page_url + page_counter)];
            case 37:
                _a.sent();
                // 等待选择器检测 确保加载完成 提高鲁棒性 | waiting for selector find target to improve robustness
                return [4 /*yield*/, page.waitForSelector('#org-members-table > ul > li > div.py-3.css-truncate.pl-3.flex-auto')];
            case 38:
                // 等待选择器检测 确保加载完成 提高鲁棒性 | waiting for selector find target to improve robustness
                _a.sent();
                return [4 /*yield*/, page.$$eval('#org-members-table > ul > li > div.py-3.css-truncate.pl-3.flex-auto', function (links) { return links.map(function (x) { return x.innerText; }); })];
            case 39:
                names = _a.sent();
                _i = 0, names_1 = names;
                _a.label = 40;
            case 40:
                if (!(_i < names_1.length)) return [3 /*break*/, 43];
                name_1 = names_1[_i];
                // 消除用户名中可能的换行符 提高鲁棒性 | remove possible line breaks in the users' names
                name_1 = name_1.replace(/\n/g, " ");
                // 写入数据库 | insert into database
                return [4 /*yield*/, db.insert(name_1, people_page_url + page_counter)];
            case 41:
                // 写入数据库 | insert into database
                _a.sent();
                _a.label = 42;
            case 42:
                _i++;
                return [3 /*break*/, 40];
            case 43:
                page_counter++;
                return [3 /*break*/, 45];
            case 44:
                e_4 = _a.sent();
                console.log(e_4);
                return [3 /*break*/, 45];
            case 45: return [3 /*break*/, 35];
            case 46: return [4 /*yield*/, db.close()];
            case 47:
                _a.sent();
                return [4 /*yield*/, toHTML()];
            case 48:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () { return alert("Database logged done."); })];
            case 49:
                _a.sent();
                return [3 /*break*/, 56];
            case 50:
                e_5 = _a.sent();
                if (!!(e_5 instanceof errors.TimeoutError)) return [3 /*break*/, 53];
                console.log(e_5);
                return [4 /*yield*/, toHTML()];
            case 51:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () { return alert("Unexpected error:\n" + e_5); })];
            case 52:
                _a.sent();
                _a.label = 53;
            case 53: return [4 /*yield*/, toHTML()];
            case 54:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () { return alert("This organization is too short!"); })];
            case 55:
                _a.sent();
                return [3 /*break*/, 56];
            case 56: return [3 /*break*/, 11];
            case 57: return [2 /*return*/];
        }
    });
}); })();
