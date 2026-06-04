Vue.component('checkout-page', {
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
                    <h2>确认订单</h2>
                </div>

                <div class="chinese-card" style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 20px; color: var(--secondary-color); font-family: 'KaiTi', 'SimSun', serif;">收货地址</h3>
                    <div v-if="addresses.length > 0">
                        <div v-for="address in addresses" :key="address.id" 
                             @click="selectAddress(address)"
                             :class="['address-card', { 'selected': selectedAddress?.id === address.id }]">
                            <div style="display: flex; justify-content: space-between;">
                                <div>
                                    <span style="font-weight: bold;">{{ address.receiverName }}</span>
                                    <span style="margin-left: 15px;">{{ address.receiverPhone }}</span>
                                </div>
                                <span v-if="address.isDefault" class="chinese-tag" style="background: var(--primary-color); color: white;">默认</span>
                            </div>
                            <div style="color: var(--light-text); margin-top: 5px;">
                                {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detailedAddress }}
                            </div>
                        </div>
                    </div>
                    <div v-else style="text-align: center; padding: 40px; color: var(--light-text);">
                        暂无收货地址，请先添加收货地址
                    </div>
                </div>

                <div class="chinese-card" style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 20px; color: var(--secondary-color); font-family: 'KaiTi', 'SimSun', serif;">支付方式</h3>
                    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                        <div v-for="method in paymentMethods" :key="method.id"
                             @click="selectedPayment = method.id"
                             :class="['payment-option', { 'selected': selectedPayment === method.id }]">
                            <span style="font-size: 24px;">{{ method.icon }}</span>
                            <span>{{ method.name }}</span>
                        </div>
                    </div>
                </div>

                <div class="chinese-card" style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 20px; color: var(--secondary-color); font-family: 'KaiTi', 'SimSun', serif;">订单备注</h3>
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入订单备注（选填）"
                        v-model="remark">
                    </el-input>
                </div>

                <div class="chinese-card">
                    <h3 style="margin-bottom: 20px; color: var(--secondary-color); font-family: 'KaiTi', 'SimSun', serif;">商品信息</h3>
                    <table class="chinese-table">
                        <thead>
                            <tr>
                                <th>商品信息</th>
                                <th>单价</th>
                                <th>数量</th>
                                <th>小计</th>
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
                                        </div>
                                    </div>
                                </td>
                                <td>¥{{ item.product?.price }}</td>
                                <td>{{ item.quantity }}</td>
                                <td style="color: var(--primary-color); font-weight: bold;">¥{{ (item.product?.price * item.quantity).toFixed(2) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="chinese-card" style="margin-top: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span>商品总数</span>
                        <span>{{ totalQuantity }} 件</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span>运费</span>
                        <span>¥{{ shippingFee }}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span>优惠</span>
                        <span style="color: #e74c3c;">-¥{{ discount }}</span>
                    </div>
                    <hr style="border: none; border-top: 1px solid var(--border-color); margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="font-size: 18px;">订单总额</span>
                        <span style="font-size: 28px; color: var(--primary-color); font-weight: bold;">¥{{ finalTotal }}</span>
                    </div>
                </div>

                <div style="text-align: right; margin-top: 20px;">
                    <button class="chinese-btn" @click="showConfirmModal = true" :disabled="!canSubmit">
                        提交订单
                    </button>
                </div>
            </div>

            <el-dialog title="确认订单" :visible.sync="showConfirmModal" width="600px" :close-on-click-modal="false">
                <div style="padding: 20px;">
                    <div style="margin-bottom: 20px;">
                        <h4>收货信息</h4>
                        <div v-if="selectedAddress">
                            <p><strong>{{ selectedAddress.receiverName }}</strong> {{ selectedAddress.receiverPhone }}</p>
                            <p>{{ selectedAddress.province }} {{ selectedAddress.city }} {{ selectedAddress.district }} {{ selectedAddress.detailedAddress }}</p>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4>支付方式</h4>
                        <p>{{ getPaymentName(selectedPayment) }}</p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h4>商品清单</h4>
                        <div v-for="item in cartItems" :key="item.id" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>{{ item.product?.name }} x {{ item.quantity }}</span>
                            <span>¥{{ (item.product?.price * item.quantity).toFixed(2) }}</span>
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h4>订单金额</h4>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>商品金额</span>
                            <span>¥{{ cartTotal }}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>运费</span>
                            <span>¥{{ shippingFee }}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>优惠</span>
                            <span style="color: #e74c3c;">-¥{{ discount }}</span>
                        </div>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 10px 0;">
                        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;">
                            <span>实付金额</span>
                            <span style="color: var(--primary-color);">¥{{ finalTotal }}</span>
                        </div>
                    </div>

                    <div v-if="remark" style="margin-bottom: 20px;">
                        <h4>订单备注</h4>
                        <p>{{ remark }}</p>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showConfirmModal = false">取消</el-button>
                    <el-button type="primary" @click="submitOrder" :loading="isSubmitting">
                        {{ isSubmitting ? '提交中...' : '确认提交' }}
                    </el-button>
                </div>
            </el-dialog>
        </div>
    `,
    data() {
        return {
            addresses: [],
            selectedAddress: null,
            cartItems: [],
            cartTotal: '0.00',
            remark: '',
            isSubmitting: false,
            showConfirmModal: false,
            selectedPayment: 'wechat',
            paymentMethods: [
                { id: 'wechat', name: '微信支付', icon: '💳' },
                { id: 'alipay', name: '支付宝', icon: '📱' },
                { id: 'bank', name: '银行卡', icon: '🏦' }
            ],
            shippingFee: '0.00',
            discount: '0.00'
        };
    },
    computed: {
        totalQuantity() {
            return this.cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        },
        finalTotal() {
            const total = parseFloat(this.cartTotal) + parseFloat(this.shippingFee) - parseFloat(this.discount);
            return total.toFixed(2);
        },
        canSubmit() {
            const result = this.selectedAddress && 
                          this.cartItems && 
                          this.cartItems.length > 0;
            console.log('canSubmit:', result, 
                        '- selectedAddress:', !!this.selectedAddress, 
                        '- cartItems:', this.cartItems?.length || 0);
            return result;
        }
    },
    mounted() {
        this.loadAddresses();
        this.loadCart();
    },
    methods: {
        async loadAddresses() {
            const token = localStorage.getItem('token');
            console.log('加载地址 - token:', token ? '存在' : '不存在');
            if (!token) {
                this.$message.warning('请先登录');
                this.$emit('navigate', 'home');
                return;
            }
            try {
                const response = await api.address.getList(token);
                console.log('地址列表响应:', response);
                this.addresses = response.data || [];
                console.log('地址列表:', this.addresses);
                const defaultAddress = this.addresses.find(a => a.isDefault);
                if (defaultAddress) {
                    this.selectedAddress = defaultAddress;
                    console.log('默认地址:', this.selectedAddress);
                } else if (this.addresses.length > 0) {
                    this.selectedAddress = this.addresses[0];
                    console.log('选择第一个地址:', this.selectedAddress);
                }
            } catch (error) {
                console.error('加载地址失败:', error);
                this.$message.error('加载收货地址失败');
            }
        },
        async loadCart() {
            const token = localStorage.getItem('token');
            console.log('加载购物车 - token:', token ? '存在' : '不存在');
            if (!token) return;
            try {
                const response = await api.cart.getList(token);
                console.log('购物车响应:', response);
                this.cartItems = response.data || [];
                console.log('购物车列表:', this.cartItems);
                await this.loadCartTotal();
            } catch (error) {
                console.error('加载购物车失败:', error);
                this.$message.error('加载购物车失败');
            }
        },
        async loadCartTotal() {
            const token = localStorage.getItem('token');
            try {
                const response = await api.cart.getTotal(token);
                this.cartTotal = response.data ? response.data.toFixed(2) : '0.00';
            } catch (error) {
                console.error('加载购物车总价失败:', error);
            }
        },
        selectAddress(address) {
            this.selectedAddress = address;
        },
        getPaymentName(paymentId) {
            const method = this.paymentMethods.find(m => m.id === paymentId);
            return method ? method.name : '未知支付方式';
        },
        async submitOrder() {
            if (!this.selectedAddress) {
                this.$message.warning('请选择收货地址');
                return;
            }
            if (!this.selectedAddress.id) {
                this.$message.warning('收货地址ID无效');
                return;
            }
            if (!this.cartItems || this.cartItems.length === 0) {
                this.$message.warning('购物车为空，请先添加商品');
                return;
            }
            
            const hasValidProducts = this.cartItems.some(item => item.product && item.product.id);
            if (!hasValidProducts) {
                this.$message.warning('购物车中没有有效商品');
                return;
            }
            
            const token = localStorage.getItem('token');
            if (!token) {
                this.$message.warning('请先登录');
                return;
            }
            
            this.isSubmitting = true;
            this.showConfirmModal = false;
            
            try {
                console.log('提交订单信息:', {
                    addressId: this.selectedAddress.id,
                    remark: this.remark,
                    paymentMethod: this.selectedPayment,
                    cartItemCount: this.cartItems.length,
                    totalAmount: this.finalTotal
                });
                
                const response = await api.order.create(token, {
                    addressId: this.selectedAddress.id,
                    remark: this.remark,
                    paymentMethod: this.selectedPayment
                });
                
                console.log('订单创建响应:', response);
                
                if (response && response.code === 200) {
                    this.$message.success('订单创建成功');
                    try {
                        if (typeof eventBus !== 'undefined') {
                            eventBus.$emit('orderCreated', response.data);
                        }
                    } catch (e) {
                        console.log('eventBus not available, skipping emit');
                    }
                    setTimeout(() => {
                        this.$emit('navigate', 'user-center', { tab: 'orders' });
                    }, 1500);
                } else {
                    const errorMsg = response?.message || '订单创建失败';
                    console.error('订单创建失败:', errorMsg);
                    this.$message.error(errorMsg);
                }
            } catch (error) {
                console.error('订单创建异常:', error);
                let errorMsg = '订单创建失败，请稍后重试';
                
                if (error.response) {
                    console.error('HTTP状态:', error.response.status);
                    console.error('响应数据:', error.response.data);
                    errorMsg = error.response.data?.message || 
                              error.response.statusText || 
                              errorMsg;
                } else if (error.message) {
                    errorMsg = error.message;
                }
                
                if (errorMsg.includes('Network Error')) {
                    errorMsg = '网络连接失败，请检查网络后重试';
                }
                
                this.$message.error(errorMsg);
            } finally {
                this.isSubmitting = false;
            }
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
