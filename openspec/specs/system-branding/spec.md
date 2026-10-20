# system-branding Specification

## Purpose

为网关提供一致的默认品牌呈现，使无自定义配置时的应用图标、浏览器图标和系统名称符合“云鹤智元”原型。

## Requirements

### Requirement: 默认品牌资源
未配置自定义 Logo 时，系统 MUST 使用“云鹤智元”原型中的鹤形图案作为默认 Logo，并使用对应的浏览器 favicon。Logo MUST 适配透明背景和小尺寸显示；favicon MUST 包含常用分辨率。

#### Scenario: 使用默认品牌图标
- **WHEN** 管理员没有配置自定义 Logo，用户打开应用
- **THEN** 应用界面显示默认鹤形 Logo，浏览器标签显示对应 favicon

### Requirement: 默认系统名称
未配置自定义系统名称时，系统 MUST 在应用品牌区域和页面标题中显示“云鹤智元”。

#### Scenario: 未设置自定义名称
- **WHEN** 状态接口未提供自定义系统名称
- **THEN** 应用品牌区域和页面标题显示“云鹤智元”

### Requirement: 管理员自定义品牌优先
管理员已配置的系统名称和 Logo MUST 继续覆盖默认品牌值。

#### Scenario: 已配置自定义名称与 Logo
- **WHEN** 状态接口返回管理员保存的系统名称和 Logo 地址
- **THEN** 应用继续显示已配置的名称和 Logo

### Requirement: 不检查上游新版本
应用 MUST NOT 自动或手动请求上游发布信息来检查是否有新版本，也 MUST NOT 显示“可更新”状态或更新检查入口。应用仍 MUST 显示当前运行版本。

#### Scenario: 显示当前版本但不查询更新
- **WHEN** 用户打开应用或系统维护页面
- **THEN** 界面显示当前运行版本，且不会查询上游发布信息或展示更新提示和检查入口

### Requirement: 品牌标识不导航
应用页眉、公开页眉和移动菜单中的 Logo 与系统名称 MUST 作为非交互品牌内容显示，不得链接或跳转到首页。

#### Scenario: 点击品牌标识
- **WHEN** 用户查看或点击页眉、公开页眉或移动菜单中的 Logo 和系统名称
- **THEN** 品牌标识不是链接，也不会触发首页导航
