import { OrderContent } from "./exchange/exchange.interface";
import { exchange } from "./exchange/exchange.service";
import { FileManagement } from "./shared/file/file";

const inputPath: string = '../input/input.json';
const outputPath: string = 'output/output.json';

const file = new FileManagement();
const content: OrderContent = file.read(inputPath);

let output = exchange(content)

file.write(outputPath, JSON.stringify(output, null, 2));

