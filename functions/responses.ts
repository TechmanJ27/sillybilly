type ResponseEntry = {
    self: string;
    bot: string;
    options: string[];
};

type ResponseMap = {
    [command: string]: ResponseEntry;
};

export const responses: ResponseMap = {
    bark: {
        self: `{user} got distracted chasing their own tail. What a silly billy`,
        bot: `Woof`,
        options: [
            `{target}, I have a message for you: "bark bark bark bark bark bark bark bark"\n{user} gave it to me :3`,
            `{user} barks ferociously at {target}`,
            `{target} tried to deliver a package, but {user}'s barking scared them away`,
        ],
    },
    cuddle: {
        self: `{user} is cuddling with a body pillow`,
        bot: `You're- You're cuddling with me?! YIPPEEEE`,
        options: [
            `{user} pulls {target} close and doesn't let go ♡`,
            `AWWWW, {user} and {target} are cuddling, how cute ♡`,
            `{user} didn't know {target} was so fluffy before cuddling them ^^`,
        ],
    },
    basement: {
        self: `{user} got lost in their own basement`,
        bot: ``,
        options: [`OH NO! {target} IS TRAPPED IN {user}'S BASEMENT!!!`],
    },
    growl: {
        self: `{user} must be angry at their inner demons or something, they’re growling at themself`,
        bot: ``,
        options: [
            `{user} just growled at {target} to assert dominance`,
            `{user} went GRRRRRRRRRR at {target}, they seem pretty angry`,
            `{user} is slowly crawling towards {target} while growling like a wolf… scary`,
        ],
    },
    arson: {
        self: `{user} plays with fire`,
        bot: ``,
        options: [
            `{user} burns down {target}'s home`,
            `{user} sets {target} ablaze`,
            `{target} watches as {user} burns down their city`,
        ],
    },
    howl: {
        self: `{user}’s howling really loudly at the sky... they must really miss their pack mates`,
        bot: ``,
        options: [
            `☆{user} just went up to {target} and howled :3`,
            `{user} is howling at {target}... must be a full moon`,
            `{user}’s howling at {target} to stay off their territory!!`,
        ],
    },
    sacrifice: {
        self: `{user} sacrifices themselves... What a hero 🫡`,
        bot: ``,
        options: [
            `{user} sacrifices one of {target}'s lambs`,
            `{user} sacrifices two of {target}'s lambs`,
            `{user} sacrifices two of {target}'s limbs`,
            `{user} sacrifices half of {target}'s limbs :O`,
            `{user} tries to sacrifice {target}, but the gods reject them 😔\nNot a good look`,
            `{target} is brought up to the 🗡️Sacrificial Altar🗡️ by {user}`,
        ],
    },
    paw: {
        self: `{user} paws at their reflection 🐾`,
        bot: ``,
        options: [`{user} paws at {target} 🐾. They must be hungry`],
    },
    banish: {
        self: `OH GOD {user} IS BANISHING THEMSELVES TO THE SHADOW REALM??? NOOOOOOOO`,
        bot: ``,
        options: [
            `OH GOD {user} IS BANISHING {target} TO THE SHADOW REALM?? SOMEONE STOP THEM!!!`,
            `{user} is now banishing {target} to the shadow realm, say goodbye!`,
            `{user} is BANISHING {target} to the shadow realm, {target} is cooked...`,
        ],
    },
    cry: {
        self: ``,
        bot: ``,
        options: [
            `Oh no, {user} is crying? Quick, someone go and cheer them up!`,
            `{user} is sad. What are they sad about? Nobody knows`,
            `{user} is crying, and they aren't happy tears`,
        ],
    },
};
