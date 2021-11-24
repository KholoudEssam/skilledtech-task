import { Injectable } from '@angular/core';
import { BehaviorSubject, of, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { collectionData } from '@angular/fire/firestore';
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  addDoc,
  increment,
} from 'firebase/firestore';

import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  comments: Comment[] = [];
  comments$ = new Subject<Comment[]>();
  noData = new BehaviorSubject<boolean>(false);

  temp() {
    return of(this.comments);
  }

  constructor(private afs: AngularFirestore) {}

  lastVisible: any;

  async getFirst() {
    const first = query(
      collection(this.afs.firestore, 'comments'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const docSnapshots = await getDocs(first);

    this.lastVisible = docSnapshots.docs[docSnapshots.docs.length - 1];
    collectionData(first).subscribe((data) => {
      this.comments.push(...(data as Comment[]));
      this.comments$.next(data as Comment[]);
    });
  }
  async getAfter() {
    const next = query(
      collection(this.afs.firestore, 'comments'),
      orderBy('createdAt', 'desc'),
      limit(5),
      startAfter(this.lastVisible)
    );

    const docSnapshots = await getDocs(next);
    if (!docSnapshots.docs.length) {
      console.log('No Data Available');
      this.noData.next(true);
      this.lastVisible = null;
      return;
    } else {
      this.lastVisible = docSnapshots.docs[docSnapshots.docs.length - 1];

      collectionData(next).subscribe((data) => {
        console.log('data', data);
        if (!data.length) {
          this.noData.next(true);
          return;
        } else {
          this.comments.push(...(data as Comment[]));
          this.comments$.next(data as Comment[]);
          if (data.length != 5) this.noData.next(true);
        }
      });
    }
  }

  addComment(comment: Comment) {
    addDoc(collection(this.afs.firestore, 'comments'), comment);
    this.afs.doc('comments/xyz').update({ docsCount: increment(1) });
    this.noData.next(true);
  }

  getCount() {
    return this.afs
      .doc<{ docsCount: number }>('comments/xyz')
      .valueChanges()
      .pipe(map((data) => data?.docsCount));
  }
}
