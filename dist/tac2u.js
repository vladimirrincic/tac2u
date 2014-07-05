/**
 * Declare main app module with all necessary dependecies and
 * application routing
 */

angular.module('app', ['ngRoute', 'LocalStorageModule', 'services.constants', 'user', 'card', 'services.message', 'templates.app'])

.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        $routeProvider
                .when('/login', {
                    templateUrl: 'user/user-sign-in.tpl.html',
                    controller: 'UserSignInController',
                    access: {
                        requireLogin: false
                    }
                })
                .when('/signup', {
                    templateUrl: 'user/user-sign-up.tpl.html',
                    controller: 'UserSignUpController',
                    access: {
                        requireLogin: false
                    }
                })
                .when('/cards', {
                    templateUrl: 'card/card-list.tpl.html',
                    controller: 'CardListController',
                    access: {
                        requireLogin: true
                    }
                })
                .when('/cards/:cardId', {
                    templateUrl: 'card/card-details.tpl.html',
                    controller: 'CardDetailsController',
                    access: {
                        requireLogin: true
                    }
                })
                .otherwise({
                    redirectTo: '/login',
                    access: {
                        requireLogin: false
                    }
        });
        
        $httpProvider.interceptors.push('tokenInterceptor');
}])

.run(['$rootScope', '$location', 'authenticationService', 'messageService', 'options', function($rootScope, $location, authenticationService, messageService, options) {
        $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
            if (nextRoute.access.requireLogin && !authenticationService.isLogged) {
                $location.path('/');
                messageService.addMessage(options.loginNeededMessage);
            } else if(authenticationService.isLogged && nextRoute.originalPath === "/login") {
                $location.path('/cards');
            }
        });
}])

.controller('AppController', ['$scope', 'options', function($scope, options) {
        $scope.appInfo = {
            name: options.name
        };
}]);
angular.module('card', ['services.card', 'directives'])

.controller('CardListController', ['$scope', 'cardService', 'localStorageService', function($scope, cardService, localStorageService) {
        var timestampOk = false;

        if (!timestampOk) {
            cardService.getAllCards().query().$promise.then(function(response) {
                    localStorageService.clearAll();
                    localStorageService.set('cardList', response);
            });
        }

        $scope.cardList = localStorageService.get('cardList');

}])

.controller('CardDetailsController', ['$scope', '$routeParams', 'cardService', function($scope, $routeParams, cardService) {
        
        $scope.cardDetails = cardService.getCardById($routeParams.cardId);

        $scope.$watch('ngImage', function(newValue) {
            if(newValue) {
                $scope.cardDetails.image = newValue.resized.dataURL;
            }
        });

        $scope.saveCard = function() {
            console.log($scope.cardDetails);
        };
}]);
angular.module('user', ['services.user'])

.controller('UserController', ['$scope','$window', '$location', 'authenticationService', function($scope, $window, $location, authenticationService) {
        $scope.signOut = function() {
            authenticationService.isLogged = false;
            delete $window.sessionStorage.token;
            $location.path('/');
        };
}])

.controller('UserSignInController', ['$scope', '$location', '$window', 'userService', 'authenticationService', function($scope, $location, $window, userService, authenticationService) {
        $scope.signIn = function(username, password) {
            userService.signIn(username, password).get().$promise.then(function(response) {
                authenticationService.isLogged = true;
                $window.sessionStorage.token = response.token;
                $location.path("/cards");
            }, function(status, data) {
                console.log(status);
                console.log(data);
            });
        };
}])

.controller('UserSignUpController', ['$scope', 'userService', function($scope, userService) {
        $scope.signUp = function(username, password) {
            userService.signUp(username, password).post().$promise.then(function(response) {
                console.log(response);
            }, function(status, data) {
                console.log(status);
                console.log(data);
            });
        };
}])

.controller('UserEditController', ['$scope', function($scope) {
        
}]);
angular.module('services.card', ['ngResource', 'filters'])

.factory('cardService', ['$resource', 'localStorageService', '$filter', 'options', function($resource, localStorageService, $filter, options) {
        return {
            getAllCards: function() {
                // return $resource(options.baseUrl + '/cards', {});
                return $resource('json/cards.json', {});
            },
            getCardById: function(cardId) {
                return $filter('getById')(localStorageService.get('cardList'), cardId).element;
            }
        };
}]);
angular.module('directives', [])

