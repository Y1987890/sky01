# 青茗商城 - 2023590527购物商城

## 项目简介

这是一个基于SpringBoot 4.0.6 + Vue.js + Element UI的完整企业级购物商城系统，采用前后端分离架构，界面采用中国风设计风格。

## 技术栈

### 后端技术
- SpringBoot 4.0.6
- MyBatis-Plus 3.5.5
- MySQL 8.0
- Druid 1.2.20
- Lombok
- JWT (jjwt 0.12.3)
- FastJSON2 2.0.43

### 前端技术
- Vue.js 2.7.14
- Element UI 2.15.14
- ECharts 5.4.3
- Axios 1.6.2

## 数据库设计

项目包含11张数据表，实现了1v1、1vN、NvM三种关系：

### 表结构
1. **users** - 用户表
2. **admins** - 管理员表
3. **categories** - 商品分类表
4. **products** - 商品表
5. **shopping_cart** - 购物车表
6. **orders** - 订单表
7. **order_items** - 订单详情表
8. **product_reviews** - 商品评价表
9. **shipping_addresses** - 收货地址表
10. **coupons** - 优惠券表
11. **user_coupon** - 用户优惠券表

### 关系说明
- **1v1关系**: 订单-用户，用户-默认地址
- **1vN关系**: 分类-商品，用户-订单，订单-订单详情，商品-评价
- **NvM关系**: 用户-优惠券（通过user_coupon中间表）

## 功能模块

### 用户端功能（20+个功能）
1. 用户注册
2. 用户登录
3. 商品浏览
4. 商品搜索
5. 商品详情查看
6. 热门商品推荐
7. 新品推荐
8. 相关商品推荐
9. 添加到购物车
10. 购物车管理
11. 修改购物车数量
12. 删除购物车商品
13. 清空购物车
14. 收货地址管理
15. 添加收货地址
16. 设置默认地址
17. 创建订单
18. 订单支付
19. 取消订单
20. 确认收货
21. 订单列表查看
22. 商品评价
23. 优惠券领取
24. 个人信息修改
25. 密码修改

### 管理员端功能
1. 管理员登录
2. 数据统计可视化
3. 商品管理（增删改查）
4. 订单管理
5. 用户管理
6. 分类管理
7. 优惠券管理

## 项目结构

```
qmjava/
├── src/
│   ├── main/
│   │   ├── java/com/example/qmjava/
│   │   │   ├── common/              # 通用类
│   │   │   │   ├── Result.java      # 统一返回结果
│   │   │   │   └── PageResult.java  # 分页结果
│   │   │   ├── config/              # 配置类
│   │   │   │   ├── MybatisPlusConfig.java
│   │   │   │   └── WebConfig.java
│   │   │   ├── controller/          # 控制器层
│   │   │   ├── entity/              # 实体类
│   │   │   ├── mapper/              # 数据访问层
│   │   │   ├── service/             # 业务逻辑层
│   │   │   │   └── impl/            # 业务逻辑实现
│   │   │   ├── util/                # 工具类
│   │   │   │   └── JwtUtil.java
│   │   │   └── QmjavaApplication.java
│   │   └── resources/
│   │       ├── static/              # 静态资源
│   │       │   ├── css/             # 样式文件
│   │       │   ├── js/              # JavaScript文件
│   │       │   │   ├── api.js       # API接口
│   │       │   │   ├── app.js       # 主应用
│   │       │   │   └── components/  # Vue组件
│   │       │   └── index.html       # 主页面
│   │       ├── sql/                 # SQL脚本
│   │       │   └── schema.sql
│   │       └── application.properties
```

## 快速开始

### 1. 数据库配置
1. 创建MySQL数据库
2. 执行 `src/main/resources/sql/schema.sql` 脚本
3. 修改 `application.properties` 中的数据库连接信息

### 2. 启动后端
```bash
cd qmjava
mvn spring-boot:run
```

### 3. 访问前端
在浏览器中访问: `http://localhost:8080`

### 4. 默认账号
- 管理员账号: `admin` / `admin`

## 中国风设计特色

### 配色方案
- 主色调: 中国红 (#C41E3A)
- 辅助色: 深红 (#8B0000)
- 点缀色: 金色 (#D4AF37)
- 背景色: 米色 (#FDF5E6)

### 设计元素
- 传统中文字体（楷体、宋体）
- 中国结、灯笼等传统图案
- 渐变色彩搭配
- 优雅的动画效果

### 界面特点
- 响应式设计，支持多终端
- 流畅的页面切换
- 精美的卡片式布局
- 清晰的信息层级

## API接口文档

### 用户相关
- POST `/api/user/register` - 用户注册
- POST `/api/user/login` - 用户登录
- GET `/api/user/info` - 获取用户信息
- PUT `/api/user/info` - 更新用户信息
- PUT `/api/user/password` - 修改密码

### 商品相关
- GET `/api/product/list` - 商品列表
- GET `/api/product/detail/{id}` - 商品详情
- GET `/api/product/hot` - 热门商品
- GET `/api/product/new` - 新品推荐

### 购物车相关
- GET `/api/cart/list` - 购物车列表
- POST `/api/cart/add` - 添加到购物车
- PUT `/api/cart/update` - 更新购物车
- DELETE `/api/cart/remove/{productId}` - 删除购物车商品

### 订单相关
- POST `/api/order/create` - 创建订单
- GET `/api/order/list` - 订单列表
- PUT `/api/order/pay/{orderId}` - 支付订单
- PUT `/api/order/cancel/{orderId}` - 取消订单

### 管理员相关
- POST `/api/admin/login` - 管理员登录
- GET `/api/order/statistics` - 订单统计

## 开发环境要求

- JDK 25
- Maven 3.6+
- MySQL 8.0+
- Node.js 14+ (可选，用于前端开发)

## 项目特色

1. **完整的前后端分离架构**
2. **RESTful API设计**
3. **JWT身份认证**
4. **MyBatis-Plus简化数据库操作**
5. **Druid数据库连接池**
6. **响应式中国风UI设计**
7. **ECharts数据可视化**
8. **完整的购物流程**
9. **订单状态管理**
10. **优惠券系统**

## 注意事项

1. 请确保MySQL服务已启动
2. 修改数据库连接信息后重启应用
3. 首次运行需要执行数据库脚本
4. 建议使用Chrome或Edge浏览器访问

## 作者信息

- 项目名称: 青茗商城
- 学号: 2023590527
- 完成时间: 2024年

## 许可证

本项目仅供学习交流使用。