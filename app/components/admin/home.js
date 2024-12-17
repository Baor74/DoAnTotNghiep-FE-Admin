// let app = angular.module("adminApp", []);

app.controller("adminAppController", function ($scope, $http) {

    const token = localStorage.getItem("token");
    const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let lineChart; // Declare chart variable for dynamic updates
    let pieChart;

    $scope.year = '';
    $scope.selectYear = new Date().getFullYear();

    $scope.updateYear = function () {
        if ($scope.year && !isNaN($scope.year) && $scope.year.toString().length === 4 && $scope.year <= $scope.selectYear) {
            $scope.selectYear = $scope.year;

            $scope.paymentLineChart();
        } else {
            alert("Vui lòng nhập đúng năm");
        }

    }

    const initializeLineChart = (lineChartData) => {
        const ctx2 = document.getElementById('lineChart');
        if (lineChart) {
            lineChart.data = lineChartData; // Update chart data
            lineChart.update(); // Refresh chart
        } else {
            lineChart = new Chart(ctx2, {
                type: 'line',
                data: lineChartData,
            });
        }
    };

    const initializePieChart = (pieChartData) => {
        const ctx1 = document.getElementById('pieChart');
        if (pieChart) {
            pieChart.data = pieChartData;
            pieChart.update();
        } else {
            pieChart = new Chart(ctx1, {
                type: 'pie',
                data: pieChartData
            })
        }

    }

    $scope.postsPieChart = function () {
        $http.get(`http://localhost:8080/api/statistic/countPostsGroupedByStatus`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    const countPostData = response.data.data;

                    const countPost = [];

                    const statusNames = [];


                    if (countPostData && Array.isArray(countPostData)) {
                        countPostData.forEach(item => {
                            const statusName = item[0];
                            const count = item[1];
                            countPost.push(count);
                            statusNames.push(statusName);

                        });
                    };

                    const pieChartData = {
                        labels: statusNames,
                        datasets: [{
                            label: 'số lượng',
                            data: countPost,
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)'
                            ],
                            hoverOffset: 4
                        }]
                    }
                    initializePieChart(pieChartData)
                }

            }).catch((err) => {
                console.log(err);

            });

    }

    $scope.usersLineChart = function () {
        $http.get(`http://localhost:8080/api/users/getUsersByMonthAndRole?year=${$scope.selectYear}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    $scope.dataRegistrations = response.data.data;

                    const registrations = new Array(12).fill(0);

                    if ($scope.dataRegistrations && Array.isArray($scope.dataRegistrations)) {
                        $scope.dataRegistrations.forEach(item => {
                            const monthIndex = item[0] - 1;
                            const count = item[1];
                            registrations[monthIndex] = count;
                        });
                    }

                    const lineChartData = {
                        labels: labels,
                        datasets: [{
                            label: 'Tổng số tài khoản đăng kí qua từng tháng năm ' + $scope.selectYear,
                            data: registrations,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    };

                    initializeLineChart(lineChartData);
                } else {
                    console.log(response.data.message);
                }
            }).catch((err) => {
                console.log(err);
            });
    };

    $scope.paymentLineChart = function () {
        $http.get(`http://localhost:8080/api/vnpay/getRevenueByMonth?year=${$scope.selectYear}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            if (response.data.status) {
                const dataPayment = response.data.data;

                const revenues = new Array(12).fill(0);

                if (dataPayment && Array.isArray(dataPayment)) {
                    dataPayment.forEach(item => {
                        const monthIndex = item[0] - 1;
                        const revenue = item[1];
                        revenues[monthIndex] = revenue;
                    });
                }

                const lineChartData = {
                    labels: labels,
                    datasets: [{
                        label: 'Tổng doanh thu qua từng tháng năm ' + $scope.selectYear,
                        data: revenues,
                        fill: false,
                        borderColor: 'rgb(75, 195, 195)',
                        tension: 0.1
                    }]
                };

                initializeLineChart(lineChartData);
            }
        }).catch((err) => {
            console.log(err);
        });

    };
    $scope.postLineChart = function () {
        $http.get(`http://localhost:8080/api/statistic/countActivePostsByMonthAndYear?year=${$scope.selectYear}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            if (response.data.status) {
                const dataPayment = response.data.data;

                const revenues = new Array(12).fill(0);

                if (dataPayment && Array.isArray(dataPayment)) {
                    dataPayment.forEach(item => {
                        const monthIndex = item[0] - 1;
                        const revenue = item[1];
                        revenues[monthIndex] = revenue;
                    });
                }

                const lineChartData = {
                    labels: labels,
                    datasets: [{
                        label: 'Tổng bài đăng qua từng tháng năm ' + $scope.selectYear,
                        data: revenues,
                        fill: false,
                        borderColor: 'rgb(75, 195, 195)',
                        tension: 0.1
                    }]
                };

                initializeLineChart(lineChartData);
            }
        }).catch((err) => {
            console.log(err);
        });
    };
    $scope.countUsers = function () {
        $http.get("http://localhost:8080/api/statistic/countUsers", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    $scope.totalUsers = response.data.data
                }
            }).catch((err) => {
                console.log(err);

            });
    }
    $scope.countPosts = function () {
        $http.get("http://localhost:8080/api/statistic/countPosts", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    $scope.totalPosts = response.data.data
                }
            }).catch((err) => {
                console.log(err);

            });
    }
    $scope.countPayments = function () {
        $http.get("http://localhost:8080/api/statistic/countPayments", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    $scope.totalPayments = response.data.data
                }
            }).catch((err) => {
                console.log(err);

            });
    }

    $scope.countUsers();
    $scope.countPayments();
    $scope.countPosts();
    // render chart
    $scope.postsPieChart();
    $scope.paymentLineChart();
});
