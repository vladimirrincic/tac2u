angular.module('services.constants', [])

.constant('options', {
    
        // Base options
        'name':'TAC2U',
        'baseUrl': 'http://localhost:9090/tac2u-web',
        'actionMsgTimeout': 4000,
        
        // Messages
        'PLEASE_LOGIN': 'You need to login to access this page.',
        'DEFAULT_ERROR': 'Something went wrong. Please try again.',
        'SIGNUP_SUCCESS': 'Your account is created. Please login.',
        'BAD_CREDENTIALS': 'Wrong email or password. Please try again.',
        'CARD_ADDED': 'Businss card added successfully.',
        'CARD_EDITED': 'Businss card edited successfully.',
        'CARD_DELETED': 'Card has been deleted.',
        
        // QR code
        'qrCodeSize': 115,
        'qrCodeVersion': 7,
        'errorCorrection': 'L'
        
});