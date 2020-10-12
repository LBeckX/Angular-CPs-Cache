import {CpsCacheService} from '../lib/cps-cache.service';

export class Example {
  constructor(
    private cpsCacheService: CpsCacheService
  ) {

    // Set new cache object
    cpsCacheService.set('myKey', 'Value');

    // Get cache object
    cpsCacheService.get('myKey');

    // Get as observable
    cpsCacheService.getObserver('myKey').subscribe((data) => {

    });

    // Delete one key
    cpsCacheService.delete('myKey');

    // Clear all
    cpsCacheService.clear();
  }
}
