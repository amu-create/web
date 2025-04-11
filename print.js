
$(document).ready(function () {
  let userData = JSON.parse(localStorage.getItem('userData')) || [];
  let currentPage = 1;
  const rowsPerPage = 5;
  let sortField = 'id';
  let sortDirection = 'asc';
  let filterText = '';

  function saveToLocalStorage() {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  function showAlert(msg, type) {
    const alertBox = $('#alertMessage');
    alertBox.removeClass().addClass(`alert alert-${type}`).text(msg).slideDown();
    setTimeout(() => alertBox.slideUp(), 3000);
  }

  function renderTable() {
    $('#userTable tbody').empty();
    const sortedData = [...userData].sort((a, b) => {
      if (sortDirection === 'asc') return a[sortField] > b[sortField] ? 1 : -1;
      else return a[sortField] < b[sortField] ? 1 : -1;
    });

    const filteredData = sortedData.filter(user =>
      user.id.toLowerCase().includes(filterText.toLowerCase()) ||
      user.phone.includes(filterText)
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const start = (currentPage - 1) * rowsPerPage;
    const paginated = filteredData.slice(start, start + rowsPerPage);

    if (paginated.length === 0) {
      $('#userTable tbody').html('<tr><td colspan="3" style="text-align:center">표시할 데이터 없음</td></tr>');
    } else {
      paginated.forEach(user => {
        $('#userTable tbody').append(`
          <tr>
            <td>${user.id}</td>
            <td>${user.phone}</td>
            <td>
              <button class="action-btn edit-btn" data-id="${user.id}"><i class="fas fa-edit"></i> 수정</button>
              <button class="action-btn delete-btn" data-id="${user.id}"><i class="fas fa-trash"></i> 삭제</button>
            </td>
          </tr>
        `);
      });
    }

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    const pagination = $('#pagination');
    pagination.empty();

    if (totalPages > 1) {
      pagination.append(`<li><a href="#" class="pagination-link" data-page="prev">&laquo;</a></li>`);
      for (let i = 1; i <= totalPages; i++) {
        pagination.append(`<li><a href="#" class="pagination-link ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</a></li>`);
      }
      pagination.append(`<li><a href="#" class="pagination-link" data-page="next">&raquo;</a></li>`);
    }
  }

  $(document).on('click', '.pagination-link', function (e) {
    e.preventDefault();
    const page = $(this).data('page');
    const totalPages = Math.ceil(userData.length / rowsPerPage);
    if (page === 'prev' && currentPage > 1) currentPage--;
    else if (page === 'next' && currentPage < totalPages) currentPage++;
    else if (!isNaN(page)) currentPage = page;
    renderTable();
  });

  $('#searchInput').on('input', function () {
    filterText = $(this).val();
    currentPage = 1;
    renderTable();
  });

  $('#userTable th[data-sort]').on('click', function () {
    const newSort = $(this).data('sort');
    if (sortField === newSort) sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    else {
      sortField = newSort;
      sortDirection = 'asc';
    }
    $('#userTable th').removeClass('sort-asc sort-desc');
    $(this).addClass(`sort-${sortDirection}`);
    renderTable();
  });

  $('#addUserBtn').on('click', function () {
    $('#modalTitle').text('이용자 추가');
    $('#userForm')[0].reset();
    $('#editUserId').val('');
    $('#userModal').show();
  });

  $(document).on('click', '.edit-btn', function () {
    const id = $(this).data('id');
    const user = userData.find(u => u.id === id);
    if (user) {
      $('#modalTitle').text('이용자 수정');
      $('#editUserId').val(id);
      $('#userId').val(user.id);
      $('#userPhone').val(user.phone);
      $('#userModal').show();
    }
  });

  $(document).on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    $('#confirmDeleteBtn').data('id', id);
    $('#deleteModal').show();
  });

  $('#confirmDeleteBtn').on('click', function () {
    const id = $(this).data('id');
    userData = userData.filter(user => user.id !== id);
    saveToLocalStorage();
    $('#deleteModal').hide();
    renderTable();
    showAlert('이용자가 삭제되었습니다.', 'success');
  });

  $('#userForm').on('submit', function (e) {
    e.preventDefault();
    const editId = $('#editUserId').val();
    const userId = $('#userId').val();
    const userPhone = $('#userPhone').val();

    if (editId) {
      const index = userData.findIndex(user => user.id === editId);
      if (index !== -1) {
        userData[index] = { id: userId, phone: userPhone };
        showAlert('수정 완료!', 'success');
      }
    } else {
      userData.push({ id: userId, phone: userPhone });
      showAlert('이용자가 추가되었습니다!', 'success');
    }

    saveToLocalStorage();
    $('#userModal').hide();
    renderTable();
  });

  $('.close-btn, #cancelBtn, #cancelDeleteBtn').on('click', function () {
    $('.modal').hide();
  });

  $('#refreshBtn').on('click', function () {
    renderTable();
    showAlert('데이터가 새로고침 되었습니다.', 'success');
  });

  $('.dark-mode-toggle').on('click', function () {
    $('body').toggleClass('dark-mode');
    const icon = $('body').hasClass('dark-mode') ? 'fa-sun' : 'fa-moon';
    const text = $('body').hasClass('dark-mode') ? '라이트 모드' : '다크 모드';
    $(this).html(`<i class="fas ${icon}"></i> ${text}`);
  });

  renderTable();
});
