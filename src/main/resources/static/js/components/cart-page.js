Vue.component('cart-page', {
    template: `
        <div>
            <header class="chinese-header">
                <div class="header-content">
                    <div class="logo" @click="$emit('navigate', 'home')" style="cursor: pointer;">优选商城</div>
                    <nav class="nav-menu">
                        <div class="nav-item" @click="$emit('navigate', 'home')">首页</div>
                        <div class="nav-item" @click="$emit('navigate', 'cart')">购物车</div>
                    </nav>
                </div>
            </header>

            <div class="chinese-section">
                <div class="chinese-section-title">
                    <h2>我的购物车</h2>
                </div>

                <div v-if="cartItems.length > 0">
                    <div class="chinese-card">
                        <table class="chinese-table">
                            <thead>
                                <tr>
                                    <th>商品信息</th>
                                    <th>单价</th>
                                    <th>数量</th>
                                    <th>小计</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in cartItems" :key="item.id">
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 15px;">
                                            <img :src="item.product?.mainImage" alt="商品图片" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                                            <div>
                                                <div style="font-weight: bold;">{{ item.product?.name }}</div>
                                                <div style="font-size: 12px; color: var(--light-text);">{{ item.product?.brand }}</div>
                                                <div v-if="item.specInfo" class="cart-item-spec">{{ item.specInfo }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>¥{{ item.product?.price }}</td>
                                    <td>
                                        <el-input-number v-model="item.quantity" :min="1" size="small" @change="updateQuantity(item)"></el-input-number>
                                    </td>
                                    <td style="color: var(--primary-color); font-weight: bold;">¥{{ (item.product?.price * item.quantity).toFixed(2) }}</td>
                                    <td>
                                        <el-button type="danger" size="small" @click="removeFromCart(item)">删除</el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="chinese-card" style="margin-top: 20px; text-align: right;">
                        <div style="font-size: 18px; margin-bottom: 15px;">
                            <span>总计：</span>
                            <span style="font-size: 28px; color: var(--primary-color); font-weight: bold;">¥{{ cartTotal }}</span>
                        </div>
                        <button class="chinese-btn" @click="checkout">去结算</button>
                    </div>
                </div>

                <div v-else class="chinese-card" style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">🛒</div>
                    <p style="color: var(--light-text); margin-bottom: 20px;">购物车是空的</p>
                    <button class="chinese-btn" @click="$emit('navigate', 'home')">去购物</button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            cartItems: [],
            cartTotal: 0
        };
    },
    mounted() {
        this.loadCart();
    },
    methods: {
        async loadCart() {
            const token = localStorage.getItem('token');
            if (!token) {
                this.$message.warning('请先登录');
                this.$emit('navigate', 'home');
                return;
            }
            try {
                const result = await api.cart.getList(token);
                if (result.code === 200) {
                    this.cartItems = result.data || [];
                }
                await this.loadCartTotal();
            } catch (error) {
                console.error('加载购物车失败:', error);
            }
        },
        async loadCartTotal() {
            const token = localStorage.getItem('token');
            try {
                const result = await api.cart.getTotal(token);
                if (result.code === 200) {
                    this.cartTotal = result.data ? result.data.toFixed(2) : '0.00';
                }
            } catch (error) {
                console.error('加载购物车总价失败:', error);
            }
        },
        async updateQuantity(item) {
            const token = localStorage.getItem('token');
            try {
                const params = {
                    productId: item.productId,
                    quantity: item.quantity
                };
                if (item.specIds) {
                    params.specIds = item.specIds;
                }
                await api.cart.update(token, params);
                await this.loadCartTotal();
            } catch (error) {
                this.$message.error('更新数量失败');
            }
        },
        async removeFromCart(item) {
            const token = localStorage.getItem('token');
            try {
                const params = { productId: item.productId };
                if (item.specIds) {
                    params.specIds = item.specIds;
                }
                await api.cart.remove(token, params);
                this.$message.success('删除成功');
                await this.loadCart();
            } catch (error) {
                this.$message.error('删除失败');
            }
        },
        checkout() {
            this.$emit('navigate', 'checkout');
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
        }
    }
});