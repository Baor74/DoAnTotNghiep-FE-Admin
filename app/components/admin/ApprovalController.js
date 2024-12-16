app.controller('ApprovalPostController', function($scope, $http, $location) {
    // Khởi tạo các biến
    $scope.approvalPosts = [];
    $scope.approvalPosts = null; // Kết quả tìm kiếm
    $scope.page = 0;
    $scope.size = 15

    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Lấy tất cả bài viết với phân trang
    $scope.getAllApprovalPosts = function(page, size) {
        $http.get('http://localhost:8080/api/approval-posts', {
            params: { page: page, size: size },
            headers: headers
        })
        .then(function(response) {
            $scope.approvalPosts = response.data.content.map(post => {
                post.reviewedAtFormatted = post.reviewedAt ? new Date(post.reviewedAt).toLocaleString('en-GB') : 'N/A';
                return post;
            });
            $scope.totalPages = response.data.totalPages;
            $scope.currentPage = response.data.number;
        })
        .catch(function(error) {
            console.error("Lỗi khi lấy danh sách bài viết:", error);
        });
    };

    // Duyệt bài viết
    $scope.approvePost = function(postId) {
        const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
        $http.post(`http://localhost:8080/api/approval-posts/approve/${postId}`, null, {
            params: { userId: userId },
            headers: headers
        })
        .then(function(response) {
            alert("Bài viết đã được duyệt!");
            $scope.getAllApprovalPosts($scope.currentPage, $scope.pageSize);
        })
        .catch(function(error) {
            console.error("Lỗi khi duyệt bài viết:", error);
        });
    };

    // Từ chối bài viết
    $scope.rejectPost = function(postId) {
        const userId = localStorage.getItem("userId");
        const rejectionReason = prompt("Nhập lý do từ chối:");
        if (rejectionReason) {
            $http.post(`http://localhost:8080/api/approval-posts/reject/${postId}`, null, {
                params: { rejectionReason: rejectionReason, userId: userId },
                headers: headers
            })
            .then(function(response) {
                alert("Bài viết đã bị từ chối!");
                $scope.getAllApprovalPosts($scope.currentPage, $scope.pageSize);
            })
            .catch(function(error) {
                console.error("Lỗi khi từ chối bài viết:", error);
            });
        }
    };

    // Tìm kiếm bài viết
    $scope.search = function() {
        const searchQuery = $scope.searchQuery.trim(); // Loại bỏ khoảng trắng thừa
    
    
        const url = 'http://localhost:8080/api/approval-posts/search';
        const params = {
            approvalPostId: searchQuery,  // Tìm kiếm theo Approval Post ID
            page: $scope.currentPage || 0,  // Trang hiện tại
            size: $scope.pageSize || 15     // Kích thước trang
        };
    
        // Thêm headers cho API request
        const headers = {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Thêm Authorization token
            'Content-Type': 'application/json' // Đảm bảo header là JSON
        };
    
        $http.get(url, { params: params, headers: headers })
            .then(function(response) {
                console.log(response);
                $scope.approvalPosts = response.data.content || [];
                $scope.approvalPosts = response.data.content.map(post => {
                    post.reviewedAtFormatted = post.reviewedAt ? new Date(post.reviewedAt).toLocaleString('en-GB') : 'N/A';
                    return post;
                });
                $scope.totalPages = response.data.totalPages;
                $scope.currentPage = response.data.number;
    
                if ($scope.approvalPosts.length === 0) {
                    alert('Không tìm thấy bài viết nào phù hợp.');
                }
            })
            .catch(function(error) {
                console.error('Lỗi khi tìm Approval Post:', error);
                alert('Không tìm thấy dữ liệu phù hợp.');
            });
    };
    
    $scope.nextPage = function () {
        if ($scope.page < $scope.totalPages - 1) {
            $scope.page++;
            $scope.getAllApprovalPosts($scope.page, $scope.size);
        }
    };

    // Chuyển trang trước
    $scope.previousPage = function () {
        if ($scope.page > 0) {
            $scope.page--;
            $scope.getAllApprovalPosts($scope.page, $scope.size);
        }
    };


    // Xem chi tiết bài viết
    $scope.viewDetails = function(postId) {
        // Lưu lại đường dẫn hiện tại vào localStorage
        const currentPath = $location.path();
        localStorage.setItem('redirectUrl', currentPath);
        
        // Điều hướng đến trang chi tiết bài đăng và truyền postId trong query parameters
        $location.path('/post-detail').search({ postId: postId });
    };
    

    // Khởi chạy
    $scope.getAllApprovalPosts($scope.page, $scope.size);
});
