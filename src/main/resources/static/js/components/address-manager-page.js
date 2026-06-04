Vue.component('address-manager-page', {
    template: `
        <div>
            <header class="chinese-header">
                <div class="header-content">
                    <div class="logo" @click="$emit('navigate', 'home')" style="cursor: pointer;">优选商城</div>
                    <nav class="nav-menu">
                        <div class="nav-item" @click="$emit('navigate', 'home')">首页</div>
                        <div class="nav-item" @click="$emit('navigate', 'user-center', { tab: 'profile' })">个人中心</div>
                    </nav>
                </div>
            </header>

            <div class="chinese-section">
                <div class="chinese-section-title">
                    <h2>收货地址管理</h2>
                </div>

                <div class="chinese-card" style="margin-bottom: 20px;">
                    <button class="chinese-btn" @click="showAddModal = true" style="width: 100%;">
                        + 添加新地址
                    </button>
                </div>

                <div v-if="addresses.length === 0" class="chinese-card" style="text-align: center; padding: 40px;">
                    <p style="color: #999;">暂无收货地址，请添加</p>
                </div>

                <div v-else>
                    <div v-for="address in addresses" :key="address.id" 
                         class="chinese-card address-item"
                         :class="{ 'default-address': address.isDefault }">
                        <div class="address-content">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <div style="display: flex; align-items: center;">
                                        <span style="font-weight: bold; font-size: 16px;">{{ address.receiverName }}</span>
                                        <span style="margin-left: 15px; color: #666;">{{ address.receiverPhone }}</span>
                                        <span v-if="address.isDefault" class="chinese-tag" style="margin-left: 10px;">默认</span>
                                    </div>
                                    <div style="margin-top: 10px; color: #666;">
                                        {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detailedAddress }}
                                    </div>
                                </div>
                                <div class="address-actions">
                                    <button class="action-btn edit-btn" @click="editAddress(address)">编辑</button>
                                    <button class="action-btn delete-btn" @click="deleteAddressConfirm(address)">删除</button>
                                    <button v-if="!address.isDefault" class="action-btn default-btn" @click="setDefaultAddress(address)">设为默认</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <el-dialog :title="editAddressData ? '编辑地址' : '添加新地址'" :visible.sync="showAddModal" width="500px">
                <el-form :model="addressForm" label-width="100px">
                    <el-form-item label="收货人">
                        <el-input v-model="addressForm.receiverName" placeholder="请输入收货人姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model="addressForm.receiverPhone" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                    <el-form-item label="省份">
                        <el-input v-model="addressForm.province" placeholder="请输入省份"></el-input>
                    </el-form-item>
                    <el-form-item label="城市">
                        <el-input v-model="addressForm.city" placeholder="请输入城市"></el-input>
                    </el-form-item>
                    <el-form-item label="区县">
                        <el-input v-model="addressForm.district" placeholder="请输入区县"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址">
                        <textarea v-model="addressForm.detailedAddress" placeholder="请输入详细地址" rows="3" 
                                  style="width: 100%; padding: 10px; border: 1px solid #dcdfe6; border-radius: 4px; resize: vertical;"></textarea>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="addressForm.isDefault">设为默认地址</el-checkbox>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showAddModal = false">取消</el-button>
                    <el-button type="primary" @click="saveAddress">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog title="确认删除" :visible.sync="showDeleteConfirm">
                <p>确定要删除该收货地址吗？</p>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showDeleteConfirm = false">取消</el-button>
                    <el-button type="danger" @click="deleteAddress">确定删除</el-button>
                </div>
            </el-dialog>
        </div>
    `,
    data() {
        return {
            addresses: [],
            showAddModal: false,
            showDeleteConfirm: false,
            editAddressData: null,
            deleteAddressData: null,
            addressForm: {
                receiverName: '',
                receiverPhone: '',
                province: '',
                city: '',
                district: '',
                detailedAddress: '',
                isDefault: false
            }
        };
    },
    mounted() {
        this.loadAddresses();
    },
    methods: {
        async loadAddresses() {
            const token = localStorage.getItem('token');
            if (!token) {
                this.$message.warning('请先登录');
                this.$emit('navigate', 'home');
                return;
            }
            try {
                const response = await api.address.getList(token);
                this.addresses = response.data || [];
            } catch (error) {
                console.error('加载地址失败:', error);
                this.$message.error('加载地址失败');
            }
        },
        openAddModal() {
            this.editAddressData = null;
            this.addressForm = {
                receiverName: '',
                receiverPhone: '',
                province: '',
                city: '',
                district: '',
                detailedAddress: '',
                isDefault: false
            };
            this.showAddModal = true;
        },
        editAddress(address) {
            this.editAddressData = address;
            this.addressForm = {
                receiverName: address.receiverName || '',
                receiverPhone: address.receiverPhone || '',
                province: address.province || '',
                city: address.city || '',
                district: address.district || '',
                detailedAddress: address.detailedAddress || '',
                isDefault: address.isDefault || false
            };
            this.showAddModal = true;
        },
        deleteAddressConfirm(address) {
            this.deleteAddressData = address;
            this.showDeleteConfirm = true;
        },
        async saveAddress() {
            if (!this.addressForm.receiverName) {
                this.$message.warning('请输入收货人姓名');
                return;
            }
            if (!this.addressForm.receiverPhone) {
                this.$message.warning('请输入联系电话');
                return;
            }
            if (!this.addressForm.province || !this.addressForm.city) {
                this.$message.warning('请输入省市区信息');
                return;
            }
            if (!this.addressForm.detailedAddress) {
                this.$message.warning('请输入详细地址');
                return;
            }

            const token = localStorage.getItem('token');
            console.log('保存地址 - token:', token ? '存在' : '不存在');
            console.log('保存地址 - 表单数据:', this.addressForm);
            
            try {
                let response;
                if (this.editAddressData) {
                    console.log('更新地址 - 请求数据:', { id: this.editAddressData.id, ...this.addressForm });
                    response = await api.address.update(token, {
                        id: this.editAddressData.id,
                        ...this.addressForm
                    });
                    console.log('更新地址 - 响应:', response);
                    this.$message.success('地址更新成功');
                } else {
                    console.log('添加地址 - 请求数据:', this.addressForm);
                    response = await api.address.add(token, this.addressForm);
                    console.log('添加地址 - 响应:', response);
                    this.$message.success('地址添加成功');
                }
                this.showAddModal = false;
                this.loadAddresses();
            } catch (error) {
                console.error('保存地址失败 - 完整错误:', error);
                console.error('保存地址失败 - 响应:', error.response);
                console.error('保存地址失败 - 错误信息:', error.message);
                this.$message.error(error.response?.data?.message || error.message || '保存地址失败');
            }
        },
        async deleteAddress() {
            if (!this.deleteAddressData) return;
            
            try {
                await api.address.delete(this.deleteAddressData.id);
                this.$message.success('地址删除成功');
                this.showDeleteConfirm = false;
                this.loadAddresses();
            } catch (error) {
                console.error('删除地址失败:', error);
                this.$message.error(error.response?.data?.message || '删除地址失败');
            }
        },
        async setDefaultAddress(address) {
            const token = localStorage.getItem('token');
            try {
                await api.address.setDefault(token, address.id);
                this.$message.success('设置默认地址成功');
                this.loadAddresses();
            } catch (error) {
                console.error('设置默认地址失败:', error);
                this.$message.error(error.response?.data?.message || '设置失败');
            }
        }
    }
});