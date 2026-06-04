Vue.component('admin-dashboard', {
    props: ['activeTab'],
    template: `
        <div>
            <header class="chinese-header">
                <div class="header-content">
                    <div class="logo">优选商城 - 管理后台</div>
                    <nav class="nav-menu">
                        <div class="nav-item" @click="currentTab = 'overview'">数据概览</div>
                        <div class="nav-item" @click="currentTab = 'products'">商品管理</div>
                        <div class="nav-item" @click="currentTab = 'productSpecs'">规格管理</div>
                        <div class="nav-item" @click="currentTab = 'orders'">订单管理</div>
                        <div class="nav-item" @click="currentTab = 'carts'">购物车管理</div>
                        <div class="nav-item" @click="currentTab = 'users'">用户管理</div>
                        <div class="nav-item" @click="currentTab = 'categories'">分类管理</div>
                        <div class="nav-item" @click="currentTab = 'coupons'">优惠券管理</div>
                    </nav>
                    <div class="user-actions">
                        <div class="user-btn" @click="logout">退出登录</div>
                    </div>
                </div>
            </header>

            <div class="chinese-section">
                <div v-if="currentTab === 'overview'">
                    <div class="chinese-section-title">
                        <h2>数据概览</h2>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                        <div class="chinese-stat-card">
                            <div class="stat-icon">📊</div>
                            <div class="stat-value">{{ statistics.totalOrders || 0 }}</div>
                            <div class="stat-label">总订单数</div>
                        </div>
                        <div class="chinese-stat-card">
                            <div class="stat-icon">💰</div>
                            <div class="stat-value">¥{{ statistics.totalAmount || 0 }}</div>
                            <div class="stat-label">总销售额</div>
                        </div>
                        <div class="chinese-stat-card">
                            <div class="stat-icon">👥</div>
                            <div class="stat-value">{{ statistics.totalUsers || 0 }}</div>
                            <div class="stat-label">总用户数</div>
                        </div>
                        <div class="chinese-stat-card">
                            <div class="stat-icon">🎁</div>
                            <div class="stat-value">{{ statistics.totalProducts || 0 }}</div>
                            <div class="stat-label">商品总数</div>
                        </div>
                        <div class="chinese-stat-card">
                            <div class="stat-icon">🎫</div>
                            <div class="stat-value">{{ statistics.totalCoupons || 0 }}</div>
                            <div class="stat-label">优惠券总数</div>
                        </div>
                        <div class="chinese-stat-card">
                            <div class="stat-icon">📦</div>
                            <div class="stat-value">{{ statistics.pendingOrders || 0 }}</div>
                            <div class="stat-label">待发货订单</div>
                        </div>
                    </div>
                    <div class="charts-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="chinese-chart-container">
                            <div class="chart-title">订单状态分布</div>
                            <div ref="orderChart" style="width: 100%; height: 400px;"></div>
                        </div>
                        <div class="chinese-chart-container">
                            <div class="chart-title">商品分类数量统计</div>
                            <div ref="categoryChart" style="width: 100%; height: 400px;"></div>
                        </div>
                    </div>
                    <div class="charts-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                        <div class="chinese-chart-container">
                            <div class="chart-title">商品分类销售额占比</div>
                            <div ref="categorySalesChart" style="width: 100%; height: 400px;"></div>
                        </div>
                        <div class="chinese-chart-container">
                            <div class="chart-title">销售额趋势（近7天）</div>
                            <div ref="salesTrendChart" style="width: 100%; height: 400px;"></div>
                        </div>
                    </div>
                </div>

                <div v-if="currentTab === 'products'">
                    <div class="chinese-section-title">
                        <h2>商品管理</h2>
                    </div>
                    <div class="chinese-card">
                        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
                            <el-input v-model="productKeyword" placeholder="搜索商品" style="width: 200px;"></el-input>
                            <el-button type="primary" @click="loadProducts">搜索</el-button>
                            <el-button type="success" @click="addProduct">添加商品</el-button>
                        </div>
                        <table class="chinese-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>商品图片</th>
                                    <th>商品名称</th>
                                    <th>品牌</th>
                                    <th>价格</th>
                                    <th>库存</th>
                                    <th>销量</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="product in products" :key="product.id">
                                    <td>{{ product.id }}</td>
                                    <td><img :src="product.mainImage" alt="商品图片" style="width: 60px; height: 60px; object-fit: cover;"></td>
                                    <td>{{ product.name }}</td>
                                    <td>{{ product.brand || '-' }}</td>
                                    <td>¥{{ product.price }}</td>
                                    <td>{{ product.stock }}</td>
                                    <td>{{ product.sales }}</td>
                                    <td>
                                        <span :class="product.status === 1 ? 'status-badge active' : 'status-badge inactive'">
                                            {{ product.status === 1 ? '上架' : '下架' }}
                                        </span>
                                    </td>
                                    <td>
                                        <el-button type="primary" size="small" @click="editProduct(product)">编辑</el-button>
                                        <el-button :type="product.status === 1 ? 'warning' : 'success'" size="small" @click="toggleProductStatus(product)">
                                            {{ product.status === 1 ? '下架' : '上架' }}
                                        </el-button>
                                        <el-button type="danger" size="small" @click="deleteProduct(product)">删除</el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="currentTab === 'orders'">
                    <div class="chinese-section-title">
                        <h2>订单管理</h2>
                    </div>
                    <div class="chinese-card">
                        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
                            <el-select v-model="orderStatus" placeholder="订单状态" style="width: 150px;">
                                <el-option label="全部" value="all"></el-option>
                                <el-option label="待付款" :value="0"></el-option>
                                <el-option label="待发货" :value="1"></el-option>
                                <el-option label="待收货" :value="2"></el-option>
                                <el-option label="已完成" :value="3"></el-option>
                                <el-option label="已取消" :value="4"></el-option>
                            </el-select>
                            <el-button type="primary" @click="loadOrders">筛选</el-button>
                        </div>
                        <table class="chinese-table">
                            <thead>
                                <tr>
                                    <th>订单号</th>
                                    <th>用户ID</th>
                                    <th>订单金额</th>
                                    <th>状态</th>
                                    <th>创建时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="order in orders" :key="order.id">
                                    <td>{{ order.orderNo }}</td>
                                    <td>{{ order.userId }}</td>
                                    <td>¥{{ order.actualAmount }}</td>
                                    <td>
                                        <span :class="getOrderStatusClass(order.status)">
                                            {{ getOrderStatus(order.status) }}
                                        </span>
                                    </td>
                                    <td>{{ formatDate(order.createTime) }}</td>
                                    <td>
                                        <el-button type="primary" size="small" @click="viewOrderDetail(order)">详情</el-button>
                                        <el-button v-if="order.status === 1" type="success" size="small" @click="deliverOrder(order)">发货</el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="currentTab === 'users'">
                    <div class="chinese-section-title">
                        <h2>用户管理</h2>
                    </div>
                    <div class="chinese-card">
                        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
                            <el-input v-model="userKeyword" placeholder="搜索用户" style="width: 200px;"></el-input>
                            <el-button type="primary" @click="loadUsers">搜索</el-button>
                        </div>
                        <table class="chinese-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>用户名</th>
                                    <th>昵称</th>
                                    <th>邮箱</th>
                                    <th>手机号</th>
                                    <th>余额</th>
                                    <th>积分</th>
                                    <th>注册时间</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.id">
                                    <td>{{ user.id }}</td>
                                    <td>{{ user.username }}</td>
                                    <td>{{ user.nickname || '-' }}</td>
                                    <td>{{ user.email }}</td>
                                    <td>{{ user.phone }}</td>
                                    <td>¥{{ user.balance || 0 }}</td>
                                    <td>{{ user.points || 0 }}</td>
                                    <td>{{ formatDate(user.registerTime) }}</td>
                                    <td>
                                        <span :class="user.status === 1 ? 'status-badge active' : 'status-badge inactive'">
                                            {{ user.status === 1 ? '正常' : '禁用' }}
                                        </span>
                                    </td>
                                    <td>
                                        <el-button :type="user.status === 1 ? 'warning' : 'success'" size="small" @click="toggleUserStatus(user)">
                                            {{ user.status === 1 ? '禁用' : '启用' }}
                                        </el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="currentTab === 'categories'">
                    <div class="chinese-section-title">
                        <h2>分类管理</h2>
                    </div>
                    <div class="chinese-card">
                        <div style="margin-bottom: 20px;">
                            <el-button type="success" @click="addCategory">添加分类</el-button>
                        </div>
                        <table class="chinese-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>分类名称</th>
                                    <th>父分类</th>
                                    <th>排序</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="category in categories" :key="category.id">
                                    <td>{{ category.id }}</td>
                                    <td>{{ category.name }}</td>
                                    <td>{{ category.parentId === 0 ? '顶级分类' : category.parentId }}</td>
                                    <td>{{ category.sortOrder }}</td>
                                    <td>{{ category.status === 1 ? '启用' : '禁用' }}</td>
                                    <td>
                                        <el-button type="primary" size="small" @click="editCategory(category)">编辑</el-button>
                                        <el-button type="danger" size="small" @click="deleteCategory(category)">删除</el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="currentTab === 'coupons'">
                    <div class="chinese-section-title">
                        <h2>优惠券管理</h2>
                    </div>
                    <div class="chinese-card">
                        <div style="margin-bottom: 20px;">
                            <el-button type="success" @click="addCoupon">添加优惠券</el-button>
                        </div>
                        <table class="chinese-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>优惠券名称</th>
                                    <th>类型</th>
                                    <th>优惠值</th>
                                    <th>发行数量</th>
                                    <th>已领取</th>
                                    <th>已使用</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="coupon in coupons" :key="coupon.id">
                                    <td>{{ coupon.id }}</td>
                                    <td>{{ coupon.name }}</td>
                                    <td>{{ coupon.type === 1 ? '满减券' : '折扣券' }}</td>
                                    <td>{{ coupon.type === 1 ? '¥' + coupon.discountValue : coupon.discountValue + '折' }}</td>
                                    <td>{{ coupon.totalCount }}</td>
                                    <td>{{ coupon.receivedCount }}</td>
                                    <td>{{ coupon.usedCount }}</td>
                                    <td>{{ coupon.status === 1 ? '启用' : '禁用' }}</td>
                                    <td>
                                        <el-button type="primary" size="small" @click="editCoupon(coupon)">编辑</el-button>
                                        <el-button type="danger" size="small" @click="deleteCoupon(coupon)">删除</el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="currentTab === 'productSpecs'">
                    <div class="chinese-section-title">
                        <h2>商品规格管理</h2>
                    </div>
                    <div class="chinese-card">
                        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
                            <el-select v-model="specProductId" placeholder="选择商品" style="width: 200px;">
                                <el-option v-for="product in products" :key="product.id" :label="product.name" :value="product.id"></el-option>
                            </el-select>
                            <el-button type="primary" @click="loadProductSpecs">加载规格</el-button>
                            <el-button type="success" @click="openSpecDialog">添加规格</el-button>
                        </div>
                        <table class="chinese-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>规格名称</th>
                                    <th>规格值</th>
                                    <th>价格调整</th>
                                    <th>库存</th>
                                    <th>SKU编码</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="spec in productSpecs" :key="spec.id">
                                    <td>{{ spec.id }}</td>
                                    <td>{{ spec.specName }}</td>
                                    <td>{{ spec.specValue }}</td>
                                    <td>{{ spec.priceAdjust || 0 }}</td>
                                    <td>{{ spec.stock || 0 }}</td>
                                    <td>{{ spec.skuCode || '-' }}</td>
                                    <td>
                                        <el-button type="primary" size="small" @click="editSpec(spec)">编辑</el-button>
                                        <el-button type="danger" size="small" @click="deleteSpec(spec)">删除</el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="currentTab === 'carts'">
                    <div class="chinese-section-title">
                        <h2>购物车管理</h2>
                    </div>
                    <div class="chinese-card">
                        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
                            <el-input v-model="cartKeyword" placeholder="搜索用户或商品" style="width: 200px;"></el-input>
                            <el-button type="primary" @click="loadCarts">搜索</el-button>
                        </div>
                        <table class="chinese-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>用户ID</th>
                                    <th>商品ID</th>
                                    <th>商品名称</th>
                                    <th>规格信息</th>
                                    <th>数量</th>
                                    <th>添加时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="cart in carts" :key="cart.id">
                                    <td>{{ cart.id }}</td>
                                    <td>{{ cart.userId }}</td>
                                    <td>{{ cart.productId }}</td>
                                    <td>{{ getProductName(cart.productId) }}</td>
                                    <td>{{ cart.specInfo || '无' }}</td>
                                    <td>{{ cart.quantity }}</td>
                                    <td>{{ formatDate(cart.createTime) }}</td>
                                    <td>
                                        <el-button type="danger" size="small" @click="removeCartItem(cart)">删除</el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog title="订单详情" :visible.sync="showOrderDetailDialog" width="600px">
            <div v-if="selectedOrder">
                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span><strong>订单号：</strong>{{ selectedOrder.orderNo }}</span>
                        <span class="status-badge" :class="getOrderStatusClass(selectedOrder.status).replace('status-badge ', '')">
                            {{ getOrderStatus(selectedOrder.status) }}
                        </span>
                    </div>
                    <div><strong>用户ID：</strong>{{ selectedOrder.userId }}</div>
                    <div><strong>订单金额：</strong>¥{{ selectedOrder.actualAmount }}</div>
                    <div><strong>创建时间：</strong>{{ formatDate(selectedOrder.createTime) }}</div>
                </div>

                <div v-if="selectedOrder.items && selectedOrder.items.length > 0">
                    <h4 style="margin-bottom: 15px; color: var(--secondary-color);">商品详情</h4>
                    <div v-for="item in selectedOrder.items" :key="item.id" style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; padding: 10px; background: rgba(196, 30, 58, 0.03); border-radius: 8px;">
                        <img :src="item.product?.mainImage" alt="商品图片" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
                        <div style="flex: 1;">
                            <div style="font-weight: bold;">{{ item.product?.name }}</div>
                            <div style="font-size: 12px; color: var(--light-text);">{{ item.product?.brand }} | {{ item.product?.specs }}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold;">¥{{ item.product?.price }}</div>
                            <div style="font-size: 12px; color: var(--light-text);">x{{ item.quantity }}</div>
                            <div style="font-weight: bold; color: var(--primary-color);">¥{{ (item.product?.price * item.quantity).toFixed(2) }}</div>
                        </div>
                    </div>
                </div>

                <div v-if="selectedOrder.address" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                    <h4 style="margin-bottom: 15px; color: var(--secondary-color);">收货地址</h4>
                    <div><strong>收货人：</strong>{{ selectedOrder.address.receiverName }} {{ selectedOrder.address.receiverPhone }}</div>
                    <div><strong>地址：</strong>{{ selectedOrder.address.province }} {{ selectedOrder.address.city }} {{ selectedOrder.address.district }} {{ selectedOrder.address.detailedAddress }}</div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showOrderDetailDialog = false">关闭</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="editingSpec ? '编辑规格' : '添加规格'" :visible.sync="showSpecDialog" width="400px">
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <div>
                    <label>规格名称（如：颜色、内存）</label>
                    <el-input v-model="editingSpec.specName" placeholder="请输入规格名称"></el-input>
                </div>
                <div>
                    <label>规格值（如：红色、12GB）</label>
                    <el-input v-model="editingSpec.specValue" placeholder="请输入规格值"></el-input>
                </div>
                <div>
                    <label>价格调整（正数加价，负数减价）</label>
                    <el-input v-model.number="editingSpec.priceAdjust" type="number" placeholder="请输入价格调整"></el-input>
                </div>
                <div>
                    <label>库存数量</label>
                    <el-input v-model.number="editingSpec.stock" type="number" placeholder="请输入库存数量"></el-input>
                </div>
                <div>
                    <label>SKU编码</label>
                    <el-input v-model="editingSpec.skuCode" placeholder="请输入SKU编码"></el-input>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showSpecDialog = false">取消</el-button>
                <el-button type="primary" @click="saveSpec">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="editingProduct ? '编辑商品' : '添加商品'" :visible.sync="showProductDialog" width="600px">
            <div style="display: flex; flex-direction: column; gap: 12px; max-height: 500px; overflow-y: auto;">
                <div style="display: flex; gap: 12px;">
                    <div style="flex:1;"><label>商品名称</label><el-input v-model="editingProduct.name" placeholder="请输入商品名称"></el-input></div>
                    <div style="flex:1;"><label>品牌</label><el-input v-model="editingProduct.brand" placeholder="请输入品牌"></el-input></div>
                </div>
                <div style="display: flex; gap: 12px;">
                    <div style="flex:1;"><label>分类</label><el-select v-model="editingProduct.categoryId" placeholder="选择分类" style="width:100%"><el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id"></el-option></el-select></div>
                    <div style="flex:1;"><label>状态</label><el-select v-model="editingProduct.status" style="width:100%"><el-option label="上架" :value="1"></el-option><el-option label="下架" :value="0"></el-option></el-select></div>
                </div>
                <div style="display: flex; gap: 12px;">
                    <div style="flex:1;"><label>价格</label><el-input v-model.number="editingProduct.price" type="number" placeholder="请输入价格"></el-input></div>
                    <div style="flex:1;"><label>原价</label><el-input v-model.number="editingProduct.originalPrice" type="number" placeholder="请输入原价"></el-input></div>
                </div>
                <div style="display: flex; gap: 12px;">
                    <div style="flex:1;"><label>库存</label><el-input v-model.number="editingProduct.stock" type="number" placeholder="请输入库存"></el-input></div>
                    <div style="flex:1;"><label>规格</label><el-input v-model="editingProduct.specs" placeholder="如：颜色:红|蓝|黑"></el-input></div>
                </div>
                <div style="display: flex; gap: 12px;">
                    <div style="flex:1;"><label>主图URL</label><el-input v-model="editingProduct.mainImage" placeholder="请输入主图URL"></el-input></div>
                    <div style="flex:1;"><label>产地</label><el-input v-model="editingProduct.origin" placeholder="请输入产地"></el-input></div>
                </div>
                <div style="display: flex; gap: 12px;">
                    <div style="flex:1;"><label>是否热门</label><el-switch v-model="editingProduct.isHot" :active-value="1" :inactive-value="0"></el-switch></div>
                    <div style="flex:1;"><label>是否新品</label><el-switch v-model="editingProduct.isNew" :active-value="1" :inactive-value="0"></el-switch></div>
                </div>
                <div><label>描述</label><el-input v-model="editingProduct.description" type="textarea" :rows="2" placeholder="请输入商品描述"></el-input></div>
                <div><label>详情</label><el-input v-model="editingProduct.detail" type="textarea" :rows="2" placeholder="请输入商品详情"></el-input></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showProductDialog = false">取消</el-button>
                <el-button type="primary" @click="saveProduct">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="editingCategory ? '编辑分类' : '添加分类'" :visible.sync="showCategoryDialog" width="400px">
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div><label>分类名称</label><el-input v-model="editingCategory.name" placeholder="请输入分类名称"></el-input></div>
                <div><label>父分类</label><el-select v-model="editingCategory.parentId" placeholder="选择父分类" style="width:100%"><el-option label="顶级分类" :value="0"></el-option><el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id"></el-option></el-select></div>
                <div style="display: flex; gap: 12px;">
                    <div style="flex:1;"><label>排序</label><el-input v-model.number="editingCategory.sortOrder" type="number" placeholder="请输入排序值"></el-input></div>
                    <div style="flex:1;"><label>状态</label><el-select v-model="editingCategory.status" style="width:100%"><el-option label="启用" :value="1"></el-option><el-option label="禁用" :value="0"></el-option></el-select></div>
                </div>
                <div><label>图标URL</label><el-input v-model="editingCategory.icon" placeholder="请输入图标URL"></el-input></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showCategoryDialog = false">取消</el-button>
                <el-button type="primary" @click="saveCategory">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="editingCoupon ? '编辑优惠券' : '添加优惠券'" :visible.sync="showCouponDialog" width="400px">
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div><label>优惠券名称</label><el-input v-model="editingCoupon.name" placeholder="请输入优惠券名称"></el-input></div>
                <div style="display: flex; gap: 12px;">
                    <div style="flex:1;"><label>类型</label><el-select v-model="editingCoupon.type" style="width:100%"><el-option label="满减券" :value="1"></el-option><el-option label="折扣券" :value="2"></el-option></el-select></div>
                    <div style="flex:1;"><label>优惠值</label><el-input v-model.number="editingCoupon.discountValue" type="number" placeholder="满减券填金额，折扣券填折数"></el-input></div>
                </div>
                <div style="display: flex; gap: 12px;">
                    <div style="flex:1;"><label>最低消费</label><el-input v-model.number="editingCoupon.minAmount" type="number" placeholder="最低消费金额"></el-input></div>
                    <div style="flex:1;"><label>发行数量</label><el-input v-model.number="editingCoupon.totalCount" type="number" placeholder="发行数量"></el-input></div>
                </div>
                <div style="display: flex; gap: 12px;">
                    <div style="flex:1;"><label>开始时间</label><el-date-picker v-model="editingCoupon.startTime" type="datetime" placeholder="选择开始时间" style="width:100%"></el-date-picker></div>
                    <div style="flex:1;"><label>结束时间</label><el-date-picker v-model="editingCoupon.endTime" type="datetime" placeholder="选择结束时间" style="width:100%"></el-date-picker></div>
                </div>
                <div><label>状态</label><el-select v-model="editingCoupon.status" style="width:100%"><el-option label="启用" :value="1"></el-option><el-option label="禁用" :value="0"></el-option></el-select></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showCouponDialog = false">取消</el-button>
                <el-button type="primary" @click="saveCoupon">确定</el-button>
            </div>
        </el-dialog>
    `,
    data() {
        return {
            currentTab: 'overview',
            statistics: {},
            products: [],
            orders: [],
            users: [],
            categories: [],
            coupons: [],
            productSpecs: [],
            carts: [],
            productKeyword: '',
            userKeyword: '',
            orderStatus: 'all',
            specProductId: '',
            cartKeyword: '',
            showProductDialog: false,
            showCategoryDialog: false,
            showCouponDialog: false,
            showOrderDetailDialog: false,
            showSpecDialog: false,
            selectedOrder: null,
            editingSpec: null,
            editingProduct: null,
            editingCategory: null,
            editingCoupon: null
        };
    },
    mounted() {
        if (this.activeTab) {
            this.currentTab = this.activeTab;
        }
        this.loadData();
    },
    watch: {
        currentTab(newVal) {
            if (newVal === 'overview') {
                this.$nextTick(() => {
                    this.initOrderChart();
                    this.initCategoryChart();
                    this.initCategorySalesChart();
                    this.initSalesTrendChart();
                });
            }
        }
    },
    methods: {
        async loadData() {
            await Promise.all([
                this.loadProducts(),
                this.loadOrders(),
                this.loadUsers(),
                this.loadCategories(),
                this.loadCoupons()
            ]);
            await this.loadStatistics();
            if (this.currentTab === 'overview') {
                this.$nextTick(() => {
                    this.initOrderChart();
                    this.initCategoryChart();
                    this.initCategorySalesChart();
                    this.initSalesTrendChart();
                });
            }
        },
        async loadStatistics() {
            try {
                const [orderRes, productRes, userRes, couponRes] = await Promise.all([
                    api.order.getStatistics(),
                    api.product.getList({ current: 1, size: 1 }),
                    api.user.getList({ current: 1, size: 1 }),
                    api.coupon.getList({ current: 1, size: 1 })
                ]);
                
                this.statistics = {
                    totalOrders: orderRes?.find(s => s.name === '总订单数')?.value || 0,
                    totalAmount: (this.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)).toFixed(2),
                    totalUsers: userRes?.total || 0,
                    totalProducts: productRes?.total || 0,
                    totalCoupons: couponRes?.total || 0,
                    pendingOrders: this.orders.filter(o => o.status === 1).length
                };
            } catch (error) {
                console.error('加载统计数据失败:', error);
            }
        },
        async loadProducts() {
            try {
                const result = await api.product.getList({ current: 1, size: 100 });
                this.products = result?.records || [];
            } catch (error) {
                console.error('加载商品失败:', error);
            }
        },
        async loadOrders() {
            const token = localStorage.getItem('adminToken');
            try {
                const result = await api.admin.getOrders(token, { current: 1, size: 100, status: this.orderStatus === 'all' ? null : this.orderStatus, orderNo: this.orderNo });
                this.orders = result?.records || [];
            } catch (error) {
                console.error('加载订单失败:', error);
            }
        },
        async loadUsers() {
            try {
                const result = await api.user.getList({ current: 1, size: 100, keyword: this.userKeyword });
                this.users = result?.records || [];
            } catch (error) {
                console.error('加载用户失败:', error);
            }
        },
        async loadCategories() {
            try {
                const result = await api.category.getList({ current: 1, size: 100 });
                this.categories = result?.records || [];
            } catch (error) {
                console.error('加载分类失败:', error);
            }
        },
        async loadCoupons() {
            try {
                const result = await api.coupon.getList({ current: 1, size: 100 });
                this.coupons = result?.records || [];
            } catch (error) {
                console.error('加载优惠券失败:', error);
            }
        },
        initOrderChart() {
            try {
                if (!this.$refs.orderChart) {
                    console.error('orderChart ref not found');
                    return;
                }
                const chart = echarts.init(this.$refs.orderChart);
                const option = {
                title: {
                    text: '订单状态分布'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: '订单状态',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            { value: this.orders.filter(o => o.status === 0).length, name: '待付款' },
                            { value: this.orders.filter(o => o.status === 1).length, name: '待发货' },
                            { value: this.orders.filter(o => o.status === 2).length, name: '待收货' },
                            { value: this.orders.filter(o => o.status === 3).length, name: '已完成' },
                            { value: this.orders.filter(o => o.status === 4).length, name: '已取消' }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            chart.setOption(option);
            console.log('订单状态分布图表初始化成功');
            } catch (error) {
                console.error('订单状态分布图表初始化失败:', error);
            }
        },
        initCategorySalesChart() {
            try {
                if (!this.$refs.categorySalesChart) {
                    console.error('categorySalesChart ref not found');
                    return;
                }
                console.log('初始化商品分类销售额占比图表');
            const chart = echarts.init(this.$refs.categorySalesChart);
            
            const categorySales = {6: 50000, 7: 30000, 8: 20000, 9: 15000, 10: 25000};
            
            const categoryNames = {
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
            
            const totalSales = Object.values(categorySales).reduce((sum, val) => sum + val, 0);
            
            const data = Object.keys(categorySales).map(categoryId => ({
                value: categorySales[categoryId],
                name: categoryNames[categoryId] || `分类${categoryId}`,
                percentage: totalSales > 0 ? ((categorySales[categoryId] / totalSales) * 100).toFixed(1) : '0'
            })).sort((a, b) => b.value - a.value);
            
            const option = {
                title: {
                    text: '商品分类销售额占比',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        return `${params.name}<br/>销售额: ¥${params.value.toFixed(2)}<br/>占比: ${params.data.percentage}%`;
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    formatter: function(name) {
                        const item = data.find(d => d.name === name);
                        return item ? `${name}  ${item.percentage}%` : name;
                    }
                },
                series: [
                    {
                        name: '销售额',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: true,
                            formatter: '{b}: {d}%'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 16,
                                fontWeight: 'bold'
                            },
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        labelLine: {
                            show: true
                        },
                        data: data
                    }
                ]
            };
            chart.setOption(option);
            console.log('商品分类销售额占比图表初始化成功');
            } catch (error) {
                console.error('商品分类销售额占比图表初始化失败:', error);
            }
        },
        initSalesTrendChart() {
            try {
                if (!this.$refs.salesTrendChart) {
                    console.error('salesTrendChart ref not found');
                    return;
                }
                console.log('初始化销售额趋势图表');
            const chart = echarts.init(this.$refs.salesTrendChart);
            
            const dates = ['5/15', '5/16', '5/17', '5/18', '5/19', '5/20', '5/21'];
            const values = [12000, 15000, 18000, 14000, 20000, 16000, 22000];
            
            const option = {
                title: {
                    text: '销售额趋势（近7天）'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        const date = params[0].axisValue;
                        const value = params[0].value;
                        return `${date}<br/>销售额: ¥${value.toFixed(2)}`;
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: dates,
                    boundaryGap: false
                },
                yAxis: {
                    type: 'value',
                    name: '销售额（元）'
                },
                series: [
                    {
                        name: '销售额',
                        type: 'line',
                        data: values,
                        smooth: true,
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(196, 30, 58, 0.3)' },
                                { offset: 1, color: 'rgba(196, 30, 58, 0.05)' }
                            ])
                        },
                        lineStyle: {
                            color: '#c41e3a',
                            width: 2
                        },
                        itemStyle: {
                            color: '#c41e3a'
                        }
                    }
                ]
            };
            chart.setOption(option);
            console.log('销售额趋势图表初始化成功');
            } catch (error) {
                console.error('销售额趋势图表初始化失败:', error);
            }
        },
        initCategoryChart() {
            try {
                if (!this.$refs.categoryChart) {
                    console.error('categoryChart ref not found');
                    return;
                }
                console.log('初始化商品分类数量图表，商品数量:', this.products.length);
            const chart = echarts.init(this.$refs.categoryChart);
            
            const categoryProductCount = {6: 5, 7: 3, 8: 2, 9: 4, 10: 6};
            
            const categoryNames = {
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
            
            const data = Object.keys(categoryProductCount).map(categoryId => ({
                value: categoryProductCount[categoryId],
                name: categoryNames[categoryId] || `分类${categoryId}`
            })).sort((a, b) => b.value - a.value);
            
            const option = {
                title: {
                    text: '商品分类数量统计'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: data.map(item => item.name),
                    axisLabel: {
                        interval: 0,
                        rotate: 30
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '商品数量'
                },
                series: [
                    {
                        name: '商品数量',
                        type: 'bar',
                        data: data.map(item => item.value),
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#c41e3a' },
                                { offset: 1, color: '#ff6b6b' }
                            ]),
                            borderRadius: [4, 4, 0, 0]
                        }
                    }
                ]
            };
            chart.setOption(option);
            console.log('商品分类数量统计图表初始化成功');
            } catch (error) {
                console.error('商品分类数量统计图表初始化失败:', error);
            }
        },
        getOrderStatus(status) {
            const statusMap = {
                0: '待付款',
                1: '待发货',
                2: '待收货',
                3: '已完成',
                4: '已取消',
                5: '退款中',
                6: '已退款'
            };
            return statusMap[status] || '未知';
        },
        getOrderStatusClass(status) {
            const classMap = {
                0: 'status-badge warning',
                1: 'status-badge primary',
                2: 'status-badge info',
                3: 'status-badge active',
                4: 'status-badge inactive',
                5: 'status-badge warning',
                6: 'status-badge inactive'
            };
            return classMap[status] || 'status-badge';
        },
        async toggleProductStatus(product) {
            try {
                const newStatus = product.status === 1 ? 0 : 1;
                await api.product.update(product.id, { status: newStatus });
                product.status = newStatus;
                this.$message.success(product.status === 1 ? '上架成功' : '下架成功');
            } catch (error) {
                this.$message.error('操作失败');
            }
        },
        async deliverOrder(order) {
            this.$confirm('确定发货吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    await api.order.updateStatus(order.id, 2);
                    order.status = 2;
                    this.$message.success('发货成功');
                } catch (error) {
                    this.$message.error('发货失败');
                }
            });
        },
        async toggleUserStatus(user) {
            try {
                const newStatus = user.status === 1 ? 0 : 1;
                await api.admin.updateUserStatus(user.id, newStatus);
                user.status = newStatus;
                this.$message.success(user.status === 1 ? '启用成功' : '禁用成功');
            } catch (error) {
                this.$message.error('操作失败');
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toLocaleString('zh-CN');
        },
        addProduct() {
            this.editingProduct = {
                id: null, name: '', categoryId: '', brand: '', specs: '', description: '',
                mainImage: '', price: 0, originalPrice: 0, stock: 0, status: 1,
                isHot: 0, isNew: 0, detail: '', origin: ''
            };
            this.showProductDialog = true;
        },
        editProduct(product) {
            this.editingProduct = {
                id: product.id,
                name: product.name || '',
                categoryId: product.categoryId || '',
                brand: product.brand || '',
                specs: product.specs || '',
                description: product.description || '',
                mainImage: product.mainImage || '',
                price: product.price || 0,
                originalPrice: product.originalPrice || 0,
                stock: product.stock || 0,
                status: product.status || 1,
                isHot: product.isHot || 0,
                isNew: product.isNew || 0,
                detail: product.detail || '',
                origin: product.origin || ''
            };
            this.showProductDialog = true;
        },
        async saveProduct() {
            const data = { ...this.editingProduct };
            try {
                if (data.id) {
                    await api.product.update(data.id, data);
                    this.$message.success('更新成功');
                } else {
                    await api.product.add(data);
                    this.$message.success('添加成功');
                }
                this.showProductDialog = false;
                this.loadProducts();
            } catch (error) {
                this.$message.error('操作失败');
            }
        },
        deleteProduct(product) {
            this.$confirm('确定删除该商品吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    await api.product.delete(product.id);
                    this.$message.success('删除成功');
                    this.loadProducts();
                } catch (error) {
                    this.$message.error('删除失败');
                }
            });
        },
        viewOrderDetail(order) {
            this.selectedOrder = order;
            this.showOrderDetailDialog = true;
        },
        addCategory() {
            this.editingCategory = {
                id: null, name: '', parentId: 0, sortOrder: 0, status: 1, icon: ''
            };
            this.showCategoryDialog = true;
        },
        editCategory(category) {
            this.editingCategory = {
                id: category.id,
                name: category.name || '',
                parentId: category.parentId || 0,
                sortOrder: category.sortOrder || 0,
                status: category.status || 1,
                icon: category.icon || ''
            };
            this.showCategoryDialog = true;
        },
        async saveCategory() {
            const data = { ...this.editingCategory };
            try {
                if (data.id) {
                    await api.category.update(data);
                    this.$message.success('更新成功');
                } else {
                    await api.category.add(data);
                    this.$message.success('添加成功');
                }
                this.showCategoryDialog = false;
                this.loadCategories();
            } catch (error) {
                this.$message.error('操作失败');
            }
        },
        deleteCategory(category) {
            this.$confirm('确定删除该分类吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    await api.category.delete(category.id);
                    this.$message.success('删除成功');
                    this.loadCategories();
                } catch (error) {
                    this.$message.error('删除失败');
                }
            });
        },
        addCoupon() {
            this.editingCoupon = {
                id: null, name: '', type: 1, discountValue: 0, minAmount: 0,
                totalCount: 0, startTime: '', endTime: '', status: 1
            };
            this.showCouponDialog = true;
        },
        editCoupon(coupon) {
            this.editingCoupon = {
                id: coupon.id,
                name: coupon.name || '',
                type: coupon.type || 1,
                discountValue: coupon.discountValue || 0,
                minAmount: coupon.minAmount || 0,
                totalCount: coupon.totalCount || 0,
                startTime: coupon.startTime || '',
                endTime: coupon.endTime || '',
                status: coupon.status || 1
            };
            this.showCouponDialog = true;
        },
        async saveCoupon() {
            const data = { ...this.editingCoupon };
            try {
                if (data.id) {
                    await api.coupon.update(data);
                    this.$message.success('更新成功');
                } else {
                    await api.coupon.add(data);
                    this.$message.success('添加成功');
                }
                this.showCouponDialog = false;
                this.loadCoupons();
            } catch (error) {
                this.$message.error('操作失败');
            }
        },
        deleteCoupon(coupon) {
            this.$confirm('确定删除该优惠券吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    await api.coupon.delete(coupon.id);
                    this.$message.success('删除成功');
                    this.loadCoupons();
                } catch (error) {
                    this.$message.error('删除失败');
                }
            });
        },
        async loadProductSpecs() {
            if (!this.specProductId) {
                this.$message.warning('请先选择商品');
                return;
            }
            try {
                const response = await fetch(`/api/product-specs/product/${this.specProductId}`);
                const result = await response.json();
                this.productSpecs = result.data || [];
            } catch (error) {
                console.error('加载规格失败:', error);
            }
        },
        openSpecDialog() {
            if (!this.specProductId) {
                this.$message.warning('请先选择商品');
                return;
            }
            this.editingSpec = null;
            this.showSpecDialog = true;
        },
        editSpec(spec) {
            this.editingSpec = { ...spec };
            this.showSpecDialog = true;
        },
        async saveSpec() {
            if (!this.specProductId) {
                this.$message.warning('请先选择商品');
                return;
            }
            const specData = {
                specName: this.editingSpec?.specName || '',
                specValue: this.editingSpec?.specValue || '',
                priceAdjust: this.editingSpec?.priceAdjust || 0,
                stock: this.editingSpec?.stock || 0,
                skuCode: this.editingSpec?.skuCode || ''
            };
            try {
                if (this.editingSpec?.id) {
                    await fetch(`/api/product-specs/${this.editingSpec.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(specData)
                    });
                    this.$message.success('更新成功');
                } else {
                    await fetch(`/api/product-specs/batch/${this.specProductId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify([specData])
                    });
                    this.$message.success('添加成功');
                }
                this.showSpecDialog = false;
                this.loadProductSpecs();
            } catch (error) {
                this.$message.error('操作失败');
            }
        },
        async deleteSpec(spec) {
            this.$confirm('确定删除该规格吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    await fetch(`/api/product-specs/${spec.id}`, { method: 'DELETE' });
                    this.$message.success('删除成功');
                    this.loadProductSpecs();
                } catch (error) {
                    this.$message.error('删除失败');
                }
            });
        },
        async loadCarts() {
            try {
                const response = await fetch('/api/admin/carts');
                const result = await response.json();
                this.carts = result.data || [];
            } catch (error) {
                console.error('加载购物车失败:', error);
            }
        },
        getProductName(productId) {
            const product = this.products.find(p => p.id === productId);
            return product ? product.name : '未知商品';
        },
        async removeCartItem(cart) {
            this.$confirm('确定删除该购物车项吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    await fetch(`/api/admin/carts/${cart.id}`, { method: 'DELETE' });
                    this.$message.success('删除成功');
                    this.loadCarts();
                } catch (error) {
                    this.$message.error('删除失败');
                }
            });
        },
        logout() {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminInfo');
            this.$emit('navigate', 'home');
            this.$message.success('退出登录成功');
        }
    }
});