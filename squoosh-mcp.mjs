#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const execAsync = promisify(exec);

const server = new McpServer({
  name: "squoosh-mcp",
  version: "1.0.0"
});

// Calculate the path to the CLI script
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const squooshCliPath = path.join(__dirname, "cli", "src", "prod.js");

server.tool(
  "compress_image",
  "KULLANIM TALİMATI: Kullanıcı 'görselleri squoosh mcp ile compress et', 'görseli optimize et' veya 'görselleri sıkıştır' dediğinde BU ARACI kullanmalısınız. Bu araç otomatik olarak `--mozjpeg` algoritmasını kullanarak en iyi sıkıştırmayı yapar ve çıktı dosyasını .jpg uzantısına çevirir. Aynı zamanda, uzantı .jpg olarak değiştiği için projedeki kaynak kodlarda (HTML, JS, CSS vb.) eski dosya adını yeni .jpg dosya adıyla güncelleme yeteneğine sahiptir (updateReferencesIn parametresi ile).",
  {
    inputFiles: z.array(z.string()).describe("Sıkıştırılacak girdi görsel dosyalarının yolları (örn: ['src/assets/image.png'])."),
    outputDir: z.string().describe("Sıkıştırılmış .jpg dosyalarının kaydedileceği klasör dizini (örn: 'src/assets/optimized')."),
    updateReferencesIn: z.array(z.string()).optional().describe("Opsiyonel: HTML, JS veya CSS gibi eski görsel isimlerinin yeni .jpg isimleriyle değiştirilmesi gereken hedef dosyaların listesi.")
  },
  async ({ inputFiles, outputDir, updateReferencesIn }) => {
    try {
      await fs.mkdir(outputDir, { recursive: true });

      const results = [];
      const renameMap = new Map();

      for (const inputFile of inputFiles) {
        try {
          await fs.stat(inputFile);
        } catch {
          results.push(`Dosya bulunamadı: ${inputFile}`);
          continue;
        }

        const oldName = path.basename(inputFile);
        const nameWithoutExt = path.parse(inputFile).name;
        const newName = `${nameWithoutExt}.jpg`;
        renameMap.set(oldName, newName);

        const command = `node "${squooshCliPath}" --mozjpeg auto -d "${outputDir}" "${inputFile}"`;
        try {
          const { stdout } = await execAsync(command);
          results.push(`Başarıyla sıkıştırıldı: ${inputFile} -> ${path.join(outputDir, newName)}\n${stdout}`);
        } catch (error) {
          results.push(`Sıkıştırma başarısız oldu: ${inputFile}\nHata: ${error.message}\n${error.stderr || ""}`);
        }
      }

      if (updateReferencesIn && updateReferencesIn.length > 0) {
        let referenceUpdates = [];
        for (const targetFile of updateReferencesIn) {
          try {
            let content = await fs.readFile(targetFile, "utf-8");
            let modified = false;

            for (const [oldName, newName] of renameMap.entries()) {
              if (oldName === newName) continue;
              const regex = new RegExp(oldName.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
              if (regex.test(content)) {
                content = content.replace(regex, newName);
                modified = true;
              }
            }

            if (modified) {
              await fs.writeFile(targetFile, content, "utf-8");
              referenceUpdates.push(`Referanslar güncellendi: ${targetFile}`);
            }
          } catch (err) {
            referenceUpdates.push(`Referans güncelleme başarısız oldu: ${targetFile} - ${err.message}`);
          }
        }
        if (referenceUpdates.length > 0) {
          results.push("\nReferans Güncellemeleri:\n" + referenceUpdates.join("\n"));
        } else {
          results.push("\nHiçbir referans güncellemesi gerekmedi veya bulunamadı.");
        }
      }

      return {
        content: [{ type: "text", text: results.join("\n") }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Hata: ${error.message}` }],
        isError: true
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Squoosh MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});