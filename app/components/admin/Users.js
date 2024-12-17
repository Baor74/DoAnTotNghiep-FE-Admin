
app.controller('AdminController', function ($scope, $http, $window) {

    // Lấy dữ liệu tỉnh thành từ GitHub
    $http.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
        .then(function (response) {
            // Lưu dữ liệu vào $scope
            $scope.provinces = response.data;
        })
        .catch(function (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        });

    // Khi chọn Tỉnh/Thành Phố
    $scope.onProvinceChange = function () {
        $scope.selectedDistrict = null; // Reset Quận/Huyện
        $scope.selectedWard = null;     // Reset Phường/Xã

        if ($scope.selectedProvince) {
            $scope.districts = $scope.selectedProvince.Districts; // Lấy danh sách Quận/Huyện
        } else {
            $scope.districts = [];
        }
    };

    // Khi chọn Quận/Huyện
    $scope.onDistrictChange = function () {
        $scope.selectedWard = null;     // Reset Phường/Xã

        if ($scope.selectedDistrict) {
            $scope.wards = $scope.selectedDistrict.Wards; // Lấy danh sách Phường/Xã
        } else {
            $scope.wards = [];
        }
    };

    // Hàm tìm kiếm gợi ý Tỉnh/Thành Phố
    $scope.searchSuggestions = function (inputValue) {
        if (!inputValue) {
            $scope.suggestions = []; // Nếu không có giá trị, không hiển thị gợi ý
            return;
        }

        // Tìm kiếm trong danh sách tỉnh thành
        $scope.suggestions = $scope.provinces.filter(function (province) {
            return province.Name.toLowerCase().includes(inputValue.toLowerCase());
        });
    };

    // Chọn Tỉnh/Thành Phố từ gợi ý
    $scope.selectProvince = function (province) {
        $scope.selectedProvince = province;
        $scope.inputProvince = province.Name; // Cập nhật giá trị input
        $scope.suggestions = []; // Ẩn danh sách gợi ý
        $scope.onProvinceChange(); // Reset quận/huyện
    };

    const token = localStorage.getItem("token");

    $scope.currentPage = 1;
    $scope.pageSize = 10;

    // Lấy danh sách người dùng
    $scope.loadUsers = function () {
        $http.get(`http://localhost:8080/api/users/getAllUsers?page=${$scope.currentPage - 1}&size=${$scope.pageSize}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(function (response) {
                if (response.data.status) {
                    $scope.users = response.data.data; // Danh sách người dùng của trang hiện tại
                    $scope.totalPages = response.data.totalPages; // Tổng số trang
                } else {
                    console.log(response.data.message);
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    };

    $scope.goToFirstPage = function () {
        $scope.currentPage = 1;
        $scope.loadUsers();
    };

    $scope.previousPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.loadUsers();
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPages) {
            $scope.currentPage++;
            $scope.loadUsers();
        }
    };

    $scope.goToLastPage = function () {
        $scope.currentPage = $scope.totalPages;
        $scope.loadUsers();
    };

    if (token) {
        // Gọi hàm loadUsers khi trang được tải
        $scope.loadUsers();
    } else {
        localStorage.setItem('redirectUrl', $window.location.href);
        $window.location.href = '/app/components/Login/LoginAndRegister.html';
    }

    // lây thông tin chi tiết của 1 user
    $scope.getUserByUsername = function (username) {
        $http.get(`http://localhost:8080/api/users/getUserByUsername?username=${username}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Gửi token trong header
            }
        })
            .then(function (response) {
                if (response.data.status) {
                    const data = response.data.data;
                    $scope.userId = data.userId
                    $scope.firstName = data.firstName;
                    $scope.lastName = data.lastName;
                    $scope.gender = data.gender;
                    $scope.dateOfBirth = new Date(data.dateOfBirth).toLocaleDateString('en-GB');
                    $scope.phoneNumber = data.phoneNumber;
                    $scope.email = data.email;
                    $scope.avatar = data.avatar;
                    $scope.username = data.username;
                    $scope.password = data.password;
                    $scope.isActive = data.isActive;
                    $scope.createdAt = new Date(data.createdAt).toLocaleString('en-GB');
                    // Đổ dữ liệu Tỉnh/Thành Phố, Quận/Huyện, Phường/Xã

                    $scope.selectedProvince = $scope.provinces.find(province => province.Name === data.provinceName);
                    if ($scope.selectedProvince) {
                        $scope.inputProvince = $scope.selectedProvince.Name; // Gán giá trị cho input

                        $scope.districts = $scope.selectedProvince.Districts; // Lấy danh sách Quận/Huyện

                        $scope.selectedDistrict = $scope.districts.find(district => district.Name === data.districtName);
                        if ($scope.selectedDistrict) {
                            $scope.wards = $scope.selectedDistrict.Wards; // Lấy danh sách Phường/Xã

                            $scope.selectedWard = $scope.wards.find(ward => ward.Name === data.wardName);
                        }
                    }


                } else {
                    console.log(response.data.message);
                }
            }, function (error) {
                console.log(error);
            }
            )
    }

    $scope.username = '';
    $scope.password = '';
    $scope.createAccount = function () {
        const data = {
            username: $scope.username,
            password: $scope.password,

        }
    }

    // cập nhật trạng thái tài khoản
    $scope.updateActive = function (id, isActive) {
        const active = !isActive;
        $http.put(`http://localhost:8080/api/users/${id}?active=${active}`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.data.status) {
                    // Tìm thông báo trong danh sách và cập nhật trạng thái isRead
                    const user = $scope.users.find(info => info.userId === id);
                    if (user) {
                        user.isActive = active;
                    }
                    if (active) {
                        $scope.showToast("Mở khóa tài khoản thành công.");
                    } else {
                        $scope.showToast("Khóa tài khoản thành công.");
                    }

                } else {
                    $scope.showToast("Có lỗi xãy ra. Khóa tài khoản thất bại.");
                }
            }).catch((err) => {
                $scope.showToast("Có lỗi xãy ra. Khóa tài khoản thất bại.");
                console.log(err);

            });

    }

    $scope.findUser = function () {
        const searchValue = document.getElementById('searchInputNav').value;

        // Kiểm tra nếu input rỗng
        if (!searchValue.trim()) {
            alert('Vui lòng nhập từ khóa để tìm kiếm!');
            return;
        }
    }

    $scope.searchCriteria = {
        userId: '',
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        page: $scope.currentPage - 1,
        size: $scope.pageSize
    };

    $scope.findUser = function () {
        const params = {
            userId: $scope.searchCriteria.id || null,
            username: $scope.searchCriteria.username || null,
            firstName: $scope.searchCriteria.firstName || null,
            lastName: $scope.searchCriteria.lastName || null,
            phoneNumber: $scope.searchCriteria.phoneNumber || null,
            page: $scope.currentPage - 1,
            size: $scope.pageSize
        };
        console.log(params);


        // Gọi API tìm kiếm
        $http.get('http://localhost:8080/api/users/searchUsers', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: params
        })
            .then(function (response) {

                if ($scope.user) {
                    $scope.users = response.data.data; // Danh sách người dùng của trang hiện tại
                    $scope.totalPages = response.data.totalPages; // Tổng số trang
                } else {
                    alert("Không tìm thấy người dùng");
                }

            })
            .catch(function (error) {
                // Xử lý lỗi
                console.error('Lỗi khi gọi API:', error);
            });
    };


    // Show success toast
    $scope.showToast = function (message) {
        $scope.toastMessage = message;
        const toastElement = document.getElementById('toast');
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    };

})