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
        .when('/post-detail', {
            templateUrl: 'app/components/admin/PostDetail.html',
            controller: 'PostDetailController'
        })
        .when('/approve', {
            templateUrl: 'app/components/admin/AprovePost.html',
            controller: 'ApprovalPostController'
        })
        .when('/account', {
            templateUrl: 'app/components/admin/Account.html',
            controller: 'AccountController'
        })
        .when('/payment', {
            templateUrl: 'app/components/admin/Payment.html',
            controller: 'PaymentController'
        })
        .when('/price', {
            templateUrl: 'app/components/admin/Price.html',
            controller: 'PriceController'
        })
        .when('/report', {
            templateUrl: 'app/components/admin/Report.html',
            controller: 'ReportController'
        })
        .when('/user', {
            templateUrl: 'app/components/admin/Users.html',
            controller: 'AdminController'
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