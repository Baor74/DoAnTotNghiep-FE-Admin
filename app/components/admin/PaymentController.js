
    app.controller('PaymentController', function ($scope, $http) {
    const apiBaseUrl = 'http://localhost:8080/api/admin/payments';
    const token = localStorage.getItem("token");
    $scope.payments = [];
    $scope.filteredPayments = [];
    $scope.newPayment = {};
    $scope.sortOption = 'paymentDate';
    $scope.sortDirection = 'asc';
    $scope.pageSize = 10; // Số bản ghi mỗi trang
    $scope.currentPage = 1;

    // Lấy danh sách thanh toán
    $scope.loadPayments = function () {
        $http.get(apiBaseUrl + '/all', {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(function (response) {
            $scope.payments = response.data;
            $scope.filteredPayments = $scope.payments; // Khởi tạo filteredPayments
            $scope.totalPages = Math.ceil($scope.filteredPayments.length / $scope.pageSize);
        }, function (error) {
            console.error("Error loading payments: ", error);
        });
    };

    // Lọc danh sách thanh toán theo tìm kiếm và sắp xếp
    $scope.filterPayments = function () {
        $scope.filteredPayments = $scope.payments.filter(function (payment) {
            return payment.postName.toLowerCase().includes($scope.searchQuery?.toLowerCase() || '') ||
                payment.paymentStatus.toLowerCase().includes($scope.searchQuery?.toLowerCase() || '');
        });

        // Sắp xếp theo lựa chọn
        $scope.filteredPayments = $scope.filteredPayments.sort(function (a, b) {
            if ($scope.sortDirection === 'asc') {
                return a[$scope.sortOption] > b[$scope.sortOption] ? 1 : -1;
            } else {
                return a[$scope.sortOption] < b[$scope.sortOption] ? 1 : -1;
            }
        });

        // Cập nhật tổng số trang sau khi lọc
        $scope.totalPages = Math.ceil($scope.filteredPayments.length / $scope.pageSize);
    };

    // Cập nhật trạng thái thanh toán
    $scope.updatePaymentStatus = function (paymentId, status) {
        $http.put(apiBaseUrl + '/' + paymentId + '/status', null, {
            params: { status: status },
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(function (response) {
            $scope.loadPayments();
            alert("Payment status updated successfully!");
        }, function (error) {
            console.error("Error updating payment status: ", error);
        });
    };

    // Tạo mới thanh toán
    $scope.createPayment = function () {
        $http.post(apiBaseUrl + '/create', $scope.newPayment, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(function (response) {
            alert("Payment created successfully!");
            $scope.loadPayments();
        }, function (error) {
            console.error("Error creating payment: ", error);
        });
    };

    // Chuyển trang
    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPages) {
            $scope.currentPage++;
        }
    };

    // Xử lý khi nhấn nút "Xem Chi Tiết"
    $scope.loadPaymentDetails = function (paymentId) {
        $http.get(apiBaseUrl + '/' + paymentId, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(function (response) {
            $scope.paymentDetails = response.data;
            $scope.modalVisible = true; // Hiển thị modal
        }, function (error) {
            console.error("Error loading payment details: ", error);
        });
    };

    // Đóng modal
    $scope.closeModal = function () {
        $scope.modalVisible = false; // Ẩn modal
    };

    // Khởi tạo dữ liệu
    $scope.loadPayments();
});
