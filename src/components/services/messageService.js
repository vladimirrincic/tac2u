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