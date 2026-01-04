import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './ui/button/button.component';
import { InputComponent } from './ui/input/input.component';
import { ModalComponent } from './ui/modal/modal.component';
import { ServiceRegistry } from './services/service-registry.service';
import { APIS } from './api';

@NgModule({
  imports: [CommonModule, ButtonComponent, InputComponent, ModalComponent],
  declarations: [],
  exports: [ButtonComponent, InputComponent, ModalComponent]
})
export class SharedModule {
  constructor(registry: ServiceRegistry) {
    APIS.forEach(api => {
      registry.register(api.name, api);
    });
  }
}
