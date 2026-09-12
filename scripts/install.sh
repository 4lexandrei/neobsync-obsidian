#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(dirname -- "$(realpath -- "$0")")"
PROJECT_DIR="$(dirname -- "$SCRIPT_DIR")"

PLUGIN_ID="neobsync-obsidian"

VAULT_PATH="${1:-}"

if [[ -z "$VAULT_PATH" ]]; then
	echo "[ERROR] Usage $0 <path-to-obsidian-vault>"
	exit 1
fi

if [[ ! -d "$VAULT_PATH" ]]; then
	echo "[ERROR] Obsidian vault does not exist: $VAULT_PATH"
	exit 1
fi

if [[ ! -d "$VAULT_PATH/.obsidian" ]]; then
	echo "[ERROR] Not an obsidian vault: $VAULT_PATH"
	exit 1
fi

VAULT_PATH="$(realpath -m "$VAULT_PATH")"

if ! command -v npm >/dev/null 2>&1; then
	echo "[ERROR] npm is not installed or not available in PATH."
	exit 1
fi

echo "Installing dependencies..."

npm ci

echo "Building plugin..."

npm run build

if [[ ! -f "$PROJECT_DIR/main.js" ]]; then
	echo "[ERROR] Couldn't find main.js"
	exit 1
fi

if [[ ! -f "$PROJECT_DIR/manifest.json" ]]; then
	echo "[ERROR] Couldn't find manifest.json"
	exit 1
fi

PLUGIN_PATH="$VAULT_PATH/.obsidian/plugins/$PLUGIN_ID"

echo "Installing $PLUGIN_ID"
echo "Vault: $VAULT_PATH"
echo "Plugin: $PLUGIN_PATH"

mkdir -p "$PLUGIN_PATH"

install_file() {
	local source="$1"
	local destination="$2"

	if [[ -e "$destination" || -L "$destination" ]]; then
		echo "[WARN] $destination already exists."

		read -r -p "Overwrite? [y/N]: " answer

		if [[ ! "$answer" =~ ^[Yy]$ ]]; then
			echo "[INFO] Skipping $destination"
			return
		fi

		rm -rf "$destination"
	fi

	cp "$source" "$destination"
}

install_file "$PROJECT_DIR/main.js" "$PLUGIN_PATH/main.js"
install_file "$PROJECT_DIR/manifest.json" "$PLUGIN_PATH/manifest.json"

echo "$PLUGIN_ID installed successfully."
