Vue.component('product-detail-page', {
    props: ['productId'],
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

            <div class="product-detail-container" v-if="product">
                <div class="product-main">
                    <div class="product-image-section">
                        <div class="main-image-wrapper">
                            <div class="main-image">
                                <img :src="product.mainImage" alt="商品图片" style="width: 100%; height: 100%; object-fit: contain;">
                            </div>
                            <div class="image-decoration">
                                <div class="corner-ornament top-left"></div>
                                <div class="corner-ornament top-right"></div>
                                <div class="corner-ornament bottom-left"></div>
                                <div class="corner-ornament bottom-right"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="product-info-section">
                        <div class="product-title-wrapper">
                            <h1 class="product-title">{{ product.name }}</h1>
                            <div class="product-tags">
                                <span class="chinese-tag hot" v-if="product.isHot">🔥 热销</span>
                                <span class="chinese-tag new" v-if="product.isNew">✨ 新品</span>
                                <span class="chinese-tag discount" v-if="product.discount">💰 特惠</span>
                            </div>
                        </div>
                        
                        <div class="product-description">
                            <p>{{ product.description }}</p>
                        </div>
                        
                        <div class="price-section">
                            <div class="current-price">
                                <span class="currency">¥</span>
                                <span class="amount">{{ displayPrice.toFixed(2) }}</span>
                            </div>
                            <div class="original-price" v-if="product.originalPrice">
                                原价 ¥{{ originalDisplayPrice.toFixed(2) }}
                            </div>
                            <div class="discount-badge" v-if="priceAdjustment !== 0">
                                <span v-if="priceAdjustment > 0" style="color: #d32f2f;">+¥{{ priceAdjustment.toFixed(2) }}</span>
                                <span v-else style="color: #388e3c;">-¥{{ Math.abs(priceAdjustment).toFixed(2) }}</span>
                            </div>
                        </div>
                        
                        <div class="product-stats">
                            <div class="stat-item">
                                <span class="stat-label">库存</span>
                                <span class="stat-value" :class="{ 'low-stock': availableStock < 10 }">{{ availableStock }}件</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">销量</span>
                                <span class="stat-value">{{ product.sales }}件</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">好评率</span>
                                <span class="stat-value">{{ positiveRate }}%</span>
                            </div>
                        </div>
                        
                        <div class="spec-section" v-if="specGroups.length > 0">
                            <div class="spec-item" v-for="(specGroup, index) in specGroups" :key="specGroup.name">
                                <span class="spec-label">{{ specGroup.name }}：</span>
                                <div class="spec-options">
                                    <button 
                                        v-for="spec in specGroup.values" 
                                        :key="spec.value"
                                        :class="['spec-option', { 
                                            active: selectedSpecs[specGroup.name] === spec.value,
                                            'out-of-stock': spec.stock === 0
                                        }]"
                                        :style="spec.style"
                                        :disabled="spec.stock === 0"
                                        @click="selectSpec(specGroup.name, spec)"
                                    >
                                        <span class="spec-label-text">{{ spec.label }}</span>
                                        <span v-if="spec.priceAdjust !== 0" class="spec-price-tag">
                                            <span v-if="spec.priceAdjust > 0">+¥{{ spec.priceAdjust.toFixed(0) }}</span>
                                            <span v-else>¥{{ spec.priceAdjust.toFixed(0) }}</span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div class="selected-summary" v-if="hasSelectedAllSpecs">
                                <span class="summary-label">已选：</span>
                                <span class="summary-value">{{ getSelectedSummary }}</span>
                            </div>
                        </div>

                        <div class="quantity-section">
                            <span class="quantity-label">购买数量：</span>
                            <div class="quantity-control">
                                <button class="qty-btn" @click="decreaseQty" :disabled="quantity <= 1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                                <input type="number" v-model.number="quantity" :min="1" :max="availableStock" class="qty-input" />
                                <button class="qty-btn" @click="increaseQty" :disabled="quantity >= availableStock">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="action-btn cart-btn" @click="addToCart">
                                <span class="btn-icon">🛒</span>
                                <span class="btn-text">加入购物车</span>
                            </button>
                            <button class="action-btn buy-btn" @click="buyNow">
                                <span class="btn-icon">⚡</span>
                                <span class="btn-text">立即购买</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="product-tabs">
                    <div class="tabs-header">
                        <div 
                            class="tab-item" 
                            :class="{ active: activeTab === 'details' }"
                            @click="activeTab = 'details'"
                        >商品详情</div>
                        <div 
                            class="tab-item" 
                            :class="{ active: activeTab === 'params' }"
                            @click="activeTab = 'params'"
                        >商品参数</div>
                        <div 
                            class="tab-item" 
                            :class="{ active: activeTab === 'reviews' }"
                            @click="activeTab = 'reviews'"
                        >用户评价 ({{ reviews.length }})</div>
                    </div>
                    
                    <div class="tabs-content">
                        <div v-show="activeTab === 'details'" class="tab-panel">
                            <div class="detail-section">
                                <h3 class="section-title">📋 商品介绍</h3>
                                <p class="detail-content">{{ product.detail || '暂无详细介绍' }}</p>
                            </div>
                            <div class="detail-section">
                                <h3 class="section-title">🎯 商品特点</h3>
                                <ul class="feature-list">
                                    <li>品质保证，正品行货</li>
                                    <li>七天无理由退换</li>
                                    <li>全国包邮配送</li>
                                    <li>专属客服服务</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div v-show="activeTab === 'params'" class="tab-panel">
                            <div class="params-table">
                                <div class="param-row">
                                    <span class="param-label">商品编号</span>
                                    <span class="param-value">{{ product.id || 'N/A' }}</span>
                                </div>
                                <div class="param-row">
                                    <span class="param-label">商品分类</span>
                                    <span class="param-value">{{ categoryName }}</span>
                                </div>
                                <div class="param-row">
                                    <span class="param-label">品牌</span>
                                    <span class="param-value">{{ product.brand || 'N/A' }}</span>
                                </div>
                                <div class="param-row">
                                    <span class="param-label">规格</span>
                                    <span class="param-value">{{ product.specs || 'N/A' }}</span>
                                </div>
                                <div class="param-row">
                                    <span class="param-label">产地</span>
                                    <span class="param-value">{{ product.origin || 'N/A' }}</span>
                                </div>
                                <div class="param-row">
                                    <span class="param-label">保质期</span>
                                    <span class="param-value">{{ product.expiryDate || 'N/A' }}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div v-show="activeTab === 'reviews'" class="tab-panel">
                            <div v-if="reviews.length > 0">
                                <div v-for="review in reviews" :key="review.id" class="review-card">
                                    <div class="review-header">
                                        <div class="reviewer-info">
                                            <div class="reviewer-avatar">👤</div>
                                            <span class="reviewer-name">用户{{ review.userId }}</span>
                                        </div>
                                        <div class="review-rating">
                                            <span>{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</span>
                                        </div>
                                    </div>
                                    <div class="review-content">{{ review.content }}</div>
                                    <div class="review-date">{{ review.createTime }}</div>
                                </div>
                            </div>
                            <div v-else class="empty-reviews">
                                <div class="empty-icon">💭</div>
                                <p>暂无评价，快来做第一个评价的人吧！</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="related-section">
                    <div class="section-header">
                        <h2 class="section-title">🎁 相关推荐</h2>
                    </div>
                    <div class="related-products">
                        <div v-for="item in relatedProducts" :key="item.id" class="related-product-card" @click="viewProduct(item.id)">
                            <div class="related-product-image">{{ getProductEmoji(item.categoryId) }}</div>
                            <div class="related-product-name">{{ item.name }}</div>
                            <div class="related-product-price">¥{{ item.price }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="loading-state">
                <div class="loading-spinner">⏳</div>
                <p>加载中...</p>
            </div>
        </div>
    `,
    data() {
        return {
            product: null,
            quantity: 1,
            relatedProducts: [],
            reviews: [],
            activeTab: 'details',
            positiveRate: 100,
            categoryName: '',
            productSpecs: [],
            specGroups: [],
            selectedSpecs: {}
        };
    },
    computed: {
        displayPrice() {
            let price = this.product?.price || 0;
            return price + this.priceAdjustment;
        },
        originalDisplayPrice() {
            let price = this.product?.originalPrice || this.product?.price || 0;
            return price + this.priceAdjustment;
        },
        priceAdjustment() {
            let adjustment = 0;
            for (const specName in this.selectedSpecs) {
                const specValue = this.selectedSpecs[specName];
                const spec = this.findSpec(specName, specValue);
                if (spec && spec.priceAdjust) {
                    adjustment += spec.priceAdjust;
                }
            }
            return adjustment;
        },
        availableStock() {
            if (this.productSpecs.length === 0) {
                return this.product?.stock || 0;
            }
            const selectedValues = Object.values(this.selectedSpecs);
            if (selectedValues.length === 0) {
                return this.product?.stock || 0;
            }
            let minStock = Infinity;
            for (const specName in this.selectedSpecs) {
                const spec = this.findSpec(specName, this.selectedSpecs[specName]);
                if (spec && spec.stock !== undefined) {
                    minStock = Math.min(minStock, spec.stock);
                }
            }
            return minStock === Infinity ? this.product?.stock || 0 : minStock;
        },
        hasSelectedAllSpecs() {
            return this.specGroups.length > 0 && 
                   this.specGroups.every(group => this.selectedSpecs[group.name]);
        },
        getSelectedSummary() {
            return this.specGroups
                .map(group => `${group.name}：${this.selectedSpecs[group.name]}`)
                .join('；');
        },
        selectedSpecIds() {
            const ids = [];
            for (const specName in this.selectedSpecs) {
                const spec = this.findSpec(specName, this.selectedSpecs[specName]);
                if (spec && spec.id) {
                    ids.push(spec.id);
                }
            }
            return ids.join(',');
        }
    },
    watch: {
        productId: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.loadProductDetail();
                    this.loadProductSpecs();
                    this.loadRelatedProducts();
                    this.loadReviews();
                }
            }
        }
    },
    methods: {
        async loadProductDetail() {
            try {
                const response = await api.product.getDetail(this.productId);
                if (response.code === 200) {
                    this.product = response.data;
                    this.updateCategoryName(this.product.categoryId);
                    this.calculatePositiveRate();
                }
            } catch (error) {
                console.error('加载商品详情失败:', error);
                this.$message.error('加载商品详情失败');
            }
        },
        async loadProductSpecs() {
            try {
                const response = await fetch(`/api/product-specs/product/${this.productId}`);
                const result = await response.json();
                if (result.code === 200 && result.data) {
                    this.productSpecs = result.data;
                    this.processSpecs();
                }
            } catch (error) {
                console.error('加载商品规格失败:', error);
                this.productSpecs = [];
            }
        },
        processSpecs() {
            const specMap = new Map();
            this.productSpecs.forEach(spec => {
                if (!specMap.has(spec.specName)) {
                    specMap.set(spec.specName, []);
                }
                specMap.get(spec.specName).push({
                    id: spec.id,
                    label: spec.specValue,
                    value: spec.specValue,
                    priceAdjust: spec.priceAdjust,
                    stock: spec.stock,
                    style: this.getSpecStyle(spec)
                });
            });
            this.specGroups = Array.from(specMap.entries()).map(([name, values]) => ({
                name,
                values: this.deduplicateSpecs(values)
            }));
            this.specGroups.forEach(group => {
                if (group.values.length > 0) {
                    this.$set(this.selectedSpecs, group.name, group.values[0].value);
                }
            });
        },
        deduplicateSpecs(specs) {
            const seen = new Map();
            specs.forEach(spec => {
                if (!seen.has(spec.value)) {
                    seen.set(spec.value, spec);
                } else {
                    const existing = seen.get(spec.value);
                    existing.stock = (existing.stock || 0) + (spec.stock || 0);
                }
            });
            return Array.from(seen.values());
        },
        getSpecStyle(spec) {
            const colorMap = {
                '曜石黑': { backgroundColor: '#1a1a1a', color: '#fff' },
                '白沙银': { backgroundColor: '#e8e8e8', color: '#333' },
                '南糯紫': { backgroundColor: '#8b5cf6', color: '#fff' },
                '雅川青': { backgroundColor: '#10b981', color: '#fff' },
                '黑色': { backgroundColor: '#1f2937', color: '#fff' },
                '白色': { backgroundColor: '#f9fafb', color: '#111827' },
                '银色': { backgroundColor: '#e5e7eb', color: '#374151' },
                '灰色': { backgroundColor: '#6b7280', color: '#fff' },
                '粉色': { backgroundColor: '#fce7f3', color: '#be185d' },
                '蓝色': { backgroundColor: '#dbeafe', color: '#1e40af' },
                '金色': { backgroundColor: '#fef3c7', color: '#92400e' },
                '天蓝色': { backgroundColor: '#e0f2fe', color: '#0369a1' },
                '绿色': { backgroundColor: '#d1fae5', color: '#047857' },
                '午夜色': { backgroundColor: '#1f2937', color: '#fff' },
                '星光色': { backgroundColor: '#fef3c7', color: '#92400e' },
                '深空黑色': { backgroundColor: '#0f172a', color: '#fff' }
            };
            return colorMap[spec.specValue] || null;
        },
        findSpec(specName, specValue) {
            return this.productSpecs.find(
                s => s.specName === specName && s.specValue === specValue
            );
        },
        selectSpec(specName, spec) {
            if (spec.stock === 0) {
                this.$message.warning('该规格暂时缺货');
                return;
            }
            this.$set(this.selectedSpecs, specName, spec.value);
            this.$nextTick(() => {
                const btn = event.target.closest('.spec-option');
                if (btn) {
                    btn.classList.add('click-animation');
                    setTimeout(() => btn.classList.remove('click-animation'), 300);
                }
            });
        },
        async loadRelatedProducts() {
            try {
                const response = await api.product.getRelated(this.product?.categoryId, this.productId, 6);
                if (response.code === 200) {
                    this.relatedProducts = response.data;
                }
            } catch (error) {
                console.error('加载相关商品失败:', error);
            }
        },
        async loadReviews() {
            try {
                const response = await api.review.getByProduct(this.productId);
                if (response.code === 200) {
                    this.reviews = response.data;
                    this.calculatePositiveRate();
                }
            } catch (error) {
                console.error('加载评价失败:', error);
            }
        },
        updateCategoryName(categoryId) {
            const categories = {
                6: '手机数码',
                7: '电脑办公',
                8: '智能设备',
                9: '男装',
                10: '女装',
                11: '鞋靴',
                12: '休闲食品',
                13: '生鲜果蔬',
                14: '酒水饮料',
                15: '家居用品',
                16: '家具装饰',
                17: '家纺床品'
            };
            this.categoryName = categories[categoryId] || '其他';
        },
        calculatePositiveRate() {
            if (this.reviews.length === 0) {
                this.positiveRate = 100;
                return;
            }
            const positiveCount = this.reviews.filter(r => r.rating >= 4).length;
            this.positiveRate = Math.round((positiveCount / this.reviews.length) * 100);
        },
        decreaseQty() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        },
        increaseQty() {
            if (this.quantity < this.availableStock) {
                this.quantity++;
            }
        },
        async addToCart() {
            const token = localStorage.getItem('token');
            if (!token) {
                this.$message.warning('请先登录');
                return;
            }
            
            if (this.specGroups.length > 0 && !this.hasSelectedAllSpecs) {
                this.$message.warning('请选择完整的商品规格');
                return;
            }
            
            const params = {
                productId: this.productId,
                quantity: this.quantity,
                specIds: this.selectedSpecIds,
                specInfo: this.getSelectedSummary
            };
            
            try {
                await api.cart.add(token, params);
                this.$message.success('添加到购物车成功');
            } catch (error) {
                this.$message.error('添加到购物车失败');
            }
        },
        buyNow() {
            if (this.specGroups.length > 0 && !this.hasSelectedAllSpecs) {
                this.$message.warning('请先选择完整的商品规格');
                return;
            }
            this.addToCart().then(() => {
                this.$emit('navigate', 'cart');
            });
        },
        viewProduct(productId) {
            this.$emit('navigate', 'product-detail', { productId });
        },
        getProductEmoji(categoryId) {
            const emojis = {
                6: '📱',
                7: '💻',
                8: '⌚',
                9: '👔',
                10: '👗',
                11: '👟',
                12: '🍪',
                13: '🍎',
                14: '🍷',
                15: '🏠',
                16: '🛋️',
                17: '🛏️'
            };
            return emojis[categoryId] || '🎁';
        }
    }
});
