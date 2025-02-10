import { Component } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrCodeComponent } from '@utils/qr-code/qr-code/qr-code.component';
import { TagService } from '@app/tags/tag.service';
import { Observable } from 'rxjs';
import { Tag } from '@models/tag';

@Component({
  selector: 'app-tags',
  imports: [AsyncPipe, FormsModule, NgForOf, QrCodeComponent],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
})
export class TagsComponent {
  tags$: Observable<Tag[]>;
  tagName: string = 'New Tag';

  constructor(private tagService: TagService) {
    this.tags$ = this.tagService.getTagsForCurrentUser();
  }

  addTag(name: string = this.tagName) {
    this.tagService.addTagForCurrentUser(name);
  }

  deleteTag(id: string | undefined) {
    if (id) {
      this.tagService.deleteTag(id);
    }
  }
}
