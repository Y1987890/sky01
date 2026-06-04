const eventBus = new Vue();

const API_BASE_URL = 'http://localhost:8080/api';

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.response.use(
    response => {
        const data = response.data;
        if (data && data.code === 200 && data.data !== undefined) {
            return data.data;
        }
        return data;
    },
    error => {
        return Promise.reject(error);
    }
);

const api = {
    user: {
        register: (data) => axios.post(`${API_BASE_URL}/user/register`, data),
        login: (data) => axios.post(`${API_BASE_URL}/user/login`, data),
        getInfo: (token) => axios.get(`${API_BASE_URL}/user/info`, {
            headers: { Authorization: token }
        }),
        updateInfo: (token, data) => axios.put(`${API_BASE_URL}/user/info`, data, {
            headers: { Authorization: token }
        }),
        updatePassword: (token, data) => axios.put(`${API_BASE_URL}/user/password`, data, {
            headers: { Authorization: token }
        }),
        getList: (params) => axios.get(`${API_BASE_URL}/user/list`, { params })
    },

    category: {
        getTree: () => axios.get(`${API_BASE_URL}/category/tree`),
        getTop: () => axios.get(`${API_BASE_URL}/category/top`),
        getSub: (parentId) => axios.get(`${API_BASE_URL}/category/sub/${parentId}`),
        getList: (params) => axios.get(`${API_BASE_URL}/category/list`, { params }),
        add: (data) => axios.post(`${API_BASE_URL}/category/add`, data),
        update: (data) => axios.put(`${API_BASE_URL}/category/update`, data),
        delete: (id) => axios.delete(`${API_BASE_URL}/category/delete/${id}`)
    },

    product: {
        getList: (params) => axios.get(`${API_BASE_URL}/product/list`, { params }),
        getDetail: (id) => axios.get(`${API_BASE_URL}/product/detail/${id}`),
        getHot: (limit) => axios.get(`${API_BASE_URL}/product/hot`, { params: { limit } }),
        getNew: (limit) => axios.get(`${API_BASE_URL}/product/new`, { params: { limit } }),
        getRelated: (categoryId, productId, limit) => axios.get(`${API_BASE_URL}/product/related/${categoryId}/${productId}`, { params: { limit } }),
        add: (data) => axios.post(`${API_BASE_URL}/product/add`, data),
        update: (id, data) => axios.put(`${API_BASE_URL}/product/update/${id}`, data),
        delete: (id) => axios.delete(`${API_BASE_URL}/product/delete/${id}`)
    },

    cart: {
        getList: (token) => axios.get(`${API_BASE_URL}/cart/list`, {
            headers: { Authorization: token }
        }),
        add: (token, data) => axios.post(`${API_BASE_URL}/cart/add`, data, {
            headers: { Authorization: token }
        }),
        update: (token, data) => axios.put(`${API_BASE_URL}/cart/update`, data, {
            headers: { Authorization: token }
        }),
        remove: (token, data) => axios.delete(`${API_BASE_URL}/cart/remove`, {
            headers: { Authorization: token },
            data: typeof data === 'object' ? data : { productId: data }
        }),
        clear: (token) => axios.delete(`${API_BASE_URL}/cart/clear`, {
            headers: { Authorization: token }
        }),
        getTotal: (token) => axios.get(`${API_BASE_URL}/cart/total`, {
            headers: { Authorization: token }
        })
    },

    order: {
        create: (token, data) => axios.post(`${API_BASE_URL}/order/create`, data, {
            headers: { Authorization: token }
        }),
        getDetail: (orderId) => axios.get(`${API_BASE_URL}/order/detail/${orderId}`),
        getList: (token, params) => axios.get(`${API_BASE_URL}/order/list`, {
            headers: { Authorization: token },
            params
        }),
        cancel: (orderId) => axios.put(`${API_BASE_URL}/order/cancel/${orderId}`),
        confirm: (orderId) => axios.put(`${API_BASE_URL}/order/confirm/${orderId}`),
        pay: (orderId, data) => axios.put(`${API_BASE_URL}/order/pay/${orderId}`, data),
        updateStatus: (orderId, status) => axios.put(`${API_BASE_URL}/order/status/${orderId}`, { status }),
        getStatistics: () => axios.get(`${API_BASE_URL}/order/statistics`)
    },

    review: {
        getByProduct: (productId) => axios.get(`${API_BASE_URL}/review/product/${productId}`),
        getList: (params) => axios.get(`${API_BASE_URL}/review/list`, { params }),
        add: (data) => axios.post(`${API_BASE_URL}/review/add`, data),
        delete: (id) => axios.delete(`${API_BASE_URL}/review/delete/${id}`),
        getAverage: (productId) => axios.get(`${API_BASE_URL}/review/average/${productId}`)
    },

    address: {
        getList: (token) => axios.get(`${API_BASE_URL}/address/list`, {
            headers: { Authorization: token }
        }),
        getDefault: (token) => axios.get(`${API_BASE_URL}/address/default`, {
            headers: { Authorization: token }
        }),
        add: (token, data) => axios.post(`${API_BASE_URL}/address/add`, data, {
            headers: { Authorization: token }
        }),
        update: (token, data) => axios.put(`${API_BASE_URL}/address/update`, data, {
            headers: { Authorization: token }
        }),
        delete: (id) => axios.delete(`${API_BASE_URL}/address/delete/${id}`),
        setDefault: (token, addressId) => axios.put(`${API_BASE_URL}/address/setDefault/${addressId}`, {}, {
            headers: { Authorization: token }
        })
    },

    coupon: {
        getAvailable: () => axios.get(`${API_BASE_URL}/coupon/available`),
        getList: (params) => axios.get(`${API_BASE_URL}/coupon/list`, { params }),
        add: (data) => axios.post(`${API_BASE_URL}/coupon/add`, data),
        update: (data) => axios.put(`${API_BASE_URL}/coupon/update`, data),
        delete: (id) => axios.delete(`${API_BASE_URL}/coupon/delete/${id}`),
        receive: (token, couponId) => axios.post(`${API_BASE_URL}/coupon/receive/${couponId}`, {}, {
            headers: { Authorization: token }
        })
    },

    admin: {
        login: (data) => axios.post(`${API_BASE_URL}/admin/login`, data),
        getInfo: (token) => axios.get(`${API_BASE_URL}/admin/info`, {
            headers: { Authorization: token }
        }),
        updatePassword: (token, data) => axios.put(`${API_BASE_URL}/admin/password`, data, {
            headers: { Authorization: token }
        }),
        updateUserStatus: (userId, status) => axios.put(`${API_BASE_URL}/admin/user/status/${userId}`, { status }),
        getOrders: (token, params) => axios.get(`${API_BASE_URL}/admin/orders`, {
            headers: { Authorization: token },
            params
        }),
        getOrderDetail: (token, orderId) => axios.get(`${API_BASE_URL}/admin/order/${orderId}`, {
            headers: { Authorization: token }
        })
    }
};