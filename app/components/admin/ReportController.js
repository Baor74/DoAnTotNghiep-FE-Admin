app.service('ReportService', function ($http) {
    var baseUrl = 'http://localhost:8080/api/admin/reports';

    // Hàm thêm header chứa token
    function getConfig() {
        var token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: 'Bearer ' + token
            }
        };
    }

    // Lấy tất cả báo cáo
    this.getReports = function () {
        return $http.get(baseUrl + '/all', getConfig())
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.error("Error fetching reports:", error);
                throw error;
            });
    };

    // Cập nhật trạng thái của báo cáo
    this.updateReportStatus = function (reportId, status, rejectedReason) {
        var url = baseUrl + '/' + reportId + '/status';
        var data = { status: status };
        if (rejectedReason) {
            data.rejectedReason = rejectedReason;
        }
        return $http.put(url, data, getConfig())
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.error("Error updating report status:", error);
                throw error;
            });
    };
});

app.controller('ReportController', function ($scope, ReportService) {
    $scope.reports = [];
    $scope.filters = {};
    $scope.selectedReport = null;
    $scope.rejectingReport = null;
    $scope.rejectReason = "";

    // Tải danh sách báo cáo
    $scope.loadReports = function () {
        ReportService.getReports().then(function (data) {
            $scope.allReports = angular.copy(data); // Lưu trữ danh sách gốc
            $scope.filteredReports = data;
        }).catch(function (error) {
            console.error("Lỗi khi tải báo cáo:", error);
            alert("Không thể tải báo cáo.");
        });
    };

    vm.updateFilteredReports = function () {
        let filtered = vm.reports;

        // Tìm kiếm báo cáo
        if (vm.searchQuery) {
            filtered = filtered.filter(report =>
                report.reportContent.toLowerCase().includes(vm.searchQuery.toLowerCase()));
        }

        // Sắp xếp báo cáo
        filtered.sort((a, b) => {
            if (vm.sortBy === 'createdAt') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return a.status.localeCompare(b.status);
        });

        // Phân trang
        const start = (vm.currentPage - 1) * vm.itemsPerPage;
        const end = start + vm.itemsPerPage;
        vm.filteredReports = filtered.slice(start, end);
    };

    vm.sortReports = function () {
        vm.updateFilteredReports();
    };

    vm.changePage = function (page) {
        if (page < 1 || page > vm.totalPages) return;
        vm.currentPage = page;
        vm.updateFilteredReports();
    };

    vm.approveReport = function (reportId) {
        $http.put(`${baseUrl}/${reportId}/status?status=Đã duyệt`, null, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(function () {
            const report = vm.reports.find(r => r.reportId === reportId);
            if (report) report.status = 'Đã duyệt';
            vm.updateFilteredReports();
            alert("Báo cáo đã được duyệt.");
        }).catch(function (error) {
            console.error("Lỗi khi duyệt báo cáo:", error);
            alert("Không thể duyệt báo cáo.");
        });
    };

    vm.openRejectModal = function (report) {
        vm.rejectingReport = report;
        vm.rejectedReason = "";
        $('#rejectModal').modal('show');
    };

    vm.viewReportDetails = function (report) {
        vm.selectedReport = report;
        $('#detailsModal').modal('show'); // Mở modal xem chi tiết
    };

    vm.confirmReject = function () {
        if (!vm.rejectedReason.trim()) {
            alert("Vui lòng nhập lý do từ chối.");
            return;
        }
        const reportId = vm.rejectingReport.reportId;
        $http.put(`${baseUrl}/${reportId}/status?status=Bị từ chối&reason=${encodeURIComponent(vm.rejectedReason)}`, null, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(function () {
            const report = vm.reports.find(r => r.reportId === reportId);
            if (report) {
                report.status = 'Bị từ chối';
                report.rejectedReason = vm.rejectedReason;
            }
            $('#rejectModal').modal('hide');
            vm.updateFilteredReports();
            alert("Báo cáo đã bị từ chối.");
        }).catch(function (error) {
            console.error("Lỗi khi từ chối báo cáo:", error);
            alert("Không thể từ chối báo cáo.");
        });
    };

    // Hủy từ chối báo cáo
    $scope.cancelReject = function () {
        $scope.rejectingReport = null;
        $scope.rejectReason = "";
        $('#rejectReportModal').modal('hide');
    };

    // Tìm kiếm báo cáo
    $scope.searchReports = function () {
        $scope.filteredReports = $scope.allReports.filter(function (report) {
            var matchStatus = !$scope.filters.status || report.status === $scope.filters.status;
            var matchType = !$scope.filters.reportType || 
                (report.reportType && report.reportType.toLowerCase().includes($scope.filters.reportType.toLowerCase()));
            var matchContent = !$scope.filters.reportContent || 
                (report.reportContent && report.reportContent.toLowerCase().includes($scope.filters.reportContent.toLowerCase()));
            var matchStartDate = !$scope.filters.startDate || new Date(report.createdAt) >= new Date($scope.filters.startDate);
            var matchEndDate = !$scope.filters.endDate || new Date(report.createdAt) <= new Date($scope.filters.endDate);
    
            return matchStatus && matchType && matchContent && matchStartDate && matchEndDate;
        });
    
        // Sau khi tìm kiếm, áp dụng sắp xếp nếu có
        $scope.sortReports();
    };
    
    // Reset bộ lọc tìm kiếm
    $scope.resetFilters = function () {
        $scope.filters = {};
        $scope.filteredReports = angular.copy($scope.allReports);
    };

    // Sắp xếp báo cáo
    $scope.sortReports = function () {
        if ($scope.filters.sortBy) {
            var sortBy = $scope.filters.sortBy.split('_');
            var sortField = sortBy[0];
            var sortOrder = sortBy[1] === 'asc' ? 1 : -1;

            $scope.filteredReports.sort(function (a, b) {
                var aValue = a[sortField];
                var bValue = b[sortField];

                // Nếu là ngày tạo, chuyển đổi thành timestamp để so sánh
                if (sortField === 'createdAt') {
                    aValue = new Date(aValue).getTime();
                    bValue = new Date(bValue).getTime();
                } else {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return -1 * sortOrder;
                }
                if (aValue > bValue) {
                    return 1 * sortOrder;
                }
                return 0;
            });
        }
    };

    // Tải báo cáo khi khởi động
    $scope.loadReports();
});
