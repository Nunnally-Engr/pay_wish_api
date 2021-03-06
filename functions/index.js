const admin = require('firebase-admin')
const functions = require('firebase-functions')
admin.initializeApp(functions.config().firebase)
// 日付型の設定を行わないと警告が出るため初期化
admin.firestore().settings( { timestampsInSnapshots: true })

// リージョン：Defaultはus-central1
const regionAsia = 'asia-northeast1' // 東京

const express = require('express')

// Cross-originの設定
const cors = require('cors')({origin: true})
// 参照設定
const claim = require('./src/claim')

const moment = require('moment-timezone')
// Timezoneを日本に設定
moment.tz.setDefault("Asia/Tokyo")

// ========================================================================
// notificationsテーブルにデータが登録・更新されたらメール通知飛ばす処理
// ========================================================================
exports.onStocksCreated = functions.firestore
  .document('notifications/{notificationsKey}')
  .onWrite(async (change, context) => {

    const notification = require('./src/notification')

    // 現在のドキュメント値を持つオブジェクトを取得します。
    // ドキュメントが存在しない場合、ドキュメントは削除されています。
    const document = change.after.exists ? change.after.data() : null

    if (document) {
      // TODO: 
      // 本当は検知して通知させたいけど、CloudFunctionsでテーブルを登録して、
      // それを検知させると重複で走る場合があるため一旦コメントアウト
      // await notification.paymentNotifier(document.receiver, context.params.notificationsKey)
    }

  })

// ========================================================================
// 【HTTPトリガー】請求情報を(GCP)CloudSQL:MySQLのテーブルへ登録
// ========================================================================
const ex1 = express()
ex1.use(cors)
ex1.use(claim.claimsCreate)
ex1.post('/', (req, res) => {
  return res.render('message', {
    message: req.message
  }).end()
})
exports.claimsCreate = functions.https.onRequest(ex1)

// ========================================================================
// 【HTTPトリガー】請求情報を(GCP)CloudSQL:MySQLのテーブルから取得
// ========================================================================
const ex2 = express()
ex2.use(cors)
ex2.use(claim.claimsSelect)
ex2.get('/', (req, res) => {
  return res.render('claims', {
    claims: req.claims
  }).end()
})
exports.claimsSelect = functions.https.onRequest(ex2)

// ========================================================================
// 【アプリからのトリガー】請求情報を(GCP)CloudSQL:MySQLのテーブルへ登録
// ========================================================================
exports.onCallClaimsCreate = functions.https.onCall(async (data, context) => {
  let result = await claim.claimsCreateByApp(data, context)
  return { result: JSON.stringify(result)}
});

// ========================================================================
// 【アプリからのトリガー】請求情報を(GCP)CloudSQL:MySQLのテーブルから取得
// ========================================================================
exports.onCallClaimsSelect = functions.https.onCall(async (data, context) => {
  let result = await claim.claimsSelectByApp(data, context)
  return { result: JSON.stringify(result)}
});