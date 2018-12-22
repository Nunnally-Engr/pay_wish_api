const admin = require('firebase-admin')
const db = admin.firestore()

// 日付関連
const moment = require('moment-timezone')
// Timezoneを日本に設定
moment.tz.setDefault("Asia/Tokyo")

// =======================================
// 通知：論理削除
// =======================================
function deleteNotification(uid) {

  // TODO: 物理削除
  // db.collection('notifications').doc(uid).delete()

  let notifications = db.doc(`/notifications/${uid}`)

  notifications.update({
    "deletedAt": moment().format('YYYY-MM-DD HH:mm:ss')
  })
  .then(() => {
    console.log('Successfully deleteNotification deleted.')
    return true
  })
  .catch(err => {
    // エラー処理
    console.error('Error deleteNotification deleted: ', err)
    return false
  })

}

exports.deleteNotification = deleteNotification

// =======================================
// 通知：登録
// =======================================
function create(receiver, sender) {

  db.collection("notifications").add({
    receiver: receiver,
    sender: sender
  })
  .then((result) => {
    console.log('Successfully notifications add.')
    return result.id
  })
  .catch(err => {
    // エラー処理
    console.error('Error notifications updated: ', err)
    return ''
  })
}

exports.create = create
