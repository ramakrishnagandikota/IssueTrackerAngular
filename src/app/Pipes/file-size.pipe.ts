import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: false
})
export class FileSizePipe implements PipeTransform {

 transform(value: unknown, ...args: unknown[]): string {
    if (typeof value !== 'number' || isNaN(value)) return '0 KB';
    const kb = value / 1024;
    return kb < 1024
      ? `${kb.toFixed(2)} KB`
      : `${(kb / 1024).toFixed(2)} MB`;
  }

}
