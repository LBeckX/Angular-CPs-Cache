/* tslint:disable:member-ordering */
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ICpsCacheObject} from './interfaces/ICpsCacheObject';

@Injectable({
  providedIn: 'any'
})
export class CpsCacheService {

  private cache: { [key: string]: BehaviorSubject<ICpsCacheObject> } = {};

  /**
   * @param key
   * @param data
   * @param expire
   */
  public set(key: string, data: any = null, expire: Date = null): any {
    const e = expire ? expire.toString() : null;
    const cacheObject: ICpsCacheObject = {key, data, since: (new Date()).toString(), expire: e};

    if (this.cache[key]) {
      this.cache[key].next(cacheObject);
    } else {
      this.cache[key] = new BehaviorSubject(cacheObject);
    }

    localStorage.setItem(key, CpsCacheService._getStringFromData(cacheObject));

    return cacheObject;
  }

  /**
   * @param key
   */
  public get(key: string): ICpsCacheObject {
    let cacheObject: ICpsCacheObject = null;

    if (this.has(key, true)) {
      cacheObject = this.cache[key].getValue();
    } else if (this.has(key, false)) {
      cacheObject = CpsCacheService._getDataFromString(localStorage.getItem(key));
    }

    if (cacheObject && (!cacheObject.expire || (new Date(cacheObject.expire).getTime() > Date.now()))) {
      return cacheObject;
    }

    return this.set(key, null);
  }

  /**
   * @param key
   */
  public getObserver(key: string): BehaviorSubject<ICpsCacheObject> {
    if (!this.has(key, true) && this.has(key, false)) {
      this.set(key, this.get(key).data);
    } else if ((!this.has(key, true) && !this.has(key, false)) || !this.get(key)) {
      this.set(key, null);
    }

    return this.cache[key];
  }

  /**
   * @param key
   */
  public delete(key: string): ICpsCacheObject {
    const cacheObject: ICpsCacheObject = this.get(key);

    if (this.has(key, true)) {
      this.cache[key].complete();
      delete this.cache[key];
    }

    localStorage.removeItem(key);

    return cacheObject;
  }

  /**
   *
   */
  public clear(): void {
    for (const key in this.cache) {
      if (!this.cache.hasOwnProperty(key)) {
        continue;
      }
      this.cache[key].complete();
      delete this.cache[key];
    }
    localStorage.clear();
  }

  /**
   * @param key
   * @param inCache
   */
  public has(key: string, inCache: boolean = true): boolean {
    if (inCache) {
      return this.cache.hasOwnProperty(key);
    }
    return localStorage.getItem(key) !== null;
  }

  /**
   * @param data
   * @private
   */
  private static _getStringFromData(data: any): string {
    switch (typeof data) {
      case 'string':
        return data;
      case 'object':
        data = JSON.stringify(data);
        return data;
      case 'number':
        data = data.toString();
        return data;
      default:
        return null;
    }
  }

  /**
   * @param s
   * @private
   */
  private static _getDataFromString(s: string): any {
    try {
      return JSON.parse(s);
    } catch (e) {
    }
    if (CpsCacheService._isNumber(s)) {
      return Number(s);
    }
    return s;
  }

  /**
   * @param n
   * @private
   */
  private static _isNumber(n): boolean {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}
