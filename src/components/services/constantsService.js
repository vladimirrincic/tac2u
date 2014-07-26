angular.module('services.constants', [])

.constant('options', {
    
        // Base options
        'name':'TAC2U',
        'baseUrl': 'json',
        
        // Messages
        'loginNeededMessage': 'You need to login!',
        
        // QR code
        'qrCodeSize': 115,
        'qrCodeVersion': 7,
        'errorCorrection': 'L'
});