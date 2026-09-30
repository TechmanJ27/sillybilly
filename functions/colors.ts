import {pickRandom} from "./messages.js";
import type {ColorResolvable} from "discord.js";
export default function color(): ColorResolvable {
    const colors: ColorResolvable[] = ['#00F8FF']
    return pickRandom(colors);
}