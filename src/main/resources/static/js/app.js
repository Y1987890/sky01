new Vue({
    el: '#app',
    data: {
        currentPage: 'home',
        currentProductId: null,
        currentCategoryId: 1,
        userTab: 'profile',
        adminTab: 'overview',
        loginVisible: false,
        registerVisible: false,
        loginForm: {
            username: '',
            password: ''
        },
        registerForm: {
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            phone: ''
        }
    },
    methods: {
        navigateTo(page, data) {
            this.currentPage = page;
            if (data) {
                if (data.productId) {
                    this.currentProductId = data.productId;
                }
                if (data.tab) {
                    this.userTab = data.tab;
                }
                if (data.categoryId !== undefined) {
                    this.currentCategoryId = data.categoryId;
                }
                if (data.orderId) {
                    this.currentOrderId = data.orderId;
                }
            }
            window.scrollTo(0, 0);
        },
        showLogin() {
            this.loginVisible = true;
        },
        showRegister() {
            this.registerVisible = true;
        },
        async handleLogin() {
            try {
                const response = await api.user.login(this.loginForm);
                if (response.code === 200) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userInfo', JSON.stringify(response.data.user));
                    this.$message.success('登录成功');
                    this.loginVisible = false;
                    console.log('Login success, user:', response.data.user);
                    eventBus.$emit('userLoggedIn', response.data.user);
                    this.currentPage = 'home';
                    console.log('Navigated to home, currentPage:', this.currentPage);
                } else {
                    this.$message.error(response.message || '登录失败');
                }
            } catch (error) {
                console.error('Login error:', error);
                this.$message.error(error.response?.data?.message || '登录失败');
            }
        },
        async handleRegister() {
            if (this.registerForm.password !== this.registerForm.confirmPassword) {
                this.$message.error('两次密码输入不一致');
                return;
            }
            try {
                await api.user.register({
                    username: this.registerForm.username,
                    password: this.registerForm.password,
                    email: this.registerForm.email,
                    phone: this.registerForm.phone
                });
                this.$message.success('注册成功');
                this.registerVisible = false;
                this.loginVisible = true;
            } catch (error) {
                this.$message.error('注册失败');
            }
        }
    },
    mounted() {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            this.currentPage = 'admin-dashboard';
        }
    }
});