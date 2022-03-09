# Organization People List Builder

一个半练手性质的 Puppeteer 爬虫，有界面交互逻辑，用来爬取 GitHub Organization 的人员名单与对应所在的页数。目的是想解决由于 Organization 人数过多导致的搜索功能 timeout 报错的问题。

A Puppeteer crawler project with interface interaction logic that crawls the GitHub Organization's people list and their corresponding pages. The purpose is to solve the problem that the search function timeout fails due to too many people in the Organization.

| 要爬取的 organization 的人员列表 | <img src=".\README\1.png" alt="1" style="zoom:67%;" />       | people's list for an organization as the datas this script collect |
| -------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 将人员名与所在的页码相对应       | ![2](.\README\2.png)                                         | corresponding people's name with the page number             |
| 通过这样的格式可以访问指定的页码 | `https://github.com/orgs/{ORG_NAME}/people?page={PAGE_NUMBER}` | view specific page by url in this format                     |
| 如果直接搜索会得到这样的结果     | <img src=".\README\3.png" alt="3" style="zoom: 67%;" />      | this is the result for searching it                          |
| 这是搜索的格式                   | `https://github.com/orgs/{ORG_NAME}/people?query={SEARCH_STRING}` | this is the searching format                                 |

最终事实证明，超过五万人之后在有限页码内人员本来就只有五万个，超出的不但搜索不到甚至连对应的页数也没有。

In the end, it turned out that there were only 50,000 people in the limited number of pages, and those beyond that could not be searched or even had no corresponding page number.

------

## 使用程序 | Run this script

#### 1 运行 `setup.bat` | Run `setup.bat`

`setup.bat` 需要电脑已安装 node, 此 bat 将会使用 npm 安装运行时必要的组件。

`setup.bat` requires node to be installed on the computer. This bat will use npm to install the necessary components for runtime.

#### 2 运行 `run.bat` | Run `run.bat`

`run.bat` 会用 node 启动程序, 其中一条需要管理员权限以用 tsc 编译并更新 `main.ts` 文件, 如果只是运行的话这里没有更新 typescript 代码所以失败了也不影响。

`run.bat` starts the program by node. One command need the administration to run tsc to update `main.ts`, but while here just need to run it with no update, it's error report by no administration can be ignore.

#### 3 登录 GitHub | Login GitHub

<img src=".\README\4.png" alt="4" style="zoom:50%;" />

#### 4 操作面板 | Control Panel

<img src=".\README\5.png" alt="5" style="zoom: 67%;" />