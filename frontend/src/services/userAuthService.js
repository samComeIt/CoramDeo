import api from './apiService';

const userAuthService = {
  login: async (name, password) => {
    const response = await api.post('/user/login', {
      username: name,
      password: password
    });

    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userId', response.data.adminId); // Backend returns adminId for user ID too
      localStorage.setItem('userName', response.data.username);
      localStorage.setItem('userType', 'user'); // To distinguish from admin
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
  },

  isAuthenticated: () => {
    return localStorage.getItem('userToken') !== null &&
           localStorage.getItem('userType') === 'user';
  },

  getUserId: () => {
    return localStorage.getItem('userId');
  },

  getUserName: () => {
    return localStorage.getItem('userName');
  },

  getToken: () => {
    return localStorage.getItem('userToken');
  }
};

export default userAuthService;