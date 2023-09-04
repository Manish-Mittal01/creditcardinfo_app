import { NativeEventEmitter, NativeModules, PermissionsAndroid, Platform } from "react-native";
export const PLATFORM_OS = Platform.OS;
export const PLATFORM_VERSION = Platform.Version;
export const READ_SMS_PERMISSION = PermissionsAndroid.PERMISSIONS.READ_SMS;
export const RECEIVE_SMS_PERMISSION = PermissionsAndroid.PERMISSIONS.RECEIVE_SMS;
export const PERMISSION_GRANTED = PermissionsAndroid.RESULTS.GRANTED;
export const IS_ANDROID = PLATFORM_OS === 'android';

const hasSmsPermissions = async () => {
    if (IS_ANDROID && PLATFORM_VERSION < 23) return true;

    const currentPermissions = await Promise.all([
        PermissionsAndroid.check(RECEIVE_SMS_PERMISSION),
        PermissionsAndroid.check(READ_SMS_PERMISSION),
    ]);

    return currentPermissions.every(permission => permission === true);
};

export const startReadSMS = async (callback) => {
    if (!callback) return;

    if (!IS_ANDROID) return callback("error", "", "ReadSms Plugin is only for android platform");

    const hasPermission = await hasSmsPermissions();

    if (!hasPermission) return callback("error", "", "Required RECEIVE_SMS and READ_SMS permission");

    NativeModules.ReadSms.startReadSMS(() => {
        new NativeEventEmitter(NativeModules.ReadSms).addListener(
            "received_sms",
            (sms) => callback("success", sms, '')
        );
    },
        (error) => callback("error", "", error)
    );
}

export const requestReadSMSPermission = async () => {
    const hasPermission = await hasSmsPermissions();

    if (!IS_ANDROID || hasPermission) return true;

    const status = Object.values(
        await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
            PermissionsAndroid.PERMISSIONS.READ_SMS,
        ])
    );

    return status.every((status) => status === PERMISSION_GRANTED);
}

export const stopReadSMS = () => {
    if (!IS_ANDROID) return;

    NativeModules.ReadSms.stopReadSMS();
}
