import { lstat, lstatSync } from "fs-extra";

async function isDirectory(path: string): Promise<boolean> {
	return (await lstat(path)).isDirectory();
}

function isDirectorySync(path: string): boolean {
	return lstatSync(path).isDirectory();
}

export { isDirectory, isDirectorySync };
