import firebase from 'firebase'
import fbConfig from '../keystore'

const app = firebase.initializeApp(fbConfig)

export const db = app.database()
export const fixedIssueRef = db.ref('ReportFixedIssues')
export const reportsRef = db.ref('Reports')

let userList
db.ref('Users').once('value').then(snap => {
  userList = snap.val()
})
export {userList}
