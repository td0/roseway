import firebase from 'firebase'
import {fbConfig} from '../keystore'

const app = firebase.initializeApp(fbConfig)

export const db = app.database()
export const fixedIssueRef = db.ref('ReportFixedIssues')
export const abusivePostRef = db.ref('ReportAbuseIssues')
export const reportsRef = db.ref('Reports')
export const usersRef = db.ref('Users')

let userList
usersRef.once('value').then(snap => {
  userList = snap.val()
})
export {userList}
