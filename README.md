# Squoosh CLI & MCP Server

This repository contains a fully working fork of the popular Squoosh image optimizer, featuring a resurrected and hardened **CLI** as well as a brand new **MCP (Model Context Protocol)** server. You can use it directly from your terminal, or plug it into AI tools like Claude Code to let AI optimize your images automatically.

---

## 🚀 1. Squoosh CLI (Command Line Interface)

The CLI tool allows you to compress, resize, and optimize your images in bulk using modern codecs (MozJPEG, OxiPNG, WebP, AVIF, JXL).

### Installation & Usage (Local)

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/PIMPfiction/squoosh-cli-mcp-2026.git
   cd squoosh-cli-mcp-2026
   npm install
   ```

2. Run the CLI directly:

   ```bash
   node cli/src/prod.js --help
   ```

3. **Example Compression (MozJPEG):**
   Compress an image named `test.jpg` into the `cli/` directory with automatic MozJPEG optimization, appending `_output` to the filename:
   ```bash
   node cli/src/prod.js cli/test.jpg --mozjpeg auto -s _output -d cli/
   ```
   _(Note: WebAssembly (WASM) warnings may temporarily appear in the terminal during fallback. This is normal and the compression will succeed)._

---

## 🤖 2. Squoosh MCP Server

We provide a built-in MCP server (`squoosh-mcp.mjs`) that allows AI assistants (like Claude, Cursor, Windows Copilot) to automatically compress and optimize images during your workflow. When asked to "optimize my images", the AI connects to this server and executes Squoosh natively.

### Installing for Claude Code (CLI)

Claude Code supports MCP servers natively. To add the Squoosh MCP server globally to your Claude Code instance, run the following command in your terminal. _(Change the absolute path to your local cloned directory)_:

```bash
claude mcp add squoosh-mcp node "/ABSOLUTE/PATH/TO/squoosh-cli-mcp-2026/squoosh-mcp.mjs"
```

Once added, open `claude` in any project and type:

> _"Compress the `src/assets/hero.jpg` file using squoosh."_

The AI will automatically run the optimization and update the file references in your local HTML/JS base.

### Installing for Claude Desktop System

To use Squoosh MCP in the official Claude Desktop app, edit your MCP configuration file:

- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the following to your `mcpServers` object:

```json
{
  "mcpServers": {
    "squoosh-mcp": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/squoosh-cli-mcp-2026/squoosh-mcp.mjs"]
    }
  }
}
```

_(After saving, restart Claude Desktop)._
