#!/usr/bin/env node
import printTreeExtendedResult from "./printTreeExtendedResult";

const [, , ...args] = process.argv;

printTreeExtendedResult(args);
