Vue.component('home-page', {
    template: `
        <div>
            <header class="chinese-header">
                <div class="header-content">
                    <div class="logo">优选商城</div>
                    <nav class="nav-menu">
                        <div class="nav-item" @click="$emit('navigate', 'home')">首页</div>
                        <div class="nav-item" @click="goToCategory(1)">电子产品</div>
                        <div class="nav-item" @click="goToCategory(2)">服装鞋帽</div>
                        <div class="nav-item" @click="goToCategory(3)">食品饮料</div>
                        <div class="nav-item" @click="goToCategory(4)">家居用品</div>
                    </nav>
                    <div class="user-actions">
                        <template v-if="isLoggedIn">
                            <div class="user-btn" @click="$emit('navigate', 'user-center')">个人信息</div>
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

            <div class="chinese-banner">
                <h1>优选商城 · 传承东方美学</h1>
                <p>精选好物，品质生活，从这里开始</p>
                <button class="chinese-btn" @click="scrollToProducts">立即选购</button>
            </div>

            <section class="chinese-section" id="products">
                <div class="chinese-section-title">
                    <h2>热门商品</h2>
                </div>
                <div class="chinese-product-grid">
                    <div v-for="product in hotProducts" :key="product.id" class="chinese-product-card" @click="viewProduct(product.id)">
                        <div class="product-image"><img :src="product.mainImage" alt="商品图片" style="width: 100%; height: 100%; object-fit: cover;"></div>
                        <div class="product-info">
                            <div class="product-name">{{ product.name }}</div>
                            <div class="product-price">
                                ¥{{ product.price }}
                                <span class="original" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
                            </div>
                            <div class="chinese-tag hot" v-if="product.isHot">热销</div>
                            <div class="chinese-tag new" v-if="product.isNew">新品</div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="chinese-section">
                <div class="chinese-section-title">
                    <h2>新品上市</h2>
                </div>
                <div class="chinese-product-grid">
                    <div v-for="product in newProducts" :key="product.id" class="chinese-product-card" @click="viewProduct(product.id)">
                        <div class="product-image"><img :src="product.mainImage" alt="商品图片" style="width: 100%; height: 100%; object-fit: cover;"></div>
                        <div class="product-info">
                            <div class="product-name">{{ product.name }}</div>
                            <div class="product-price">
                                ¥{{ product.price }}
                                <span class="original" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
                            </div>
                            <div class="chinese-tag new">新品</div>
                        </div>
                    </div>
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
                            <li>售后服务</li>
                            <li>配送说明</li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>商家合作</h3>
                        <ul>
                            <li>商家入驻</li>
                            <li>广告合作</li>
                            <li>友情链接</li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>关注我们</h3>
                        <ul>
                            <li>微信公众号</li>
                            <li>微博</li>
                            <li>抖音</li>
                        </ul>
                    </div>
                </div>
                <div class="copyright">
                    © 2024 青茗商城 版权所有 | 2023590527
                </div>
            </footer>
        </div>
    `,
    data() {
        return {
            hotProducts: [],
            newProducts: [],
            isLoggedIn: false,
            nickname: '用户'
        };
    },
    mounted() {
        this.checkLoginStatus();
        this.loadHotProducts();
        this.loadNewProducts();
        
        eventBus.$on('userLoggedIn', (user) => {
            this.isLoggedIn = true;
            this.nickname = user.nickname || user.username || '用户';
        });
        
        eventBus.$on('userLoggedOut', () => {
            this.isLoggedIn = false;
            this.nickname = '用户';
        });
    },
    methods: {
        async loadHotProducts() {
            try {
                const response = await api.product.getHot(8);
                if (response.code === 200) {
                    this.hotProducts = response.data;
                }
            } catch (error) {
                console.error('加载热门商品失败:', error);
            }
        },
        async loadNewProducts() {
            try {
                const response = await api.product.getNew(8);
                if (response.code === 200) {
                    this.newProducts = response.data;
                }
            } catch (error) {
                console.error('加载新品失败:', error);
            }
        },
        viewProduct(productId) {
            this.$emit('navigate', 'product-detail', { productId });
        },
        goToCategory(categoryId) {
            this.$emit('navigate', 'category', { categoryId });
        },
        scrollToProducts() {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        },
        getProductEmoji(categoryId) {
            const emojis = {
                6: '📱',
                7: '💻',
                8: '📱',
                9: '👔',
                10: '👗',
                11: '👟'
            };
            return emojis[categoryId] || '🎁';
        },
        checkLoginStatus() {
            const token = localStorage.getItem('token');
            const userInfo = localStorage.getItem('userInfo');
            if (token && userInfo) {
                this.isLoggedIn = true;
                try {
                    const user = JSON.parse(userInfo);
                    this.nickname = user.nickname || user.username || '用户';
                } catch (e) {
                    this.nickname = '用户';
                }
            } else {
                this.isLoggedIn = false;
            }
        },
        handleLogout() {
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            this.isLoggedIn = false;
            this.nickname = '用户';
            eventBus.$emit('userLoggedOut');
            this.$message.success('退出成功');
        }
    }
});