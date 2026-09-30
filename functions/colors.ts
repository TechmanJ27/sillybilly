import {pickRandom} from "./messages.js";
import {colorNames} from "J27-lib";

import type {ColorResolvable} from "discord.js";
export default function color(): ColorResolvable {
    const colors: ColorResolvable[] = ['#00F8FF', "#766A5E"]
    for (let i = 0; i < colors.length; i++) {
        colors.push(colorNames[i] as ColorResolvable);
    }
    return pickRandom(colors);
}