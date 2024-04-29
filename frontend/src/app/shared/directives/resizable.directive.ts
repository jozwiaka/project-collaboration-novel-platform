import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appResizable]',
})
export class ResizableDirective {
  startX: number = 0;
  resizing: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.startX = event.pageX;
    this.resizing = true;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.resizing) return;

    const diffX = event.pageX - this.startX;
    const newWidth = this.el.nativeElement.offsetWidth + diffX;
    this.el.nativeElement.style.width = newWidth + 'px';
    this.startX = event.pageX;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.resizing = false;
  }
}
