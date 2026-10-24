import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const disabledPath = path.join(__dirname, "", "..", "data", "disabled.json");

export type DisabledMap = Record<string, string[]>;

export let disabledCache: DisabledMap = {};

export function initializeDisabledCache(): void {
    try {
        if (!fs.existsSync(disabledPath)) {
            fs.writeFileSync(disabledPath, JSON.stringify({}), "utf8");
        }
        const data = fs.readFileSync(disabledPath, "utf8");
        const parsed = JSON.parse(data);
        disabledCache = parsed !== null && typeof parsed === "object" ? parsed : {};
    } catch (error) {
        console.error("Failed to load disabled file during initialization:", error);
        disabledCache = {};
    }
}

export function updateDisabledCache(newData: DisabledMap): void {
    disabledCache = newData;
    try {
        fs.writeFileSync(disabledPath, JSON.stringify(newData, null, 2), "utf8");
    } catch (error) {
        console.error("Failed to write to disabled commands file:", error);
    }
}
