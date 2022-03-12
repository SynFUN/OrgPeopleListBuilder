const fs = require("fs");
const puppeteer = require('puppeteer');
const {errors} = require("puppeteer");
const {database} = require("./database");

(async () => {
    // 创建 Chromium 浏览器实例
    const browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--enable-automation'],         // 去掉左上角Chrome正受自动软件控制 | close top reminder bar
        args: [
            '--no-sandbox',                                 // 不开启沙箱 | not turn on the sandbox
            `--window-size=1300,800`,                       // 设置窗口大小 | set the window's default size
            '--disable-ios-password-suggestions'            // 不保存密码 | do not memory passwords
        ],
        timeout: 8000,
        defaultViewport: null,                              // 长宽自适应 | auto-fit the size
        ignoreHTTPSErrors: true,                            // 忽略证书错误 | ignore https' credential
        headless: false                                     // 关闭无头模式 | turn off headless
    });
    let pages = await browser.pages();
    const page = pages[0];
    await page.goto('https://github.com/login');
    // 此循环会在用户完成登陆后打破 | while loop ends after user successfully login
    while (true) {
        try {
            // 此检测器检测的是登录后GitHub页面左上角的Logo | selector recognize the GitHub logo at the top left
            await page.waitForSelector('body > div > header > div > a > svg > path', {timeout: 1000});
            break;
        } catch (e) {
            // 如非此处利用的timeout错误 即如有预料外的错误 log出来 | utilize timeout errors so log out any unexpected errors
            if (!(e instanceof errors.TimeoutError)) {
                console.log(e);
                await page.evaluate(() => alert("Unexpected error:\n" + e));
            }
        }
    }

    async function toHTML() {
        // 转跳到index.html文件 | goto this html file
        await page.goto(__dirname + "/index.html");
        // 此处遍历是否有已经生成的数据并在html中列出 | check if there's formed data and shows on the html page
        let file_name_list = fs.readdirSync(__dirname);
        let path_for_browser = __dirname.replace(/\\/g, "/");
        for (let file_name of file_name_list) {
            if (file_name.endsWith(".csv")) {
                await page.evaluate("addNewElements('" + file_name + "','" + path_for_browser + "' + '/');");
            } else if (file_name.endsWith(".db")) {
                await page.evaluate("addNewElements('" + file_name + "','" + path_for_browser + "' + '/');");
            }
        }
    }

    while (true) {
        // 用户登录后进入此页面 | goto this html page after login
        await toHTML();
        // 这里程序逻辑在html文件中 所以puppeteer需要通过选择器和timeout特性判断程序的进度和状态
        // this part will use many try-catch because the script is in the html file
        // so here the puppeteer script can only analyze the current status by selector-timeout checks
        // 此循环在用户输入正确的 Organization 后打破 | while loop ends after user provides right organization ID
        while (true) {
            // 这个try会反复验证 HTML文件是否已经用其内嵌的JS脚本转跳 | try waiting for the html jump to target page
            try {
                // 此检测器检测的是登录后GitHub页面左上角的Logo | selector recognize the GitHub logo at the top left
                await page.waitForSelector('body > div > header > div > a > svg > path', {timeout: 100});
                // 这个try会反复验证 HTML文件是否已经用其内嵌的JS脚本转跳到 正确的网页 | this try waiting for the right page
                try {
                    // 此检测器检测Organization页面的People元素 | selector recognize people element in the require page
                    await page.waitForSelector('#organization-people-label', {timeout: 1000});
                    break;
                } catch (e) {
                    //  如非此处利用的timeout错误 即如有预料外的错误 log出来 | utilize timeout errors so log out any unexpected errors
                    if (!(e instanceof errors.TimeoutError)) {
                        console.log(e);
                        await toHTML();
                        await page.evaluate(() => alert("Unexpected error:\n" + e));
                    }
                    // 此处timeout说明转跳的网页是错误的 重新回到HTML | timeout error means the page is wrong so back to html page
                    await toHTML();
                    await page.evaluate(() => alert("You need to fill in the organization\'s GitHub ID correctly!"));
                }
            } catch (e) {
                //  如非此处利用的timeout错误 即如有预料外的错误 log出来 | utilize timeout errors so log out any unexpected errors
                if (!(e instanceof errors.TimeoutError)) {
                    console.log(e);
                    await toHTML();
                    await page.evaluate(() => alert("Unexpected error:\n" + e));
                }
            }
        }
        // 上一操作是HTML内脚本进行的网页转跳 此处重新捕获url | here will re-control the url after operated the html file
        // substring用于截去url末尾的page=1处的1 | substring cuts off the page number at the end of url
        let people_page_url = page.url().substring(0, page.url().length - 1);
        // substring用于获取的organization的名称 | substring gets the ID of the organization
        let organization_name = page.url().substring(0, page.url().lastIndexOf('/'));
        organization_name = organization_name.substring(organization_name.lastIndexOf('/') + 1);
        await page.goto(people_page_url + '1');
        try {
            // 此处需要抓取page尾页的页码 用于下方循环的截停 | select the largest page number from the bottom page chooser in page
            // 如果没有次页码 表示页面数量不足一页 会造成timeout 直接结束爬取 | cannot get this value will means less than 1 page so direct end
            await page.waitForSelector('#org-members-table > div.paginate-container > div', {timeout: 1000});
            // 抓取选择器内容page_numbers包含当前页面所有用户的用户名及ID | select the largest page number from the bottom page chooser into page_numbers
            let page_numbers: string[] = await page.$$eval('#org-members-table > div.paginate-container > div', (links) => links.map((x) => x.innerText));
            // 【example】page_numbers[0] = 'Previous 1 2 3 4 5 … 1666 1667 Next'
            // 【example】last_page_number = 1667
            let last_page_number = page_numbers[0].substring(0, page_numbers[0].lastIndexOf(' '));
            last_page_number = last_page_number.substring(last_page_number.lastIndexOf(' ') + 1);
            // 创建数据库对象 用于操作 | get a database object
            let db = new database(organization_name);
            // 此while循环用于遍历用户网页 | while loop for traverse all people's pages
            let page_counter = 1;
            while (Number(page_counter) !== Number(last_page_number)) {
                try {
                    await page.goto(people_page_url + page_counter);
                    // 等待选择器检测 确保加载完成 提高鲁棒性 | waiting for selector find target to improve robustness
                    await page.waitForSelector('#org-members-table > ul > li > div.py-3.css-truncate.pl-3.flex-auto');
                    // 抓取选择器内容names包含当前页面所有用户的用户名及ID | select all people's ID in the current page into names
                    let names: string[] = await page.$$eval('#org-members-table > ul > li > div.py-3.css-truncate.pl-3.flex-auto', (links) => links.map((x) => x.innerText));
                    // 遍历names列表并写入数据库 | traverse all people's names and insert into database
                    for (let name of names) {
                        // 消除用户名中可能的换行符 提高鲁棒性 | remove possible line breaks in the users' names
                        name = name.replace(/\n/g, " ");
                        // 写入数据库 | insert into database
                        await db.insert(name, people_page_url + page_counter);
                    }
                    page_counter++;
                } catch (e) {
                    console.log(e);
                }
            }
            await db.close();
            await toHTML();
            await page.evaluate(() => alert("Database logged done."));
        } catch (e) {
            // 如非此处利用的timeout错误 即如有预料外的错误 log出来 | utilize timeout errors so log out any unexpected errors
            if (!(e instanceof errors.TimeoutError)) {
                console.log(e);
                await toHTML();
                await page.evaluate(() => alert("Unexpected error:\n" + e));
            }
            await toHTML();
            await page.evaluate(() => alert("This organization is too short!"));
        }
    }
})();