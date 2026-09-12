import fs from "fs";
import path from "path";

const rawVaultPath = process.argv[2];

if (!rawVaultPath) {
	console.error("ERROR: Please specify a target vault path.");
	process.exit(1);
}

const resolvedVaultPath = rawVaultPath.startsWith("~")
	? path.join(
			process.env.HOME || process.env.USERPROFILE || "",
			rawVaultPath.slice(1),
		)
	: path.resolve(rawVaultPath);

if (!fs.existsSync(resolvedVaultPath)) {
	console.error(`ERROR: Missing directory: ${resolvedVaultPath}`);
	process.exit(1);
}

const filesToLink = ["main.js", "manifest.json"];
const projectRoot = process.cwd();

console.log(`Symlinking files from ${projectRoot} to ${resolvedVaultPath}`);

filesToLink.forEach((file) => {
	const sourceFile = path.join(projectRoot, file);
	const targetFile = path.join(resolvedVaultPath, file);

	try {
		if (
			fs.existsSync(targetFile) &&
			fs.lstatSync(targetFile).isSymbolicLink()
		) {
			console.log(`${file} is already symlinked`);
			return;
		}
		fs.symlinkSync(sourceFile, targetFile, "file");
		console.log(` ✅ Linked: ${file} -> "${targetFile}"`);
	} catch {
		console.log(`ERROR: Couldn't create symlink for ${file}`);
	}
});
console.log("✨ Symlink setup complete!");
