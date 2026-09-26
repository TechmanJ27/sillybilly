type ResponseEntry = {
    options: string[];
};

type ResponseMap = {
    [command: string]: ResponseEntry;
};

export const responses: ResponseMap = {
    test: {
        options: [
            `Test 1`,
            `Test 2`,
            `Test 3`,
        ],
    },
};

/*
name: {
    options: [
    ],
}
*/