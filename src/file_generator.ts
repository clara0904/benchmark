import * as fs from 'fs';
import * as path from 'path';

export default class FileGenerator {
  private directory: string;

  constructor(directory: string = './generated') {
    this.directory = directory;

    if (!fs.existsSync(this.directory)) {
      fs.mkdirSync(this.directory, { recursive: true });
    }
  }

  private generateFileName(): string {
    return `${Date.now()}.txt`;
  }

  public createFile(contents: string | string[]): void {
    const fileName = this.generateFileName();
    const filePath = path.join(this.directory, fileName);

    const formattedContent = Array.isArray(contents) ? contents.join('\n') : contents;

    fs.writeFileSync(filePath, formattedContent, 'utf8');

    console.log(`Arquivo criado: ${filePath}`);
  }
}

const generator = new FileGenerator();