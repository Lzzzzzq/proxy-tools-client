## Proxy-tools-client

一个本地网络请求代理小工具，通过中间人解决开发、调试及测试环境下的一些问题，使用pkg打包



### 功能

- [x] hosts修改
- [x] 请求抓取（基础版）
- [ ] 本地调试线上静态资源文件



### 下载地址

[https://github.com/Lzzzzzq/proxy-tools-client/releases](https://github.com/Lzzzzzq/proxy-tools-client/releases)



### 使用方式

**将本地网络请求代理到 proxy-tools**，可以通过浏览器插件 [SwitchyOmega](https://www.switchyomega.com/) 配置网页请求的代理，或在fiddler中进行配置 Tools -> Options -> Gateway -> Manual Proxy Configuration ，proxy-tools 默认为localhost:3000，具体端口号请参考软件控制台中显示的 Port -> *。