const functions = require('firebase-functions')
const mysql = require("mysql")
const util = require('util')

// 日付関連
const moment = require('moment-timezone')
// Timezoneを日本に設定
moment.tz.setDefault("Asia/Tokyo")

// =======================================
// 作成
// =======================================
async function create(data) {

  // MySQLへ接続(環境変数よりセット)
  const connect = await mysql.createConnection({
    socketPath: "/cloudsql/" + functions.config().mysql.instance_connection_name,
    user: functions.config().mysql.user,
    password: functions.config().mysql.password,
    database: functions.config().mysql.database_name
  })

  try {

    await connect.connect()

    // Transaction Start
    await connect.beginTransaction()
    
    // 日付
    data.created_at = moment().format('YYYY-MM-DD HH:mm:ss')
    data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')

    // 登録
    await connect.query('INSERT INTO claims SET ?', data)

    // Commit
    await connect.commit()

    return true
  
  } catch (e) {
    console.log(e)
    await connect.rollback()
    return false
  } finally {
    await connect.end()
  }

}
exports.create = create

// =======================================
// 取得
// =======================================
async function select(data) {

  // MySQLへ接続(環境変数よりセット)
  const connect = await mysql.createPool({
    socketPath: "/cloudsql/" + functions.config().mysql.instance_connection_name,
    user: functions.config().mysql.user,
    password: functions.config().mysql.password,
    database: functions.config().mysql.database_name
  })

  // 関数をPromise処理に変換
  connect.query = util.promisify(connect.query)

  try {

    let results = await connect.query('SELECT * FROM claims')
    connect.end()

    return results

  } catch (err) {
    throw new Error(err)
  } finally {
    console.log('claims selected.')
  }

}
exports.select = select
