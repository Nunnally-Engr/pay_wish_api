const admin = require('firebase-admin')

// 参照
const claims = require('./table/claims')
const notifications = require('./table/notifications')

// ========================================================================
// [WEB]請求情報作成処理
// ========================================================================
async function claimsCreate(req, res, next) {

  console.log('>>> claimsCreate start')

  try {

    let receiver = req.query.billing_uid
    let sender = req.query.buy_uid

    // =======================================
    // 登録内容設定
    // =======================================
    let isClaims = await claims.create(req.query)
    if (isClaims) {
      // 登録完了
      notifications.create(receiver, sender)
    }

    // =======================================
    // 処理終了
    // =======================================
    // 結果
    if (isClaims) {
      console.log('Successfully claims create.')
      res.status(200).send({ message: 'Success' }).end()
    }else{
      console.log('Successfully claims error.')
      res.status(500).send({ message: 'Error' }).end()
    }
  } catch (error) {
    console.error(error.toString())
    res.status(500).send({ message: 'Error' }).end()
  }

  console.log('>>> claimsCreate end')
}

exports.claimsCreate = claimsCreate

// ========================================================================
// [アプリ]請求情報作成処理
// ========================================================================
async function claimsCreateByApp(data, context) {

  console.log('>>> claimsCreateByApp start')
  let returnContext = {
    message: '',
    data: data,
    context: context,
  }

  try {

    // =======================================
    // 登録内容設定
    // =======================================
    let isCreate = await claims.create(data)

    if (isCreate) {
      returnContext.message = '登録しました(●´ω｀●)'
    }

    // =======================================
    // 処理終了
    // =======================================
    console.log('Successfully claims create.')

    return returnContext

  } catch (error) {
    console.error(error.toString())
  }

  console.log('>>> claimsCreateByApp end')
}

exports.claimsCreateByApp = claimsCreateByApp

// ========================================================================
// [WEB]請求情報 取得
// ========================================================================
async function claimsSelect(req, res, next) {

  console.log('>>> claimsSelect start')

  try {

    // =======================================
    // 取得
    // =======================================
    let claimsRecord = await claims.select(req.query)
    console.log('>>> claimsRecord')
    console.log(claimsRecord)

    // =======================================
    // 処理終了
    // =======================================
    // 結果
    if (claimsRecord) {
      console.log('Successfully claims select.')
      await res.status(200).send({ claims: claimsRecord }).end()
    }else{
      console.log('Successfully claims error.')
      res.status(500).send({ message: 'Error' }).end()
    }
  } catch (error) {
    console.error(error.toString())
    res.status(500).send({ message: 'Error' }).end()
  }

  console.log('>>> claimsSelect end')
}

exports.claimsSelect = claimsSelect

// ========================================================================
// [アプリ]請求情報 取得
// ========================================================================
async function claimsSelectByApp(data, context) {

  console.log('>>> claimsSelectByApp start')

  try {

    // =======================================
    // 取得
    // =======================================
    let claimsRecord = await claims.select()
    console.log('claimsRecord: ')
    console.log(claimsRecord)

    // =======================================
    // 処理終了
    // =======================================
    // 結果
    let returnContext = {
      message: '',
      record: '',
      data: data,
      context: context,
    }

    if (claimsRecord) {
      returnContext.message = '取得成功しました(●´ω｀●)'
      returnContext.record = claimsRecord
      return returnContext
    }else{
      returnContext.message = '取得失敗しました(｡□｡；)'
      return false
    }
  } catch (error) {
    console.error(error.toString())
    return false
  } finally {
    console.log('>>> claimsSelectByApp end')
  }
  
}

exports.claimsSelectByApp = claimsSelectByApp
