
app.service('ReportService', function ($http) {
    let baseUrl = 'http://localhost:8080/api/admin/reports';

    // Lấy tất cả báo cáo
    this.getReports = function () {
        return $http.get(baseUrl + '/all')
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
        return $http.put(url, data)
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
            alert("Lỗi khi tải báo cáo.");
        });
    };

    // Xem chi tiết báo cáo
    $scope.viewDetails = function (report) {
        $scope.selectedReport = report;
        $('#viewReportModal').modal('show');
    };

    // Đóng modal chi tiết
    $scope.closeDetails = function () {
        $scope.selectedReport = null;
        $('#viewReportModal').modal('hide');
    };

    // Duyệt báo cáo
    $scope.approveReport = function (reportId) {
        ReportService.updateReportStatus(reportId, 'Đã duyệt').then(function () {
            // Cập nhật trạng thái trong danh sách
            var index = $scope.filteredReports.findIndex(r => r.reportId === reportId);
            if (index !== -1) {
                $scope.filteredReports[index].status = 'Đã duyệt';
                $scope.filteredReports[index].rejectedReason = null;
            }
            alert("Báo cáo đã được duyệt.");
        }).catch(function () {
            alert("Lỗi khi duyệt báo cáo.");
        });
    };

    // Từ chối báo cáo
    $scope.rejectReport = function (report) {
        $scope.rejectingReport = report;
        $scope.rejectReason = "";
        $('#rejectReportModal').modal('show');
    };

    // Xác nhận từ chối báo cáo
    $scope.confirmReject = function () {
        if (!$scope.rejectReason.trim()) {
            alert("Vui lòng nhập lý do từ chối.");
            return;
        }
        var reportId = $scope.rejectingReport.reportId;
        var statusWithReason = 'Bị từ chối';
        ReportService.updateReportStatus(reportId, statusWithReason, $scope.rejectReason).then(function () {
            // Cập nhật trạng thái và lý do trong danh sách
            var index = $scope.filteredReports.findIndex(r => r.reportId === reportId);
            if (index !== -1) {
                $scope.filteredReports[index].status = 'Bị từ chối';
                $scope.filteredReports[index].rejectedReason = $scope.rejectReason;
            }
            $('#rejectReportModal').modal('hide');
            alert("Báo cáo đã bị từ chối.");
        }).catch(function () {
            alert("Lỗi khi từ chối báo cáo.");
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
            var matchType = !$scope.filters.reportType || report.reportType.toLowerCase().includes($scope.filters.reportType.toLowerCase());
            var matchContent = !$scope.filters.reportContent || report.reportContent.toLowerCase().includes($scope.filters.reportContent.toLowerCase());
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