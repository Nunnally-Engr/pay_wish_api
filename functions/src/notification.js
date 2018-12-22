const admin = require('firebase-admin')

// 参照
const users = require('./table/users')
const notifications = require('./table/notifications')

// 定数
const options = { priority: 'high' }

async function paymentNotifier(receiver) {

  try {

    // =======================================
    // FCMへ登録
    // =======================================
    // 受信者
    const receiverUid = receiver

    // デバイス通知トークンを取得します
    const user = await users.getUsersInfo(receiverUid)

    // 通知内容
    const payload = {
      notification: {
        title: 'タイトル：請求がきたよ(｡□｡；)！！',
        body: '本文：(・ω<) てへぺろ'
      },
      data: {
        "id" : "1",
        "status": "default",
        "click_action": "FLUTTER_NOTIFICATION_CLICK"
      }          
    }

    // 対象デバイスへ送信
    const response = await admin.messaging().sendToDevice(user.deviceToken, payload, options)
    response.results.forEach((result, index) => {
      const error = result.error
      if (error) {
        // =======================================
        // 【異常】エラーが出るDeviceToken削除
        // =======================================
        console.error('通知の送信に失敗： ', user.deviceToken, error)
        // 送信できないトークンを初期化します
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered') {
          console.log(error.code)
          // Users.deviceToken をNullにする処理
          users.deleteUsersDeviceToken(receiverUid)
        }
      }
    })

  } catch (error) {
    console.error(error.toString())
  }

}

exports.paymentNotifier = paymentNotifier