export class DataTools {
  static delProp (obj: any, propName: string) {
    if (obj && typeof obj === 'object' && obj[propName]) obj[propName] = null;
    return obj;
  }

  static delProps (obj: any, propNames: string[]) {
    propNames.forEach(propName => DataTools.delProp(obj, propName));
    return obj
  }

  static delArrProps (arr: any[], propNames: string[]) {
    arr.map(item => DataTools.delProps(item, propNames));
    return arr;
  }

  static
}

export const delProps = DataTools.delProps;

export const delArrProps = DataTools.delArrProps;