.directive('ngImage', function($q) {
    
    var URL = window.URL || window.webkitURL;
    
    var getResizeArea = function () {
        var resizeAreaId = 'fileupload-resize-area';

        var resizeArea = document.getElementById(resizeAreaId);

        if (!resizeArea) {
            resizeArea = document.createElement('canvas');
            resizeArea.id = resizeAreaId;
            resizeArea.style.visibility = 'hidden';
            document.body.appendChild(resizeArea);
        }

        return resizeArea;
    };
    
    var resizeImage = function (origImage, options) {
        var maxHeight = options.resizeMaxHeight || 300;
        var maxWidth = options.resizeMaxWidth || 250;
        var quality = options.resizeQuality || 0.7;
        var type = options.resizeType || 'image/jpg';

        var canvas = getResizeArea();

        var height = origImage.height;
        var width = origImage.width;

        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round(height *= maxWidth / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round(width *= maxHeight / height);
                height = maxHeight;
            }
        }

        canvas.width = width;
        canvas.height = height;

        //draw image on canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(origImage, 0, 0, width, height);

        // get the data from canvas as 70% jpg (or specified type).
        return canvas.toDataURL(type, quality);
    };
    
    var createImage = function(url, callback) {
        var image = new Image();
        image.onload = function() {
            callback(image);
        };
        image.src = url;
    };

    var fileToDataURL = function (file) {
        var deferred = $q.defer();
        var reader = new FileReader();
        reader.onload = function (e) {
            deferred.resolve(e.target.result);
        };
        reader.readAsDataURL(file);
        return deferred.promise;
    };

    
    return {
        restrict: 'A',
        scope: {
            ngImage: '=',
            resizeMaxHeight: '@?',
            resizeMaxWidth: '@?',
            resizeQuality: '@?',
            resizeType: '@?'
        },
        link: function(scope, element, $scope) {
            
            
            var doResizing = function(imageResult, callback) {
                createImage(imageResult.url, function(image) {
                    var dataURL = resizeImage(image, scope);
                    imageResult.resized = {
                        dataURL: dataURL,
                        type: dataURL.match(/:(.+\/.+);/)[1]
                    };
                    callback(imageResult);
                });
            };

            var applyScope = function(imageResult) {
                scope.$apply(function() {
                        scope.ngImage = imageResult;
                });
            };

            element.bind('change', function (evt) {
                
                var file = evt.target.files[0];

                var imageResult = {
                    file: file,
                    url: URL.createObjectURL(file)
                };

                fileToDataURL(file).then(function (dataURL) {
                    imageResult.dataURL = dataURL;
                });

                if(scope.resizeMaxHeight || scope.resizeMaxWidth) {
                    doResizing(imageResult, function(imageResult) {
                        applyScope(imageResult);
                    });
                }
                else {
                    applyScope(imageResult);
                }
                
            });
        }
    };
});
angular.module('filters', [])

.filter('getById', function() {
    return function(array, id) {
        var i, response = {};
        for (i = 0; i < array.length; i++) {
            if (array[i].cardId == id) {
                response.index = i;
                response.element = array[i];
                return response;
            }
        }
        return null;
    };
});
angular.module('services.constants', [])

.constant('options', {
    
        // Base options
        'name':'TAC2U',
        'baseUrl': 'json',
        
        // Messages
        'loginNeededMessage': 'You need to login!'
});
angular.module('services.message', [])

.factory('messageService', [function() {
        return {
            addMessage: function(message) {
                console.log(message);
            },
//            addMessage: function(errorMessageJsonFromBackend) {
//                Ovde ide logika za tip poruke, da li je autoclose, poruka
//            }
            clearMessages: function() {
                
            }
        };
}]);
angular.module('services.user', ['ngResource'])

.factory('userService', ['$resource', function($resource, options) {
    return {
        signIn: function(username, password) {
            // return $http.post(options.baseUrl + '/login', {username: username, password: password});
            return $resource('json/login.json', {});
        },
        signUp: function(username, password) {
            return $resource(options.baseUrl + '/signup', {username: username, password: password});
        }
    };
}])

.factory('authenticationService', ['$window', function($window) {
    return {
        isLogged: $window.sessionStorage.token !== undefined ? true : false
    };
}])

.factory('tokenInterceptor', ['$q', '$window', '$location', 'messageService', 'authenticationService', 'options', function ($q, $window, $location, messageService, authenticationService, options) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = $window.sessionStorage.token;
            }
            return config;
        },
 
        response: function (response) {
            if (response.status === 401) {
                authenticationService.isLogged = false;
                delete $window.sessionStorage.token;
                $location.path('/');
                messageService.addMessage(options.loginNeededMessage);
                // messageService.addMessage(response.errorMessageJsonFromBackend);
            }
            return response || $q.when(response);
        }
    };
}]);