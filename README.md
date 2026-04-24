# Squoosh CLI & MCP Server

This repository contains a fully working fork of the popular Squoosh image optimizer, featuring a resurrected and hardened **CLI** as well as a brand new **MCP (Model Context Protocol)** server. You can use it directly from your terminal, or plug it into AI tools like Claude Code to let AI optimize your images automatically.

---

## 🤖 1. Squoosh MCP Server (Easiest Method)

If you use **Claude Code**, you can directly install and run the Squoosh MCP server without downloading anything manually!

Run this single command in your terminal:

```bash
claude mcp add squoosh-mcp npx -y github:PIMPfiction/squoosh-cli-mcp-2026 squoosh-mcp
```

That's it! Now open `claude` and type:

> _"Compress the `src/assets/hero.jpg` file using squoosh."_

The AI will perfectly compress the image and update references automatically.

### Claude Desktop System (Without cloning)

To use it without cloning in Claude Desktop, edit your config file:

- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the following to your `mcpServers` object:

```json
{
  "mcpServers": {
    "squoosh-mcp": {
      "command": "npx",
      "args": ["-y", "github:PIMPfiction/squoosh-cli-mcp-2026", "squoosh-mcp"]
    }
  }
}
```

_(After saving, restart Claude Desktop)._

---

## 🚀 2. Squoosh CLI (Command Line Interface)

The CLI tool allows you to compress, resize, and optimize your images in bulk using modern codecs (MozJPEG, OxiPNG, WebP, AVIF, JXL).

Since it's highly configurable, you can instantly run it via `npx` directly from this repository:

```bash
npx -y github:PIMPfiction/squoosh-cli-mcp-2026 squoosh-cli --help
```

### Example Compression (MozJPEG):

Compress an image named `test.jpg` into the `cli/` directory with automatic MozJPEG optimization, appending `_output` to the filename:

```bash
npx -y github:PIMPfiction/squoosh-cli-mcp-2026 squoosh-cli test.jpg --mozjpeg auto -s _output -d cli/
```

_(Note: WebAssembly (WASM) warnings may temporarily appear in the terminal during fallback. This is normal and the compression will succeed)._

---

## 👨‍💻 Note for Developers (Manual Cloning)

If you want to view, edit, or commit to the source code:

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/PIMPfiction/squoosh-cli-mcp-2026.git
   cd squoosh-cli-mcp-2026
   npm install
   ```

2. Run the CLI or MCP directly:
   ```bash
   node cli/src/prod.js --help
   node squoosh-mcp.mjs
   ```
