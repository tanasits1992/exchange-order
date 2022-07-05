const cloneDeep = require('lodash/cloneDeep');
const fs = require('fs');

export class FileManagement {
  read(path: string): any {
    try {
      return cloneDeep(require(`../../../${path}`))
    } catch (err) {
      throw err
    }
  };

  write(path: string, data: any) {
    try {
      fs.writeFileSync(path, data);
    } catch (err) {
      throw err
    }
  };
}
