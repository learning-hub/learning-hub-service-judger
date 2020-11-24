export class PromiseTools {
  static wrap<T> (promise: Promise<T>) {
    return promise.then(data => [null, data]).catch(err => [err, null])
  }
}

export const wrap = PromiseTools.wrap;