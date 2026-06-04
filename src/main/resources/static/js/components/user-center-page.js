Vue.component('user-center-page', {
    props: ['activeTab'],
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
                <h1>用户中心</h1>
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <div class="chinese-sidebar" style="flex: 0 0 200px;">
                        <div class="sidebar-title">个人中心</div>
                        <div class="sidebar-item" :class="{ active: currentTab === 'profile' }" @click="currentTab = 'profile'">个人信息</div>
                        <div class="sidebar-item" :class="{ active: currentTab === 'orders' }" @click="currentTab = 'orders'">我的订单</div>
                        <div class="sidebar-item" @click="$emit('navigate', 'address-manager')">收货地址</div>
                        <div class="sidebar-item" @click="logout">退出登录</div>
                    </div>

                    <div style="flex: 1; min-width: 300px;">
                        <div v-if="currentTab === 'profile'" class="chinese-card">
                            <h3>个人信息</h3>
                            <el-form :model="userInfo" label-width="80px">
                                <el-form-item label="用户名">
                                    <el-input v-model="userInfo.username" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="昵称">
                                    <el-input v-model="userInfo.nickname"></el-input>
                                </el-form-item>
                                <el-form-item label="邮箱">
                                    <el-input v-model="userInfo.email"></el-input>
                                </el-form-item>
                                <el-form-item label="手机号">
                                    <el-input v-model="userInfo.phone"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="updateUserInfo">保存</el-button>
                                </el-form-item>
                            </el-form>
                        </div>

                        <div v-if="currentTab === 'orders'" class="chinese-card">
                            <h3>我的订单</h3>
                            <div v-if="orders.length > 0">
                                <div v-for="order in orders" :key="order.id" class="order-card">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                                        <div>
                                            <span style="font-weight: bold;">订单号：{{ order.orderNo }}</span>
                                        </div>
                                        <span :class="['order-status', order.status]" style="padding: 4px 12px; border-radius: 4px;">{{ getStatusText(order.status) }}</span>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <div v-if="order.items && order.items.length > 0">
                                            <div v-for="item in order.items" :key="item.id" style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                                                <img v-if="item.product" :src="item.product.mainImage" alt="商品图片" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                                                <div style="flex: 1;">
                                                    <div>{{ item.productName }}</div>
                                                    <div style="font-size: 12px; color: var(--light-text);">¥{{ item.productPrice }} x {{ item.quantity }}</div>
                                                </div>
                                                <div style="font-weight: bold;">¥{{ item.subtotal }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid var(--border-color);">
                                        <div style="display: flex; gap: 20px;">
                                            <span>支付方式：{{ getPaymentText(order.paymentMethod) }}</span>
                                            <span>下单时间：{{ formatDate(order.createTime) }}</span>
                                        </div>
                                        <div>
                                            <span style="font-size: 18px; font-weight: bold; color: var(--primary-color);">¥{{ order.actualAmount }}</span>
                                        </div>
                                    </div>
                                    <div style="display: flex; gap: 10px; margin-top: 15px; justify-content: flex-end;">
                                        <el-button v-if="order.status === 0" size="small" @click="payOrder(order.id)">去支付</el-button>
                                        <el-button v-if="order.status === 1" size="small" @click="confirmOrder(order.id)">确认收货</el-button>
                                        <el-button v-if="order.status === 0" size="small" type="danger" @click="cancelOrder(order.id)">取消订单</el-button>
                                    </div>
                                </div>
                            </div>
                            <div v-else style="text-align: center; padding: 60px 20px;">
                                <div style="font-size: 48px; margin-bottom: 20px;">📦</div>
                                <p style="color: var(--light-text);">暂无订单</p>
                            </div>
                        </div>

                        <div v-if="currentTab === 'addresses'" class="chinese-card">
                            <h3>收货地址</h3>
                            <el-button type="primary" @click="showAddAddress = true" style="margin-bottom: 20px;">添加地址</el-button>
                            <div v-if="addresses.length > 0">
                                <div v-for="address in addresses" :key="address.id" class="chinese-card" style="margin-bottom: 15px;">
                                    <div>{{ address.receiverName }} {{ address.receiverPhone }}</div>
                                    <div>{{ address.province }} {{ address.city }} {{ address.district }} {{ address.detailedAddress }}</div>
                                </div>
                            </div>
                            <div v-else>暂无地址</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            currentTab: 'profile',
            userInfo: {
                username: '',
                nickname: '',
                email: '',
                phone: ''
            },
            orders: [],
            addresses: [],
            showAddAddress: false
        };
    },
    mounted() {
        console.log('user-center-page mounted');
        this.currentTab = this.activeTab || 'profile';
        this.loadUserInfo();
        this.loadOrders();
        this.loadAddresses();
        
        eventBus.$on('orderCreated', (order) => {
            console.log('订单创建成功，刷新订单列表:', order);
            this.loadOrders();
            this.currentTab = 'orders';
        });
    },
    methods: {
        async loadUserInfo() {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const response = await api.user.getInfo(token);
                if (response.code === 200 && response.data) {
                    this.userInfo = {
                        username: response.data.username || '',
                        nickname: response.data.nickname || response.data.username || '',
                        email: response.data.email || '',
                        phone: response.data.phone || ''
                    };
                }
            } catch (error) {
                console.error('加载用户信息失败:', error);
            }
        },
        async updateUserInfo() {
            const token = localStorage.getItem('token');
            try {
                const response = await api.user.updateInfo(token, this.userInfo);
                if (response.code === 200) {
                    this.$message.success('更新成功');
                } else {
                    this.$message.error('更新失败');
                }
            } catch (error) {
                this.$message.error('更新失败');
            }
        },
        async loadOrders() {
            const token = localStorage.getItem('token');
            try {
                const response = await api.order.getList(token, { current: 1, size: 100 });
                this.orders = response.data?.records || [];
            } catch (error) {
                console.error('加载订单失败:', error);
            }
        },
        getStatusText(status) {
            const statusMap = {
                0: '待付款',
                1: '待发货',
                2: '待收货',
                3: '已完成',
                4: '已取消'
            };
            return statusMap[status] || '未知状态';
        },
        getPaymentText(paymentMethod) {
            const paymentMap = {
                'wechat': '微信支付',
                'alipay': '支付宝',
                'bank': '银行卡'
            };
            return paymentMap[paymentMethod] || '未支付';
        },
        formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        async payOrder(orderId) {
            try {
                const response = await api.order.pay(orderId, { paymentMethod: 'wechat' });
                if (response.code === 200) {
                    this.$message.success('支付成功');
                    this.loadOrders();
                } else {
                    this.$message.error(response.message || '支付失败');
                }
            } catch (error) {
                console.error('支付失败:', error);
                this.$message.error('支付失败');
            }
        },
        async confirmOrder(orderId) {
            try {
                const response = await api.order.confirm(orderId);
                if (response.code === 200) {
                    this.$message.success('确认收货成功');
                    this.loadOrders();
                } else {
                    this.$message.error(response.message || '确认收货失败');
                }
            } catch (error) {
                console.error('确认收货失败:', error);
                this.$message.error('确认收货失败');
            }
        },
        async cancelOrder(orderId) {
            this.$confirm('确定要取消订单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await api.order.cancel(orderId);
                    if (response.code === 200) {
                        this.$message.success('订单已取消');
                        this.loadOrders();
                    } else {
                        this.$message.error(response.message || '取消失败');
                    }
                } catch (error) {
                    console.error('取消订单失败:', error);
                    this.$message.error('取消订单失败');
                }
            }).catch(() => {
                this.$message.info('已取消操作');
            });
        },
        async loadAddresses() {
            const token = localStorage.getItem('token');
            try {
                const response = await api.address.getList(token);
                this.addresses = response.data || [];
            } catch (error) {
                console.error('加载地址失败:', error);
            }
        },
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            eventBus.$emit('userLoggedOut');
            this.$message.success('退出成功');
            this.$emit('navigate', 'home');
        }
    }
});