const admin = require('firebase-admin')

// 参照
const claims = require('./table/claims')
const notifications = require('./table/notifications')
const notification = require('./notification')

// ========================================================================
// [WEB]請求情報作成処理
// ========================================================================
async function claimsCreate(req, res, next) {

  try {

    let receiver = req.query.billing_uid
    let sender = req.query.buy_uid

    // =======================================
    // 登録内容設定
    // =======================================
    let isClaims = await claims.create(req.query)
    if (isClaims) {
      // 通知処理
      await notification.paymentNotifier(receiver)
    }

    // =======================================
    // 処理終了
    // =======================================
    // 結果
    if (isClaims) {
      res.status(200).send({ message: 'Successfully claims create.' }).end()
    }else{
      res.status(500).send({ message: 'Successfully claims error.' }).end()
    }
  } catch (error) {
    console.error(error.toString())
    res.status(500).send({ message: 'Error' }).end()
  }

}

exports.claimsCreate = claimsCreate

// ========================================================================
// [WEB]請求情報 取得
// ========================================================================
async function claimsSelect(req, res, next) {

  try {

    // =======================================
    // 取得
    // =======================================
    let claimsRecord = await claims.select(req.query)

    // =======================================
    // 処理終了
    // =======================================
    // 結果
    if (claimsRecord) {
      await res.status(200).send({ message: 'Successfully claims select.', claims: claimsRecord }).end()
    }else{
      res.status(500).send({ message: 'Not success claims error.' }).end()
    }
  } catch (error) {
    console.error(error.toString())
    res.status(500).send({ message: '[catch]Not success claims error.' }).end()
  }
}

exports.claimsSelect = claimsSelect

// ========================================================================
// [アプリ]請求情報作成処理
// ========================================================================
async function claimsCreateByApp(data) {

  // 結果返却用
  let result = {
    message: '',
    data: data
  }

  try {

    let receiver = data.billing_uid
    let sender = data.buy_uid

    // =======================================
    // 登録内容設定
    // =======================================
    let isClaims = await claims.create(data)

    if (isClaims) {
      // 通知処理
      await notification.paymentNotifier(receiver)
      result.message = '登録しました(●´ω｀●)'
    }

    // =======================================
    // 処理終了
    // =======================================
    return result

  } catch (error) {
    console.error(error.toString())
    return result
  }

}

exports.claimsCreateByApp = claimsCreateByApp

// ========================================================================
// [アプリ]請求情報 取得
// ========================================================================
async function claimsSelectByApp(data, context) {

  // 結果返却用
  let result = {
    message: '',
    record: '',
    data: data
  }

  try {

    // =======================================
    // 取得
    // =======================================
    let record = await claims.select()

    // =======================================
    // 処理終了
    // =======================================
    if (record) {
      result.message = '取得成功しました(●´ω｀●)'
      result.record = record
      return result
    }else{
      result.message = '取得失敗しました(｡□｡；)'
      return result
    }
  } catch (error) {
    console.error(error.toString())
    result.message = '取得失敗しました(｡□｡；)'
    return result
  }
  
}

exports.claimsSelectByApp = claimsSelectByApp
