#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

// Metadata for the global tool
program
    .name('mytool')
    .description('A custom Node.js CLI tool')
    .version('1.0.0');

// Define a console command with a required argument
program
    .command('greet <name>')
    .description('Greet a specific user')
    .option('-s, --shout', 'Greet in ALL CAPS') // Optional flag
    .action((name, options) => {
        let message = `Hello, ${name}!`;

        if (options.shout) {
            message = message.toUpperCase();
        }

        console.log(message);
    });

// Parse the arguments passed from the console
program.parse(process.argv);
