import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ResizableDirective } from './directives/resizable.directive';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, ResizableDirective],
  imports: [CommonModule],
  exports: [NavbarComponent, FooterComponent, ResizableDirective],
})
export class SharedModule {}
