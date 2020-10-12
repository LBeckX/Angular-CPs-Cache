/* tslint:disable:member-ordering */
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ICpsCacheObject} from './interfaces/ICpsCacheObject';

@Injectable({
  providedIn: 'root'
})
export class CpsCacheService {

  private cache: { [key: string]: BehaviorSubject<ICpsCacheObject> } = {};

  /**
   * @param key
   * @param data
   */
  public set(key: string, data: any = null): ICpsCacheObject {
    const co: ICpsCacheObject = {key, data, time: (new Date()).toString()};

    if (this.cache[key]) {
      this.cache[key].next(co);
    } else {
      this.cache[key] = new BehaviorSubject(co);
    }

    localStorage.setItem(key, CpsCacheService._getStringFromData(data));

    return co;
  }

  /**
   * @param key
   */
  public get(key: string): ICpsCacheObject {
    if (this.has(key, true)) {
      return this.cache[key].getValue();
    }

    if (this.has(key, false)) {
      const data = CpsCacheService._getDataFromString(localStorage.getItem(key));
      return this.set(key, data);
    }

    return null;
  }

  /**
   * @param key
   */
  public getObserver(key: string): BehaviorSubject<ICpsCacheObject> {
    if (!this.has(key, true) && this.has(key, false)) {
      this.set(key, this.get(key).data);
    } else if (!this.has(key, true) && !this.has(key, false)) {
      this.set(key, null);
    }
    return this.cache[key];
  }

  /**
   * @param key
   */
  public delete(key: string): void {
    delete this.cache[key];
    localStorage.removeItem(key);
  }

  /**
   *
   */
  public clear(): void {
    for (const i in this.cache) {
      if (!this.cache.hasOwnProperty(i)) {
        continue;
      }
      this.cache[i].complete();
      delete this.cache[i];
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
  private static _getStringFromData(data: any): string | null {
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
