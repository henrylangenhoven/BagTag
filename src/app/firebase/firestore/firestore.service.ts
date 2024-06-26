import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, query, where } from '@angular/fire/firestore';
import { BagTagCollections } from './bagTagCollections';
import { DocumentReference } from '@firebase/firestore';
import { BaseFirestoreDocument } from '@models/base-firestore-document';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  getCollectionDataForUser(
    collectionPath: string = BagTagCollections.TAGS,
    userId: string
  ): Observable<BaseFirestoreDocument[] | unknown> {
    const collectionReference = collection(this.firestore, collectionPath);
    const q = query(collectionReference, where('ownerId', '==', userId));

    return new Observable(observer => {
      return onSnapshot(q, snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        observer.next(data); // Emit the data
      });
    });
  }

  async save(
    firestoreCollection: BagTagCollections = BagTagCollections.TAGS,
    payload: BaseFirestoreDocument
  ): Promise<DocumentReference<BaseFirestoreDocument>> {
    const collectionReference = collection(this.firestore, firestoreCollection);
    return addDoc(collectionReference, payload);
  }

  delete(afCollection: BagTagCollections, id: string) {
    let documentReference = doc(this.firestore, `/${afCollection}/`, id);
    return deleteDoc(documentReference);
  }
}
