(function ($) {
  $(".email-link").html(function () {
    var email = $(this).data("name") + "@" + $(this).data("domain");
    var text = $(this).text() || email;
    return "<a href=\"mailto:" + email +"\">" + text + "</a>";
  });
})(jQuery);
