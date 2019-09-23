# 2019-9-23

	提供了新的创建项目机制，使用定制化的项目配置文件可直接生成简单的表单管理系统

## 项目配置文件示例

	配置文件的定义描述：参见 framework/qde/configuration.def 文件

	在 framework/qde/samples 目录下有两个文件都可以用来创建项目

		profile.js ： 完整配置下的定制化文件
		simplify.js ： 简化版的定制化文件

## 使用办法

1. 在项目的根目录下，如：/home/coder/fpg；创建（或者复制/链接）定制化文件为新项目的配置文件：

		# cp framework/qde/samples/simplify.js prjName.js
	
2. 执行快速开发项目创建命令，如：
		
		# npm run qde prjName
	
	此命令将在当前目录下创建新项目工程目录 prjName 和 新的项目管理指令

3. 启动新项目：

		# npm run dev:prjName
