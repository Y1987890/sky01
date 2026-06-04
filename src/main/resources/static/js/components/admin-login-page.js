Vue.component('admin-login-page', {
    template: `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #FFE4B5, #FFDAB9);">
            <div class="chinese-card" style="width: 400px; padding: 40px;">
                <h2 style="text-align: center; margin-bottom: 30px; color: var(--secondary-color); font-family: 'KaiTi', 'SimSun', serif;">管理员登录</h2>
                <el-form :model="loginForm" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleLogin" style="width: 100%;">登录</el-button>
                    </el-form-item>
                </el-form>
                <div style="text-align: center; margin-top: 20px;">
                    <el-button type="text" @click="$emit('navigate', 'home')">返回首页</el-button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            }
        };
    },
    methods: {
        async handleLogin() {
            try {
                const response = await api.admin.login(this.loginForm);
                if (response.code === 200) {
                    localStorage.setItem('adminToken', response.data.token);
                    localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
                    this.$message.success('登录成功');
                    this.$emit('navigate', 'admin-dashboard');
                } else {
                    this.$message.error(response.message || '登录失败');
                }
            } catch (error) {
                this.$message.error(error.response?.data?.message || '登录失败');
            }
        }
    }
});