import { Injectable } from '@angular/core';

// Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Environment
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  m_collections = {
    users: 'users',
    records: 'records'
  }
  m_data_base: any;

  constructor() {
    this.database_init();
  }

  database_init() {
    if (null == this.m_data_base) {
      firebase.initializeApp(environment.firebase_config);

      this.m_data_base = firebase.firestore();

      firebase.firestore().settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
      });

      this.m_data_base.enablePersistence({synchronizeTabs: true})
          .catch((err: { code: string; }) => {
            if (err.code === 'failed-precondition') {
              // Multiple tabs open, persistence can only be enabled
              // in one tab at a a time.
            } else if (err.code === 'unimplemented') {
            }
            // The current browser does not support all of the
            // features required to enable persistence
          });

    }
  }

  create_date( date: Date ){
    if ( date )
      return firebase.firestore.Timestamp.fromDate(new Date(date));
    else
      return firebase.firestore.Timestamp.now();
  }
}
