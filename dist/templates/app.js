angular.module('templates.app', ['card/card-details.tpl.html', 'card/card-list.tpl.html', 'user/user-edit.tpl.html', 'user/user-sign-in.tpl.html', 'user/user-sign-up.tpl.html']);

angular.module("card/card-details.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("card/card-details.tpl.html",
    "<form ng-submit=\"saveCard()\">\n" +
    "    <label>Card ID</label>\n" +
    "    <input type=\"text\" ng-model=\"cardDetails.cardId\">\n" +
    "    <label>Card Name</label>\n" +
    "    <input type=\"text\" ng-model=\"cardDetails.cardName\">\n" +
    "    <label>Image</label>\n" +
    "    <input type=\"file\" ng-image=\"ngImage\" resize-max-height=\"100\" resize-max-width=\"100\" resize-quality=\"0.7\" >\n" +
    "\n" +
    "    <div>\n" +
    "        <img ng-src=\"{{cardDetails.image}}\">\n" +
    "    </div>\n" +
    "    \n" +
    "    <button type=\"submit\">Save</button>\n" +
    "    \n" +
    "</form>\n" +
    "\n" +
    "<a href=\"#/cards\">Back to cards</a>\n" +
    "\n" +
    "");
}]);

angular.module("card/card-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("card/card-list.tpl.html",
    "<ul>\n" +
    "    <li ng-repeat=\"card in cardList\">\n" +
    "        <a ng-href=\"#/cards/{{card.cardId}}\">{{card.cardName}}</a>\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("user/user-edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("user/user-edit.tpl.html",
    "<h1>User edit</h1>");
}]);

angular.module("user/user-sign-in.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("user/user-sign-in.tpl.html",
    "<h1>Sign In</h1>\n" +
    "\n" +
    "<form class=\"form-horizontal\" role=\"form\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"inputUsername\" class=\"col-sm-4 control-label\">Username</label>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"inputUsername\" placeholder=\"Username\" ng-model=\"login.email\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"inputPassword\" class=\"col-sm-4 control-label\">Password</label>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "            <input type=\"password\" class=\"form-control\" id=\"inputPassword\" placeholder=\"Password\" ng-model=\"login.password\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"col-sm-offset-4 col-sm-10\">\n" +
    "            <button type=\"submit\" class=\"btn btn-default\" ng-click=\"signIn(login.email, login.password)\">Log In</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>");
}]);

angular.module("user/user-sign-up.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("user/user-sign-up.tpl.html",
    "<h1>Sign Up</h1>");
}]);
