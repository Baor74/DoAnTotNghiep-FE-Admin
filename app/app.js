let app = angular.module('ParkingApp', ['ngRoute', 'ngSanitize']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider

    $locationProvider.html5Mode(true);
}]);