let app = angular.module('ParkingAdminApp', ['ngRoute', 'ngSanitize']);

app.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/post", {
            templateUrl: "/DoAnTotNghiep-FE-Admin/app/components/admin/Post.html",
            controller: "PostController"
        })
        .when("/approve-post", {
            templateUrl: "/DoAnTotNghiep-FE-Admin/app/components/admin/AprovePost.html",
            controller: "ApprovalController"
        })
        .when("/accounts", {
            templateUrl: "/DoAnTotNghiep-FE-Admin/app/components/admin/Accounts.html",
            controller: "AccountsController"
        })
        .when("/payments", {
            templateUrl: "/DoAnTotNghiep-FE-Admin/app/components/admin/Payment.html",
            controller: "PaymentController"
        })
        .when("/price", {
            templateUrl: "/DoAnTotNghiep-FE-Admin/app/components/admin/Price.html",
            controller: "PriceController"
        })
        .when("/report", {
            templateUrl: "/DoAnTotNghiep-FE-Admin/app/components/admin/Report.html",
            controller: "ReportController"
        })
        .otherwise({
            redirectTo: "/HomePageAdmin.html"
        });
    
}]);
