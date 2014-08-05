angular.module('services.message', [])

// Message factory
// keepMessage parameter should be set to true if we want message to be there after route change

.factory('messageService', ['$rootScope', '$timeout', 'options', function($rootScope, $timeout, options) {
    return {
        addActionMessage: function(type, message, keepMessage) {
            this.clearMessages();
            $timeout.cancel($rootScope.timeoutPromise);
            $rootScope.actionMessage = {
                messageType: type,
                message: message,
                keepMessage: keepMessage ? true : false
            };
            $rootScope.timeoutPromise = $timeout(function() {
                $rootScope.actionMessage = {
                    messageType: ''
                };
            }, options.actionMsgTimeout);
        },
        clearMessages: function() {
            $rootScope.actionMessage = {
                messageType: ''
            };
        }
    };
}]);