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

const vaultStats = fs.statSync(resolvedVaultPath, {
	throwIfNoEntry: false,
});

if (!vaultStats) {
	console.error(`ERROR: Missing directory: ${resolvedVaultPath}`);
	process.exit(1);
}

if (!vaultStats.isDirectory()) {
	console.error(`ERROR: Path is not a directory: ${resolvedVaultPath}`);
	process.exit(1);
}

const obsidianPath = path.join(resolvedVaultPath, ".obsidian");
const obsidianStats = fs.statSync(obsidianPath, { throwIfNoEntry: false });

if (!obsidianStats || !obsidianStats.isDirectory()) {
	console.error(`ERROR: Not an obsidian vault: ${resolvedVaultPath}`);
	process.exit(1);
}

const pluginPath = path.join(obsidianPath, "plugins", "neobsync-obsidian");
fs.mkdirSync(pluginPath, { recursive: true });

const filesToLink = ["main.js", "manifest.json"];
const projectRoot = process.cwd();

console.log(`Symlinking files from ${projectRoot} to ${resolvedVaultPath}`);

filesToLink.forEach((file) => {
	const sourceFile = path.join(projectRoot, file);
	const targetFile = path.join(pluginPath, file);

	try {
		const stats = fs.lstatSync(targetFile, { throwIfNoEntry: false });

		if (stats) {
			if (stats.isSymbolicLink()) {
				console.log(
					`${path.basename(targetFile)} already exists; replacing it`,
				);
				fs.unlinkSync(targetFile);
			} else if (stats.isFile()) {
				console.log(
					`${path.basename(targetFile)} already exists; replacing it`,
				);
				fs.rmSync(targetFile);
			}
		}

		fs.symlinkSync(sourceFile, targetFile, "file");

		console.log(` ✅ Linked: ${file} -> "${targetFile}"`);
	} catch {
		console.log(`ERROR: Couldn't create symlink for ${file}`);
	}
});
console.log("✨ Symlink setup complete!");
