app.controller('PaymentController', function ($scope, $http, $location) {
    $scope.payments = [];
    $scope.userPayments = [];
    $scope.selectedPayment = {};
    $scope.searchQuery = '';
    $scope.sortCriteria = 'paymentDate';
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.totalPages = 0;

    // Lấy token từ localStorage
    const token = localStorage.getItem('token');

    // Cấu hình headers với token
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    $scope.loadAllPayments = function () {
        $http.get('http://localhost:8080/admin/payments/all') // URL API
            .then(function (response) {
                $scope.payments = response.data; // Lưu danh sách thanh toán vào $scope.payments
            })
            .catch(function (error) {
                console.error('Lỗi khi tải danh sách thanh toán:', error);
                $scope.errorMessage = 'Không thể tải danh sách thanh toán. Vui lòng thử lại sau.';
            });
    };

    // Gọi hàm loadAllPayments khi controller được khởi tạo

    // Load payments with pagination
    $scope.loadPayments = function (userId, page, size) {
        $http.get(`http://localhost:8080/api/vnpay/user/${userId}`, {
            params: { page: page, size: size },
            headers: config.headers
        }).then(function (response) {
            $scope.userPayments = response.data.content; // Payments for the current page
            $scope.totalPages = response.data.totalPages; // Total pages
            $scope.currentPage = response.data.number;   // Current page
        }).catch(function (error) {
            console.error('Lỗi khi lấy danh sách thanh toán:', error);
        });
    };

    // View payment details
    $scope.viewPayment = function (paymentId) {
        $http.get(`http://localhost:8080/api/vnpay/${paymentId}`, config)
            .then(function (response) {
                $scope.selectedPayment = response.data;
                $('#paymentModal').modal('show');
            })
            .catch(function (error) {
                console.error('Lỗi khi lấy chi tiết thanh toán:', error);
            });
    };

    $scope.viewDetails = function (postId) {
        // Lưu lại đường dẫn hiện tại vào localStorage
        const currentPath = $location.path();
        localStorage.setItem('redirectUrl', currentPath);
    
        // Điều hướng đến trang chi tiết bài đăng
        // $location.path('/admin/post-detail/' + postId);
        $location.path('/post-detail').search({ postId: postId });
    
      };

    // Load next page
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPages - 1) {
            $scope.loadPayments(1, $scope.currentPage + 1, $scope.pageSize);
        }
    };

    $scope.formatCurrency = function (amount) {
        if (amount != null) {
            return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return "0 VND";
    };
    
    // Load previous page
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.loadPayments(1, $scope.currentPage - 1, $scope.pageSize);
        }
    };

    $scope.searchPayments = function (query) {
        if (!query) {
            alert("Vui lòng nhập từ khóa tìm kiếm!");
            return;
        }
    
        const params = {
            userId: 1, // Thay bằng userId hiện tại
            paymentId: null,
            postId: null,
            page: 0,
            size: 10
        };
    
        if (!isNaN(query)) {
            // Nếu input là số, coi đó là paymentId hoặc postId
            params.paymentId = query;
        } else {
            // Nếu input không phải số, xử lý tìm kiếm khác (nếu có logic)
            alert("Chỉ hỗ trợ tìm kiếm bằng ID Payment hoặc ID Post!");
            return;
        }
    
        $http.get('http://localhost:8080/api/vnpay/search', { 
            params: params, 
            headers: config.headers // Thêm headers vào request
        })
        .then(function (response) {
            $scope.payments = response.data.content; // Dữ liệu thanh toán
            $scope.totalPages = response.data.totalPages; // Tổng số trang
            $scope.currentPage = response.data.number;   // Trang hiện tại
        })
        .catch(function (error) {
            console.error('Lỗi khi tìm kiếm thanh toán:', error);
        });
    };
    
    

    
 
    $scope.loadPayments(1, 0, $scope.pageSize);
    // $scope.loadAllPayments();
});
