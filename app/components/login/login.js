let app = angular.module('AdminApp', []);

app.controller('LoginController', function ($scope, $location, $http, $window) {
    $scope.login = {
        username: '',
        password: ''
    }

    $scope.submitFormLogin = function () {
        console.log("click");

        const data = {
            username: $scope.login.username,
            password: $scope.login.password
        }
        $http.post('http://localhost:8080/api/administration/user/login', data)
            .then(function (response) {
                console.log(response.data.status);

                if (response.data.status) {

                    const token = response.data.data.token;
                    const userId = response.data.data.userId;
                    const roleName = response.data.data.roleName;

                    localStorage.setItem('token', token);
                    localStorage.setItem('username', $scope.login.username);
                    localStorage.setItem('userId', userId);
                    localStorage.setItem('roleName', roleName);
                    const redirectUrl = localStorage.getItem('redirectUrl');
                    if (redirectUrl) {
                        // Xóa URL đã lưu sau khi chuyển hướng
                        localStorage.removeItem('redirectUrl');
                        // Chuyển hướng đến trang trước đó
                        $location.absUrl(redirectUrl);
                    } else {

                        $window.location.href = '#/';
                    }
                } else {
                    $scope.message = response.data.message;
                }
            }, function (error) {
                console.log(error);
            }
            )
    }
}
) 