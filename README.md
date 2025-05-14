# 在线教育平台

## 项目简介
本项目为前后端分离的在线教育平台，包含Spring Boot后端与Vue前端。

---

## 后端（Spring Boot）

### 端口与接口
- 默认端口：`8080`
- 所有接口统一前缀：`/api`
- H2数据库控制台：`http://localhost:8080/h2-console`

### H2数据库使用说明
- **无需安装MySQL，默认使用本地文件型H2数据库**
- 数据文件路径：`server/data/education.mv.db`
- 数据库连接URL：`jdbc:h2:file:./data/education;DB_CLOSE_ON_EXIT=FALSE;AUTO_RECONNECT=TRUE`
- 用户名：`sa`，密码：空
- 控制台访问：`http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:./data/education`
  - 用户名：`sa`，密码留空
- 启动后会自动初始化表结构和部分基础数据
- 切换MySQL只需修改`server/src/main/resources/application.yml`中的`spring.datasource`配置
- H2控制台（/h2-console）已放行，无需登录即可访问，仅建议开发环境使用。

### 其他注意事项
- 文件上传目录：`server/uploads`，可在`application.yml`中修改
- JWT密钥和过期时间可在`application.yml`中配置
- 端口如需修改，请同步修改前端的API代理配置

---

## 前端（Vue）

### 端口与API代理
- 默认端口：`3000`
- 开发环境下，前端通过代理将`/api`请求转发到后端
- 代理配置文件：`web/vue.config.js` 或 `web/vite.config.js`
- 例：
  ```js
  // vite.config.js
  export default {
    server: {
      proxy: {
        '/api': 'http://localhost:8080',
      },
    },
  }
  ```
- 若后端端口有变动，需同步修改前端代理配置

### 访问地址
- 前端开发环境：http://localhost:3000
- 后端API接口：http://localhost:8080/api
- H2数据库控制台：http://localhost:8080/h2-console

---

## 启动方式

### 后端
```bash
cd server
mvn spring-boot:run
```

### 前端
```bash
cd web
npm install
npm run dev
```

---

## 常见问题
- **H2数据库数据丢失？**
  - 请确保`data/education.mv.db`文件未被删除。
- **端口冲突？**
  - 修改`application.yml`和前端代理配置保持一致。
- **切换MySQL？**
  - 修改`application.yml`中的`spring.datasource`相关配置即可。

---

如有其他问题请联系开发者。 