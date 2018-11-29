# 框架说明：

	FPG框架是基于VUE框架制定的多项目工程组框架（Frontend Projects Group framework）；

# 使用办法

	1. 建立工程组根目录，如：/home/coder/fpg
	
	2. 在工程组根目录下下载或者使用fpg创建项目组框架，如：/home/code/fpg/framework
	
	3. 执行该框架目录下的脚本init.sh初始化工程组，请注意相关的读写权限，如：sh ./framework/init.sh
	
	4. 执行完成后，工程根目录下出现5个软链接和一个自动加载完成的node_modules。

		如希望node_modules手动加载，可以在第2步时，手动生成该目录，待第3步完成后，自行执行'npm install'或者复制已存在的node_modules库。
	
	5. 如果需要在该工作组下创建新项目，有2种方式：
		
		5.1 可以执行该框架下的脚本create.sh，如：
			# sh ./framework/create.sh project-name

		5.2 可以在根目录下执行npm命令，如：
			# npm run create project-name
	
	不建议自行调用vue init命令！

# 注意事项

	1. framework目录属于框架的中枢；请谨慎调整。

	2. 工程组根目录下的目录（除node_modules外)都是对framework内容的引用，可以随framework一起提交；
		如果操作不系统不支持文件引用的方式，也可以按照脚本的要求复制文件，但需要注意一旦修改，需要同步回对应文件再提交；

	3. framework/share目录下属于全工程组项目可共享，其下包括_mixins, biz-components, components, engine, router等多个共享目录；调整时请谨慎，避免影响到其他项目。
		这些共享文件可以在各项目下使用”@“方法直接引用。如存在非标准的类似文件，可以自行复制到各自目录下进行改编；

	4. 项目中如需引入额外npm库，可以通过修改framework/env/package.json；

	5. 对任一项目（假设项目目录为prj1），可以在工程组根目录下执行：

		5.1 如有图片／背景集需要整合，可以将相关图片放置于 prj1/_assets 目录下的特定目录中，视情况调整 prj1/config/index.js 中关于 preless 的配置；然后执行整合命令， 如：
			# npm run preless:prj1
		
		整合结果将生成如下：
			_demo目录
			src/less/ixwpre.less
			static/images/*.png
			static/less/ixwpre.less

		其中_demo可以dev模式下，通过 http://url/_demo/preview.htm 查看当前已经整合好的图片／背景集以及示例用法，其他文件将被项目代码所使用；
		
		5.2 项目生成后可以执行命令以启动项目开发模式, 如：
			# npm run dev:prj1；

		5.3 项目开发提交代码前，可以通过命令行对项目进行代码检查，如：
			# npm run lint:prj1； 
			# npm run lintext:prj1；

		5.4 项目开发完成后，可以通过命令行发布项目, 如: 
			# npm run release:prj1；
		
		发布结果存在于工程组根目录下的prj1/rel目录下，也可以通过修改 prj1/config/index.js 中的release配置自行指定；
