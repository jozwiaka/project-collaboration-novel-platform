import { Novel } from '../../../models/novel.model';

export class NovelCheckbox {
  novel: Novel;
  private checked: boolean = false;

  constructor(novel: Novel) {
    this.novel = novel;
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
