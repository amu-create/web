$(document).ready(function () {
  $.ajax({
    url: 'https://amu-create.github.io/web/members.json',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      // 테이블에 추가
    },
    error: function () {
      console.log('에러!');
    }
  });
});
