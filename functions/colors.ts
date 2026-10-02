import {pickRandom} from "./messages.js";

import type {ColorResolvable} from "discord.js";
export default function color(): ColorResolvable {
    const colors: ColorResolvable[] = ['#00F8FF', "#3F02BA", "#70D1FE", "#B898F2"]
    return pickRandom(colors);
}