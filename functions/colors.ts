import {pickRandom} from "./messages.js";
import {colorValues} from "j27-lib";

import type {ColorResolvable} from "discord.js";
export default function color(): ColorResolvable {
    const colors: ColorResolvable[] = ['#00F8FF', "#3F02BA", "#70D1FE", "#B898F2"]
    for (let i = 0; i < colorValues.length; i++) {
        colors.push(colorValues[i] as ColorResolvable);
    }
    return pickRandom(colors);
}