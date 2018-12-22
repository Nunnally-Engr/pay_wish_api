const admin = require('firebase-admin')
const db = admin.firestore()

// =======================================
// 取得
// =======================================
function getUsersInfo(uid) {
  return new Promise(resolve => {
    db.doc(`/users/${uid}`).get().then(data => resolve(data.data())).catch(error => reject(error))
  })
}

exports.getUsersInfo = getUsersInfo

// =======================================
// 更新：デバイストークン
// =======================================
function deleteUsersDeviceToken(uid) {

  let user = db.doc(`/users/${uid}`)

  user.update({
      "deviceToken": ''
  })
  .then(() => {
    console.log('Successfully deleteUsersDeviceToken updated.')
    return true
  })
  .catch(err => {
    // エラー処理
    console.error('Error deleteUsersDeviceToken updated: ', err)
    return false
  })

}

exports.deleteUsersDeviceToken = deleteUsersDeviceToken
