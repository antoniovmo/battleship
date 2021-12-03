import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {DatabaseService} from "./database.service";
import {fromUnixTime} from "date-fns";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class GameRecordsService {

  m_array_records!: Array<any>;
  m_record_snapshot: any;
  m_record_b_subject!: BehaviorSubject<Array<any>>;

  constructor( public authService: AuthenticationService, private dbService: DatabaseService ) {
    if (!this.m_record_snapshot) {
      this.m_array_records = new Array<any>();

      this.m_record_b_subject = new BehaviorSubject<Array<any>>(this.m_array_records);

      this.m_record_snapshot = this.create_snapshot(
          this.dbService.m_data_base.collection(this.dbService.m_collections.records).where("player", "==", authService.m_uid),
          this.snap_callback.bind(this));
    }
  }

  snap_callback(in_data: any, type: any, modified: any) {
    const tmp_pcat = {
      id: in_data.id,
      ...in_data.data()
    };

    if ( tmp_pcat.start_time && tmp_pcat.end_time) {
      tmp_pcat.start_time = fromUnixTime(tmp_pcat.start_time.seconds)
      tmp_pcat.end_time = fromUnixTime(tmp_pcat.end_time.seconds)
    }

    if (type === 'added')
      this.m_array_records.push(tmp_pcat);
    if (type === 'modified') {
      const index = this.m_array_records.findIndex(it => it.id === tmp_pcat.id);
      if (index < 0) {
        return;
      }
      this.m_array_records[index] = tmp_pcat;
    }
    if (type === 'removed' || type === 'deleted') {
      const index = this.m_array_records.findIndex(it => it.id === tmp_pcat.id);
      if (index < 0) {
        return;
      }
      this.m_array_records.splice(index, 1);
    }
    this.m_record_b_subject.next(this.m_array_records);
  }

  create_snapshot( coll_ref: any, callback: any, includeMetadata = true) {
    if( !coll_ref )
      return null;

    return coll_ref.onSnapshot( {includeMetadataChanges: includeMetadata}, (snapshot : any) => {
      const modification_from =  snapshot.metadata.hasPendingWrites ? 'LOCAL' : 'SERVER';
      if (!snapshot.empty)
        snapshot.docChanges().forEach( (doc_data : any) => {
          callback( doc_data.doc, doc_data.type, modification_from );
        });
      else {
        const data: any = {};
        data.id = 0;
        data.data = () => {};
        callback( data, '', modification_from );
      }
    });
  }

  _finish() {
    if (this.m_record_snapshot)
      this.m_record_snapshot();
  }

  save_data( m_data: any) {
    this.dbService.m_data_base.collection(this.dbService.m_collections.records)
        .add(Object.assign({}, m_data))
        .then(() => {
          console.log('save')
        }).catch((error : any) => {
      console.log(error)
    });
  }
}
