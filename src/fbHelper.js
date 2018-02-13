import firebase from 'firebase'
import {fbConfig} from '../keystore'

const app = firebase.initializeApp(fbConfig)

export const db = app.database()
export const fixedIssueRef = db.ref('ReportFixedIssues')
export const userFixIssueRef = db.ref('UserFixedIssues')
export const abusivePostRef = db.ref('ReportAbuseIssues')
export const reportsRef = db.ref('Reports')
export const userReportsRef = db.ref('UserReports')
export const usersRef = db.ref('Users')
export const storageRef = firebase.storage().ref('Roseway/')

let userList
usersRef.once('value').then(snap => {
  userList = snap.val()
})
export {userList}
