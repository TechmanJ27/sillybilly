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
        bot: `Puny mortal, you thought you could trap ME!?`,
        options: [
            `OH NO! {target} IS TRAPPED IN {user}'S BASEMENT!!!`
        ],
    },
    growl: {
        self: `{user} must be angry at their inner demons or something, they’re growling at themself`,
        bot: `Don't growl at me!`,
        options: [
            `{user} just growled at {target} to assert dominance`,
            `{user} went GRRRRRRRRRR at {target}, they seem pretty angry`,
            `{user} is slowly crawling towards {target} while growling like a wolf… scary`,
        ],
    },
    arson: {
        self: `{user} plays with fire`,
        bot: `Activating anti-burn protocol`,
        options: [
            `{user} burns down {target}'s home`,
            `{user} sets {target} ablaze`,
            `{target} watches as {user} burns down their city`,
        ],
    },
    howl: {
        self: `{user}’s howling really loudly at the sky... they must really miss their pack mates`,
        bot: `AWOOOOOO!!!!`,
        options: [
            `☆{user} just went up to {target} and howled :3`,
            `{user} is howling at {target}... must be a full moon`,
            `{user}’s howling at {target} to stay off their territory!!`,
        ],
    },
    sacrifice: {
        self: `{user} sacrifices themselves... What a hero 🫡`,
        bot: `What did I ever do to you?`,
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
        bot: `Woah there, don't be getting to excited`,
        options: [
            `{user} paws at {target} 🐾. They must be hungry`,
            `Gimme five... or, well, four~`
        ],
    },
    banish: {
        self: `OH GOD {user} IS BANISHING THEMSELVES TO THE SHADOW REALM??? NOOOOOOOO`,
        bot: `Nice try. I dodge`,
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
            `{user} is crying, and they aren't happy tears :(`,
        ],
    },
    cake: {
        self: `{user} bakes a tasty cake for themself`,
        bot: `You baked a cake for me!`,
        options: [
            `{user} bakes a cake for {target}! What's the occasion?`,
            `Is is {target}'s birthday? Why else would {user} be making them such a wonderful cake!`,
        ],
    },
    pie: {
        self: `{user} makes themself a delicious pie`,
        bot: `A pie? For me! YIPPEE`,
        options: [
            `{user} pies {target}. Apple, tasty`,
            `{target} SURPRISE PIE!! Don't look at me, {user} told me to do it`,
        ],
    },
    nuzzle: {
        self: `Wooahh, how did you do that?`,
        bot: `I'm not a furry I swear`,
        options: [
            `{user} is attempting to spread the furry agenda by nuzzling {target}~`,
        ],
    },
    dance: {
        self: `{user} shows off their moves`,
        bot: `I'll dance with you :3`,
        options: [
            `{user} dances with {target}`,
            `{user} spins {target} right round`
        ],
    },
    gun: {
        self: `{user} is secretly a gun. Don't tell anyone!`,
        bot: ``,
        options: [
            `{user} is exercising their second amendment right and turning {target} into a rifle`,
            `Who has two thumbs and just got turned into a gun? That's right, {target}!\nThx {user} ^^`
        ],
    },
    scream: {
        self: `{user} screams into a pillow`,
        bot: `Oh, ok, I'll go hide in my corner again`,
        options: [
            `{user} attempts to intimidate {target}! `,
        ],
    },
    explode: {
        self: `{user} explodes!`,
        bot: `Self-destruct sequence activated. Haha, just kidding!`,
        options: [
            `{target} opens their mailbox to find...\nA pipe bomb from {user} 💥`,
        ],
    },
    murder: {
        self: `{user} dies!`,
        bot: `I dodge`,
        options: [
            `{user} pulls a knife on {target}`,
            `{user} snipes {target}. Nice shot!`,
        ],
    },
    ascend: {
        self: ``,
        bot: ``,
        options: [
            `{user} ascended to the heavens beyond, never to return`,
            `{user} grows wings and flies away`
        ],
    },
    rob: {
        self: `You can't rob yourself, silly!`,
        bot: `Joke's on you, I'm broke!`,
        options: [
            `{user} bumps into {target} and pickpockets a measly 5 cents from their pocket`
        ],
    },
};

/*
name: {
    self: ``,
    bot: ``,
    options: [
    ],
},
*/