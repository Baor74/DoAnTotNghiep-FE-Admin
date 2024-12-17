app.controller('HomeController', function ($scope, $http, $window) {

    $scope.logout = function () {
        // Xóa toàn bộ dữ liệu lưu trữ trong localStorage
        localStorage.clear();

        // Chuyển hướng về trang đăng nhập
        $window.location.href="/app/components/login/login.html";

    };
})
