## 说明

本模块主要作为 [mz-fis](https://github.com/mz-team/mz-fis) i18n 国际化框架的协同插件使用。

### 安装

```
npm install mz-command-xgettext
```

### 工作原理

1. 遍历当前工作项目中的所有 **isJsLike** 与 **isHtmlLike** 文件（JS、Smarty 模板）中的以下特征字符串：

	- __('需要翻译的文案')
	- <{'需要翻译的文案'|gettext}>

2. 进入项目目录，运行 mz xgettext 命令

	```
	cd i18n-www/source/cn
	mz xgettext
	```

3. 该插件会基于 fis-conf.js 中的 fis.get('lang') 配置，在 lang/ 目录下生成 .po 语言文件

4. 打开 .po 文件，翻译对应的 msgstr 字符串，也可通过 [poedit](http://poedit.net/) 或 [Goolge Translator Toolkit](https://translate.google.com/toolkit/list) 进行翻译