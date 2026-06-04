Vue.component('category-page', {
    props: ['categoryId'],
    template: `
        <div>
            <header class="chinese-header">
                <div class="header-content">
                    <div class="logo">优选商城</div>
                    <nav class="nav-menu">
                        <div class="nav-item" :class="{ active: categoryId === 0 }" @click="goToCategory(0)">首页</div>
                        <div class="nav-item" :class="{ active: categoryId === 1 }" @click="goToCategory(1)">电子产品</div>
                        <div class="nav-item" :class="{ active: categoryId === 2 }" @click="goToCategory(2)">服装鞋帽</div>
                        <div class="nav-item" :class="{ active: categoryId === 3 }" @click="goToCategory(3)">食品饮料</div>
                        <div class="nav-item" :class="{ active: categoryId === 4 }" @click="goToCategory(4)">家居用品</div>
                    </nav>
                    <div class="user-actions">
                        <template v-if="isLoggedIn">
                            <div class="user-btn" @click="$emit('navigate', 'user-center')">{{ nickname }}</div>
                            <div class="user-btn" @click="handleLogout">退出</div>
                        </template>
                        <template v-else>
                            <div class="user-btn" @click="$emit('login')">登录</div>
                            <div class="user-btn" @click="$emit('register')">注册</div>
                            <div class="user-btn" @click="$emit('navigate', 'admin-login')">管理员登录</div>
                        </template>
                        <div class="user-btn" @click="$emit('navigate', 'cart')">购物车</div>
                    </div>
                </div>
            </header>

            <div class="chinese-banner" style="min-height: 150px;">
                <h1>{{ categoryName }}</h1>
                <p>{{ categoryDescription }}</p>
            </div>

            <section class="chinese-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div class="chinese-section-title">
                        <h2>{{ categoryName }}商品</h2>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <el-select v-model="sortBy" placeholder="排序方式" style="width: 150px;">
                            <el-option label="默认排序" value="default"></el-option>
                            <el-option label="价格从低到高" value="price_asc"></el-option>
                            <el-option label="价格从高到低" value="price_desc"></el-option>
                            <el-option label="销量优先" value="sales"></el-option>
                        </el-select>
                    </div>
                </div>

                <div v-if="products.length > 0" class="chinese-product-grid category-grid">
                    <div v-for="product in products" :key="product.id" class="chinese-product-card" @click="viewProduct(product.id)">
                        <div class="product-image">
                            <img :src="product.mainImage" alt="商品图片" style="width: 100%; height: 100%; object-fit: cover;">
                            <div class="chinese-tag hot" v-if="product.isHot">热销</div>
                            <div class="chinese-tag new" v-if="product.isNew">新品</div>
                        </div>
                        <div class="product-info">
                            <div class="product-name">{{ product.name }}</div>
                            <div class="product-brand">{{ product.brand }}</div>
                            <div class="product-price">
                                ¥{{ product.price }}
                                <span class="original" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
                            </div>
                            <div class="product-specs">{{ product.specs }}</div>
                        </div>
                    </div>
                </div>

                <div v-else class="empty-state">
                    <div style="font-size: 48px; margin-bottom: 20px;">&#128542;</div>
                    <p>该分类暂无商品</p>
                </div>
            </section>

            <footer class="chinese-footer">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>关于我们</h3>
                        <ul>
                            <li>公司简介</li>
                            <li>企业文化</li>
                            <li>联系我们</li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>客户服务</h3>
                        <ul>
                            <li>帮助中心</li>
                            <li>退换货政策</li>
                            <li>配送说明</li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>关注我们</h3>
                        <ul>
                            <li>微信公众号</li>
                            <li>官方微博</li>
                            <li>抖音账号</li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 优选商城 版权所有</p>
                </div>
            </footer>
        </div>
    `,
    data() {
        return {
            products: [],
            sortBy: 'default',
            categoryList: [
                { id: 0, name: '全部商品', description: '浏览所有精选商品', subCategories: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22] },
                { id: 1, name: '电子产品', description: '数码科技，品质生活', subCategories: [6, 7, 8, 9, 10] },
                { id: 2, name: '服装鞋帽', description: '时尚穿搭，彰显个性', subCategories: [11, 12, 13, 14] },
                { id: 3, name: '食品饮料', description: '美味食品，健康生活', subCategories: [15, 16, 17] },
                { id: 4, name: '家居用品', description: '温馨家居，舒适生活', subCategories: [18, 19, 20] }
            ]
        };
    },
    computed: {
        isLoggedIn() {
            return !!localStorage.getItem('token');
        },
        nickname() {
            const userInfo = localStorage.getItem('userInfo');
            return userInfo ? JSON.parse(userInfo).username : '';
        },
        currentCategory() {
            return this.categoryList.find(c => c.id === parseInt(this.categoryId)) || this.categoryList[0];
        },
        categoryName() {
            return this.currentCategory.name;
        },
        categoryDescription() {
            return this.currentCategory.description;
        }
    },
    async mounted() {
        await this.loadProducts();
    },
    watch: {
        categoryId: async function() {
            await this.loadProducts();
        },
        sortBy: async function() {
            await this.loadProducts();
        }
    },
    methods: {
        async loadProducts() {
            try {
                const category = this.currentCategory;
                const params = {
                    current: 1,
                    size: 50
                };
                
                if (category.id !== 0) {
                    params.categoryIds = category.subCategories.join(',');
                }
                
                const response = await api.product.getList(params);
                let products = response.data.records || [];
                
                products = this.sortProducts(products);
                this.products = products;
            } catch (error) {
                console.error('加载商品失败:', error);
            }
        },
        sortProducts(products) {
            switch (this.sortBy) {
                case 'price_asc':
                    return [...products].sort((a, b) => a.price - b.price);
                case 'price_desc':
                    return [...products].sort((a, b) => b.price - a.price);
                case 'sales':
                    return [...products].sort((a, b) => (b.sales || 0) - (a.sales || 0));
                default:
                    return products;
            }
        },
        goToCategory(id) {
            if (id === 0) {
                this.$emit('navigate', 'home');
            } else {
                this.$emit('navigate', 'category', { categoryId: id });
            }
        },
        viewProduct(productId) {
            this.$emit('navigate', 'product-detail', { productId });
        },
        async handleLogout() {
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            this.$message.success('退出成功');
            this.$emit('navigate', 'home');
        }
    }
});
