import { Tag } from '../../../models/tag.model';

export class TagCheckbox {
  tag: Tag;
  private checked: boolean = false;

  constructor(tag: Tag) {
    this.tag = tag;
  }

  getChecked(): boolean {
    return this.checked;
  }

  toggleCheck() {
    this.checked = !this.checked;
  }

  check() {
    this.checked = true;
  }

  uncheck() {
    this.checked = false;
  }
}
