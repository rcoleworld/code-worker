import CodeContainer from './CodeContainer';
import GolangCodeContainer from './GolangCodeContainer';
import PythonCodeContainer from './PythonCodeContainer';

export default class CodeContainerFactory {
  public getCodeContainer(type: string, code: string): CodeContainer {
    switch (type) {
      case 'python':
        return new PythonCodeContainer(code);
      case 'golang':
        return new GolangCodeContainer(code);
      default:
        throw new Error('Invalid CodeContainer type.');
    }
  }
}
