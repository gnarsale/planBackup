import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  constructor(private _elementRef: ElementRef) {
  }
  // output event to close intellisense
  @Output('clickOutside') clickOutside: EventEmitter<any> = new EventEmitter();
  // attach hostlistener on click event on document
  @HostListener('document:click', ['$event.target']) onMouseEnter(targetElement) {
    // check if target element is inside host element
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      // if target element on which user has clicked is outside the host element then emit an event to close the intellisense
      this.clickOutside.emit(null);
    }
  }
}
