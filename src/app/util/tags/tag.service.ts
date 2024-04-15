import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from './tag.model';
import { FirestoreService } from '../../firebase/firestore.service';
import { BagTagCollectionsEnum } from '../../firebase/bagTag.collections.enum';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  firestoreService: FirestoreService = inject(FirestoreService);
  tags$: Observable<Tag[]>;

  constructor() {
    this.tags$ = this.firestoreService.getCollectionData(BagTagCollectionsEnum.TAGS) as Observable<Tag[]>;
  }

  addTag(name: string = 'New Tag') {
    const newTag: Tag = {
      name: name,
      url: name,
    };
    return this.firestoreService.save(BagTagCollectionsEnum.TAGS, newTag);
  }

  getTags() {
    return this.tags$;
  }

  deleteTag(id: string) {
    return this.firestoreService.delete(BagTagCollectionsEnum.TAGS, id);
  }
}
