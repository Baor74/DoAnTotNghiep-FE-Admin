// Khai báo module chính
let app = angular.module('ParkingAdminApp', ['ngRoute', 'ngSanitize']);

app.config(["$routeProvider", "$locationProvider", function ($routeProvider,  $locationProvider) {
    $locationProvider.html5Mode(false); // Sử dụng hash mode
    $locationProvider.hashPrefix(''); // Không thêm ký tự "!"
    $routeProvider
        .when('/', {
            templateUrl: 'app/components/admin/Home.html',
            controller: 'HomeController'
        })
        .when('/statistic', {
            templateUrl: 'app/components/admin/statistic.html',
            controller: 'adminAppController'
        })
        .when('/post', {
            templateUrl: 'app/components/admin/Post.html',
            controller: 'PostController'
        })
        .when('/user', {
            templateUrl: 'app/components/admin/Users.html',
            controller: 'AdminController'
        })
        .when('/detailAccount', {
            templateUrl: 'app/components/admin/DetailAcount.html',
            controller: 'detailUserController'
        })
        .otherwise({
            redirectTo: '/'
        });

}]);
// Đặt đoạn mã sửa lỗi URL
app.run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function () {
        let decodedPath = decodeURIComponent($location.path());
        if ($location.path() !== decodedPath) {
            $location.path(decodedPath).replace();
        }
    });
}]);