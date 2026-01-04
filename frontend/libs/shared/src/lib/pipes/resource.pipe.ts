import { Pipe, PipeTransform } from '@angular/core';
import { ResourceService } from '../services/resource.service';

@Pipe({
  name: 'resource',
  standalone: true,
  pure: false // To update when signal changes, though signal usage might require different approach or pure: false
})
export class ResourcePipe implements PipeTransform {
  constructor(private resourceService: ResourceService) {}

  transform(value: string): string {
    return this.resourceService.get(value);
  }
}
