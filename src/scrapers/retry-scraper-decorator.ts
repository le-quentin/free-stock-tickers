const getMethods = (obj: object) => {
  let properties = new Set<string>()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

type RetryableFunction = (...args: any[]) => Promise<any>;

export function RetryDecorator<T extends object>(decorated: T, f: RetryableFunction, retries: number) {
  Object.assign(this, decorated);
  for(const method of getMethods(decorated)) {
    this[method]=decorated[method];
  }

  this[f.name] = (...args: any[]) => {
    function tryApply(nthAttempt: number) {
      return f.apply(decorated, args)
        .catch((err: any) => {
          if (nthAttempt >= retries) throw err;
          return tryApply(nthAttempt+1);
        });
    };
    return tryApply(1);
  }
}
