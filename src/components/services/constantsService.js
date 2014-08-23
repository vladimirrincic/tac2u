angular.module('services.constants', [])

.constant('options', {
    
        // Base options
        'name':'TAC2U',
//        'baseUrl': 'http://192.168.0.101:9090/tac2u-web',
        'baseUrl': 'http://54.77.151.51/tac2u-web',
        'actionMsgTimeout': 4000,
        
        // Messages
        'PLEASE_LOGIN': 'You need to login to access this page.',
        'DEFAULT_ERROR': 'Something went wrong. Please try again.',
        'SIGNUP_SUCCESS': 'Your account is created. Please login.',
        'BAD_CREDENTIALS': 'Wrong email or password. Please try again.',
        'CARD_ADDED': 'Business card added successfully.',
        'CARD_EDITED': 'Business card edited successfully.',
        'CARD_DELETED': 'Card has been deleted.',
        
        // QR code
        'qrCodeSize': 115,
        'qrCodeVersion': 7,
        'errorCorrection': 'L',
        
        cardLabels: {
            'label_fullName': 'Full name',
            'label_occupation': 'Occupation',
            'label_phone': 'Phone',
            'label_email': 'Email',
            'label_webpage': 'Web',
            'label_addressLine1': 'Address line 1',
            'label_addressLine2': 'Address line 2'
        }
});