import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

import { directoryStruct } from '../tools/directoryStructs';

/**
 * Generates a directory for the source file and docker file
 * to be stored.
 * @param uuid The UUID of the running code container.
 * @param codeType The language of the code container.
 */
export function generateBuildDirectory(uuid: string, codeType: string): void {
  let dir: string;

  switch (codeType) {
    case 'python':
      dir = directoryStruct.python;
      if (!fs.existsSync(path.join(process.cwd(), dir))) {
        fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true });
      }
      break;
    case 'golang':
      dir = directoryStruct.golang;
      if (!fs.existsSync(path.join(process.cwd(), dir))) {
        fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true });
      }
      break;
    default:
      throw new Error('Invalid code type specified...');
  }

  dir = `${dir}/${uuid}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true });
  }

  console.log('Build Directory generated...');
}

/**
 * Generates a source file for the code to be ran from.
 * @param uuid The UUID of the running code container.
 * @param codeType The language of the code container.
 * @param code The code to be written to the file.
 */
export function generateSrcFile(uuid: string, codeType: string, code: string): void {
  let dir: string; // path to where file should be generated
  switch (codeType) {
    case 'python':
      dir = `${directoryStruct.python}/${uuid}/${uuid}.py`;
      break;
    case 'golang':
      dir = `${directoryStruct.golang}/${uuid}/${uuid}.go`;
      break;
    default:
      throw new Error('Invalid code type specified...');
  }

  const filePath = path.join(process.cwd(), dir);

  try {
    fs.writeFile(filePath, code, (error) => {
      if (error) {
        throw error;
      }
      console.log('Source File Generated...');
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Removes a directory that is unused based on the specific codeType and uuid targeted.
 * @param uuid The UUID of the running code container.
 * @param codeType The language of the code container.
 */
export function removeBuildDirectory(uuid: string, codeType: string) {
  let dir: string;
  switch (codeType) {
    case 'python':
      dir = `${directoryStruct.python}/${uuid}`;
      break;
    case 'golang':
      dir = `${directoryStruct.golang}/${uuid}`;
      break;
    default:
      throw new Error('Invalid code type specified...');
  }
  try {
    rimraf.sync(dir);
    console.log('Directory removed...');
  } catch (error) {
    console.error(error);
  }
}
