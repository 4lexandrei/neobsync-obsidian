# neobsync-obsidian

neobsync-obsidian is a plugin for Obsidian that allows synchronization with Neovim.

> [!NOTE]
> This plugin works alongside [`neobsync.nvim`](https://github.com/4lexandrei/neobsync.nvim)

## 📦 Installation

### Requirements

- Node.js
- npm
- An existing Obsidian vault

Clone the repository:

```bash
git clone https://github.com/4lexandrei/neobsync-obsidian.git
cd neobsync-obsidian
```

Run the installation script:

```bash
./scripts/install.sh ~/<path_to_obsidian_vault>
```

Enable the plugin:

1. In Obsidian, open Settings.
2. In the side menu, select Community plugins.
3. Select Turn on community plugins.
4. Under Installed plugins, enable Neobsync Obsidian by selecting the toggle button next to it.

## 🔄 Updating

Pull the latest changes and run the installer:

```bash
cd <neobsync-obsidian_path>
git pull
./scripts/install.sh ~/<path_to_obsidian_vault>
```

This installer will update the plugin files in the vault

## 🛠️ Development setup

```bash
git clone https://github.com/4lexandrei/neobsync-obsidian.git
cd neobsync-obsidian
```

Install dependencies:

```
npm install
npm run dev
```

Use symlink script helper for quick setup:

```
npm run symlink ~/<path_to_obsidian_vault>
```
