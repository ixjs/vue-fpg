# 模板说明：

  FPG框架是基于VUE框架制定的多项目工程组框架（Frontend Projects Group framework）；

  该框架下项目将基于VUE框架的[Webpack](https://github.com/vuejs-templates/webpack)模版进行改编；

# 使用办法

  1. 下载本模版，假设下载地址为：/home/test/fpg

  2. 按照如下方式建立新项目组并初始化： 

``` bash
$ npm install -g vue-cli
$ vue init /home/coder/fpg my-group-dir
$ cd my-group-dir
$ sh framework/init.sh

$ cd framwork
$ git init 
$ git add .
$ git commit -m "initialize framework"

```

  3. 如果框架已存在时，可以从按照如下步骤建立开发环境

``` bash
$ mkdir my-group-dir
$ git clone framework-repo-url
$ sh framework/init.sh
```

  4. 在项目组中创建项目：

``` bash
$ cd my-group-dir
$ npm run create project-name

$ cd project-name
$ git init 
$ git add .
$ git commit -m "initialize project"
```

  此命令将在项目组目录下创建项目专属目录，如该目录已经存在，则不会继续创建

#其他

  更多可见框架安装完成后的说明文件： ./framework/README.md
