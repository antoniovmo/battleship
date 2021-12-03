import {Component, OnDestroy, OnInit} from '@angular/core';

// RxJS
import {Observable} from "rxjs";

// Services
import {GameRecordsService} from "../../../services/game-records.service";

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {

  m_array_records: Observable<Array<any>>;

  constructor( private grService: GameRecordsService ) {
    this.m_array_records = this.grService.m_record_b_subject.asObservable();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.grService._finish();
  }

  /* async get_firestore_history() {
       const m_history_snapshot = await getDocs(collection(this.databaseService.m_data_base, this.databaseService.m_collections.history))

       m_history_snapshot.forEach((doc) => {
           console.log(doc.id, " => ", this.m_array_history.push(doc.data()));
       });
   }
   */

}
