angular.module('directives', [])

// Directive for upload and resize image
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
        var type = options.resizeType || 'image/png';

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
})

.directive('mySlideController', ['$swipe', function($swipe) {
    return {
        restrict: 'EA',
        link: function(scope, ele, attrs, ctrl) {
            var startX, pointX;
            $swipe.bind(ele, {
                'start': function(coords) {
                    startX = coords.x;
                    pointX = coords.y;
                },
                'move': function(coords) {
                    var delta = coords.x - pointX;
                    // ...
                },
                'end': function(coords) {
                    // ...
                },
                'cancel': function(coords) {
                    // ...
                }
            });
        }
    };
}])

// Confirm dialog directive
.directive('ngConfirmClick', [ function() {
    return {
        link: function (scope, element, attr) {
            var msg = attr.ngConfirmClick || "Are you sure?";
            var clickAction = attr.confirmedClick;
            element.bind('click',function (event) {
                if (window.confirm(msg) ) {
                    scope.$eval(clickAction);
                }
            });
        }
    };
}])

// Loadimg animation
.directive('loadingAnimation', ['$http', '$timeout', function($http, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                scope.isLoading = function() {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function(v) {
                    if (v) {
                        $(elm).show();
                    } else {
                        $(elm).hide();
                    }
                });
            }
        };

    }]);