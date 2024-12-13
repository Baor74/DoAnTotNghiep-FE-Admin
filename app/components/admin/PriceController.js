app.controller('PriceController', ['$scope', '$http', function($scope, $http) {
    const baseUrl = 'http://localhost:8080/api/prices';

    // Lấy token từ localStorage
    const token = localStorage.getItem('token');

    // Cấu hình headers với token
    const config = {
        headers: {
            checkToken: token
        }
    };

    $scope.prices = [];
    $scope.newPrice = {};
    $scope.editingPrice = null;

    // Lấy danh sách giá
    $scope.getAllPrices = function() {
        $http.get(baseUrl, config).then(
            function(response) {
                $scope.prices = response.data;
            },
            function(error) {
                console.error('Error fetching prices:', error);
            }
        );
    };

    // Tạo mới giá
    $scope.createPrice = function() {
        $http.post(baseUrl, $scope.newPrice, config).then(
            function(response) {
                $scope.prices.push(response.data);
                $scope.newPrice = {}; // Reset form
            },
            function(error) {
                console.error('Error creating price:', error);
            }
        );
    };

    // Cập nhật giá
    $scope.updatePrice = function() {
        if ($scope.editingPrice) {
            $http.put(`${baseUrl}/${$scope.editingPrice.priceId}`, $scope.editingPrice, config).then(
                function(response) {
                    $scope.getAllPrices(); // Refresh danh sách
                    $scope.editingPrice = null; // Reset form
                },
                function(error) {
                    console.error('Error updating price:', error);
                }
            );
        }
    };

    // Chọn giá để chỉnh sửa
    $scope.editPrice = function(price) {
        $scope.editingPrice = angular.copy(price);
    };

    // Xóa giá
    $scope.deletePrice = function(id) {
        $http.delete(`${baseUrl}/${id}`, config).then(
            function() {
                $scope.getAllPrices(); // Refresh danh sách
            },
            function(error) {
                console.error('Error deleting price:', error);
            }
        );
    };

    // Khởi tạo bằng cách load dữ liệu
    $scope.getAllPrices();
}]);
