import { Command } from 'commander';
const program = new Command();
import {client} from '../index.js';

const commandClient = client;

program
  .name('dm-util')
  .description('CLI to DM a specific user')
  .version('0.8.0');

program.command('dm')
  .description('DM a user')
  .argument('<id>', 'Id of the user to dm')
  .argument('<message>', 'The content of the message to send the user')
  .action((id, message) => {
    commandClient.users.send(id, message);
  });

program.parse();
