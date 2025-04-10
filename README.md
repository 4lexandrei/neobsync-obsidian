# neobsync-obsidian

neobsync-obsidian is a plugin for Obsidian that allows synchronization with Neovim.

> [!NOTE]
> This plugin works alongside [`neobsync.nvim`](https://github.com/4lexandrei/neobsync.nvim)

# Installation

Local installation

```bash
git clone https://github.com/4lexandrei/neobsync-obsidian.git
```

Install dependencies and finally build

```bash
cd neobsync-obsidian
npm install
npm run build
```

Building should output `main.js`
The final step would be copying `main.js` and `manifest.json` inside the obsidian vault plugins directory

```bash
mkdir -p ~/<path_to_obsidian_vault>/.obsidian/plugins/neobsync-obsidian
cp main.js ~/<path_to_obsidian_vault>/.obsidian/plugins/neobsync-obsidian
cp manifest.json ~/<path_to_obsidian_vault>/.obsidian/plugins/neobsync-obsidian
```
