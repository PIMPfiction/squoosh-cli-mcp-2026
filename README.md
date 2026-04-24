# Squoosh CLI & MCP Server

This repository contains a fully working fork of the popular Squoosh image optimizer, featuring a resurrected and hardened **CLI** as well as a brand new **MCP (Model Context Protocol)** server. You can use it directly from your terminal, or plug it into AI tools like Claude Code to let AI optimize your images automatically.

---

## 📦 Global Installation (Easiest Method)

You can easily install both the CLI and MCP Server globally on your machine directly from GitHub:

```bash
npm install -g PIMPfiction/squoosh-cli-mcp-2026
```

This will automatically add `squoosh-cli` and `squoosh-mcp` as global commands on your system.

---

## 🤖 1. Squoosh MCP Server

The built-in MCP server allows AI assistants (like Claude) to automatically compress and optimize images during your workflow. When asked to "optimize my images", the AI connects to this server and executes Squoosh natively.

### Installing for Claude Code (CLI)

Once you have globally installed the package, just run this to connect it to Claude Code:

```bash
claude mcp add squoosh-mcp squoosh-mcp
```

Open `claude` in any project and type:

> _"Compress the `src/assets/hero.jpg` file using squoosh."_

The AI will automatically run the optimization and update the file references in your local HTML/JS.

### Installing for Claude Desktop System

To use Squoosh MCP in the official Claude Desktop app, edit your MCP configuration file:

- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the following to your `mcpServers` object:

```json
{
  "mcpServers": {
    "squoosh-mcp": {
      "command": "squoosh-mcp",
      "args": []
    }
  }
}
```

_(After saving, restart Claude Desktop)._

---

## 🚀 2. Squoosh CLI (Command Line Interface)

The CLI tool allows you to compress, resize, and optimize your images in bulk using modern codecs (MozJPEG, OxiPNG, WebP, AVIF, JXL).

Since you installed it globally, you can run it from anywhere.

View help:

```bash
squoosh-cli --help
```

### Example Compression (MozJPEG):

Compress an image named `test.jpg` into the `cli/` directory with automatic MozJPEG optimization, appending `_output` to the filename:

```bash
squoosh-cli test.jpg --mozjpeg auto -s _output -d cli/
```

_(Note: WebAssembly warnings may temporarily appear in the terminal during fallback. This is normal and the compression will succeed)._

---

## 👨‍💻 Note for Developers (Manual Cloning)

If you want to view, edit, or commit to the source code:

1. Clone the repository:

   ```bash
   git clone https://github.com/PIMPfiction/squoosh-cli-mcp-2026.git
   cd squoosh-cli-mcp-2026
   npm install
   ```

2. Run directly from the source:
   ```bash
   node cli/src/prod.js --help
   node squoosh-mcp.mjs
   ```
