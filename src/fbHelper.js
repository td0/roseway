import firebase from 'firebase'
import fbConfig from '../keystore'

const app = firebase.initializeApp(fbConfig)

export const db = app.database()
