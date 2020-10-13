# CpsCache

install
```
npm i cps-cache
```

usage angular dependency injection
```typescript
export class Example {
  
  constructor(
    private cpsCacheService: CpsCacheService
  ) {

        console.log('--- Test with simple data ---');

        console.log(this.cpsCache.set('test', 'test'));
    
        console.log(this.cpsCache.get('test'));
    
        this.cpsCache.getObserver('test').subscribe((data) => {
          console.log(data);
        });
    

        console.log('--- Test with complex data ---');

        console.log(this.cpsCache.set('testComplex', {name: 'Your son', age: 12}));
    
        console.log(this.cpsCache.get('testComplex'));
    
        this.cpsCache.getObserver('testComplex').subscribe((data) => {
          console.log(data);
        });
    
        
        console.log('--- Test with expired data ---');

        console.log(this.cpsCache.set('testExpire', 'test', (new Date())));
    
        console.log(this.cpsCache.get('testExpire'));
    
        this.cpsCache.getObserver('testExpire').subscribe((data) => {
          console.log(data);
        });
  }
}
```
example output

```
> --- Test with simple data ---
> {key: "test", data: "test", since: "Tue Oct 13 2020 23:43:43 GMT+0200 (Mitteleuropäische Sommerzeit)", expire: null}
> {key: "test", data: "test", since: "Tue Oct 13 2020 23:43:43 GMT+0200 (Mitteleuropäische Sommerzeit)", expire: null}
> {key: "test", data: "test", since: "Tue Oct 13 2020 23:43:43 GMT+0200 (Mitteleuropäische Sommerzeit)", expire: null}

> --- Test with complex data ---
> {key: "testComplex", data: {name: 'Your son', age: 12}, since: "Tue Oct 13 2020 23:43:43 GMT+0200 (Mitteleuropäische Sommerzeit)", expire: null}
> {key: "testComplex", data: {name: 'Your son', age: 12}, since: "Tue Oct 13 2020 23:43:43 GMT+0200 (Mitteleuropäische Sommerzeit)", expire: null}
> {key: "testComplex", data: {name: 'Your son', age: 12}, since: "Tue Oct 13 2020 23:43:43 GMT+0200 (Mitteleuropäische Sommerzeit)", expire: null}

> --- Test with expired data ---
> {key: "testExpire", data: "test", since: "Tue Oct 13 2020 23:43:43 GMT+0200 (Mitteleuropäische Sommerzeit)", expire: "Tue Oct 13 2020 23:43:43 GMT+0200 (Mitteleuropäische Sommerzeit)"}
> {key: "testExpire", data: null, since: "Tue Oct 13 2020 23:43:43 GMT+0200 (Mitteleuropäische Sommerzeit)", expire: null}
> {key: "testExpire", data: null, since: "Tue Oct 13 2020 23:43:43 GMT+0200 (Mitteleuropäische Sommerzeit)", expire: null}
```
